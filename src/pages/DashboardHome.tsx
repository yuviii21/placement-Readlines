import React from 'react';

const DashboardHome: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-4">Welcome back, Student!</h2>
                <p className="text-gray-600">Here's your progress overview for the week.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-40">
                    <h3 className="font-semibold mb-2">Problems Solved</h3>
                    <p className="text-3xl font-bold text-primary">124</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-40">
                    <h3 className="font-semibold mb-2">Mock Interviews</h3>
                    <p className="text-3xl font-bold text-primary">3</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-40">
                    <h3 className="font-semibold mb-2">Readiness Score</h3>
                    <p className="text-3xl font-bold text-green-600">72%</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
