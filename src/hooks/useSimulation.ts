import { useState, useEffect, useCallback, useRef } from 'react';
import { QueryParserService } from '@/services/queryParserService';
import { VIPPlannerService } from '@/services/vipPlannerService';
import { DataLookupService } from '@/services/dataLookupService';
import { FlexibleQueryParser } from '@/services/flexibleQueryParser';
import { ParsedVIPVisit } from '@/types/vip';
import { SpecialQueryHandler } from '@/services/specialQueryHandler';
import { QuickActionHandler } from '@/services/quickActionHandler';
import { ModuleDetector, ModuleName } from '@/services/moduleDetector';

export type SimulationStatus = 'idle' | 'generating' | 'complete';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    text: string;
    fullText?: string; // Full text for typewriter effect
    isTyping?: boolean; // Whether to show typewriter effect
}

export interface CanvasSection {
    id: string;
    title: string;
    subTitle?: string;
    content: string; // The full content
    type: 'text' | 'list' | 'steps' | 'components';
    visibleContent: string; // What is currently shown (typewriter)
    isVisible: boolean; // Has the section started appearing?
}

export interface UseSimulationOptions {
    onVIPVisitParsed?: (visit: ParsedVIPVisit) => void;
    onModuleDetected?: (module: ModuleName) => void;
}

