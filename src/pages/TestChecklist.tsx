import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { getChecklist, saveChecklist, type TestChecklist } from '../lib/storage';
import { CheckSquare, Square, AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react';

const TESTS = [
    { id: 'jd_required', label: 'JD required validation works', hint: 'Go to New Analysis, leave JD empty. Button should be disabled.' },
    { id: 'short_jd_warning', label: 'Short JD warning shows for <200 chars', hint: 'Enter 10 chars. Warning text should appear.' },
    { id: 'skills_extraction', label: 'Skills extraction groups correctly', hint: 'Analyze a JD with known keywords. Check "Skill Analysis" card.' },
    { id: 'round_mapping', label: 'Round mapping changes based on company + skills', hint: 'Compare "Google" (DSA) vs "Startup" (Dev).' },
    { id: 'score_deterministic', label: 'Score calculation is deterministic', hint: 'Same JD should give same base score every time.' },
    { id: 'skill_toggles', label: 'Skill toggles update score live', hint: 'Click a skill. Live Score should change immediately.' },
    { id: 'persist_refresh', label: 'Changes persist after refresh', hint: 'Toggle a skill, refresh page. State should remain.' },
    { id: 'history_saves', label: 'History saves and loads correctly', hint: 'Check "Assessment History". New entry should utilize strict schema.' },
    { id: 'export_works', label: 'Export buttons copy the correct content', hint: 'Click "Copy" on Plan/Checklist. Paste to verify.' },
    { id: 'no_console_errors', label: 'No console errors on core pages', hint: 'Open DevTools (F12). Check Console tab.' }
];

const TestChecklistPage: React.FC = () => {
    const [checklist, setChecklist] = useState<TestChecklist>({});

    useEffect(() => {
        setChecklist(getChecklist());
    }, []);

    const toggleItem = (id: string) => {
        const newState = { ...checklist, [id]: !checklist[id] };
        setChecklist(newState);
        saveChecklist(newState);
    };

    const resetChecklist = () => {
        if (confirm('Reset all test progress?')) {
            setChecklist({});
            saveChecklist({});
        }
    };

    const passedCount = TESTS.filter(t => checklist[t.id]).length;
    const isComplete = passedCount === TESTS.length;

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Header Summary */}
                <Card className={isComplete ? "border-green-500 bg-green-50" : "border-amber-200 bg-amber-50"}>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-3">
                                {isComplete ? <CheckCircle className="text-green-600" /> : <AlertTriangle className="text-amber-600" />}
                                Pre-Flight Checks
                            </h1>
                            <p className="font-medium mt-1">
                                Tests Passed: <span className="text-xl font-bold">{passedCount}</span> / 10
                            </p>
                        </div>
                        {!isComplete && (
                            <div className="text-amber-700 font-bold text-sm px-4 py-2 bg-amber-100 rounded-lg">
                                Fix issues before shipping.
                            </div>
                        )}
                        {isComplete && (
                            <div className="text-green-700 font-bold text-sm px-4 py-2 bg-green-100 rounded-lg">
                                Ready to Ship!
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Checklist */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Test Suite</CardTitle>
                        <button
                            onClick={resetChecklist}
                            className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                        >
                            <RotateCcw className="w-3 h-3" /> Reset
                        </button>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        {TESTS.map(test => {
                            const isChecked = !!checklist[test.id];
                            return (
                                <div
                                    key={test.id}
                                    className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer group ${isChecked ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                                    onClick={() => toggleItem(test.id)}
                                >
                                    <div className={`mt-0.5 ${isChecked ? 'text-green-600' : 'text-gray-300 group-hover:text-gray-400'}`}>
                                        {isChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className={`font-medium ${isChecked ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                            {test.label}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">{test.hint}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                <div className="text-center">
                    <a href="/prp/08-ship" className="inline-block text-blue-600 hover:underline text-sm font-medium">
                        Go to /prp/08-ship &rarr;
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TestChecklistPage;
