import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Video, BarChart3 } from 'lucide-react';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F7F6F3] text-[#111111] font-sans">
            {/* Navigation */}
            <nav className="flex justify-between items-center px-8 py-5 max-w-7xl mx-auto">
                <div className="text-xl font-serif font-bold tracking-tight">Placement<span className="text-primary">Prep</span></div>
                <div className="space-x-4">
                    <button onClick={() => navigate('/dashboard')} className="text-sm font-medium hover:text-primary transition-colors">Log In</button>
                    <button onClick={() => navigate('/dashboard')} className="bg-primary text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-primary-hover transition-colors">
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
                <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight mb-6">
                    Ace Your <span className="text-primary decoration-4 underline-offset-4">Placement</span>
                </h1>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Practice, assess, and prepare for your dream job with our comprehensive readiness platform. Master technical rounds and behavioral interviews.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-hover transition-transform hover:-translate-y-1 shadow-lg shadow-indigo-200"
                    >
                        Get Started Now
                    </button>
                    <button className="px-8 py-4 rounded-lg text-lg font-medium border border-gray-300 hover:bg-white transition-colors">
                        View Syllabus
                    </button>
                </div>
            </main>

            {/* Features Grid */}
            <section className="bg-white py-24 border-t border-gray-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold mb-4">Everything you need to succeed</h2>
                        <p className="text-gray-500">Comprehensive tools designed for student placement success.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary/20 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group">
                            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Code className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Practice Problems</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Access a vast library of coding challenges sorted by company and difficulty level.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary/20 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group">
                            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Video className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Mock Interviews</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Simulate real interview scenarios with AI-driven feedback and peer sessions.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary/20 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group">
                            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BarChart3 className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Track Progress</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Visualize your improvement with detailed analytics and readiness scores.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#F7F6F3] py-10 border-t border-gray-200">
                <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} PlacementPrep. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
