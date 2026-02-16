import React, { useEffect, useState } from 'react';
import { getChecklist } from '../lib/storage';
import { Lock, Rocket, CheckCircle } from 'lucide-react';

const ShipLocked: React.FC = () => {
    const [isUnlocked, setIsUnlocked] = useState(false);

    useEffect(() => {
        const checklist = getChecklist();
        // Hardcoded IDs must match TestChecklist.tsx
        const TESTS = [
            'jd_required', 'short_jd_warning', 'skills_extraction',
            'round_mapping', 'score_deterministic', 'skill_toggles',
            'persist_refresh', 'history_saves', 'export_works',
            'no_console_errors'
        ];

        const allPassed = TESTS.every(id => checklist[id]);
        setIsUnlocked(allPassed);
    }, []);

    if (!isUnlocked) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center space-y-6 animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                        <Lock className="w-10 h-10 text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-widest uppercase">LOCKED</h1>
                        <p className="text-red-400 mt-2 font-mono">Deployment protocols not met.</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 max-w-sm mx-auto">
                        <p className="text-gray-400 text-sm">
                            You must complete the verification checklist before shipping.
                        </p>
                        <a href="/prp/07-test" className="mt-4 block w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition-colors">
                            Go to Checklist
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4 overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 text-center space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.5)]">
                    <Rocket className="w-16 h-16 text-white ml-1 -mt-1" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-white tracking-tight">
                        READY TO SHIP
                    </h1>
                    <p className="text-xl text-green-300 font-light tracking-widest uppercase">
                        All Systems Go
                    </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-white/50 bg-white/5 py-2 px-4 rounded-full mx-auto w-fit backdrop-blur-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Verification Complete</span>
                </div>
            </div>
        </div>
    );
};

export default ShipLocked;
