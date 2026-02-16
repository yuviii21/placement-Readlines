import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Code, BookOpen, FileText, User, Bell, Search, Menu } from 'lucide-react';

const DashboardLayout: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Code, label: 'Practice', path: '/dashboard/practice' },
        { icon: FileText, label: 'Assessments', path: '/dashboard/assessments' },
        { icon: BookOpen, label: 'Resources', path: '/dashboard/resources' },
        { icon: User, label: 'Profile', path: '/dashboard/profile' },
    ];

    const getPageTitle = () => {
        const currentItem = navItems.find(item => item.path === location.pathname);
        return currentItem ? currentItem.label : 'Placement Prep';
    };

    return (
        <div className="flex h-screen bg-[#F7F6F3]">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-serif font-bold tracking-tight text-[#111111]">
                        Placement<span className="text-primary">Prep</span>
                    </h2>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard'} // Only exact match for root dashboard
                            className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                ${isActive
                                    ? 'bg-indigo-50 text-primary'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#111111]'}
              `}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="bg-indigo-50 rounded-lg p-4">
                        <h4 className="font-semibold text-primary text-sm mb-1">Weekly Goal</h4>
                        <div className="w-full bg-indigo-200 h-2 rounded-full mb-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <p className="text-xs text-indigo-600">12/20 Problems Solved</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md">
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-semibold text-[#111111] hidden sm:block">{getPageTitle()}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-primary w-64"
                            />
                        </div>

                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-primary font-bold text-sm">
                            JD
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
