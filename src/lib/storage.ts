import type { AnalysisResult } from './analyzer';

const STORAGE_KEY = 'placement_history';

export function saveAnalysis(analysis: AnalysisResult): void {
    try {
        const history = getHistory();
        const existingIndex = history.findIndex(item => item.id === analysis.id);

        let updated: AnalysisResult[];

        if (existingIndex >= 0) {
            // Update existing
            updated = [...history];
            updated[existingIndex] = analysis;
        } else {
            // Prepend new
            updated = [analysis, ...history];
        }

        // Limit to last 20 entries
        const limited = updated.slice(0, 20);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
    } catch (error) {
        console.error("Failed to save analysis:", error);
    }
}

export function getHistory(): AnalysisResult[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        const validHistory = parsed.filter((item: any) => {
            // Strict Schema Validation
            const hasId = typeof item.id === 'string';
            const hasSkills = item.extractedSkills && typeof item.extractedSkills === 'object';
            const hasScore = typeof item.baseScore === 'number'; // Check baseScore specifically

            // If legacy entry (has 'skills' but not 'extractedSkills'), we skip it (or could migrate)
            // User requested strict model + skip corrupted
            return hasId && hasSkills && hasScore;
        });

        // Optional: Update storage if we filtered out items? 
        // Better not to destructively write unless necessary, but to keep UI in sync...
        if (validHistory.length < parsed.length) {
            console.warn("Filtered out corrupted or legacy history entries.");
            // We could write back the cleaned history to prevent checking again
            localStorage.setItem(STORAGE_KEY, JSON.stringify(validHistory));
        }

        return validHistory;
    } catch (error) {
        console.error("Failed to retrieve history:", error);
        return [];
    }
}

export function getAnalysis(id: string): AnalysisResult | undefined {
    const history = getHistory();
    return history.find(item => item.id === id);
}

export function clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
}
