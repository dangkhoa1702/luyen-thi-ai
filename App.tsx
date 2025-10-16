
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MockTest } from './components/MockTest';
import { AIChatbot } from './components/AIChatbot';
import { StudyPlanner } from './components/StudyPlanner';
import { Community } from './components/Community';
import { Header } from './components/Header';
import { DashboardSkeleton } from './components/DashboardSkeleton';
import { ApiKeyModal } from './components/ApiKeyModal';
import { initializeAi } from './services/geminiService';
import type { ViewType, User } from './types';
import { KnowledgeBase } from './components/KnowledgeBase';
import { LearningProfile } from './components/LearningProfile';
import { ParentDashboard } from './components/ParentDashboard';
import { StudyMaterials } from './components/StudyMaterials';
import { TeacherDashboard } from './components/TeacherDashboard';
import TodayPlan from './components/TodayPlan';
import DailyReminder from './components/DailyReminder';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  // Set a default mock user to bypass login for non-profile features
  const mockUser: User = {
      id: 'default-user-01',
      name: 'Học sinh',
      email: 'hocsinh@aistudio.dev',
      avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=Học+sinh`,
      role: 'student' // Added role for community features
  };
  const [user, setUser] = useState<User | null>(mockUser);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Effect to load API key from localStorage on initial load
  useEffect(() => {
    try {
        const savedApiKey = localStorage.getItem('gemini-api-key');
        if (savedApiKey) {
            setApiKey(savedApiKey);
            initializeAi(savedApiKey);
        }
    } catch (error) {
        console.error("Failed to parse API key from localStorage.", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleApiKeySubmit = (newApiKey: string) => {
    setApiKey(newApiKey);
    initializeAi(newApiKey);
    localStorage.setItem('gemini-api-key', newApiKey);
    setShowApiKeyModal(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const requireAuthAndApi = useCallback((action: () => void) => {
    // User login is not required for most features, only check for API key
    // The new Learning Profile component handles its own auth state.
    if (!apiKey) {
        setPendingAction(() => action);
        setShowApiKeyModal(true);
        return;
    }
    action();
  }, [apiKey]);

  const handleSetView = (view: ViewType) => {
    if (view !== 'mock-test' && view !== 'knowledge-base') {
        setSelectedSubject(null); // Clear subject when navigating away
        setSelectedTopic(null);
    }
    const protectedViews: ViewType[] = ['mock-test', 'chatbot', 'planner', 'knowledge-base', 'learning-profile', 'parent-dashboard', 'study-materials', 'teacher-dashboard', 'today-plan', 'daily-reminder'];
    if (protectedViews.includes(view)) {
      requireAuthAndApi(() => setCurrentView(view));
    } else {
      setCurrentView(view);
    }
  };

  const handleStartTest = (subject: string) => {
    requireAuthAndApi(() => {
        setSelectedSubject(subject);
        setSelectedTopic(null);
        setCurrentView('mock-test');
    });
  };
  
  const handleStartPractice = (subject: string, topic: string) => {
    requireAuthAndApi(() => {
        setSelectedSubject(subject);
        setSelectedTopic(topic);
        setCurrentView('mock-test');
    });
  };

  const handleViewKnowledge = (subject: string) => {
    requireAuthAndApi(() => {
        setSelectedSubject(subject);
        setCurrentView('knowledge-base');
    });
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onStartTest={handleStartTest} onViewKnowledge={handleViewKnowledge} />;
      case 'mock-test':
        return <MockTest subject={selectedSubject} topic={selectedTopic} />;
      case 'knowledge-base':
        return <KnowledgeBase subject={selectedSubject} onStartPractice={handleStartPractice} />;
      case 'chatbot':
        return <AIChatbot />;
      case 'planner':
        return <StudyPlanner />;
      case 'community':
        return <Community user={user} />;
      case 'learning-profile':
        // The LearningProfile component shows detailed stats and allows starting practice sessions.
        return <LearningProfile onStartPractice={handleStartPractice} />;
      case 'parent-dashboard':
        return <ParentDashboard />;
      case 'study-materials':
        return <StudyMaterials />;
      case 'teacher-dashboard':
        return <TeacherDashboard />;
      case 'today-plan':
        return <TodayPlan />;
      case 'daily-reminder':
        return <DailyReminder />;
      default:
        return <Dashboard onStartTest={handleStartTest} onViewKnowledge={handleViewKnowledge} />;
    }
  };

  const cancelAndGoHome = () => {
    setShowApiKeyModal(false);
    setPendingAction(null);
    setCurrentView('dashboard');
  }

  return (
    <>
      {showApiKeyModal && (
        <ApiKeyModal
          currentApiKey={apiKey}
          onKeySubmit={handleApiKeySubmit}
          onDismiss={cancelAndGoHome}
        />
      )}
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
        <Sidebar currentView={currentView} setView={handleSetView} />
        <div className="flex-1 flex flex-col overflow-hidden">
           <Header 
              user={user} 
              isLoading={isLoading}
              apiKey={apiKey}
              onApiKeyClick={() => setShowApiKeyModal(true)} 
            />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
            {isLoading ? <DashboardSkeleton /> : renderContent()}
          </main>
        </div>
      </div>
    </>
  );
};

export default App;