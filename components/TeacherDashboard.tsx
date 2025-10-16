
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User as FirebaseUser, GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth';
import { db } from '../db/firebase';
import { useAuthRole } from '../lib/useAuthRole';
import { ensureUserProfile } from '../lib/userProfile';
import { ProfileLookupByEmail } from './ProfileLookupByEmail';
import { MyProfile } from './MyProfile';

export const TeacherDashboard: React.FC = () => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const role = useAuthRole();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Ensure profile exists in Firestore when user logs in
                await ensureUserProfile(db);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        signInWithRedirect(auth, provider);
    };

    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth);
    };

    if (loading || (user && role === 'unknown')) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Giáo viên theo dõi</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Vui lòng đăng nhập bằng tài khoản Google của bạn để truy cập.</p>
                <button onClick={handleLogin} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /><path d="M1 1h22v22H1z" fill="none" /></svg>
                    <span>Đăng nhập với Google</span>
                </button>
            </div>
        );
    }

    if (role !== 'teacher') {
        return (
            <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">Truy cập bị từ chối</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Bạn không có quyền truy cập vào trang này. Chức năng này chỉ dành cho giáo viên.</p>
                <button onClick={handleLogout} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">Đăng xuất</button>
            </div>
        );
    }
    
    // Teacher is logged in
    return (
        <div className="space-y-6">
             <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bảng điều khiển Giáo viên</h1>
                    {user.email && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Đăng nhập với tư cách: {user.email}</p>}
                </div>
                <button onClick={handleLogout} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors self-start sm:self-center">Đăng xuất</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProfileLookupByEmail db={db} />
                <MyProfile db={db} />
            </div>
        </div>
    );
};