export function useSimulation(options?: UseSimulationOptions) {
    // Store module detection callback
    const moduleDetectionCallback = options?.onModuleDetected;
    
    const [status, setStatus] = useState<SimulationStatus>('idle');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [sections, setSections] = useState<CanvasSection[]>([]);

    const [currentSectionIndex, setCurrentSectionIndex] = useState(-1);
    const [typingIndex, setTypingIndex] = useState(0);
    const planningMessageShownRef = useRef(false);

    // Helper to add messages
    const addMessage = useCallback((role: 'user' | 'assistant' | 'system', text: string, enableTypewriter: boolean = false) => {
        const messageId = Math.random().toString(36).substr(2, 9);
        if (enableTypewriter && role === 'assistant') {
            // For typewriter effect, start with empty text and store full text
            setMessages(prev => [...prev, {
                id: messageId,
                role,
                text: '',
                fullText: text,
                isTyping: true
            }]);
        } else {
            // For user/system messages or non-typewriter, show immediately
            setMessages(prev => [...prev, {
                id: messageId,
                role,
                text,
                isTyping: false
            }]);
        }
    }, []);

    // Helper to generate planner actions based on query context
    const generatePlannerActionsFromQuery = (query: string, queryType: 'info' | 'summary' | 'kitchen' | 'general' = 'general'): string => {
        const lowerQuery = query.toLowerCase();
        let actions: string[] = [];

        // Generate actions based on query type and content
        if (queryType === 'info') {
            if (lowerQuery.includes('employee') || lowerQuery.includes('staff') || lowerQuery.includes('who')) {
                actions.push('Review employee assignments and availability');
                actions.push('Update employee records if needed');
            } else if (lowerQuery.includes('inventory') || lowerQuery.includes('stock')) {
                actions.push('Review inventory levels and reorder if needed');
                actions.push('Update inventory records');
            } else if (lowerQuery.includes('location') || lowerQuery.includes('where')) {
                actions.push('Verify location availability');
                actions.push('Coordinate location access if needed');
            } else if (lowerQuery.includes('devotee')) {
                actions.push('Review devotee records');
                actions.push('Update devotee information if needed');
            } else {
                actions.push('Review the information provided');
                actions.push('Take necessary follow-up actions');
            }
        } else if (queryType === 'summary' || queryType === 'general') {
            if (lowerQuery.includes('progress') || lowerQuery.includes('status')) {
                actions.push('Review current progress and status');
                actions.push('Identify any blockers or issues');
                actions.push('Update progress tracking');
            } else if (lowerQuery.includes('festival') || lowerQuery.includes('navaratri')) {
                actions.push('Review festival preparation status');
                actions.push('Address any pending items');
                actions.push('Coordinate with relevant departments');
            } else {
                actions.push('Review the information');
                actions.push('Plan next steps based on the data');
            }
        } else if (queryType === 'kitchen') {
            actions.push('Review kitchen menu and requirements');
            actions.push('Coordinate with kitchen department');
            actions.push('Update menu planning if needed');
        }

        // Add general follow-up actions if query contains specific keywords
        if (lowerQuery.includes('check') || lowerQuery.includes('verify')) {
            actions.push('Verify the information is accurate');
            actions.push('Update records if discrepancies found');
        }

        if (lowerQuery.includes('show') || lowerQuery.includes('display') || lowerQuery.includes('list')) {
            actions.push('Review the displayed information');
            actions.push('Take action based on the findings');
        }

        // If no specific actions generated, add generic ones
        if (actions.length === 0) {
            actions.push('Review the query and information provided');
            actions.push('Plan appropriate follow-up actions');
        }

        // Format as planner actions
        return actions.map(action => `[·] ${action}`).join('\n');
    };

    // Helper to parse action items from query
    const parseActionsFromQuery = (query: string): string[] => {
        const actions: string[] = [];

        // Try to extract actions from various formats:
        // 1. Numbered list: "1. Action 1, 2. Action 2"
        // 2. Bullet points: "- Action 1, - Action 2"
        // 3. Comma-separated: "Action 1, Action 2, Action 3"
        // 4. Line-separated (if query contains newlines)

        // Remove common prefixes
        let cleanQuery = query
            .replace(/^(add|create|make|plan|schedule|set)\s+(plan|planner|action|task|item|todo|step)/i, '')
            .replace(/^(add|create|make|plan|schedule|set)\s+(to|in)\s+(plan|planner)/i, '')
            .trim();

        // Try numbered list first
        const numberedMatches = cleanQuery.match(/\d+[\.\)]\s*([^\d,]+)/g);
        if (numberedMatches && numberedMatches.length > 0) {
            return numberedMatches.map(m => m.replace(/^\d+[\.\)]\s*/, '').trim());
        }

        // Try bullet points
        const bulletMatches = cleanQuery.match(/[-•*]\s*([^-,]+)/g);
        if (bulletMatches && bulletMatches.length > 0) {
            return bulletMatches.map(m => m.replace(/^[-•*]\s*/, '').trim());
        }

        // Try comma-separated
        if (cleanQuery.includes(',')) {
            const parts = cleanQuery.split(',').map(p => p.trim()).filter(p => p.length > 0);
            if (parts.length > 1) {
                return parts;
            }
        }

        // If no structured format, treat the whole query as a single action
        // But try to split on common conjunctions
        const conjunctions = [' and ', ' then ', ' also ', ' plus '];
        for (const conj of conjunctions) {
            if (cleanQuery.toLowerCase().includes(conj)) {
                return cleanQuery.split(new RegExp(conj, 'i')).map(a => a.trim()).filter(a => a.length > 0);
            }
        }

        // Single action
        if (cleanQuery.length > 0) {
            return [cleanQuery];
        }

        return [];
    };

    const startSimulation = useCallback((query: string = 'Create onboarding workflow', options?: { isRecommendation?: boolean; displayQuery?: string; onVIPVisitParsed?: (vip: any) => void; onModuleDetected?: (module: ModuleName) => void }) => {
        const lowercaseQuery = query.toLowerCase();

        // Handle recommendation prefix and options consistently
        const isRecommendation = options?.isRecommendation || query.startsWith('[REC] ');
        const displayQuery = options?.displayQuery || (isRecommendation ? query.replace('[REC] ', '') : query);

        // Detect module from query (early detection before other handlers)
        const detectedModule = ModuleDetector.detectModule(query);
        if (detectedModule) {
            // Notify parent component about module detection
            const callback = options?.onModuleDetected || moduleDetectionCallback;
            if (callback) {
                callback(detectedModule);
            }
            // Early return - module views handle their own query processing
            setStatus('generating');
            addMessage('user', displayQuery);
            
            // Show sub-modules in chat for Assets module
            if (detectedModule === 'Assets') {
                const assetsSubModules = [
                    'Asset Registry',
                    'Classification & Tagging',
                    'Onboarding & Acquisition',
                    'Security & Custody',
                    'Movement tracking',
                    'Maintenance & Preservation',
                    'Audit & Verification',
                    'Valuation & Finance',
                    'Compliance & Legal',
                    'Retirement & Disposal',
                    'History & Memory',
                    'Impact & Reporting',
                    'Access & Governance'
                ];
                
                setTimeout(() => {
                    addMessage('assistant', `Switching to ${detectedModule} module.\n\nAvailable sub-modules:\n${assetsSubModules.map((sub, idx) => `${idx + 1}. ${sub}`).join('\n')}`, true);
                    setStatus('complete');
                }, 500);
            } else {
                setTimeout(() => {
                    addMessage('assistant', `Switching to ${detectedModule} module...`, true);
                    setStatus('complete');
                }, 500);
            }
            return;
        }

        // Set status and add user message for all queries
        setStatus('generating');
        addMessage('user', displayQuery);

        // Try special query handler first (priority handling)
        const specialResult = SpecialQueryHandler.handleQuery(query, options?.onVIPVisitParsed);
        
        if (specialResult) {
            // Create sections from special query handler result
            const newSections: CanvasSection[] = [
                {
                    id: specialResult.sectionId,
                    title: specialResult.cardTitle,
                    content: specialResult.infoCardData,
                    type: 'text',
                    visibleContent: '',
                    isVisible: false
                },
                {
                    id: `planner-${specialResult.sectionId.replace('focus-', '')}`,
                    title: 'Your Planner Actions',
                    subTitle: specialResult.planTitle,
                    content: specialResult.plannerActions,
                    type: 'list',
                    visibleContent: '',
                    isVisible: false
                }
            ];

            // Set sections and start typewriter effect
            setTimeout(() => {
                setSections(prev => {
                    // Replace existing focus cards and governance card
                    const nonFocusPrevSections = prev.filter(s => {
                        if (s.title === 'Your Planner Actions') return true;
                        const isFocusCard = s.id.startsWith('focus-') || 
                                           s.id === 'objective' ||
                                           s.title.includes('Protocol Brief') ||
                                           s.title.includes('Appointments') ||
                                           s.title.includes('Approvals') ||
                                           s.title.includes('Alerts') ||
                                           s.title.includes('Finance Summary') ||
                                           s.title.includes('Event Protocol Brief') ||
                                           s.title.includes('Visit Protocol Brief');
                        return !isFocusCard;
                    });

                    // Add new sections first, then existing non-focus sections
                    const updatedSections = [...newSections, ...nonFocusPrevSections];

                    // Handle planner merging if existing planner exists
                    const existingPlanner = prev.find(s => s.title === 'Your Planner Actions');
                    const newPlanner = newSections.find(s => s.title === 'Your Planner Actions');
                    
                    if (existingPlanner && newPlanner) {
                        const mergedContent = existingPlanner.content
                            ? `${existingPlanner.content}\n${newPlanner.content}`
                            : newPlanner.content;
                        
                        const mergedPlanner = {
                            ...existingPlanner,
                            content: mergedContent,
                            subTitle: newPlanner.subTitle,
                            visibleContent: existingPlanner.visibleContent,
                            isVisible: existingPlanner.isVisible
                        };

                        const plannerIndex = updatedSections.findIndex(s => s.title === 'Your Planner Actions');
                        if (plannerIndex >= 0) {
                            updatedSections[plannerIndex] = mergedPlanner;
                        }
                    }

                    return updatedSections;
                });

                // Set up typewriter for first focus card
                setTimeout(() => {
                    setCurrentSectionIndex(0);
                    setTypingIndex(0);
                }, 100);

                // Add assistant message
                addMessage('assistant', "I've prepared the briefing and planner actions.", true);
            }, 600);

            return; // Exit early, special handler processed the query
        }

        // Try quick action handler for "Show" queries (alerts, appointments, approvals, finance)
        const quickActionResult = QuickActionHandler.handleQuery(query);
        
        if (quickActionResult) {
            const newSections: CanvasSection[] = [{
                id: quickActionResult.sectionId,
                title: quickActionResult.sectionTitle,
                content: 'Loading...',
                type: 'components',
                visibleContent: '',
                isVisible: false
            }];

            // Handle actionable finance queries separately
            if (quickActionResult.sectionId === 'focus-finance' && lowercaseQuery.includes('approve')) {
                newSections[0] = {
                    id: 'focus-finance',
                    title: 'Morning Revenue Analysis',
                    content: 'Today\'s collections are 18% higher than the 30-day average.',
                    type: 'text',
                    visibleContent: '',
                    isVisible: false
                };
                newSections.push({
                    id: 'finance-actions',
                    title: 'Your Planner Actions',
                    content: '[·] Move ₹15L to Endowment Fund\n[·] Audit North Gate UPI scanner logs',
                    type: 'list',
                    visibleContent: '',
                    isVisible: false
                });
            }

            // Set sections and start typewriter effect
            setTimeout(() => {
                setSections(prev => {
                    // Replace existing focus cards (including default appointments view)
                    // This ensures the default "Today's Appointments" view is replaced when any quick action is clicked
                    const nonFocusPrevSections = prev.filter(s => {
                        if (s.title === 'Your Planner Actions') return true;
                        // Remove all focus cards - this includes appointments, approvals, alerts, finance, VIP cards, etc.
                        // Also catch variations like "Today's", "Tomorrow's" to ensure default appointments view is replaced
                        const isFocusCard = s.id.startsWith('focus-') || 
                                           s.id === 'objective' ||
                                           s.title.includes('Protocol Brief') ||
                                           s.title.includes('Appointments') ||
                                           s.title.includes('Appointment') ||
                                           s.title.includes('Approvals') ||
                                           s.title.includes('Approval') ||
                                           s.title.includes('Alerts') ||
                                           s.title.includes('Alert') ||
                                           s.title.includes('Reminder') ||
                                           s.title.includes('Notification') ||
                                           s.title.includes('Finance Summary') ||
                                           s.title.includes('Finance') ||
                                           s.title.includes('Revenue Analysis') ||
                                           s.title.includes('Revenue') ||
                                           s.title.includes('Morning Revenue') ||
                                           s.title.includes('Event Protocol Brief') ||
                                           s.title.includes('Visit Protocol Brief') ||
                                           s.title.includes('VIP') ||
                                           s.title.includes('VIP Visits') ||
                                           s.title.includes('Calendar') ||
                                           s.title.includes('Schedule') ||
                                           s.title.includes('Today\'s') ||
                                           s.title.includes('Tomorrow\'s');
                        return !isFocusCard;
                    });

                    // Always place new focus section at the beginning to ensure it's displayed
                    const updatedSections = [...newSections, ...nonFocusPrevSections];

                    // Handle planner merging if actionable finance
                    const existingPlanner = prev.find(s => s.title === 'Your Planner Actions');
                    const newPlanner = newSections.find(s => s.title === 'Your Planner Actions');
                    
                    if (existingPlanner && newPlanner) {
                        const mergedContent = existingPlanner.content
                            ? `${existingPlanner.content}\n${newPlanner.content}`
                            : newPlanner.content;
                        
                        const mergedPlanner = {
                            ...existingPlanner,
                            content: mergedContent,
                            subTitle: newPlanner.subTitle,
                            visibleContent: existingPlanner.visibleContent,
                            isVisible: existingPlanner.isVisible
                        };

                        const plannerIndex = updatedSections.findIndex(s => s.title === 'Your Planner Actions');
                        if (plannerIndex >= 0) {
                            updatedSections[plannerIndex] = mergedPlanner;
                        }
                    } else if (existingPlanner) {
                        const plannerIndex = updatedSections.findIndex(s => s.title === 'Your Planner Actions');
                        if (plannerIndex < 0) {
                            updatedSections.push(existingPlanner);
                        }
                    }

                    return updatedSections;
                });

                // Set up typewriter for first focus card
                setTimeout(() => {
                    setCurrentSectionIndex(0);
                    setTypingIndex(0);
                }, 100);

                // Add assistant message
                addMessage('assistant', quickActionResult.responseMessage, true);
            }, 600);

            return; // Exit early, quick action handler processed the query
        }

        // Define intent flags early for consistent prioritization
        let newSections: CanvasSection[] = [];

        const isInfoQuery = lowercaseQuery.includes('show') ||
            lowercaseQuery.includes('list') ||
            lowercaseQuery.includes('what') ||
            lowercaseQuery.includes('who') ||
            lowercaseQuery.includes('when') ||
            lowercaseQuery.includes('where') ||
            lowercaseQuery.includes('tell me') ||
            lowercaseQuery.includes('display') ||
            lowercaseQuery.includes('get') ||
            lowercaseQuery.includes('find') ||
            lowercaseQuery.includes('about') ||
            lowercaseQuery.includes('information') ||
            lowercaseQuery.includes('details') ||
            (lowercaseQuery.includes('temple') && !lowercaseQuery.includes('plan')) ||
            (lowercaseQuery.includes('jagadguru') && !lowercaseQuery.includes('plan')) ||
            (lowercaseQuery.includes('ceo') && !lowercaseQuery.includes('plan')) ||
            (lowercaseQuery.includes('sringeri') && !lowercaseQuery.includes('plan')) ||
            (lowercaseQuery.includes('peetham') && !lowercaseQuery.includes('plan'));

        const isSummaryQuery = lowercaseQuery.includes('progress') ||
            lowercaseQuery.includes('summary') ||
            lowercaseQuery.includes('status') ||
            lowercaseQuery.includes('update') ||
            (lowercaseQuery.includes('how') && lowercaseQuery.includes('is') && (lowercaseQuery.includes('preparation') || lowercaseQuery.includes('preparation')));

        const isPlannerRequest =
            lowercaseQuery.includes('plan') ||
            lowercaseQuery.includes('planner') ||
            lowercaseQuery.includes('action') ||
            lowercaseQuery.includes('task') ||
            lowercaseQuery.includes('todo') ||
            lowercaseQuery.includes('step') ||
            (lowercaseQuery.includes('add') && (lowercaseQuery.includes('to') || lowercaseQuery.includes('in'))) ||
            (lowercaseQuery.includes('create') && (lowercaseQuery.includes('plan') || lowercaseQuery.includes('action') || lowercaseQuery.includes('step'))) ||
            lowercaseQuery.includes('schedule');

        // 1. Inventory/Resource Check (Chat Only, No Canvas Update)
        if (
            lowercaseQuery.includes('check stock') ||
            lowercaseQuery.includes('check inventory') ||
            lowercaseQuery.includes('do we have') ||
            (lowercaseQuery.includes('available') && lowercaseQuery.includes('?'))
        ) {
            // User message already added at start
            setTimeout(() => {
                let response = "Checking system records...";

                if (lowercaseQuery.includes('flower') || lowercaseQuery.includes('garland')) {
                    response = "Yes, verified. We have 40kg of fresh Jasmine and 20kg of Marigold delivered this morning. Cold storage is optimal.";
                } else if (lowercaseQuery.includes('chair') || lowercaseQuery.includes('seating')) {
                    response = "Inventory check confirms 200 plastic chairs are available in the South Storage Shed. 50 more are currently in use at the Dining Hall.";
                } else if (lowercaseQuery.includes('prasadam') || lowercaseQuery.includes('laddu')) {
                    response = "Kitchen reports 5,000 Laddus packed and ready for distribution. Raw material stock is sufficient for another 15,000.";
                } else if (lowercaseQuery.includes('security') || lowercaseQuery.includes('guard')) {
                    response = "Staffing logs show 12 guards currently on duty at North Gate. 4 relief guards are available in the barracks.";
                } else {
                    response = "I've checked the inventory database. The requested resources are marked as 'Available' and can be allocated to your plan.";
                }

                addMessage('assistant', response, true); // Enable typewriter
                setStatus('complete');
            }, 1200);
            return; // EXIT EARLY: Do not touch the canvas/sections
        }

        // 2. Dynamic Planner Add (Chat -> Planner Update)
        // Match patterns like: "add X to plan", "add X in plan", "X is missing add that", etc.
        const addToPlanPatterns = [
            // 0. NEW: "add this/that to plan [actual task]" - must come first!
            /\badd\s+(?:this|that)\s+(?:to|in)\s+(?:the\s+)?plan(?:ner)?\s+(.+)/i,

            // 1. Prefix: "add (item) to/in plan"
            /\badd\s+(.+?)\s+(?:to|in)\s+(?:the\s+)?plan(?:ner)?/i,

            // 2. Infix: "add to/in plan (item)"
            /\badd\s+(?:to|in)\s+(?:the\s+)?plan(?:ner)?\s+(.+)/i,

            // 3. Suffix: "(item) add to/in plan" - robust punctuation handling
            /(.+?)(?:[-–—,.]+)?\s*\b(?:please\s+)?add\s+(?:to|in)\s+(?:the\s+)?plan(?:ner)?/i,

            // 4. Suffix: "(item) added to/in plan"
            /(.+?)(?:[-–—,.]+)?\s*\b(?:should\s+be\s+)?added\s+(?:to|in)\s+(?:the\s+)?plan(?:ner)?/i,

            // 5. Specific Context: "X is missing add that in plan"
            /(.+?)\s+is\s+missing\s+add\s+that\s+(?:to|in)\s+plan/i,

            // 6. Fallback: "add that to plan" (no task specified)
            /add\s+that\s+(?:to|in)\s+plan/i,

            // 7. NEW: "add step: [task]" or "new step [task]"
            /\b(?:add|new|create|include)\b\s+step(?::|\s+)?\s+(.+)/i,

            // 8. NEW: "[task] add as step"
            /(.+?)\s+add\s+(?:it\s+)?as\s+(?:a\s+)?step/i,
        ];

        let itemToAdd: string | null = null;

        for (let i = 0; i < addToPlanPatterns.length; i++) {
            const pattern = addToPlanPatterns[i];
            const match = lowercaseQuery.match(pattern);
            if (match) {
                // Pattern 0: "add this/that to plan [task]" - extract task from after "plan"
                if (i === 0) {
                    if (match[1]) {
                        itemToAdd = match[1].trim();
                    }
                }
                // Pattern 6: "add that to plan" (no task) - try to extract from context
                else if (i === 6 && !match[1]) {
                    // Extract item from before "add that" if it exists
                    const beforeMatch = query.match(/(.+?)\s+(is\s+missing|add\s+that)/i);
                    if (beforeMatch) {
                        itemToAdd = beforeMatch[1].replace(/^(ok\s+|please\s+|can\s+you\s+)/i, '').trim();
                    }
                }
                // Pattern 5: "X is missing add that in plan"
                else if (i === 5) {
                    if (match[1]) {
                        itemToAdd = match[1].trim();
                    }
                }
                // All other patterns: use captured group
                else if (match[1]) {
                    // Check if captured item is "this" or "that" - if so, look for task after "plan"
                    const captured = match[1].trim().toLowerCase();
                    if (captured === 'this' || captured === 'that') {
                        // Try to extract task from after "to the plan"
                        const afterPlanMatch = query.match(/\b(?:to|in)\s+(?:the\s+)?plan(?:ner)?\s+(.+)/i);
                        if (afterPlanMatch && afterPlanMatch[1]) {
                            itemToAdd = afterPlanMatch[1].trim();
                        }
                    } else {
                        itemToAdd = match[1].trim();
                    }
                }
                break;
            }
        }

        if (itemToAdd) {
            // Capitalize first letter
            itemToAdd = itemToAdd.charAt(0).toUpperCase() + itemToAdd.slice(1);

            // User message already added at start

            setSections(prev => {
                const plannerIndex = prev.findIndex(s => s.title === 'Your Planner Actions');

                if (plannerIndex >= 0) {
                    // Planner exists - append to it
                    const planner = prev[plannerIndex];
                    const newContent = planner.content
                        ? `${planner.content}\n[·] ${itemToAdd}`
                        : `[·] ${itemToAdd}`;
                    const updated = [...prev];
                    updated[plannerIndex] = {
                        ...planner,
                        content: newContent,
                        // Keep existing visibleContent - typewriter will stream the new part
                        visibleContent: planner.visibleContent,
                        isVisible: true
                    };

                    // Set typing index and section index after state update completes
                    setTimeout(() => {
                        setTypingIndex(planner.visibleContent.length);
                        setCurrentSectionIndex(plannerIndex);
                    }, 0);

                    return updated;
                } else {
                    // No planner exists - create a new one
                    const newPlanner: CanvasSection = {
                        id: `planner-actions-${Date.now()}`,
                        title: 'Your Planner Actions',
                        content: `[·] ${itemToAdd}`,
                        type: 'list',
                        visibleContent: '',
                        isVisible: false
                    };
                    const newPlannerIndex = prev.length; // Index of the new planner after adding

                    // Set typing index and section index after state update completes
                    setTimeout(() => {
                        setTypingIndex(0);
                        setCurrentSectionIndex(newPlannerIndex);
                    }, 0);

                    return [...prev, newPlanner];
                }
            });

            setTimeout(() => {
                addMessage('assistant', `Adding "${itemToAdd}" to your plan...`, true); // Enable typewriter
            }, 400);
            return;
        }

        // 3. Special Scenarios (Priority 1)
        if (lowercaseQuery.includes('jagadguru') || lowercaseQuery.includes('swamiji')) {
            // Jagadgurugalu / Swamiji Logic
            const isKiggaVisit = lowercaseQuery.includes('kigga');

            if (options?.onVIPVisitParsed) {
                options.onVIPVisitParsed({
                    visitor: "Jagadguru Sri Sri Vidhushekhara Bharati Sannidhanam",
                    title: "Pontiff of Sringeri Sharada Peetham",
                    date: isKiggaVisit ? new Date() : new Date(new Date().setDate(new Date().getDate() + 1)),
                    time: isKiggaVisit ? "16:00" : "17:00",
                    location: isKiggaVisit ? "Kigga" : "Main Entrance (Raja Gopuram)",
                    protocolLevel: "maximum",
                    confidence: 1.0
                });
            }

            const vipData = {
                visitor: "Jagadguru Sri Sri Vidhushekhara Bharati Sannidhanam",
                title: "Pontiff of Sringeri Sharada Peetham",
                dateTime: isKiggaVisit ? "Today at 4:00 PM" : "Tomorrow at 5:00 PM",
                location: isKiggaVisit ? "Kigga" : "Main Entrance (Raja Gopuram)",
                protocolLevel: "maximum",
                delegationSize: isKiggaVisit ? "~20 persons" : "~10 persons",
                todayHighlights: isKiggaVisit ? [
                    { time: '03:30 PM', description: 'Pre-arrival shubha samaya readiness check.' },
                    { time: '04:00 PM', description: 'Arrival at Kigga Temple and Poornakumbha Swagata.' },
                    { time: '04:30 PM', description: 'Darshan and special pooja at the sanctum.' },
                    { time: '05:30 PM', description: 'Ashirvachana and meeting with devotees.' }
                ] : [
                    { time: '05:00 PM', description: 'Arrival at Raja Gopuram, Sringeri.' },
                    { time: '05:30 PM', description: 'Poornakumbha Swagata and processional welcome.' },
                    { time: '06:30 PM', description: 'Dharma Sabha and Anugraha Bhashana.' }
                ],
                highlightTitle: "TODAY | HIGHLIGHTS",
                highlights: isKiggaVisit ? [
                    { time: '03:30 PM', description: 'Pre-arrival shubha samaya readiness check.' },
                    { time: '04:00 PM', description: 'Arrival at Kigga Temple and Poornakumbha Swagata.' },
                    { time: '04:30 PM', description: 'Darshan and special pooja at the sanctum.' },
                    { time: '05:30 PM', description: 'Ashirvachana and meeting with devotees.' }
                ] : [
                    { time: '05:00 PM', description: 'Arrival at Raja Gopuram, Sringeri.' },
                    { time: '05:30 PM', description: 'Poornakumbha Swagata and processional welcome.' },
                    { time: '06:30 PM', description: 'Dharma Sabha and Anugraha Bhashana.' }
                ]
            };

            const kiggaPlannerContent = `[·] Confirm Jagadguru arrival seva & reception krama
[·] Align mutt coordination & travel readiness
[·] Prepare darshan & movement path inside temple
[·] Confirm archaka & purohita availability
[·] Prepare alankara & minimal pooja samagri
[·] Inform temple trustees & senior sevaks
[·] Activate crowd seva & volunteer arrangement
[·] Coordinate prasad preparation (small batch)
[·] Ensure protocol & security alignment
[·] Conduct pre-arrival shubha samaya readiness check (3:30 PM)`;

            newSections = [
                {
                    id: 'focus-vip',
                    title: 'VIP Protocol Brief',
                    content: JSON.stringify(vipData),
                    type: 'text',
                    visibleContent: '',
                    isVisible: false
                },
                {
                    id: 'planner-jagadguru',
                    title: 'Your Planner Actions',
                    subTitle: isKiggaVisit ? 'Kigga Adhoc Visit Plan' : 'Poornakumbha Swagata Plan',
                    content: isKiggaVisit ? kiggaPlannerContent : '[·] Arrange Poornakumbha Swagata at Raja Gopuram\n[·] Coordinate Dhuli Pada Puja at Pravachana Mandiram\n[·] Ensure security clearance for devotee darshan line\n[·] Prepare Sanctum for special Mangala Arathi',
                    type: 'list',
                    visibleContent: '',
                    isVisible: false
                }
            ];
            addMessage('assistant', `I've prepared the ${isKiggaVisit ? 'Kigga visit' : 'Sringeri arrival'} briefing and planner actions for Jagadgurugalu.`, true);

        } else if (lowercaseQuery.includes('chandi') || lowercaseQuery.includes('yaga') || lowercaseQuery.includes('homa')) {
            // Sahasra Chandi Yaga logic
            const isFeb3rd = lowercaseQuery.includes('3rd feb') || lowercaseQuery.includes('february 3');

            if (isFeb3rd) {
                const vipData = {
                    visitor: "Special Dignitaries & Devotees",
                    title: "Sahasra Chandi Maha Yaga",
                    dateTime: "3rd Feb, 2024 (7:00 AM - 1:00 PM)",
                    location: "Main Yaga Shala / Temple Inner Courtyard",
                    protocolLevel: "high",
                    delegationSize: "Multiple VIP Groups",
                    todayHighlights: [
                        { time: '07:00 AM', description: 'Commencement of Sahasra Chandi Yaga with Maha Sankalpa and Avahana.' },
                        { time: '09:00 AM', description: 'Ritwik Varanam and start of Maha Chandi Parayanam.' },
                        { time: '11:00 AM', description: 'VIP participation in the Yaga and special darshan flow.' },
                        { time: '12:30 PM', description: 'Maha Purnahuti, Deeparadhana, and Shanti Mantra Patha.' }
                    ],
                    highlightTitle: "FEBRUARY 3 | HIGHLIGHTS",
                    highlights: [
                        { time: '07:00 AM', description: 'Commencement of Sahasra Chandi Yaga with Maha Sankalpa and Avahana.' },
                        { time: '09:00 AM', description: 'Ritwik Varanam and start of Maha Chandi Parayanam.' },
                        { time: '11:00 AM', description: 'VIP participation in the Yaga and special darshan flow.' },
                        { time: '12:30 PM', description: 'Maha Purnahuti, Deeparadhana, and Shanti Mantra Patha.' }
                    ]
                };

                newSections = [
                    {
                        id: 'focus-yaga',
                        title: 'Sahasra Chandi Maha Yaga Protocol',
                        content: JSON.stringify(vipData),
                        type: 'text',
                        visibleContent: '',
                        isVisible: false
                    },
                    {
                        id: 'planner-yaga',
                        title: 'Your Planner Actions',
                        subTitle: 'Yaga Preparation Plan',
                        content: '[·] Confirm seating for 50+ Vedic scholars\n[·] Secure Yaga Shala perimeter for VIP entry\n[·] Arrange for specialized ritual samagri (Chandi Homa specific)\n[·] Coordinate with Annadanam department for special Prasad distribution',
                        type: 'list',
                        visibleContent: '',
                        isVisible: false
                    }
                ];
                addMessage('assistant', "I've generated the Sahasra Chandi Maha Yaga protocol briefing and planning steps for Feb 3rd.", true);
            }

        } else if (lowercaseQuery.includes('restoration') || lowercaseQuery.includes('project') || lowercaseQuery.includes('renovation')) {
            // Project Restoration Logic
            const projectData = {
                visitor: "Project Management Office",
                title: "Temple Restoration Project",
                dateTime: "Phase 1: Construction & Conservation",
                location: "Sharada Temple North Wing",
                protocolLevel: "standard",
                delegationSize: "25 members crew",
                todayHighlights: [
                    { time: '10:00 AM', description: 'Daily site inspection and safety briefing.' },
                    { time: '02:00 PM', description: 'Architectural review of stone carving progress.' },
                    { time: '04:00 PM', description: 'Material audit and procurement update for next week.' }
                ],
                highlightTitle: "PROJECT | HIGHLIGHTS",
                highlights: [
                    { time: 'Phase 1', description: 'Foundation reinforcement and heritage stone cleaning.' },
                    { time: 'Phase 2', description: 'Intricate wood carving and roof restoration.' },
                    { time: 'Phase 3', description: 'Final painting, lighting, and consecration prep.' }
                ]
            };

            newSections = [
                {
                    id: 'focus-project',
                    title: 'Project Executive Brief',
                    content: JSON.stringify(projectData),
                    type: 'text',
                    visibleContent: '',
                    isVisible: false
                },
                {
                    id: 'planner-project',
                    title: 'Your Planner Actions',
                    subTitle: 'Restoration Milestones',
                    content: '[·] Review architectural blueprints for North Wing\n[·] Approve granite supply from authorized quarries\n[·] Schedule weekly project review meeting with CEO\n[·] Coordinate with Archeology Dept for heritage preservation standards',
                    type: 'list',
                    visibleContent: '',
                    isVisible: false
                }
            ];
            addMessage('assistant', "Project status updated. I've added the restoration milestones to your planner.", true);

        } else if (lowercaseQuery.includes('navaratri') || lowercaseQuery.includes('festival')) {
            // Navaratri Logic - check if info/summary or prepare/plan
            const isNavaratriInfo = (lowercaseQuery.includes('navaratri') || lowercaseQuery.includes('festival')) && (isInfoQuery || isSummaryQuery || lowercaseQuery.includes('prepare') || lowercaseQuery.includes('plan'));

            if (isNavaratriInfo) {
                const festivalData = {
                    visitor: "Special Festival Protocol",
                    title: "Sharada Sharannavarathri",
                    dateTime: "Upcoming: Ashwayuja Shukla Prathama",
                    location: "Main Temple & Sringeri Town",
                    protocolLevel: "maximum",
                    delegationSize: "Lakhs of devotees",
                    todayHighlights: [
                        { time: 'Day 1', description: 'Sharada Sharannavarathri Prarambha, Kalasha Sthapana.' },
                        { time: 'Day 7', description: 'Moola Nakshatra (Saraswati Avahana).' },
                        { time: 'Day 10', description: 'Vijayadashami, Maha Rathotsava.' }
                    ],
                    highlightTitle: "FESTIVAL | HIGHLIGHTS",
                    highlights: [
                        { time: 'Day 1', description: 'Sharada Sharannavarathri Prarambha, Kalasha Sthapana.' },
                        { time: 'Day 7', description: 'Moola Nakshatra (Saraswati Avahana).' },
                        { time: 'Day 10', description: 'Vijayadashami, Maha Rathotsava.' }
                    ]
                };

                newSections = [
                    {
                        id: 'focus-festival',
                        title: 'Festival Event Brief',
                        content: JSON.stringify(festivalData),
                        type: 'text',
                        visibleContent: '',
                        isVisible: false
                    },
                    {
                        id: 'planner-festival',
                        title: 'Your Planner Actions',
                        subTitle: 'Navaratri Execution Roadmap',
                        content: `[·] Verify Alankara schedule for all 10 days
[·] Finalize Annadanam procurement for 5L+ devotees
[·] Deploy additional 200 crowd control volunteers
[·] Setup temporary medical camps at 3 locations
[·] Coordinate with KSRTC for special bus services`,
                        type: 'list',
                        visibleContent: '',
                        isVisible: false
                    }
                ];
                addMessage('assistant', "I've generated the Sharada Sharannavarathri execution roadmap and briefing.", true);
            } else {
                newSections = [
                    {
                        id: 'focus-summary',
                        title: 'Navaratri Preparation Status',
                        content: 'Overall preparation is 85% complete. The main Alankara for Day 1 is ready. Security barriers are installed. Annadanam supplies are stocked for the first 3 days.',
                        type: 'text',
                        visibleContent: '',
                        isVisible: false
                    }
                ];
                addMessage('assistant', "Navaratri preparations are on track. Dashboard updated with current status.", true);
            }

        } else if (lowercaseQuery.includes('ceo') || (lowercaseQuery.includes('appointment') && lowercaseQuery.includes('eo'))) {
            // CEO Intent - Info or Action
            const isCEOAction = lowercaseQuery.includes('ask') || lowercaseQuery.includes('tell') || lowercaseQuery.includes('directive') || lowercaseQuery.includes('order');
            const dept = lowercaseQuery.includes('kitchen') ? 'Kitchen' : lowercaseQuery.includes('security') ? 'Security' : 'Admin';

            if (isCEOAction) {
                newSections = [
                    {
                        id: `focus-ceo-action-${Date.now()}`,
                        title: `Executive Directive: ${dept}`,
                        content: `CEO has directed the ${dept} department to ${query.split(' to ')[1] || 'respond immediately to current requirements'}. Tracking for completion by EOD.`,
                        type: 'text',
                        visibleContent: '',
                        isVisible: false
                    },
                    {
                        id: `planner-ceo-${Date.now()}`,
                        title: 'Your Planner Actions',
                        subTitle: 'Admin Follow-up',
                        content: `[·] Confirm receipt of directive by ${dept} head\n[·] Monitor ${dept} progress updates\n[·] Report completion to CEO office`,
                        type: 'list',
                        visibleContent: '',
                        isVisible: false
                    }
                ];
                addMessage('assistant', `Directive issued to ${dept}. Tracking as high priority.`, true);
            } else {
                const ceoData = {
                    visitor: "Sri V. R. Gowrishankar",
                    title: "Executive Officer & CEO, Sringeri Mutt",
                    dateTime: "Today: Office Hours (10:00 AM - 6:00 PM)",
                    location: "Peetham Administrative Office",
                    protocolLevel: "maximum",
                    delegationSize: "Executive Staff",
                    todayHighlights: [
                        { time: '11:30 AM', description: 'Review of Navaratri preparation with HODs.' },
                        { time: '03:00 PM', description: 'Meeting with District Administration (Protocol).' },
                        { time: '05:00 PM', description: 'Financial audit final review.' }
                    ],
                    highlightTitle: "OFFICE | HIGHLIGHTS"
                };

                newSections = [
                    {
                        id: 'focus-ceo',
                        title: 'CEO Office Briefing',
                        content: JSON.stringify(ceoData),
                        type: 'text',
                        visibleContent: '',
                        isVisible: false
                    }
                ];
                addMessage('assistant', "CEO office briefing loaded. Dashboard shows today's high-level engagements.", true);
            }

        } else if (lowercaseQuery.includes('governor') || (lowercaseQuery.includes('minister') && !lowercaseQuery.includes('prime minister')) || lowercaseQuery.includes('cm') || lowercaseQuery.includes('vvip')) {
            // VVIP / Governor visit (but not Prime Minister - that's handled by VIP visit parser)
            const visitorName = lowercaseQuery.includes('governor') ? "Governor of Karnataka" : "Hon'ble Minister";
            const protocolData = {
                visitor: visitorName,
                title: "State Guest Protocol",
                dateTime: "Confirmed: 12th Feb, 2024 at 11:00 AM",
                location: "Helipad / Raja Gopuram Entrance",
                protocolLevel: "maximum",
                delegationSize: "~15 persons + security",
                leadEscort: "CEO / Executive Officer",
                securityStatus: "Z-Category / Local Police Liaison",
                todayHighlights: [
                    { time: '10:30 AM', description: `Pre-arrival security sweep by local police.` },
                    { time: '11:00 AM', description: `Arrival and reception by Peetham CEO.` },
                    { time: '11:30 AM', description: `Temple Darshan and Ashirvada.` },
                    { time: '12:30 PM', description: `Lunch at Special VIP Guesthouse.` }
                ],
                highlightTitle: "PROTOCOL | HIGHLIGHTS"
            };

            newSections = [
                {
                    id: 'focus-vvip',
                    title: 'VVIP Visit Protocol',
                    content: JSON.stringify(protocolData),
                    type: 'text',
                    visibleContent: '',
                    isVisible: false
                },
                {
                    id: 'planner-vvip',
                    title: 'Your Planner Actions',
                    subTitle: 'State Guest Protocol',
                    content: `[·] Coordinate with District Police for pilot & escort\n[·] Brief Sringeri protocol officers on guest profile\n[·] Secure private darshan window (30 mins)\n[·] Confirm special prasadam & shalu arrangements`,
                    type: 'list',
                    visibleContent: '',
                    isVisible: false
                }
            ];
            addMessage('assistant', `I've prepared the protocol briefing and planner actions for the ${visitorName}'s visit.`, true);
        } else if (isRecommendation) {
            // 4. Recommendation Click (No Canvas Update)
            // User message already added at start
            setTimeout(() => {
                let response = "I've noted this requirement. I'll flag any potential conflicts with the existing schedule.";
                const effectiveLowercaseQuery = lowercaseQuery;

                // Check for flexible query parsing FIRST (planning, actions, kitchen) - before general status setting
                const planningQuery = FlexibleQueryParser.parsePlanningQuery(query);
                const actionQuery = FlexibleQueryParser.parseActionQuery(query);
                const kitchenQuery = FlexibleQueryParser.parseKitchenQuery(query);

                if (planningQuery) {
                    // User message already added at start

                    setTimeout(() => {
                        let plannerActions = '';

                        if (planningQuery.type === 'adhoc-visit') {
                            // Get location data from mock data
                            const locationData = DataLookupService.searchLocations(query);
                            const locationInfo = locationData.data.length > 0 ? locationData.data[0] : null;

                            // Parse time to generate highlights
                            let visitTime = '04:00 PM';
                            if (planningQuery.time) {
                                visitTime = planningQuery.time;
                            }

                            // Generate highlights based on visit time
                            const timeParts = visitTime.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)/i);
                            let hour24 = 16;
                            let minute = 0;
                            let period = 'PM';
                            if (timeParts) {
                                const hour12 = parseInt(timeParts[1]);
                                minute = timeParts[2] ? parseInt(timeParts[2]) : 0;
                                period = timeParts[3].toUpperCase();
                                hour24 = hour12;
                                if (period === 'PM' && hour12 !== 12) hour24 = hour12 + 12;
                                if (period === 'AM' && hour12 === 12) hour24 = 0;
                            }

                            // Format time helper - convert 24h to 12h format
                            const formatTime = (h24: number, m: number, originalPeriod: string) => {
                                let h12 = h24;
                                let period = originalPeriod;
                                if (h24 > 12) {
                                    h12 = h24 - 12;
                                    period = 'PM';
                                } else if (h24 === 0) {
                                    h12 = 12;
                                    period = 'AM';
                                } else if (h24 === 12) {
                                    h12 = 12;
                                    period = 'PM';
                                } else {
                                    period = 'AM';
                                }
                                return `${h12}:${String(m).padStart(2, '0')} ${period}`;
                            };

                            // Create rich card data for adhoc visit
                            const visitCardData = {
                                visitor: planningQuery.person || "Jagadgurugalu",
                                title: "Spiritual Visit",
                                dateTime: `${planningQuery.date || 'Today'} at ${visitTime}`,
                                location: planningQuery.location || "Destination",
                                protocolLevel: "maximum",
                                delegationSize: "~20 persons",
                                leadEscort: "Executive Officer",
                                securityStatus: "Briefed & Ready",
                                todayHighlights: [
                                    {
                                        time: formatTime((hour24 - 1 + 24) % 24, minute, period),
                                        description: 'Pre-arrival shubha samaya readiness check and final preparations.'
                                    },
                                    {
                                        time: visitTime,
                                        description: `Arrival at ${planningQuery.location || 'destination'} and Poornakumbha Swagata.`
                                    },
                                    {
                                        time: formatTime((hour24 + 1) % 24, minute, period),
                                        description: 'Darshan and special pooja at the sanctum.'
                                    },
                                    {
                                        time: formatTime((hour24 + 2) % 24, minute, period),
                                        description: 'Ashirvachana and meeting with devotees.'
                                    }
                                ],
                                highlightTitle: "TODAY | HIGHLIGHTS"
                            };

                            // Create focus-visit section
                            const visitCardSection: CanvasSection = {
                                id: `focus-visit-${Date.now()}`,
                                title: 'Visit Protocol Brief',
                                content: JSON.stringify(visitCardData),
                                type: 'text',
                                visibleContent: '',
                                isVisible: true
                            };

                            plannerActions = `[·] Coordinate travel arrangements for ${planningQuery.person || 'Jagadguru'} to ${planningQuery.location || 'destination'}\n`;
                            plannerActions += `[·] Arrange security and protocol for the visit\n`;
                            plannerActions += `[·] Prepare welcome arrangements at ${planningQuery.location || 'destination'}\n`;
                            if (locationInfo && locationInfo.description) {
                                plannerActions += `[·] Review location details: ${locationInfo.description}\n`;
                            }
                            plannerActions += `[·] Coordinate with local temple authorities\n`;
                            plannerActions += `[·] Arrange accommodation if needed\n`;
                            plannerActions += `[·] Notify security department about the visit\n`;
                            if (planningQuery.date) {
                                plannerActions += `[·] Confirm visit date: ${planningQuery.date}\n`;
                            }
                            if (planningQuery.time) {
                                plannerActions += `[·] Schedule arrival time: ${planningQuery.time}\n`;
                            }
                            plannerActions += `[·] Prepare special prasad for the visit\n`;
                            plannerActions += `[·] Arrange media coverage if required\n`;

                            // Add visit card section first, then planner
                            setSections(prev => {
                                const plannerIndex = prev.findIndex(s => s.title === 'Your Planner Actions');
                                const updated = [...prev, visitCardSection];

                                const newPlanner: CanvasSection = {
                                    id: `planner-${Date.now()}`,
                                    title: 'Your Planner Actions',
                                    subTitle: 'Visit Plan',
                                    content: plannerActions,
                                    type: 'list',
                                    visibleContent: '',
                                    isVisible: true
                                };

                                if (plannerIndex >= 0) {
                                    const existingContent = prev[plannerIndex].content || '';
                                    const existingVisibleContent = prev[plannerIndex].visibleContent || '';
                                    const newContent = existingContent ? `${existingContent}\n${plannerActions}` : plannerActions;
                                    updated[plannerIndex] = {
                                        ...prev[plannerIndex],
                                        content: newContent,
                                        visibleContent: existingVisibleContent,
                                        isVisible: true
                                    };

                                    // Set up typewriter for visit card first, then planner
                                    const visitCardIndex = updated.length - 1;
                                    setTimeout(() => {
                                        setCurrentSectionIndex(visitCardIndex);
                                        setTypingIndex(0);
                                    }, 100);

                                    return updated;
                                } else {
                                    const newPlannerIndex = updated.length;
                                    updated.push(newPlanner);

                                    // Set up typewriter for visit card first, then planner
                                    const visitCardIndex = updated.length - 2;
                                    setTimeout(() => {
                                        setCurrentSectionIndex(visitCardIndex);
                                        setTypingIndex(0);
                                    }, 100);

                                    return updated;
                                }
                            });

                            addMessage('assistant', `I've created a plan for the visit. Check your planner actions.`, true); // Enable typewriter
                            return;
                        } else if (planningQuery.type === 'event-planning') {
                            // Get event data from mock data
                            const eventData = DataLookupService.searchEvents(query);
                            const eventInfo = eventData.data.length > 0 ? eventData.data[0] : null;

                            // Create rich card data for event planning
                            const eventCardData = {
                                visitor: "Special Event",
                                title: planningQuery.eventType || "Event",
                                dateTime: `${planningQuery.date || 'TBD'} at ${eventInfo?.time || 'TBD'}`,
                                location: eventInfo?.location || "Main Temple Complex",
                                protocolLevel: planningQuery.vipAssociation ? "high" : "standard",
                                delegationSize: planningQuery.vipAssociation ? "Multiple VIP Groups" : "~100 persons",
                                leadEscort: planningQuery.vipAssociation ? "Executive Officer" : "Ritual Department",
                                securityStatus: planningQuery.vipAssociation ? "Briefed & Ready" : "Standard Protocol",
                                todayHighlights: eventInfo ? [
                                    { time: '07:00 AM', description: `Commencement of ${planningQuery.eventType || 'event'} with Maha Sankalpa.` },
                                    { time: '09:00 AM', description: 'Ritwik Varanam and start of main rituals.' },
                                    { time: '11:00 AM', description: planningQuery.vipAssociation ? 'VIP participation in the event and special darshan flow.' : 'Main event proceedings.' },
                                    { time: '12:30 PM', description: 'Purnahuti, Deeparadhana, and Shanti Mantra Patha.' }
                                ] : [
                                    { time: 'Morning', description: `Preparation for ${planningQuery.eventType || 'event'}.` },
                                    { time: 'Midday', description: 'Main event proceedings.' },
                                    { time: 'Evening', description: 'Conclusion and prasad distribution.' }
                                ],
                                highlightTitle: planningQuery.date ? `${planningQuery.date.toUpperCase()} | HIGHLIGHTS` : "TODAY | HIGHLIGHTS"
                            };

                            // Create focus-event section
                            const eventCardSection: CanvasSection = {
                                id: `focus-event-${Date.now()}`,
                                title: 'Event Protocol Brief',
                                content: JSON.stringify(eventCardData),
                                type: 'text',
                                visibleContent: '',
                                isVisible: true
                            };

                            plannerActions = `[·] Prepare ${planningQuery.eventType || 'event'} arrangements\n`;
                            plannerActions += `[·] Coordinate with ritual department for ${planningQuery.eventType || 'event'}\n`;
                            if (planningQuery.date) {
                                plannerActions += `[·] Confirm event date: ${planningQuery.date}\n`;
                            }
                            if (planningQuery.vipAssociation) {
                                plannerActions += `[·] Arrange VIP protocol and security\n`;
                                plannerActions += `[·] Coordinate VIP invitations\n`;
                                plannerActions += `[·] Prepare special arrangements for VIP guests\n`;
                            }
                            plannerActions += `[·] Arrange special prasad preparation\n`;
                            plannerActions += `[·] Coordinate media and documentation if needed\n`;

                            // Add event card section first, then planner
                            setSections(prev => {
                                const plannerIndex = prev.findIndex(s => s.title === 'Your Planner Actions');
                                const updated = [...prev, eventCardSection];

                                const newPlanner: CanvasSection = {
                                    id: `planner-${Date.now()}`,
                                    title: 'Your Planner Actions',
                                    subTitle: 'Event Plan',
                                    content: plannerActions,
                                    type: 'list',
                                    visibleContent: '',
                                    isVisible: true
                                };

                                if (plannerIndex >= 0) {
                                    const existingContent = prev[plannerIndex].content || '';
                                    const existingVisibleContent = prev[plannerIndex].visibleContent || '';
                                    const newContent = existingContent ? `${existingContent}\n${plannerActions}` : plannerActions;
                                    updated[plannerIndex] = {
                                        ...prev[plannerIndex],
                                        content: newContent,
                                        visibleContent: existingVisibleContent,
                                        isVisible: true
                                    };

                                    // Set up typewriter for event card first, then planner
                                    const eventCardIndex = updated.length - 1;
                                    setTimeout(() => {
                                        setCurrentSectionIndex(eventCardIndex);
                                        setTypingIndex(0);
                                    }, 100);

                                    return updated;
                                } else {
                                    const newPlannerIndex = updated.length;
                                    updated.push(newPlanner);

                                    // Set up typewriter for event card first, then planner
                                    const eventCardIndex = updated.length - 2;
                                    setTimeout(() => {
                                        setCurrentSectionIndex(eventCardIndex);
                                        setTypingIndex(0);
                                    }, 100);

                                    return updated;
                                }
                            });

                            addMessage('assistant', `I've created a plan for the event. Check your planner actions.`, true); // Enable typewriter
                            return;
                        }
                    }, 1200);
                    return;
                }

                if (actionQuery) {
                    // User message already added at start

                    setTimeout(() => {
                        let response = '';
                        let plannerActions = '';

                        if (actionQuery.action === 'add' && actionQuery.entityType === 'devotees') {
                            plannerActions = `[·] Add devotee records to system\n`;
                            plannerActions += `[·] Update devotee database\n`;
                            plannerActions += `[·] Notify relevant departments about new devotees\n`;
                            response = "I've added devotee-related actions to your planner.";
                        } else if (actionQuery.action === 'extend' && actionQuery.recipients) {
                            actionQuery.recipients.forEach(recipient => {
                                plannerActions += `[·] Send invitation to ${recipient}\n`;
                                plannerActions += `[·] Coordinate protocol for ${recipient} visit\n`;
                                plannerActions += `[·] Arrange security briefing for ${recipient}\n`;
                            });
                            response = `I've added invitation actions for ${actionQuery.recipients.join(' and ')} to your planner.`;
                        } else if (actionQuery.action === 'ask' && actionQuery.target === 'kitchen department') {
                            const kitchenData = DataLookupService.searchKitchen(query);
                            if (kitchenData.data.length > 0) {
                                response = `**Kitchen Menu Information:**\n\n${DataLookupService.formatDataForDisplay(kitchenData)}`;
                            } else {
                                response = "I've requested the menu from the kitchen department. Here's the current information:\n\n";
                                response += "**Prasad Menu:**\n";
                                response += "- Laddu\n";
                                response += "- Sweet Pongal\n";
                                response += "- Payasam\n\n";
                                response += "**Annadanam Menu:**\n";
                                response += "- Puliyogare\n";
                                response += "- Curd Rice\n";
                                response += "- Sambar\n";
                                response += "- Rasam\n";
                            }
                        }

                        if (plannerActions) {
                            setSections(prev => {
                                const plannerIndex = prev.findIndex(s => s.title === 'Your Planner Actions');
                                const newContent = plannerActions;

                                if (plannerIndex >= 0) {
                                    const updated = [...prev];
                                    const existingContent = prev[plannerIndex].content || '';
                                    const existingVisibleContent = prev[plannerIndex].visibleContent || '';
                                    const mergedContent = existingContent ? `${existingContent}\n${newContent}` : newContent;
                                    updated[plannerIndex] = {
                                        ...prev[plannerIndex],
                                        content: mergedContent,
                                        visibleContent: existingVisibleContent, // Keep existing, typewriter will add new part
                                        isVisible: true
                                    };

                                    // Set up typewriter effect
                                    setTimeout(() => {
                                        setTypingIndex(existingVisibleContent.length);
                                        setCurrentSectionIndex(plannerIndex);
                                    }, 0);

                                    return updated;
                                } else {
                                    const newPlannerIndex = prev.length;

                                    // Set up typewriter effect for new planner
                                    setTimeout(() => {
                                        setTypingIndex(0);
                                        setCurrentSectionIndex(newPlannerIndex);
                                    }, 0);

                                    return [...prev, {
                                        id: `planner-${Date.now()}`,
                                        title: 'Your Planner Actions',
                                        subTitle: 'Query Follow-up',
                                        content: newContent,
                                        type: 'list',
                                        visibleContent: '', // Start empty for typewriter effect
                                        isVisible: true
                                    }];
                                }
                            });
                        }

                        addMessage('assistant', response || "I've processed your request.", true); // Enable typewriter
                        setStatus('complete');
                    }, 1200);
                    return;
                }

                if (kitchenQuery) {
                    // User message already added at start

                    setTimeout(() => {
                        const kitchenData = DataLookupService.searchKitchen(query);
                        let response = '';

                        if (kitchenQuery.requestType === 'menu') {
                            response = "**Kitchen Menu:**\n\n";
                            if (kitchenQuery.menuType === 'prasad') {
                                response += "**Prasad Menu:**\n";
                                response += "- Laddu\n";
                                response += "- Sweet Pongal\n";
                                response += "- Payasam\n";
                                response += "- Vada\n";
                            } else if (kitchenQuery.menuType === 'annadanam') {
                                response += "**Annadanam Menu:**\n";
                                response += "- Puliyogare\n";
                                response += "- Curd Rice\n";
                                response += "- Sambar\n";
                                response += "- Rasam\n";
                                response += "- Pickle\n";
                            } else {
                                response += "**Prasad:** Laddu, Sweet Pongal, Payasam, Vada\n";
                                response += "**Annadanam:** Puliyogare, Curd Rice, Sambar, Rasam\n";
                            }
                        } else {
                            response = DataLookupService.formatDataForDisplay(kitchenData);
                        }

                        addMessage('assistant', response, true); // Enable typewriter

                        // Generate planner actions for kitchen query
                        const plannerActions = generatePlannerActionsFromQuery(query, 'kitchen');

                        // Add planner actions to the planner section
                        setSections(prev => {
                            const plannerIndex = prev.findIndex(s => s.title === 'Your Planner Actions');

                            if (plannerIndex >= 0) {
                                const updated = [...prev];
                                const existingContent = prev[plannerIndex].content || '';
                                const existingVisibleContent = prev[plannerIndex].visibleContent || '';
                                const mergedContent = existingContent ? `${existingContent}\n${plannerActions}` : plannerActions;
                                updated[plannerIndex] = {
                                    ...prev[plannerIndex],
                                    content: mergedContent,
                                    visibleContent: existingVisibleContent, // Keep existing, typewriter will add new part
                                    isVisible: true
                                };

                                // Set up typewriter effect
                                setTimeout(() => {
                                    setTypingIndex(existingVisibleContent.length);
                                    setCurrentSectionIndex(plannerIndex);
                                }, 0);

                                return updated;
                            } else {
                                const newPlannerIndex = prev.length;

                                // Set up typewriter effect for new planner
                                setTimeout(() => {
                                    setTypingIndex(0);
                                    setCurrentSectionIndex(newPlannerIndex);
                                }, 0);

                                return [...prev, {
                                    id: `planner-${Date.now()}`,
                                    title: 'Your Planner Actions',
                                    subTitle: 'Kitchen Follow-up',
                                    content: plannerActions,
                                    type: 'list',
                                    visibleContent: '', // Start empty for typewriter effect
                                    isVisible: true
                                }];
                            }
                        });

                        setStatus('complete');
                    }, 1200);
                    return;
                }

                // User message already added at start

                if (isRecommendation) {
                    // Recommendation click - provide a specific answer based on the query, don't update canvas
                    setTimeout(() => {
                        let response = "I've noted this requirement. I'll flag any potential conflicts with the existing schedule.";

                        if (lowercaseQuery.includes('parking')) {
                            response = "Yes, the North Gate VIP parking area has been reserved and secured. Security personnel will be stationed there 30 minutes prior to arrival.";
                        } else if (lowercaseQuery.includes('escort') || lowercaseQuery.includes('who should escort')) {
                            response = "The Executive Officer will be the lead escort for the VIP. Two additional temple guards have been assigned for the inner circle.";
                        } else if (lowercaseQuery.includes('security briefing')) {
                            response = "The security briefing document is ready. It covers the entry protocols, sanctum access limits, and emergency exit routes.";
                        } else if (lowercaseQuery.includes('prasadam')) {
                            response = "Based on the delegation size, 20 special prasadam packets have been prepared and are currently being held in the VIP lounge.";
                        } else if (lowercaseQuery.includes('approval workflow')) {
                            response = "The approval workflow is currently at the 'Executive Review' stage. 2 of 3 required signatures have been obtained.";
                        } else if (lowercaseQuery.includes('notified')) {
                            response = "The Departments of Ritual, Security, and Public Relations have been notified. The local police station has also received the protocol notice.";
                        } else if (lowercaseQuery.includes('budget') || lowercaseQuery.includes('financial report')) {
                            response = "The financial summary shows all allocations are within the festive season budget. Hundi collections are being processed as scheduled.";
                        } else if (lowercaseQuery.includes('when should') || lowercaseQuery.includes('deadline')) {
                            response = "High-priority items should be completed by 6 PM tonight. Secondary tasks can be finalized by 7 AM tomorrow morning.";
                        }

                        addMessage('assistant', response, true); // Enable typewriter
                        setStatus('complete');
                    }, 800);
                    return;
                }

                // 5. Generic Queries (Priority 3)
                if ((isInfoQuery || isSummaryQuery) && newSections.length === 0) {
                    // User message already added at start

                    setTimeout(() => {
                        const lookupResult = DataLookupService.lookupData(query);
                        let response = '';

                        // Try flexible query parsing for progress queries first
                        const progressQuery = FlexibleQueryParser.parseProgressQuery(query);
                        let summaryCardData: any = null;

                        if (isSummaryQuery && progressQuery && progressQuery.festivalName) {
                            // Get festival data for summary card
                            const festivalData = DataLookupService.searchFestivals(query);
                            if (festivalData.data.length > 0) {
                                const fest = festivalData.data[0];

                                // Create rich summary card data
                                summaryCardData = {
                                    title: `${fest.festivalName} Preparation Status`,
                                    progress: fest.progress || 0,
                                    status: fest.status || "in-progress",
                                    todayHighlights: [
                                        { time: 'Status', description: `Overall: ${fest.progress || 0}% complete` },
                                        { time: 'Actions', description: `${fest.actions?.filter((a: any) => a.status === 'completed').length || 0} of ${fest.actions?.length || 0} actions completed` },
                                        ...(fest.actions?.slice(0, 2).map((action: any) => ({
                                            time: action.status === 'completed' ? '✓' : action.status === 'in-progress' ? '⟳' : '○',
                                            description: action.description
                                        })) || [])
                                    ],
                                    highlightTitle: "PROGRESS | HIGHLIGHTS"
                                };

                                response = `**${fest.festivalName} Preparation Progress:**\n\n`;
                                response += `Status: ${fest.status}\n`;
                                response += `Progress: ${fest.progress}%\n\n`;
                                response += `**Actions:**\n`;
                                fest.actions.forEach((action: any) => {
                                    const statusIcon = action.status === 'completed' ? '✓' : action.status === 'in-progress' ? '⟳' : '○';
                                    response += `${statusIcon} ${action.description} [${action.status}]\n`;
                                });
                            } else {
                                response = `I couldn't find specific data for "${progressQuery.festivalName}". The system is checking available information.`;
                            }
                        } else if (lookupResult.data.length > 0) {
                            if (isSummaryQuery) {
                                // Format as summary
                                response = `**Summary:**\n\n${DataLookupService.formatDataForDisplay(lookupResult)}`;
                            } else {
                                // Format as info
                                response = `**Information:**\n\n${DataLookupService.formatDataForDisplay(lookupResult)}`;
                            }
                        } else {
                            response = "I couldn't find specific data matching your query. Please try rephrasing or be more specific.";
                        }

                        addMessage('assistant', response, true); // Enable typewriter

                        // Generate planner actions for this query
                        const plannerActions = generatePlannerActionsFromQuery(query, isSummaryQuery ? 'summary' : 'info');

                        // Create summary card section if we have summary data
                        if (summaryCardData) {
                            const summaryCardSection: CanvasSection = {
                                id: `focus-summary-${Date.now()}`,
                                title: 'Summary Status',
                                content: JSON.stringify(summaryCardData),
                                type: 'text',
                                visibleContent: '',
                                isVisible: true
                            };

                            // Add summary card section first, then planner
                            setSections(prev => {
                                const plannerIndex = prev.findIndex(s => s.title === 'Your Planner Actions');
                                const updated = [...prev, summaryCardSection];

                                if (plannerIndex >= 0) {
                                    const existingContent = prev[plannerIndex].content || '';
                                    const existingVisibleContent = prev[plannerIndex].visibleContent || '';
                                    const mergedContent = existingContent ? `${existingContent}\n${plannerActions}` : plannerActions;
                                    updated[plannerIndex] = {
                                        ...prev[plannerIndex],
                                        content: mergedContent,
                                        visibleContent: existingVisibleContent,
                                        isVisible: true
                                    };

                                    // Set up typewriter for summary card first, then planner
                                    const summaryCardIndex = updated.length - 1;
                                    setTimeout(() => {
                                        setCurrentSectionIndex(summaryCardIndex);
                                        setTypingIndex(0);
                                    }, 100);

                                    return updated;
                                } else {
                                    const newPlannerIndex = updated.length;
                                    updated.push({
                                        id: `planner-${Date.now()}`,
                                        title: 'Your Planner Actions',
                                        subTitle: 'Query Follow-up',
                                        content: plannerActions,
                                        type: 'list',
                                        visibleContent: '',
                                        isVisible: true
                                    });

                                    // Set up typewriter for summary card first, then planner
                                    const summaryCardIndex = updated.length - 2;
                                    setTimeout(() => {
                                        setCurrentSectionIndex(summaryCardIndex);
                                        setTypingIndex(0);
                                    }, 100);

                                    return updated;
                                }
                            });
                        } else {
                            // Add planner actions to the planner section (no summary card)
                            setSections(prev => {
                                const plannerIndex = prev.findIndex(s => s.title === 'Your Planner Actions');

                                if (plannerIndex >= 0) {
                                    const updated = [...prev];
                                    const existingContent = prev[plannerIndex].content || '';
                                    const existingVisibleContent = prev[plannerIndex].visibleContent || '';
                                    const mergedContent = existingContent ? `${existingContent}\n${plannerActions}` : plannerActions;
                                    updated[plannerIndex] = {
                                        ...prev[plannerIndex],
                                        content: mergedContent,
                                        visibleContent: existingVisibleContent,
                                        isVisible: true
                                    };

                                    // Set up typewriter effect
                                    setTimeout(() => {
                                        setTypingIndex(existingVisibleContent.length);
                                        setCurrentSectionIndex(plannerIndex);
                                    }, 0);

                                    return updated;
                                } else {
                                    const newPlannerIndex = prev.length;

                                    // Set up typewriter effect for new planner
                                    setTimeout(() => {
                                        setTypingIndex(0);
                                        setCurrentSectionIndex(newPlannerIndex);
                                    }, 0);

                                    return [...prev, {
                                        id: `planner-${Date.now()}`,
                                        title: 'Your Planner Actions',
                                        subTitle: 'Query Follow-up',
                                        content: plannerActions,
                                        type: 'list',
                                        visibleContent: '',
                                        isVisible: true
                                    }];
                                }
                            });
                        }

                        setStatus('complete');
                    }, 1200);
                    return;
                }

                // Check if this is a planner action request - only if not already handled by special scenarios
                if (isPlannerRequest && newSections.length === 0) {
                    // This is a planner action request - parse actions from query
                    // User message already added at start
                    const actions = parseActionsFromQuery(query);

                    if (actions.length > 0) {
                        // Format actions with [·] prefix for planner
                        const formattedActions = actions.map(action => `[·] ${action}`).join('\n');

                        // Check if there's an existing planner actions section
                        setSections(prev => {
                            const existingPlannerIndex = prev.findIndex(s => s.title === 'Your Planner Actions');

                            if (existingPlannerIndex >= 0) {
                                // Append to existing planner actions
                                const existingContent = prev[existingPlannerIndex].content;
                                const newContent = existingContent
                                    ? `${existingContent}\n${formattedActions}`
                                    : formattedActions;

                                const updated = [...prev];
                                const existingSection = prev[existingPlannerIndex];
                                updated[existingPlannerIndex] = {
                                    ...existingSection,
                                    content: newContent,
                                    subTitle: 'VIP Plan',
                                    // PRESERVE existing visible content so it doesn't disappear
                                    visibleContent: existingSection.visibleContent,
                                    isVisible: existingSection.isVisible
                                };

                                // Start typing from the end of current content - set after state update
                                setTimeout(() => {
                                    setTypingIndex(existingSection.visibleContent.length);
                                    setCurrentSectionIndex(existingPlannerIndex);
                                }, 0);
                                return updated;
                            } else {
                                // Create new planner actions section
                                const newPlannerIndex = prev.length; // Index of the new planner after adding
                                setTimeout(() => {
                                    setTypingIndex(0);
                                    setCurrentSectionIndex(newPlannerIndex);
                                }, 0);
                                return [
                                    ...prev,
                                    {
                                        id: `planner-actions-${Date.now()}`,
                                        title: 'Your Planner Actions',
                                        subTitle: 'VIP Plan',
                                        content: formattedActions,
                                        type: 'list',
                                        visibleContent: '',
                                        isVisible: false
                                    }
                                ];
                            }
                        });

                        // Set sections to trigger re-render, but we've already updated above
                        newSections = [];
                    } else {
                        // Fallback: use the query as a single action
                        setSections(prev => {
                            const existingPlannerIndex = prev.findIndex(s => s.title === 'Your Planner Actions');

                            if (existingPlannerIndex >= 0) {
                                const existingContent = prev[existingPlannerIndex].content;
                                const newContent = existingContent
                                    ? `${existingContent}\n[·] ${query}`
                                    : `[·] ${query}`;

                                const updated = [...prev];
                                const existingSection = prev[existingPlannerIndex];
                                updated[existingPlannerIndex] = {
                                    ...updated[existingPlannerIndex],
                                    content: newContent,
                                    // PRESERVE existing visible content so it doesn't disappear
                                    visibleContent: existingSection.visibleContent,
                                    isVisible: existingSection.isVisible
                                };

                                // Start typing from the end of current content - set after state update
                                setTimeout(() => {
                                    setTypingIndex(existingSection.visibleContent.length);
                                    setCurrentSectionIndex(existingPlannerIndex);
                                }, 0);
                                return updated;
                            } else {
                                // Create new planner actions section
                                const newPlannerIndex = prev.length; // Index of the new planner after adding
                                setTimeout(() => {
                                    setTypingIndex(0);
                                    setCurrentSectionIndex(newPlannerIndex);
                                }, 0);
                                return [
                                    ...prev,
                                    {
                                        id: `planner-actions-${Date.now()}`,
                                        title: 'Your Planner Actions',
                                        content: `[·] ${query}`,
                                        type: 'list',
                                        visibleContent: '',
                                        isVisible: false
                                    }
                                ];
                            }
                        });
                        newSections = [];
                    }
                } else if (lowercaseQuery.includes('jagadguru') || lowercaseQuery.includes('swamiji')) {
                    // Jagadgurugalu / Swamiji Logic
                    const isKiggaVisit = lowercaseQuery.includes('kigga');

                    if (options?.onVIPVisitParsed) {
                        options.onVIPVisitParsed({
                            visitor: "Jagadguru Sri Sri Vidhushekhara Bharati Sannidhanam",
                            title: "Pontiff of Sringeri Sharada Peetham",
                            date: isKiggaVisit ? new Date() : new Date(new Date().setDate(new Date().getDate() + 1)),
                            time: isKiggaVisit ? "16:00" : "17:00",
                            location: isKiggaVisit ? "Kigga" : "Main Entrance (Raja Gopuram)",
                            protocolLevel: "maximum",
                            confidence: 1.0
                        });
                    }

                    const vipData = {
                        visitor: "Jagadguru Sri Sri Vidhushekhara Bharati Sannidhanam",
                        title: "Pontiff of Sringeri Sharada Peetham",
                        dateTime: isKiggaVisit ? "Today at 4:00 PM" : "Tomorrow at 5:00 PM",
                        location: isKiggaVisit ? "Kigga" : "Main Entrance (Raja Gopuram)",
                        protocolLevel: "maximum",
                        delegationSize: isKiggaVisit ? "~20 persons" : "~10 persons",
                        todayHighlights: isKiggaVisit ? [
                            { time: '03:30 PM', description: 'Pre-arrival shubha samaya readiness check.' },
                            { time: '04:00 PM', description: 'Arrival at Kigga Temple and Poornakumbha Swagata.' },
                            { time: '04:30 PM', description: 'Darshan and special pooja at the sanctum.' },
                            { time: '05:30 PM', description: 'Ashirvachana and meeting with devotees.' }
                        ] : [
                            { time: '05:00 PM', description: 'Arrival at Raja Gopuram, Sringeri.' },
                            { time: '05:30 PM', description: 'Poornakumbha Swagata and processional welcome.' },
                            { time: '06:30 PM', description: 'Dharma Sabha and Anugraha Bhashana.' }
                        ],
                        highlightTitle: "TODAY | HIGHLIGHTS",
                        highlights: isKiggaVisit ? [
                            { time: '03:30 PM', description: 'Pre-arrival shubha samaya readiness check.' },
                            { time: '04:00 PM', description: 'Arrival at Kigga Temple and Poornakumbha Swagata.' },
                            { time: '04:30 PM', description: 'Darshan and special pooja at the sanctum.' },
                            { time: '05:30 PM', description: 'Ashirvachana and meeting with devotees.' }
                        ] : [
                            { time: '05:00 PM', description: 'Arrival at Raja Gopuram, Sringeri.' },
                            { time: '05:30 PM', description: 'Poornakumbha Swagata and processional welcome.' },
                            { time: '06:30 PM', description: 'Dharma Sabha and Anugraha Bhashana.' }
                        ]
                    };

                    const kiggaPlannerContent = `[·] Confirm Jagadguru arrival seva & reception krama
[·] Align mutt coordination & travel readiness
[·] Prepare darshan & movement path inside temple
[·] Confirm archaka & purohita availability
[·] Prepare alankara & minimal pooja samagri
[·] Inform temple trustees & senior sevaks
[·] Activate crowd seva & volunteer arrangement
[·] Coordinate prasad preparation (small batch)
[·] Ensure protocol & security alignment
[·] Conduct pre-arrival shubha samaya readiness check (3:30 PM)`;

                    newSections = [
                        {
                            id: 'focus-vip',
                            title: 'VIP Protocol Brief',
                            content: JSON.stringify(vipData),
                            type: 'text',
                            visibleContent: '',
                            isVisible: false
                        },
                        {
                            id: 'planner-jagadguru',
                            title: 'Your Planner Actions',
                            subTitle: isKiggaVisit ? 'Kigga Adhoc Visit Plan' : 'Poornakumbha Swagata Plan',
                            content: isKiggaVisit ? kiggaPlannerContent : '[·] Arrange Poornakumbha Swagata at Raja Gopuram\n[·] Coordinate Dhuli Pada Puja at Pravachana Mandiram\n[·] Ensure security clearance for devotee darshan line\n[·] Prepare Sanctum for special Mangala Arathi',
                            type: 'list',
                            visibleContent: '',
                            isVisible: false
                        }
                    ];

                } else if (lowercaseQuery.includes('chandi') || lowercaseQuery.includes('yaga') || lowercaseQuery.includes('homa')) {
                    // Sahasra Chandi Yaga logic
                    const isFeb3rd = lowercaseQuery.includes('3rd feb') || lowercaseQuery.includes('february 3');

                    if (isFeb3rd) {
                        const vipData = {
                            visitor: "Special Dignitaries & Devotees",
                            title: "Sahasra Chandi Maha Yaga",
                            dateTime: "3rd Feb, 2024 (7:00 AM - 1:00 PM)",
                            location: "Main Yaga Shala / Temple Inner Courtyard",
                            protocolLevel: "high",
                            delegationSize: "Multiple VIP Groups",
                            todayHighlights: [
                                { time: '07:00 AM', description: 'Commencement of Sahasra Chandi Yaga with Maha Sankalpa and Avahana.' },
                                { time: '09:00 AM', description: 'Ritwik Varanam and start of Maha Chandi Parayanam.' },
                                { time: '11:00 AM', description: 'VIP participation in the Yaga and special darshan flow.' },
                                { time: '12:30 PM', description: 'Maha Purnahuti, Deeparadhana, and Shanti Mantra Patha.' }
                            ],
                            highlightTitle: "FEBRUARY 3 | HIGHLIGHTS",
                            highlights: [
                                { time: '07:00 AM', description: 'Commencement of Sahasra Chandi Yaga with Maha Sankalpa and Avahana.' },
                                { time: '09:00 AM', description: 'Ritwik Varanam and start of Maha Chandi Parayanam.' },
                                { time: '11:00 AM', description: 'VIP participation in the Yaga and special darshan flow.' },
                                { time: '12:30 PM', description: 'Maha Purnahuti, Deeparadhana, and Shanti Mantra Patha.' }
                            ]
                        };

                        newSections = [
                            {
                                id: 'focus-vip',
                                title: 'VIP Event Brief: Sahasra Chandi Yaga',
                                content: JSON.stringify(vipData),
                                type: 'text',
                                visibleContent: '',
                                isVisible: false
                            },
                            {
                                id: 'planner-yaga',
                                title: 'Your Planner Actions',
                                subTitle: 'Sahasra Chandi Yaga Plan (Feb 3rd)',
                                content: `[·] Confirm yaga sankalpa, muhurta & duration
[·] Assign chief acharya, rtviks & purohita team
[·] Prepare complete yaga shala & homa kundas
[·] Verify Sahasra Chandi pooja samagri readiness
[·] Align VIP darshan, seating & yaga participation protocol
[·] Coordinate prasad & naivedya preparation plan
[·] Prepare devotee & crowd movement arrangement
[·] Notify temple trustees & ritual oversight committee
[·] Deploy sevaks & volunteers for yaga support seva
[·] Conduct pre-yaga shubha muhurtam readiness review (2nd Feb)`,
                                type: 'list',
                                visibleContent: '',
                                isVisible: false
                            }
                        ];
                    } else {
                        newSections = [
                            {
                                id: 'focus-event',
                                title: 'Event Brief: Sahasra Chandi Yaga',
                                content: 'The Sahasra Chandi Maha Yaga is scheduled to commence at 7:00 AM tomorrow at the Yaga Shala. 108 Ritwiks have arrived. Purnahuti is scheduled for 12:30 PM on Sunday.',
                                type: 'text',
                                visibleContent: '',
                                isVisible: false
                            },
                            {
                                id: 'planner-yaga',
                                title: 'Your Planner Actions',
                                subTitle: 'Yaga Preparation',
                                content: '[·] Inspect Yaga Shala arrangements and seating\n[·] Verify stock of 500kg Ghee and 1000kg Samidha\n[·] Coordinate accommodation for 108 Ritwiks\n[·] Setup medical camp near North Gate',
                                type: 'list',
                                visibleContent: '',
                                isVisible: false
                            }
                        ];
                    }

                } else if (lowercaseQuery.includes('restoration') || lowercaseQuery.includes('renovation') || lowercaseQuery.includes('infrastructure')) {
                    const projectData = {
                        title: "Gold Archak (Kavacha) Restoration",
                        subTitle: "Status: Ongoing (65% Complete) | Deadline: Feb 20, 2024",
                        highlightTitle: "PROJECT | RECENT MILESTONES",
                        highlights: [
                            { time: 'Jan 2', description: 'Primary cleaning and purification completed.' },
                            { time: 'Jan 5', description: 'Gold plating of base structure initiated.' },
                            { time: 'Today', description: 'Ready for stage-3 artisan review.' }
                        ]
                    };

                    newSections = [
                        {
                            id: 'focus-project',
                            title: 'Project Executive Brief',
                            content: JSON.stringify(projectData),
                            type: 'text',
                            visibleContent: '',
                            isVisible: false
                        },
                        {
                            id: 'planner-project',
                            title: 'Your Planner Actions',
                            subTitle: 'Restoration Milestones',
                            content: `[·] Audit current gold stock and utilization
[·] Approve stage-3 artisan progress report
[·] Schedule security transfer of completed components
[·] Finalize sanctum closure window for installation
[·] Arrange documentation photography of progress`,
                            type: 'list',
                            visibleContent: '',
                            isVisible: false
                        }
                    ];
                    addMessage('assistant', "Project status updated. I've added the restoration milestones to your planner.", true); // Enable typewriter

                } else if (lowercaseQuery.includes('navaratri') || lowercaseQuery.includes('festival') || lowercaseQuery.includes('dasara') || lowercaseQuery.includes('sharannavarathri')) {
                    // Navaratri preparation
                    const isSharadaNavaratri = lowercaseQuery.includes('sharada') || lowercaseQuery.includes('sharannavarathri');
                    const isStatusQuery = lowercaseQuery.includes('progress') || lowercaseQuery.includes('status') || lowercaseQuery.startsWith('show') || lowercaseQuery.includes('view');

                    if (isSharadaNavaratri) {
                        const festivalData = {
                            title: "Sharada Sharannavarathri 2024",
                            subTitle: "Duration: Oct 3 - Oct 12, 2024 | Expected: 50,000+ Daily",
                            highlightTitle: "FESTIVAL | KEY HIGHLIGHTS",
                            highlights: [
                                { time: 'Day 1', description: 'Sharada Sharannavarathri Prarambha, Kalasha Sthapana.' },
                                { time: 'Day 7', description: 'Moola Nakshatra (Saraswati Avahana).' },
                                { time: 'Day 10', description: 'Vijayadashami, Maha Rathotsava.' }
                            ]
                        };

                        newSections = [
                            {
                                id: 'focus-festival',
                                title: 'Festival Event Brief',
                                content: JSON.stringify(festivalData),
                                type: 'text',
                                visibleContent: '',
                                isVisible: false
                            },
                            {
                                id: 'planner-festival',
                                title: 'Your Planner Actions',
                                subTitle: 'Navaratri Execution Roadmap',
                                content: `[·] Verify Alankara schedule for all 10 days
[·] Finalize Annadanam procurement for 5L+ devotees
[·] Deploy additional 200 crowd control volunteers
[·] Setup temporary medical camps at 3 locations
[·] Coordinate with KSRTC for special bus services`,
                                type: 'list',
                                visibleContent: '',
                                isVisible: false
                            }
                        ];
                        addMessage('assistant', "I've generated the Sharada Sharannavarathri execution roadmap and briefing.", true); // Enable typewriter
                    } else {
                        newSections = [
                            {
                                id: 'focus-summary',
                                title: 'Navaratri Preparation Status',
                                content: 'Overall preparation is 85% complete. The main Alankara for Day 1 is ready. Security barriers are installed. Annadanam supplies are stocked for the first 3 days.',
                                type: 'text',
                                visibleContent: '',
                                isVisible: false
                            }
                        ];

                        if (!isStatusQuery) {
                            newSections.push({
                                id: 'planner-navaratri',
                                title: 'Your Planner Actions',
                                subTitle: 'Festival Readiness',
                                content: '[·] Final inspection of Queue Complex A\n[·] Review CCTV coverage with Police Commissioner\n[·] Distributors meeting for Prasadam counters\n[·] Electrical safety audit of illumination',
                                type: 'list',
                                visibleContent: '',
                                isVisible: false
                            });
                        }
                    }

                } else if (lowercaseQuery.includes('approval') || lowercaseQuery.includes('pending')) {
                    const isViewOnly = lowercaseQuery.startsWith('show') || lowercaseQuery.includes('view') || lowercaseQuery.includes('list') || lowercaseQuery.includes('check');

                    const focusContent = 'You have 3 high-priority approvals pending for the Gold Kavacha restoration. Delay may impact the upcoming festival schedule.';

                    newSections = [
                        { id: 'focus-approval', title: 'Approval Briefing', content: focusContent, type: 'text', visibleContent: '', isVisible: false }
                    ];

                    if (!isViewOnly) {
                        newSections.push({
                            id: 'approval-steps',
                            title: 'Your Planner Actions',
                            content: '[·] Review Priest\'s technical request\n[·] Verify insurance coverage extension\n[·] Confirm artisan availability for Jan 15',
                            type: 'list',
                            visibleContent: '',
                            isVisible: false
                        });
                    }
                } else if (lowercaseQuery.startsWith('schedule') || lowercaseQuery.startsWith('review') || lowercaseQuery.startsWith('plan') && !lowercaseQuery.includes('action')) {
                    // CEO INFORMATION / APPOINTMENT INTENT
                    if (lowercaseQuery.includes('sahasra chandi')) {
                        // Special handling for the specific event if needed, or fall through to generic
                    }

                    let cardType = 'appointment';
                    if (lowercaseQuery.includes('review')) cardType = 'review';
                    else if (lowercaseQuery.includes('event') || lowercaseQuery.includes('yaga')) cardType = 'event';
                    else if (lowercaseQuery.includes('ritual') || lowercaseQuery.includes('pooja')) cardType = 'ritual';

                    // Mock Extract subjects
                    const subject = query.replace(/^(schedule|review|plan)\s+/i, '').split(' on ')[0].split(' at ')[0];

                    const cardData = {
                        type: cardType,
                        subject: subject.charAt(0).toUpperCase() + subject.slice(1),
                        dateTime: "Tomorrow, 10:00 AM", // Mock logic
                        intent: "Align key stakeholders on execution roadmap and identify blockers.",
                        plannedBy: "Temple CEO",
                        visibility: "Executive"
                    };

                    newSections = [
                        {
                            id: 'focus-ceo-card',
                            title: 'Executive Plan',
                            content: JSON.stringify(cardData),
                            type: 'text', // We use custom renderer
                            visibleContent: '', // Not used for this type really
                            isVisible: false
                        }
                    ];
                    addMessage('assistant', `I've scheduled the ${cardType} regarding "${subject}". Relevant cards have been placed on your canvas.`, true); // Enable typewriter

                } else if (lowercaseQuery.startsWith('direct') || lowercaseQuery.startsWith('instruct') || lowercaseQuery.startsWith('ask') || lowercaseQuery.startsWith('tell') || lowercaseQuery.startsWith('ensure')) {
                    // CEO ACTION / DIRECTIVE INTENT
                    // User message already added at start
                    const cleanDirective = query.replace(/^(direct|instruct|ask|tell|ensure)\s+/i, '');

                    // Infer Department
                    let dept = 'Operations';
                    if (cleanDirective.toLowerCase().includes('security') || cleanDirective.toLowerCase().includes('guard')) dept = 'Security';
                    else if (cleanDirective.toLowerCase().includes('finance') || cleanDirective.toLowerCase().includes('money')) dept = 'Finance';
                    else if (cleanDirective.toLowerCase().includes('priest') || cleanDirective.toLowerCase().includes('ritual')) dept = 'Rituals';

                    // Construct Tagged Action
                    const taggedAction = `[·] [DIRECTIVE] [PRIORITY:HIGH] [DEPT:${dept}] ${cleanDirective.charAt(0).toUpperCase() + cleanDirective.slice(1)}`;

                    setSections(prev => {
                        const existingPlannerIndex = prev.findIndex(s => s.title === 'Your Planner Actions');

                        if (existingPlannerIndex >= 0) {
                            const existingContent = prev[existingPlannerIndex].content;
                            const newContent = existingContent
                                ? `${existingContent}\n${taggedAction}`
                                : taggedAction;

                            const updated = [...prev];
                            const existingSection = prev[existingPlannerIndex];
                            updated[existingPlannerIndex] = {
                                ...updated[existingPlannerIndex],
                                content: newContent,
                                visibleContent: existingSection.visibleContent // Persist existing view
                            };

                            // Start typing from the end of current content - set after state update
                            setTimeout(() => {
                                setTypingIndex(existingSection.visibleContent.length);
                                setCurrentSectionIndex(existingPlannerIndex);
                            }, 0);
                            return updated;
                        } else {
                            // Create new planner actions section
                            const newPlannerIndex = prev.length; // Index of the new planner after adding
                            setTimeout(() => {
                                setTypingIndex(0);
                                setCurrentSectionIndex(newPlannerIndex);
                            }, 0);
                            return [
                                ...prev,
                                {
                                    id: `planner-actions-${Date.now()}`,
                                    title: 'Your Planner Actions',
                                    subTitle: 'Executive Directives',
                                    content: taggedAction,
                                    type: 'list',
                                    visibleContent: '',
                                    isVisible: false
                                }
                            ];
                        }
                    });

                    addMessage('assistant', `Directive issued to ${dept}. Tracking as high priority.`, true); // Enable typewriter
                    setStatus('complete'); // Early exit since we handled the state update manually
                    return;

                } else if (lowercaseQuery.includes('governor') && (lowercaseQuery.includes('karnataka') || lowercaseQuery.includes('visit'))) {
                    const vipData = {
                        visitor: "Thawar Chand Gehlot",
                        title: "Governor of Karnataka",
                        dateTime: "15th Jan, 2024 at 11:30 AM",
                        location: "Main Entrance (Raja Gopuram)",
                        protocolLevel: "high",
                        delegationSize: "~12 persons",
                        todayHighlights: [
                            { time: '11:00 AM', description: 'Pre-arrival security sweep of Raj Niwas Guest House.' },
                            { time: '11:30 AM', description: 'Arrival at Raja Gopuram and ceremonial welcome.' },
                            { time: '12:00 PM', description: 'Special Darshan at Sri Sharadamba Temple.' },
                            { time: '01:00 PM', description: 'Lunch at Executive Guest House with Temple Trust.' }
                        ],
                        highlightTitle: "JANUARY 15 | HIGHLIGHTS",
                        highlights: [
                            { time: '11:00 AM', description: 'Pre-arrival security sweep of Raj Niwas Guest House.' },
                            { time: '11:30 AM', description: 'Arrival at Raja Gopuram and ceremonial welcome.' },
                            { time: '12:00 PM', description: 'Special Darshan at Sri Sharadamba Temple.' },
                            { time: '01:00 PM', description: 'Lunch at Executive Guest House with Temple Trust.' }
                        ]
                    };

                    newSections = [
                        {
                            id: 'focus-vip',
                            title: 'VIP Protocol Brief: Governor Visit',
                            content: JSON.stringify(vipData),
                            type: 'text',
                            visibleContent: '',
                            isVisible: false
                        },
                        {
                            id: 'planner-governor',
                            title: 'Your Planner Actions',
                            subTitle: 'Governor Protocol Plan',
                            content: `[·] Coordinate with Raj Bhavan protocol office
[·] Arrange Z-category security escort from entry
[·] Reserve Executive Guest House for lunch
[·] Prepare Poornakumbha Swagata at main gate
[·] Ensure media-free corridor during darshan`,
                            type: 'list',
                            visibleContent: '',
                            isVisible: false
                        }
                    ];
                    addMessage('assistant', "I've prepared the protocol briefing and planner actions for the Governor's visit.", true); // Enable typewriter

                } else if (lowercaseQuery.includes('vip') || lowercaseQuery.includes('minister') || lowercaseQuery.includes('visit')) {
                    // Skip this legacy VIP handling for "Show VIP visits" queries - they should be handled by QuickActionHandler
                    const isShowVIPVisitsQuery = lowercaseQuery.startsWith('show') && 
                                                 (lowercaseQuery.includes('vip') && (lowercaseQuery.includes('visit') || lowercaseQuery.includes('visits')));
                    
                    if (isShowVIPVisitsQuery) {
                        // This query should have been handled by QuickActionHandler, skip legacy handling
                        newSections = [];
                    } else {
                        // For VIP queries, always show planner - even for "Show VIP visits" queries
                        const isViewOnly = (lowercaseQuery.startsWith('show') || lowercaseQuery.includes('view') || lowercaseQuery.includes('list') || lowercaseQuery.includes('check')) && !lowercaseQuery.includes('vip');

                        // Try to parse VIP visit using NLP
                        const parseResult = QueryParserService.parseQuery(query);
                        let focusContent = '';
                        let plannerActions = '';
                        // Always show planner for VIP-related queries
                        let showPlanner = true;

                        if (parseResult.intent === 'vip-visit' && parseResult.data) {
                            const parsedVisit = parseResult.data as ParsedVIPVisit;
                            if (options?.onVIPVisitParsed) options.onVIPVisitParsed(parsedVisit);

                            // Format date
                            const dateStr = parsedVisit.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

                            // Create structured VIP data for the info card
                            const vipCardData = {
                                visitor: parsedVisit.visitor,
                                title: parsedVisit.title || '',
                                dateTime: `${dateStr} at ${parsedVisit.time}`,
                                location: parsedVisit.location || 'Main Entrance',
                                protocolLevel: parsedVisit.protocolLevel,
                                delegationSize: '~15 persons', // Mock
                                leadEscort: 'Executive Officer',
                                securityStatus: 'Briefed & Ready',
                                // Highlights Section
                                todayHighlights: [
                                    { time: '07:00 AM', description: 'Sri Gurugalu will perform the Morning Anushtana as part of the daily spiritual observances.' },
                                    { time: '09:00 AM', description: 'The Sahasra Chandi Yaga Purnahuti will be conducted in the temple sanctum.' },
                                    { time: '09:30 AM', description: 'VIP Darshan is scheduled for the Honourable Prime Minister, with special protocol arrangements in place.' },
                                    { time: '04:00 PM', description: 'Sri Gurugalu will deliver the Evening Discourse, offering spiritual guidance and blessings to devotees.' }
                                ],
                                // Specific Schedules as requested
                                templeEvents: [
                                    { time: '09:00 AM', event: 'Sahasra Chandi Yaga Purnahuti' },
                                    { time: '10:30 AM', event: 'Special Pooja for VIP Visit' },
                                    { time: '04:00 PM', event: 'Evening Discourse' }
                                ],
                                executiveSchedule: [
                                    { time: '08:30 AM', event: 'Security Briefing with Police Chief' },
                                    { time: '09:00 AM', event: 'Receive Prime Minister at Helipad' },
                                    { time: '11:00 AM', event: 'Press Briefing Review' },
                                    { time: '02:00 PM', event: 'Internal Review Meeting' }
                                ],
                                gurugaluSchedule: [
                                    { time: '07:00 AM', event: 'Morning Anushtana' },
                                    { time: '09:30 AM', event: 'VIP Darshan (Prime Minister)' },
                                    { time: '10:30 AM', event: 'Public Discourse (Anugraha Bhashana)' },
                                    { time: '05:00 PM', event: 'Evening Pooja' }
                                ]
                            };

                            focusContent = JSON.stringify(vipCardData);

                            // Generate planner actions
                            const tempVisit = {
                                id: 'temp',
                                visitor: parsedVisit.visitor,
                                title: parsedVisit.title,
                                date: parsedVisit.date.toISOString().split('T')[0],
                                time: parsedVisit.time,
                                location: parsedVisit.location,
                                protocolLevel: parsedVisit.protocolLevel,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                                createdBy: 'system',
                                updatedBy: 'system',
                            };
                            const actions = VIPPlannerService.generateVIPPlannerActions(tempVisit);
                            plannerActions = VIPPlannerService.formatActionsForPlanner(actions);
                        } else {
                            // Fallback VIP data
                            const fallbackVipData = {
                                visitor: 'Justice A. K. Reddy',
                                title: 'High Court Judge',
                                dateTime: 'Today at 4:00 PM',
                                location: 'North Gate VIP Entrance',
                                protocolLevel: 'high',
                                delegationSize: '~5 persons',
                                leadEscort: 'Executive Officer',
                                securityStatus: 'Briefed & Ready'
                            };
                            focusContent = JSON.stringify(fallbackVipData);
                            plannerActions = '[·] Reserve North Gate parking\n[·] Brief Sanctum security staff\n[·] Arrange Prasadam for 5 guests';
                        }

                        newSections = [
                            { id: 'focus-vip', title: 'VIP Protocol Brief', content: focusContent, type: 'text', visibleContent: '', isVisible: false }
                        ];

                        // Always add planner for VIP queries - showPlanner is always true now
                        if (showPlanner && plannerActions) {
                            newSections.push({ id: 'vip-checklist', title: 'Your Planner Actions', subTitle: 'VIP Plan', content: plannerActions, type: 'list', visibleContent: '', isVisible: false });
                        }
                        
                        // Add assistant message for VIP queries
                        setTimeout(() => {
                            if (lowercaseQuery.includes('show') && lowercaseQuery.includes('vip')) {
                                addMessage('assistant', "Here are the VIP visits and related planning actions.", true);
                            } else {
                                addMessage('assistant', "I've prepared the VIP protocol briefing and planner actions.", true);
                            }
                        }, 500);
                    }
                } else {
                    // Check if this is an informational query (from recommendations or general questions)
                    const isInformationalQuery =
                        lowercaseQuery.startsWith('who ') ||
                        lowercaseQuery.startsWith('what ') ||
                        lowercaseQuery.startsWith('when ') ||
                        lowercaseQuery.startsWith('how ') ||
                        lowercaseQuery.startsWith('is ') ||
                        lowercaseQuery.startsWith('should ') ||
                        lowercaseQuery.includes('?');

                    if (!isInformationalQuery) {
                        // No default sections - let user query determine content
                        newSections = [];
                    } else {
                        // For informational queries, generate planner actions
                        const plannerActions = generatePlannerActionsFromQuery(query, 'general');
                        if (plannerActions) {
                            newSections = [
                                {
                                    id: `planner-${Date.now()}`,
                                    title: 'Your Planner Actions',
                                    subTitle: 'Query Follow-up',
                                    content: plannerActions,
                                    type: 'list',
                                    visibleContent: '',
                                    isVisible: false
                                }
                            ];
                        }
                    }
                }

                // Only set sections if we have new sections (not for planner requests which update existing)
                if (newSections.length > 0) {
                    setSections(prev => {
                        const existingPlanner = prev.find(s => s.title === 'Your Planner Actions');
                        const newPlanner = newSections.find(s => s.title === 'Your Planner Actions');

                        // Filter out the new planner section (we'll merge it)
                        const nonPlannerNewSections = newSections.filter(s => s.title !== 'Your Planner Actions');

                        // For quick actions (Show queries) and VIP/visit queries, replace existing focus cards (first card)
                        // Focus cards have IDs starting with 'focus-' or titles like 'VIP Protocol Brief', 'Appointments', etc.
                        // Also treat recommendation queries as quick actions
                        const isQuickAction = lowercaseQuery.startsWith('show') || 
                                             lowercaseQuery.includes('view') || 
                                             lowercaseQuery.includes('list') ||
                                             lowercaseQuery.includes('check') ||
                                             isRecommendation; // Recommendations should replace cards
                        
                        // Check if this is a VIP/visit/event query that should replace the focus card
                        const isVIPOrVisitQuery = lowercaseQuery.includes('vip') || 
                                                  lowercaseQuery.includes('minister') || 
                                                  lowercaseQuery.includes('visit') ||
                                                  lowercaseQuery.includes('governor') ||
                                                  nonPlannerNewSections.some(s => s.id.startsWith('focus-'));
                        
                        let updatedSections: CanvasSection[] = [];
                        
                        if ((isQuickAction || isVIPOrVisitQuery) && nonPlannerNewSections.length > 0) {
                            // For quick actions and VIP/visit queries, replace existing focus cards with new ones
                            // Keep only non-focus sections from previous state
                            const nonFocusPrevSections = prev.filter(s => {
                                // Keep planner actions
                                if (s.title === 'Your Planner Actions') return true;
                                // Remove focus cards (cards with focus- IDs or specific focus titles)
                                // Also remove default sections like 'objective' that show governance
                                const isFocusCard = s.id.startsWith('focus-') || 
                                                   s.id === 'objective' ||
                                                   s.title.includes('Protocol Brief') ||
                                                   s.title.includes('Appointments') ||
                                                   s.title.includes('Approvals') ||
                                                   s.title.includes('Alerts') ||
                                                   s.title.includes('Finance Summary') ||
                                                   s.title.includes('Revenue Analysis') ||
                                                   s.title.includes('Morning Revenue') ||
                                                   s.title.includes('Event Protocol Brief') ||
                                                   s.title.includes('Visit Protocol Brief');
                                return !isFocusCard;
                            });
                            
                            // Add new focus sections first, then other sections, then planner
                            updatedSections = [...nonPlannerNewSections, ...nonFocusPrevSections];
                        } else {
                            // For non-quick actions, add new sections to existing ones
                            updatedSections = [...prev, ...nonPlannerNewSections];
                        }

                        // Handle planner merging
                        if (existingPlanner && newPlanner) {
                            // Merge new planner actions with existing ones
                            const mergedContent = existingPlanner.content
                                ? `${existingPlanner.content}\n${newPlanner.content}`
                                : newPlanner.content;

                            const mergedPlanner = {
                                ...existingPlanner,
                                content: mergedContent,
                                subTitle: mergedContent.toLowerCase().includes('vip') ? 'VIP Plan' : undefined,
                                // PRESERVE existing visible content so it doesn't disappear
                                visibleContent: existingPlanner.visibleContent,
                                isVisible: existingPlanner.isVisible
                            };

                            // Start typing from the end of current content - set after state update
                            const plannerIndex = updatedSections.findIndex(s => s.title === 'Your Planner Actions');
                            setTimeout(() => {
                                setTypingIndex(existingPlanner.visibleContent.length);
                                if (plannerIndex >= 0) {
                                    setCurrentSectionIndex(plannerIndex);
                                }
                            }, 0);

                            // Add merged planner if not already in updatedSections
                            if (plannerIndex < 0) {
                                updatedSections.push(mergedPlanner);
                            } else {
                                updatedSections[plannerIndex] = mergedPlanner;
                            }
                        } else if (existingPlanner) {
                            // Keep existing planner with new sections (no new planner to merge)
                            const plannerIndex = updatedSections.findIndex(s => s.title === 'Your Planner Actions');
                            if (plannerIndex < 0) {
                                updatedSections.push(existingPlanner);
                            }
                        } else if (newPlanner) {
                            // No existing planner, add new planner
                            updatedSections.push(newPlanner);
                            // Set up typing for new planner
                            const newPlannerIndex = updatedSections.length - 1;
                            setTimeout(() => {
                                setTypingIndex(0);
                                setCurrentSectionIndex(newPlannerIndex);
                            }, 0);
                        }

                        // Set up typing for first focus card if it's a quick action or VIP/visit query
                        if ((isQuickAction || isVIPOrVisitQuery) && nonPlannerNewSections.length > 0) {
                            const firstFocusIndex = updatedSections.findIndex(s => 
                                s.id.startsWith('focus-') || 
                                s.title.includes('Protocol Brief') ||
                                s.title.includes('Appointments') ||
                                s.title.includes('Approvals') ||
                                s.title.includes('Alerts') ||
                                s.title.includes('Finance Summary')
                            );
                            if (firstFocusIndex >= 0) {
                                setTimeout(() => {
                                    setCurrentSectionIndex(firstFocusIndex);
                                    setTypingIndex(0);
                                }, 100);
                            }
                        }

                        return updatedSections;
                    });
                }

                setTimeout(() => {
                    if (isPlannerRequest) {
                        addMessage('assistant', "I've added these actions to your planner. You can edit, assign, or add more items.", true); // Enable typewriter
                        // For planner requests, find the planner section and start typing it
                        setSections(prev => {
                            const plannerIndex = prev.findIndex(s => s.title === 'Your Planner Actions');
                            if (plannerIndex >= 0) {
                                setCurrentSectionIndex(plannerIndex);
                            }
                            return prev;
                        });
                    } else if (newSections.length === 0) {
                        // Informational query - just provide a chat response
                        const responses = [
                            "Based on your current planner, I recommend coordinating with the relevant department heads to ensure smooth execution.",
                            "This action requires careful coordination with security and protocol teams. I suggest scheduling a brief alignment meeting.",
                            "For this task, you'll want to verify availability and resource allocation before proceeding.",
                            "I'd recommend breaking this down into smaller sub-tasks and assigning specific owners to each."
                        ];
                        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                        addMessage('assistant', randomResponse, true); // Enable typewriter
                        setStatus('complete');
                    } else {
                        // Generate context-specific response based on query type
                        let response = "I'm generating the relevant briefing in your workspace focus area.";
                        if (lowercaseQuery.includes('alert') || lowercaseQuery.includes('reminder') || lowercaseQuery.includes('notification')) {
                            const datePrefix = lowercaseQuery.includes('tomorrow') ? 'tomorrow\'s' : 'today\'s';
                            response = `Showing ${datePrefix} alerts and reminders.`;
                        } else if (lowercaseQuery.includes('approval')) {
                            const datePrefix = lowercaseQuery.includes('tomorrow') ? 'tomorrow\'s' : 'today\'s';
                            response = `Showing ${datePrefix} pending approvals.`;
                        } else if (lowercaseQuery.includes('appointment') || lowercaseQuery.includes('calendar') || lowercaseQuery.includes('schedule')) {
                            const datePrefix = lowercaseQuery.includes('tomorrow') ? 'tomorrow\'s' : 'today\'s';
                            response = `Showing ${datePrefix} appointments and schedule.`;
                        } else if (lowercaseQuery.includes('finance') || lowercaseQuery.includes('summary') || lowercaseQuery.includes('revenue')) {
                            const datePrefix = lowercaseQuery.includes('tomorrow') ? 'tomorrow\'s' : 'today\'s';
                            response = `Showing ${datePrefix} financial summary.`;
                        }
                        addMessage('assistant', response, true); // Enable typewriter
                        setCurrentSectionIndex(0);
                    }
                }, 600);
            }, 600);
        }
    }, [addMessage]);

    // The Typewriter Effect Loop
    useEffect(() => {
        if (status !== 'generating' || currentSectionIndex === -1) return;

        if (currentSectionIndex >= sections.length) {
            setStatus('complete');
            return;
        }

        const currentSection = sections[currentSectionIndex];
        const contentToType = currentSection.content;

        // Skip typewriter for focus- components and component type sections
        const isFocusSection = currentSection.id.startsWith('focus-');
        const isComponentSection = currentSection.type === 'components';

        if (!currentSection.isVisible) {
            setSections(prev => prev.map((s, i) => i === currentSectionIndex ? { ...s, isVisible: true } : s));
            // Show planning message only once per query
            if (!planningMessageShownRef.current) {
                planningMessageShownRef.current = true;
                addMessage('system', 'Planning...');
            }
        }

        if (isFocusSection || isComponentSection) {
            // Immediate display for dashboard sections and component sections
            setSections(prev => prev.map((s, i) => {
                if (i !== currentSectionIndex) return s;
                return { ...s, visibleContent: contentToType || s.content };
            }));
            const nextIndex = currentSectionIndex + 1;
            setCurrentSectionIndex(nextIndex);
            setTypingIndex(0);
            
            // If this was the last section, set status to complete
            if (nextIndex >= sections.length) {
                setStatus('complete');
            }
        } else if (typingIndex < contentToType.length) {
            const timeoutId = setTimeout(() => {
                setSections(prev => prev.map((s, i) => {
                    if (i !== currentSectionIndex) return s;
                    return { ...s, visibleContent: contentToType.slice(0, typingIndex + 1) };
                }));
                setTypingIndex(prev => prev + 1);
            }, 20);
            return () => clearTimeout(timeoutId);
        } else {
            const delay = setTimeout(() => {
                const nextIndex = currentSectionIndex + 1;
                setCurrentSectionIndex(nextIndex);
                setTypingIndex(0);
                
                // If this was the last section, set status to complete
                if (nextIndex >= sections.length) {
                    setStatus('complete');
                }
            }, 400);
            return () => clearTimeout(delay);
        }
    }, [status, currentSectionIndex, typingIndex, sections, addMessage]);

    // Typewriter Effect for Chat Messages
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage || lastMessage.role !== 'assistant' || !lastMessage.isTyping) {
            return;
        }

        const fullText = lastMessage.fullText || lastMessage.text;
        const currentVisibleText = lastMessage.text;

        if (currentVisibleText.length < fullText.length) {
            const timeoutId = setTimeout(() => {
                setMessages(prev => prev.map(msg =>
                    msg.id === lastMessage.id
                        ? { ...msg, text: fullText.slice(0, currentVisibleText.length + 1) }
                        : msg
                ));
            }, 15); // Typing speed for chat messages (15ms per character)
            return () => clearTimeout(timeoutId);
        } else {
            // Typing complete for this message
            setMessages(prev => prev.map(msg =>
                msg.id === lastMessage.id
                    ? { ...msg, isTyping: false }
                    : msg
            ));
        }
    }, [messages]);

    return {
        status,
        messages,
        sections,
        startSimulation,
        clearPlanner: () => {
            // Remove all sections with title "Your Planner Actions"
            setSections(prev => prev.filter(s => s.title !== 'Your Planner Actions'));
        },
        reset: () => {
            setStatus('idle');
            setMessages([]);
            setSections([]);
            setCurrentSectionIndex(-1);
            setTypingIndex(0);
            planningMessageShownRef.current = false;
        }
    };
}

