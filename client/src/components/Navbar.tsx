'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-bw border-b-2 border-border shadow-shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/app-logo.svg"
              alt="Superseed"
              className="h-[47px] w-[137px]"
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

          {/* Connect with X Button (Desktop) */}
          <div className="hidden md:block">
            <Button className="flex items-center" variant="default">
              Connect with <span className="font-bold text-lg">𝕏</span>
            </Button>
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
            <Button
              className="flex items-center justify-center"
              variant="default"
              onClick={() => setIsMenuOpen(false)}
            >
              Connect with <span className="font-bold text-lg">𝕏</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
