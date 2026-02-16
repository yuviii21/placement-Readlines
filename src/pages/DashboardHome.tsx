import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Play } from 'lucide-react';

const DashboardHome: React.FC = () => {
    // 1. Overall Readiness Data
    const readinessScore = 72;
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (readinessScore / 100) * circumference;

    // 2. Skill Breakdown Data
    const skillData = [
        { subject: 'DSA', A: 75, fullMark: 100 },
        { subject: 'System Design', A: 60, fullMark: 100 },
        { subject: 'Communication', A: 80, fullMark: 100 },
        { subject: 'Resume', A: 85, fullMark: 100 },
        { subject: 'Aptitude', A: 70, fullMark: 100 },
    ];

    // 4. Weekly Goals Data
    const weeklySolved = 12;
    const weeklyGoal = 20;
    const weekDays = [
        { day: 'M', active: true },
        { day: 'T', active: true },
        { day: 'W', active: true },
        { day: 'T', active: false },
        { day: 'F', active: true },
        { day: 'S', active: false },
        { day: 'S', active: false },
    ];

    // 5. Upcoming Assessments Data
    const assessments = [
        { title: 'DSA Mock Test', time: 'Tomorrow, 10:00 AM', type: 'Technical' },
        { title: 'System Design Review', time: 'Wed, 2:00 PM', type: 'Review' },
        { title: 'HR Interview Prep', time: 'Friday, 11:00 AM', type: 'Behavioral' },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#111111]">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Overall Readiness */}
                <Card className="flex flex-col items-center justify-center p-6">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-center">Overall Readiness</CardTitle>
                    </CardHeader>
                    <CardContent className="relative flex items-center justify-center pt-4">
                        <svg width="200" height="200" className="transform -rotate-90">
                            {/* Background Circle */}
                            <circle
                                cx="100"
                                cy="100"
                                r={radius}
                                stroke="#f3f4f6"
                                strokeWidth="12"
                                fill="transparent"
                            />
                            {/* Progress Circle */}
                            <circle
                                cx="100"
                                cy="100"
                                r={radius}
                                stroke="hsl(245, 58%, 51%)"
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center text-[#111111]">
                            <span className="text-4xl font-bold">{readinessScore}</span>
                            <span className="text-sm text-gray-500">/ 100</span>
                        </div>
                    </CardContent>
                    <p className="text-sm text-gray-500 mt-2">Readiness Score</p>
                </Card>

                {/* 2. Skill Breakdown */}
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Skill Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Skills"
                                    dataKey="A"
                                    stroke="hsl(245, 58%, 51%)"
                                    strokeWidth={2}
                                    fill="hsl(245, 58%, 51%)"
                                    fillOpacity={0.2}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 3. Continue Practice */}
                <Card>
                    <CardHeader>
                        <CardTitle>Continue Practice</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="font-medium text-sm text-gray-700">Dynamic Programming</span>
                                <span className="text-xs text-gray-500">3/10</span>
                            </div>
                            <ProgressBar value={30} className="h-2" />
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium">
                            <Play className="w-4 h-4 ml-1 fill-current" /> Continue
                        </button>
                    </CardContent>
                </Card>

                {/* 4. Weekly Goals */}
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm text-gray-600">Problems Solved</span>
                                <span className="text-lg font-bold text-primary">{weeklySolved}<span className="text-gray-400 text-sm font-normal">/{weeklyGoal}</span></span>
                            </div>
                            <ProgressBar value={(weeklySolved / weeklyGoal) * 100} />
                        </div>
                        <div className="flex justify-between mt-6">
                            {weekDays.map((day, index) => (
                                <div key={index} className="flex flex-col items-center gap-1">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                                            ${day.active ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}
                                    >
                                        {day.day}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 5. Upcoming Assessments */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Assessments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {assessments.map((assessment, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900">{assessment.title}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{assessment.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 text-primary text-sm font-medium hover:underline">
                            View All Assessments
                        </button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardHome;
