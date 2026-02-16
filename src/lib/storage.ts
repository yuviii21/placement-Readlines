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
        return JSON.parse(raw);
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
