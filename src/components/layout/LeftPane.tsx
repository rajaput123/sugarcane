import React, { useState, useRef, useEffect } from 'react';
import {
    Home,
    LayoutGrid,
    Package,
    DollarSign,
    Users,
    ChevronDown,
    Gift,
    Zap,
    Mail,
    Plus,
    Workflow,
    Building2,
    LogOut,
    ArrowLeft,
    ChevronUp
} from 'lucide-react';

interface LeftPaneProps {
    isCollapsed: boolean;
    onToggle: () => void;
    onNewChat: () => void;
    activeModule: string;
    onSelectModule: (module: string) => void;
    onLogout?: () => void;
    onBackToLanding?: () => void;
}

// Nav Item Component
const NavItem = ({
    icon: Icon,
    label,
    collapsed,
    active,
    onClick,
    hasChevron = false
}: {
    icon: React.ElementType;
    label: string;
    collapsed: boolean;
    active?: boolean;
    onClick?: () => void;
    hasChevron?: boolean;
}) => (
    <div
        onClick={onClick}
        className={`h-10 flex items-center rounded-lg cursor-pointer transition-all duration-200 group relative ${collapsed
                ? 'justify-center w-10 mx-auto'
                : 'gap-3 px-3 mx-2'
            } ${active
                ? 'bg-neutral-100 text-neutral-900 font-medium'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
    >
        <Icon size={20} className="shrink-0" />
        {!collapsed && (
            <>
                <span className="text-sm whitespace-nowrap flex-1">{label}</span>
                {hasChevron && <ChevronDown size={16} className="shrink-0" />}
            </>
        )}
        {/* Tooltip for collapsed state */}
        {collapsed && (
            <div className="absolute left-full ml-3 z-50 px-2 py-1 bg-earth-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                {label}
                <div className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-neutral-900"></div>
            </div>
        )}
    </div>
);

export default function LeftPane({ isCollapsed, onToggle, onNewChat, activeModule, onSelectModule, onLogout, onBackToLanding }: LeftPaneProps) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        };

        if (showProfileMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileMenu]);

    // Get sub-modules based on active module
    const getSubModules = () => {
        switch (activeModule) {
            case 'Assets':
                return [
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
            case 'Operations':
                return [
                    'Operational Planning & Control',
                    'Task Management',
                    'Temple Management',
                    'Seva and Darshan Management',
                    'Booking and allocation Management',
                    'Kitchen & Prasad Management',
                    'Inventory Management',
                    'Facilities Management',
                    'Queue & Token Management',
                    'Crowd & Capacity Management'
                ];
            case 'People':
                return [
                    'Department Management',
                    'Employee Management',
                    'Priest Management',
                    'Volunteer Management',
                    'Devotee Management',
                    'Freelancer Management',
                    'VIP Management',
                    'Content Management'
                ];
            case 'Finance':
                return [
                    'Donation Management',
                    'Expense Management',
                    'Budgeting & Forecasting',
                    'Compliance & Legal (80G)'
                ];
            case 'Projects':
                return [
                    'Festival & Utsavam Management',
                    'Event Management',
                    'Infrastructure & Renovation'
                ];
            default:
                return [];
        }
    };

    const subModules = getSubModules();

    return (
        <div className="flex flex-col h-full bg-white border-r border-neutral-200 relative overflow-hidden">
            {/* Header - Fixed at top */}
            <div className={`flex items-center relative shrink-0 group ${isCollapsed ? 'justify-center py-4' : 'justify-between px-4 py-4'}`}>
                {!isCollapsed && (
                    <div className="flex items-center gap-2">
                        {/* Logo with gradient */}
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-earth-400 via-brown-400 to-earth-600 flex items-center justify-center shadow-sm">
                            <span className="text-white font-black text-xs">N</span>
                        </div>
                        <span className="font-bold text-base text-neutral-900">Namaha</span>
                    </div>
                )}
                {isCollapsed && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-earth-400 via-brown-400 to-earth-600 flex items-center justify-center shadow-sm">
                        <span className="text-white font-black text-xs">N</span>
                    </div>
                )}
                <button
                    onClick={onToggle}
                    className={`p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-all ${isCollapsed
                            ? 'absolute top-4 right-2 opacity-0 group-hover:opacity-100'
                            : ''
                        }`}
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="9" y1="3" x2="9" y2="21"></line>
                            <line x1="14" y1="8" x2="18" y2="12"></line>
                            <line x1="14" y1="16" x2="18" y2="12"></line>
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="9" y1="3" x2="9" y2="21"></line>
                            <line x1="14" y1="12" x2="18" y2="12"></line>
                        </svg>
                    )}
                </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                {/* New Chat Button */}
                <div className={`${isCollapsed ? 'px-2 mb-4' : 'px-4 mb-4'}`}>
                    <button
                        onClick={onNewChat}
                        className={`h-10 flex items-center rounded-lg cursor-pointer transition-all duration-200 group relative ${isCollapsed
                                ? 'justify-center w-10 mx-auto text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                                : 'w-full gap-3 px-3 mx-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 font-medium'
                            }`}
                    >
                        <Plus size={20} className="shrink-0" />
                        {!isCollapsed && <span className="text-sm whitespace-nowrap">New Chat</span>}
                        {/* Tooltip for collapsed state */}
                        {isCollapsed && (
                            <div className="absolute left-full ml-3 z-50 px-2 py-1 bg-earth-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                                New Chat
                                <div className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-neutral-900"></div>
                            </div>
                        )}
                    </button>
                </div>

                {/* 6 Modules Navigation */}
                {!isCollapsed && (
                    <div className="px-4 mb-2">
                        <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Modules</div>
                    </div>
                )}
                <div className={`flex flex-col gap-1 ${isCollapsed ? 'px-2' : 'px-2'}`}>
                    <NavItem
                        icon={Home}
                        label="Dashboard"
                        collapsed={isCollapsed}
                        active={activeModule === 'Dashboard'}
                        onClick={() => onSelectModule('Dashboard')}
                    />
                    <NavItem
                        icon={Workflow}
                        label="Operations & Workflow"
                        collapsed={isCollapsed}
                        active={activeModule === 'Operations'}
                        onClick={() => onSelectModule('Operations')}
                    />
                    <NavItem
                        icon={Users}
                        label="People"
                        collapsed={isCollapsed}
                        active={activeModule === 'People'}
                        onClick={() => onSelectModule('People')}
                    />
                    <NavItem
                        icon={DollarSign}
                        label="Finance"
                        collapsed={isCollapsed}
                        active={activeModule === 'Finance'}
                        onClick={() => onSelectModule('Finance')}
                    />
                    <NavItem
                        icon={Package}
                        label="Asset Management"
                        collapsed={isCollapsed}
                        active={activeModule === 'Assets'}
                        onClick={() => onSelectModule('Assets')}
                    />
                    <NavItem
                        icon={LayoutGrid}
                        label="Projects & Initiatives"
                        collapsed={isCollapsed}
                        active={activeModule === 'Projects'}
                        onClick={() => onSelectModule('Projects')}
                    />
                </div>

                {/* Recent Chats Section */}
                {!isCollapsed && (
                    <div className="px-4 mt-6 mb-4">
                        <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Recent</div>
                        <div className="flex flex-col gap-1">
                            {[
                                'Onboarding Workflow',
                                'Q4 Financial Review',
                                'Asset Allocation',
                                'Team Structure',
                                'Project Alpha'
                            ].map((chat, i) => (
                                <div
                                    key={i}
                                    onClick={() => onSelectModule(chat)}
                                    className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors truncate ${activeModule === chat
                                            ? 'bg-neutral-100 text-neutral-900 font-medium'
                                            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                                        }`}
                                >
                                    {chat}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Promotional Cards - Only when expanded */}

            </div>

            {/* Bottom Section - Fixed at bottom */}
            <div className="shrink-0 border-t border-neutral-200 relative" ref={profileMenuRef}>
                {isCollapsed ? (
                    <div className="flex flex-col items-center gap-3 py-4 relative">
                        {/* User Avatar - Collapsed */}
                        <div 
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="w-10 h-10 rounded-lg bg-earth-600 flex items-center justify-center cursor-pointer hover:bg-earth-700 transition-colors relative z-10"
                        >
                            <span className="text-white font-bold text-sm">R</span>
                        </div>
                        {/* Profile Menu - Collapsed */}
                        {showProfileMenu && (
                            <div className="absolute bottom-0 left-full ml-3 w-64 bg-white border border-neutral-200 rounded-lg shadow-2xl z-[100] overflow-hidden animate-fadeIn flex flex-col max-h-[80vh]">
                                {/* Menu Header */}
                                <div className="px-3 py-2 bg-earth-600 border-b border-earth-700 shrink-0">
                                    <div className="text-xs font-black text-white uppercase tracking-wider">Profile Menu</div>
                                </div>
                                
                                {/* Sub-Modules Section - Scrollable */}
                                {subModules.length > 0 && (
                                    <>
                                        <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200 shrink-0">
                                            <div className="text-[10px] font-black text-neutral-500 uppercase tracking-wider">Sub-Modules</div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-neutral-100 min-h-0">
                                            {subModules.map((subModule, idx) => (
                                                <div
                                                    key={idx}
                                                    className="px-3 py-2.5 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer border-b border-neutral-100 last:border-b-0 transition-colors"
                                                >
                                                    {subModule}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t border-neutral-200 shrink-0"></div>
                                    </>
                                )}
                                
                                {/* Navigation Options - Fixed at bottom, always visible */}
                                <div className="border-t border-neutral-200 shrink-0 bg-white">
                                    {onBackToLanding && (
                                        <div
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                onBackToLanding();
                                            }}
                                            className="px-3 py-2.5 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer flex items-center gap-2 border-b border-neutral-200 transition-colors"
                                        >
                                            <ArrowLeft size={14} />
                                            <span>Back to Landing Page</span>
                                        </div>
                                    )}
                                    {onLogout && (
                                        <div
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                onLogout();
                                            }}
                                            className="px-3 py-2.5 text-xs text-red-600 hover:bg-red-50 cursor-pointer flex items-center gap-2 transition-colors"
                                        >
                                            <LogOut size={14} />
                                            <span>Logout</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-4">
                        <div 
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 cursor-pointer hover:bg-neutral-50 rounded-lg p-2 -m-2 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-lg bg-earth-600 flex items-center justify-center cursor-pointer hover:bg-earth-700 transition-colors shrink-0">
                                <span className="text-white font-bold text-xs">R</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-neutral-900 truncate">Renuka</div>
                                <div className="text-[10px] text-neutral-500 truncate">namaha.dev/dashboard</div>
                            </div>
                            <ChevronUp 
                                size={14} 
                                className={`text-neutral-400 transition-transform shrink-0 ${showProfileMenu ? 'rotate-180' : ''}`}
                            />
                        </div>
                        {/* Profile Menu - Expanded */}
                        {showProfileMenu && (
                            <div className="mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 overflow-hidden">
                                {subModules.length > 0 && (
                                    <>
                                        <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200">
                                            <div className="text-[10px] font-black text-neutral-500 uppercase tracking-wider">Sub-Modules</div>
                                        </div>
                                        <div className="max-h-48 overflow-y-auto">
                                            {subModules.map((subModule, idx) => (
                                                <div
                                                    key={idx}
                                                    className="px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer border-b border-neutral-100 last:border-b-0"
                                                >
                                                    {subModule}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t border-neutral-200"></div>
                                    </>
                                )}
                                {onBackToLanding && (
                                    <div
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            onBackToLanding();
                                        }}
                                        className="px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer flex items-center gap-2 border-b border-neutral-200"
                                    >
                                        <ArrowLeft size={14} />
                                        <span>Back to Landing Page</span>
                                    </div>
                                )}
                                {onLogout && (
                                    <div
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            onLogout();
                                        }}
                                        className="px-3 py-2 text-xs text-red-600 hover:bg-red-50 cursor-pointer flex items-center gap-2"
                                    >
                                        <LogOut size={14} />
                                        <span>Logout</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
