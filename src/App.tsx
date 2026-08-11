import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Features
import { HomePage } from './features/home/HomePage';
import { CurriculumExplorerPage } from './features/curriculum/CurriculumExplorerPage';
import { LessonDetailPage } from './features/curriculum/LessonDetailPage';
import { MaterialsManagerPage } from './features/materials/MaterialsManagerPage';
import { ClassManagerPage } from './features/classes/ClassManagerPage';
import { ClassDetailPage } from './features/classes/ClassDetailPage';
import { GameLobbyPage } from './features/games/GameLobbyPage';
import { GamePlayPage } from './features/games/GamePlayPage';
import { GameStudioPage } from './features/games/GameStudioPage';
import { LeaderboardPage } from './features/analytics/LeaderboardPage';
import { StudentProfilePage } from './features/analytics/StudentProfilePage';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 selection:bg-cyan-500 selection:text-white">
          <Navbar />
          
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <Routes>
              {/* Home & Curriculum */}
              <Route path="/" element={<HomePage />} />
              <Route path="/curriculum" element={<CurriculumExplorerPage />} />
              <Route path="/curriculum/:lessonId" element={<LessonDetailPage />} />

              {/* Materials & Class Management */}
              <Route path="/materials" element={<MaterialsManagerPage />} />
              <Route path="/classes" element={<ClassManagerPage />} />
              <Route path="/classes/:classId" element={<ClassDetailPage />} />

              {/* Game Arena & Studio */}
              <Route path="/games" element={<GameLobbyPage />} />
              <Route path="/play" element={<GamePlayPage />} />
              <Route path="/studio" element={<GameStudioPage />} />

              {/* Leaderboard & Profile */}
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<StudentProfilePage />} />

              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
