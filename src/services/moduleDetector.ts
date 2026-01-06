/**
 * Module Detector Service
 * 
 * Detects module-related keywords in user queries and returns the appropriate module name.
 */

export type ModuleName = 'Assets' | 'Finance' | 'People' | 'Operations' | 'Projects' | null;

export class ModuleDetector {
    /**
     * Detect module from user query
     * Returns module name if detected, null otherwise
     */
    static detectModule(query: string): ModuleName {
        const lowercaseQuery = query.toLowerCase();

        // Assets module keywords
        const assetsKeywords = [
            'asset', 'assets', 'inventory', 'equipment', 'property', 'item', 'items',
            'acquisition', 'disposal', 'classification', 'registry', 'maintenance'
        ];
        if (assetsKeywords.some(keyword => lowercaseQuery.includes(keyword))) {
            return 'Assets';
        }

        // Finance module keywords
        const financeKeywords = [
            'finance', 'financial', 'payment', 'payments', 'revenue', 'collection', 'collections',
            'budget', 'expense', 'expenses', 'transaction', 'transactions', 'donation', 'donations',
            'hundi', 'accounting', 'accounts', 'audit', 'auditing'
        ];
        if (financeKeywords.some(keyword => lowercaseQuery.includes(keyword))) {
            return 'Finance';
        }

        // People module keywords
        const peopleKeywords = [
            'people', 'employee', 'employees', 'staff', 'personnel', 'department', 'departments',
            'team', 'teams', 'worker', 'workers', 'human resources', 'hr', 'organization',
            'organizational', 'role', 'roles', 'position', 'positions'
        ];
        if (peopleKeywords.some(keyword => lowercaseQuery.includes(keyword))) {
            return 'People';
        }

        // Operations module keywords
        const operationsKeywords = [
            'operation', 'operations', 'workflow', 'workflows', 'process', 'processes',
            'activity', 'activities', 'task', 'tasks', 'daily', 'routine', 'execution',
            'work', 'works', 'procedure', 'procedures'
        ];
        if (operationsKeywords.some(keyword => lowercaseQuery.includes(keyword))) {
            return 'Operations';
        }

        // Projects module keywords
        const projectsKeywords = [
            'project', 'projects', 'initiative', 'initiatives', 'campaign', 'campaigns',
            'program', 'programs', 'milestone', 'milestones', 'deliverable', 'deliverables'
        ];
        if (projectsKeywords.some(keyword => lowercaseQuery.includes(keyword))) {
            return 'Projects';
        }

        return null;
    }
}

