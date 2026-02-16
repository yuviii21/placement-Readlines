import React, { useState, useEffect } from 'react';
import { analyzeJD, type AnalysisResult } from '../lib/analyzer';
import { saveAnalysis, getHistory, getAnalysis } from '../lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

import {
    Briefcase, FileText, CheckCircle, ChevronRight, Clock,
    Plus, History, Calendar, HelpCircle, Download, Copy, Check,
    AlertCircle, ArrowRight
} from 'lucide-react';

type ViewMode = 'history' | 'new' | 'result';

const Assessments: React.FC = () => {
    const [view, setView] = useState<ViewMode>('history');
    const [history, setHistory] = useState<AnalysisResult[]>([]);
    const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);

    // Form State
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [jdText, setJdText] = useState('');

    useEffect(() => {
        setHistory(getHistory());
    }, [view]);

    const handleAnalyze = () => {
        if (!jdText.trim()) return;
        const result = analyzeJD(company, role, jdText);
        saveAnalysis(result);
        setCurrentResult(result);
        setView('result');
        // Reset form
        setCompany('');
        setRole('');
        setJdText('');
    };

    const handleViewHistoryItem = (id: string) => {
        const item = getAnalysis(id);
        if (item) {
            setCurrentResult(item);
            setView('result');
        }
    };

    // --- Interactive Logic ---

    const toggleSkill = (skill: string) => {
        if (!currentResult) return;

        const currentMap = currentResult.skillConfidenceMap || {};
        const currentStatus = currentMap[skill] || 'practice';
        const newStatus: 'know' | 'practice' = currentStatus === 'know' ? 'practice' : 'know';

        const updatedMap: Record<string, 'know' | 'practice'> = { ...currentMap, [skill]: newStatus };
        const updatedResult = { ...currentResult, skillConfidenceMap: updatedMap };

        setCurrentResult(updatedResult);
        saveAnalysis(updatedResult); // Persist immediately
    };

    const calculateLiveScore = () => {
        if (!currentResult) return 0;
        let score = currentResult.score; // Base score
        const map = currentResult.skillConfidenceMap || {};

        // Adjust based on toggles
        Object.values(map).forEach(status => {
            if (status === 'know') score += 2;
            else score -= 2;
        });

        return Math.max(0, Math.min(100, score)); // Clamp 0-100
    };

    const getWeakSkills = () => {
        if (!currentResult) return [];
        const allSkills = Object.values(currentResult.skills).flat();
        const map = currentResult.skillConfidenceMap || {};
        // Filter skills that are NOT 'know' (default is 'practice')
        return allSkills.filter(s => map[s] !== 'know').slice(0, 3);
    };

    const handleExport = (type: 'plan' | 'checklist' | 'questions' | 'full') => {
        if (!currentResult) return;
        let text = '';

        if (type === 'plan') {
            text = currentResult.plan.map(d => `${d.day} (${d.focus}):\n${d.tasks.map(t => `- ${t}`).join('\n')}`).join('\n\n');
        } else if (type === 'checklist') {
            text = currentResult.checklist.map(r => `${r.round}:\n${r.items.map(i => `- ${i}`).join('\n')}`).join('\n\n');
        } else if (type === 'questions') {
            text = currentResult.questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
        } else if (type === 'full') {
            text = `ANALYSIS FOR ${currentResult.role} @ ${currentResult.company}\n\n`;
            text += `READINESS SCORE: ${calculateLiveScore()}/100\n\n`;
            text += `--- SKILLS ---\n${Object.entries(currentResult.skills).map(([c, s]) => `${c}: ${s.join(', ')}`).join('\n')}\n\n`;
            text += `--- PLAN ---\n${currentResult.plan.map(d => `${d.day}: ${d.focus}\n${d.tasks.map(t => `- ${t}`).join('\n')}`).join('\n\n')}\n\n`;
            text += `--- CHECKLIST ---\n${currentResult.checklist.map(r => `${r.round}\n${r.items.map(i => `- ${i}`).join('\n')}`).join('\n\n')}\n\n`;
            text += `--- QUESTIONS ---\n${currentResult.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;
        }

        if (type === 'full') {
            // Download as file
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${currentResult.role.replace(/\s+/g, '_')}_Analysis.txt`;
            a.click();
        } else {
            // Copy to clipboard
            navigator.clipboard.writeText(text);
            alert('Copied to clipboard!');
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header / Navigation */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#111111]">
                    {view === 'history' && 'Assessment History'}
                    {view === 'new' && 'New JD Analysis'}
                    {view === 'result' && 'Analysis Results'}
                </h2>
                <div className="space-x-2">
                    {view !== 'history' && (
                        <button
                            onClick={() => setView('history')}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#111111] transition-colors"
                        >
                            Back to History
                        </button>
                    )}
                    {view === 'history' && (
                        <button
                            onClick={() => setView('new')}
                            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary-hover transition-colors"
                        >
                            <Plus className="w-4 h-4" /> New Analysis
                        </button>
                    )}
                </div>
            </div>

            {/* VIEW: HISTORY LIST */}
            {view === 'history' && (
                <div className="grid gap-4">
                    {history.length === 0 ? (
                        <Card className="p-12 text-center text-gray-500">
                            <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p className="text-lg">No analysis history found.</p>
                            <p className="text-sm">Start a new analysis to get a personalized readiness plan.</p>
                        </Card>
                    ) : (
                        history.map((item) => (
                            <Card
                                key={item.id}
                                onClick={() => handleViewHistoryItem(item.id)}
                                className="cursor-pointer hover:border-primary/50 transition-colors group"
                            >
                                <CardContent className="flex items-center justify-between p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-primary font-bold">
                                            {item.score}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-[#111111] group-hover:text-primary transition-colors">
                                                {item.role || 'Unknown Role'}
                                            </h3>
                                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                                <Briefcase className="w-3 h-3" /> {item.company || 'Unknown Company'}
                                                <span className="text-gray-300">|</span>
                                                <Clock className="w-3 h-3" /> {new Date(item.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* VIEW: NEW ANALYSIS FORM */}
            {view === 'new' && (
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Paste Job Description</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Company Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    placeholder="e.g. Google"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Role Title</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    placeholder="e.g. Frontend Engineer"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Job Description Text *</label>
                            <textarea
                                className="w-full h-64 p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary resize-none"
                                placeholder="Paste the full JD here..."
                                value={jdText}
                                onChange={(e) => setJdText(e.target.value)}
                            />
                            <p className="text-xs text-gray-400 text-right">{jdText.length} chars</p>
                        </div>
                        <button
                            onClick={handleAnalyze}
                            disabled={!jdText.trim()}
                            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Analyze Readiness
                        </button>
                    </CardContent>
                </Card>
            )}

            {/* VIEW: RESULTS */}
            {view === 'result' && currentResult && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Top Score Card */}
                    <Card className="bg-indigo-900 text-white border-none overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800 rounded-full blur-3xl opacity-50 -mr-16 -mt-16"></div>
                        <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{currentResult.role}</h1>
                                <p className="text-indigo-200 text-lg flex items-center gap-2">
                                    <Briefcase className="w-5 h-5" /> {currentResult.company}
                                </p>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <button onClick={() => handleExport('full')} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-sm font-medium flex items-center gap-2 transition-colors">
                                        <Download className="w-4 h-4" /> Download Report
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-indigo-200 text-sm font-medium uppercase tracking-wider">Live Readiness</p>
                                    <p className="text-5xl font-bold">{calculateLiveScore()}/100</p>
                                </div>
                                <div className="w-24 h-24 rounded-full border-4 border-indigo-400 flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-900/50 bg-indigo-800">
                                    {calculateLiveScore()}%
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Next Box */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-emerald-900">Recommended Next Step</h3>
                                <p className="text-emerald-700 mt-1">
                                    Focus on your weak areas: <span className="font-semibold">{getWeakSkills().join(', ') || 'General Prep'}</span>.
                                </p>
                            </div>
                        </div>
                        <button onClick={() => window.scrollTo({ top: 1000, behavior: 'smooth' })} className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-emerald-200 shadow-lg">
                            Start Day 1 Plan <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Skills Detected */}
                        <div className="md:col-span-1 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-primary" /> Skill Analysis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-xs text-gray-500">
                                        Click skills to toggle status. <span className="text-green-600 font-bold">Knowing</span> skills improves your score.
                                    </p>
                                    {Object.entries(currentResult.skills).map(([category, skills]) => (
                                        <div key={category}>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{category}</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {skills.map(skill => {
                                                    const status = currentResult.skillConfidenceMap?.[skill] || 'practice';
                                                    const isKnown = status === 'know';
                                                    return (
                                                        <button
                                                            key={skill}
                                                            onClick={() => toggleSkill(skill)}
                                                            className={`px-2 py-1 rounded text-xs font-medium border transition-all flex items-center gap-1.5 ${isKnown
                                                                ? 'bg-green-100 text-green-700 border-green-200'
                                                                : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                                                                }`}
                                                        >
                                                            {isKnown && <Check className="w-3 h-3" />}
                                                            {skill}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                    {Object.keys(currentResult.skills).length === 0 && (
                                        <p className="text-sm text-gray-500 italic">No specific technical skills detected.</p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <HelpCircle className="w-5 h-5 text-primary" /> Likely Questions
                                    </CardTitle>
                                    <button onClick={() => handleExport('questions')} className="text-xs text-primary hover:underline flex items-center gap-1">
                                        <Copy className="w-3 h-3" /> Copy
                                    </button>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 mt-2">
                                        {currentResult.questions.map((q, i) => (
                                            <li key={i} className="text-sm text-gray-700 flex gap-2">
                                                <span className="text-primary font-bold">•</span>
                                                {q}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Plan & Checklist */}
                        <div className="md:col-span-2 space-y-6">
                            {/* 7-Day Plan */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-primary" /> 7-Day Preparation Plan
                                    </CardTitle>
                                    <button onClick={() => handleExport('plan')} className="text-xs text-primary hover:underline flex items-center gap-1">
                                        <Copy className="w-3 h-3" /> Copy
                                    </button>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative border-l-2 border-indigo-100 ml-3 py-2 space-y-6">
                                        {currentResult.plan.map((day, idx) => (
                                            <div key={idx} className="relative pl-8">
                                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-primary"></div>
                                                <h4 className="font-bold text-[#111111] leading-none mb-1">{day.day}: {day.focus}</h4>
                                                <ul className="mt-2 space-y-1">
                                                    {day.tasks.map((task, tIdx) => (
                                                        <li key={tIdx} className="text-sm text-gray-600">• {task}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Round Checklist */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-primary" /> Interview Rounds Checklist
                                    </CardTitle>
                                    <button onClick={() => handleExport('checklist')} className="text-xs text-primary hover:underline flex items-center gap-1">
                                        <Copy className="w-3 h-3" /> Copy
                                    </button>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    {currentResult.checklist.map((round, idx) => (
                                        <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <h4 className="font-semibold text-[#111111] mb-2">{round.round}</h4>
                                            <div className="space-y-2">
                                                {round.items.map((item, iIdx) => (
                                                    <div key={iIdx} className="flex items-center gap-2">
                                                        <input type="checkbox" className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                                                        <span className="text-sm text-gray-600">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assessments;
