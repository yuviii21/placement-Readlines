import React, { useState, useEffect } from 'react';
import { analyzeJD, type AnalysisResult } from '../lib/analyzer';
import { saveAnalysis, getHistory, getAnalysis } from '../lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

import {
    Briefcase, FileText, CheckCircle, ChevronRight, Clock,
    Plus, History, Calendar, HelpCircle
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
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-indigo-200 text-sm font-medium uppercase tracking-wider">Readiness Score</p>
                                    <p className="text-5xl font-bold">{currentResult.score}/100</p>
                                </div>
                                <div className="w-24 h-24 rounded-full border-4 border-indigo-400 flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-900/50 bg-indigo-800">
                                    {currentResult.score}%
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Skills Detected */}
                        <div className="md:col-span-1 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-primary" /> Detected Skills
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {Object.entries(currentResult.skills).map(([category, skills]) => (
                                        <div key={category}>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{category}</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {skills.map(skill => (
                                                    <span key={skill} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium border border-indigo-100">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {Object.keys(currentResult.skills).length === 0 && (
                                        <p className="text-sm text-gray-500 italic">No specific technical skills detected.</p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <HelpCircle className="w-5 h-5 text-primary" /> Likely Questions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
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
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-primary" /> 7-Day Preparation Plan
                                    </CardTitle>
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
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-primary" /> Interview Rounds Checklist
                                    </CardTitle>
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
