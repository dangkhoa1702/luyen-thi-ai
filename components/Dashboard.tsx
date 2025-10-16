
import React from 'react';
import type { ViewType } from '../types';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area } from 'recharts';
import { MOCK_PROGRESS_DATA } from '../constants';

interface DashboardProps {
    onStartTest: (subject: string) => void;
    onViewKnowledge: (subject: string) => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md flex items-center space-x-4 border-l-4 border-blue-500">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const SubjectCard: React.FC<{
  subject: string;
  icon: React.ReactNode;
  gradient: string;
  onStartTest: () => void;
  onViewKnowledge: () => void;
}> = ({ subject, icon, gradient, onStartTest, onViewKnowledge }) => (
    <div className={`relative p-4 rounded-2xl shadow-lg text-left w-full text-white overflow-hidden ${gradient} flex flex-col justify-between min-h-[160px]`}>
        <div>
            <div className="mb-2">
                {icon}
            </div>
            <p className="font-bold text-lg">{subject}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
             <button onClick={onViewKnowledge} className="text-center text-xs font-bold py-2 px-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm">
                Kiến thức
            </button>
            <button onClick={onStartTest} className="text-center text-xs font-bold py-2 px-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm">
                Luyện thi
            </button>
        </div>
    </div>
);


const ExamForecastCard: React.FC = () => {
    const percentage = 85;
    const strokeDashoffset = 283 * (1 - percentage / 100); // 283 is the circumference (2 * pi * 45)

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Dự báo kết quả thi</h3>
            <div className="flex flex-col items-center">
                <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle className="text-gray-200 dark:text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                        <circle
                            className="text-green-500"
                            strokeWidth="10"
                            strokeDasharray="283"
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="45"
                            cx="50"
                            cy="50"
                            transform="rotate(-90 50 50)"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-green-500">{percentage}%</span>
                    </div>
                </div>
                <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    Khả năng <span className="font-semibold text-green-500">đậu</span> vào nguyện vọng 1 dựa trên tiến độ hiện tại.
                </p>
            </div>
        </div>
    );
};

const SuggestionsCard: React.FC = () => {
    const suggestions = [
        { title: 'Hình học không gian Oxy', subject: 'Toán' },
        { title: 'Tác phẩm "Vợ chồng A Phủ"', subject: 'Ngữ văn' },
        { title: 'Câu điều kiện loại 3', subject: 'Tiếng Anh' },
    ];
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Đề xuất bài ôn phù hợp năng lực</h3>
            <ul className="space-y-3">
                {suggestions.map((item, index) => (
                    <li key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{item.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.subject}</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export const Dashboard: React.FC<DashboardProps> = ({ onStartTest, onViewKnowledge }) => {
    const statIconClasses = "h-6 w-6 text-blue-600 dark:text-blue-400";
    const subjectIconClasses = "h-8 w-8 opacity-80";

    const subjects = [
        { name: 'Toán', icon: <svg xmlns="http://www.w3.org/2000/svg" className={subjectIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>, gradient: 'bg-gradient-to-br from-blue-500 to-blue-600' },
        { name: 'Ngữ văn', icon: <svg xmlns="http://www.w3.org/2000/svg" className={subjectIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>, gradient: 'bg-gradient-to-br from-red-500 to-red-600' },
        { name: 'Tiếng Anh', icon: <svg xmlns="http://www.w3.org/2000/svg" className={subjectIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m4 0h6M17 3v2M4 21h16a1 1 0 001-1V7a1 1 0 00-1-1H4a1 1 0 00-1 1v13a1 1 0 001 1z" /></svg>, gradient: 'bg-gradient-to-br from-green-500 to-green-600' },
        { name: 'Vật lí', icon: <svg xmlns="http://www.w3.org/2000/svg" className={subjectIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.5 1.591L5.22 15.5h13.56l-4.03-5.091a2.25 2.25 0 01-.5-1.591V3.104a2.25 2.25 0 00-3.262-2.121L12 2.1l-1.238-.817A2.25 2.25 0 009.75 3.104zM12 15.5h.01" /></svg>, gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-600' },
        { name: 'Hoá học', icon: <svg xmlns="http://www.w3.org/2000/svg" className={subjectIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.25 5.25a3 3 0 013 3v10.5a3 3 0 01-3 3h-4.5a3 3 0 01-3-3V8.25a3 3 0 013-3h4.5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.25 8.25h-4.5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15.75h.008v.008H12v-.008z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 16.5A.75.75 0 013 15.75V9a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6.75a.75.75 0 01-.75.75h-1.5z" /></svg>, gradient: 'bg-gradient-to-br from-purple-500 to-purple-600' },
        { name: 'Sinh học', icon: <svg xmlns="http://www.w3.org/2000/svg" className={subjectIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L12 15l5.571-3M6.429 9.75L12 6.75l5.571 3" /></svg>, gradient: 'bg-gradient-to-br from-teal-500 to-teal-600' },
        { name: 'Lịch sử', icon: <svg xmlns="http://www.w3.org/2000/svg" className={subjectIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, gradient: 'bg-gradient-to-br from-orange-500 to-orange-600' },
        { name: 'Địa lí', icon: <svg xmlns="http://www.w3.org/2000/svg" className={subjectIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 21V3m0 0l-4 4M9 3l4 4M15 21V3m0 0l-4 4m4-4l4 4" /></svg>, gradient: 'bg-gradient-to-br from-cyan-500 to-cyan-600' },
        { name: 'Tin học', icon: <svg xmlns="http://www.w3.org/2000/svg" className={subjectIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25" /></svg>, gradient: 'bg-gradient-to-br from-gray-700 to-gray-800' },
        { name: 'Tiếng Pháp', icon: <svg xmlns="http://www.w3.org/2000/svg" className={subjectIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-600' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Lựa chọn học phần</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    {subjects.map(subject => (
                        <SubjectCard
                            key={subject.name}
                            subject={subject.name}
                            icon={subject.icon}
                            gradient={subject.gradient}
                            onStartTest={() => onStartTest(subject.name)}
                            onViewKnowledge={() => onViewKnowledge(subject.name)}
                        />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6 space-y-6 lg:space-y-0">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4 px-2">Biểu đồ tiến bộ</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={MOCK_PROGRESS_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
                                    <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
                                    <YAxis stroke="currentColor" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                                            borderColor: 'rgb(55, 65, 81)',
                                            borderRadius: '0.75rem',
                                            color: '#e5e7eb'
                                        }}
                                        itemStyle={{ color: '#e5e7eb' }}
                                        labelStyle={{ color: '#f9fafb', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="Điểm" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUv)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <SuggestionsCard />
                </div>

                <div className="space-y-6">
                    <ExamForecastCard />
                    <StatCard title="Đề đã luyện" value="12" icon={<svg xmlns="http://www.w3.org/2000/svg" className={statIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} />
                    <StatCard title="Điểm trung bình" value="7.8" icon={<svg xmlns="http://www.w3.org/2000/svg" className={statIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} />
                    <StatCard title="Ngày học liên tiếp" value="5" icon={<svg xmlns="http://www.w3.org/2000/svg" className={statIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
                </div>
            </div>
        </div>
    );
}