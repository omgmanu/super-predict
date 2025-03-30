import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { UserProvider } from '../context/UserContext';
import { Leaderboard } from './leaderboard';
import { Play } from './play';
import { About } from './about';
import { Home } from './home';
import Prompts from './prompts';
import { AuthCallback } from './auth-callback';
import GamePage from './game/[id]/page';
import { Toaster } from '../components/ui/toast/toaster';
import './app.module.css';

export function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <div className="min-h-screen bg-bg text-text flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/play" element={<Play />} />
              <Route path="/game/:id" element={<GamePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/prompts" element={<Prompts />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
