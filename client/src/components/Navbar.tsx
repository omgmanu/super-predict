'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, Coins, Trophy } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { useUserContext } from '../context/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, login, logout } = useUserContext();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle login with X
  const handleLogin = () => {
    login();
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-bw border-b-2 border-border shadow-shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/app-logo-v3.svg"
              alt="Superseed"
              className="h-[50px] w-[140px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/leaderboard"
              className="text-text hover:text-main text-lg font-medium"
            >
              Leaderboard
            </Link>
            <Link
              to="/play"
              className="text-text hover:text-main text-xl font-bold"
            >
              Play
            </Link>
            <Link
              to="/about"
              className="text-text hover:text-main text-lg font-medium"
            >
              About
            </Link>
          </nav>

          {/* Auth Button (Desktop) */}
          <div className="hidden md:block">
            {loading ? (
              <Button disabled variant="default">
                Loading...
              </Button>
            ) : user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profileImageUrl} alt={user.username} />
                    <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.username}</span>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="default" className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        {user.points}
                      </Badge>
                      <Badge variant="default" className="flex items-center gap-1">
                        <Coins className="h-3 w-3" />
                        {user.coins}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button onClick={handleLogout} variant="neutral">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              </div>
            ) : (
              <Button onClick={handleLogin} className="flex items-center" variant="default">
                Connect with <span className="font-bold text-lg ml-1">𝕏</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md bg-main border-2 border-border shadow-shadow"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={cn('md:hidden pb-4', isMenuOpen ? 'block' : 'hidden')}>
          <div className="flex flex-col space-y-4 pt-2 pb-3">
            <Link
              to="/leaderboard"
              className="px-3 py-2 text-base font-medium rounded-md bg-main border-2 border-border shadow-shadow text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Leaderboard
            </Link>
            <Link
              to="/play"
              className="px-3 py-2 text-base font-medium rounded-md bg-main border-2 border-border shadow-shadow text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Play
            </Link>
            <Link
              to="/about"
              className="px-3 py-2 text-base font-medium rounded-md bg-main border-2 border-border shadow-shadow text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            
            {/* Auth in Mobile Menu */}
            {loading ? (
              <Button disabled variant="default">
                Loading...
              </Button>
            ) : user ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-2 bg-bw p-3 rounded-md border-2 border-border shadow-shadow">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profileImageUrl} alt={user.username} />
                    <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.username}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      {user.points}
                    </Badge>
                    <Badge variant="default" className="flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      {user.coins}
                    </Badge>
                  </div>
                </div>
                <Button onClick={handleLogout} variant="neutral" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleLogin}
                className="flex items-center justify-center"
                variant="default"
              >
                Connect with <span className="font-bold text-lg ml-1">𝕏</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
