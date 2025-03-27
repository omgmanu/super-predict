import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-main border-t-4 border-border mt-auto py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-heading text-mtext mb-4">
              Super Predict
            </h3>
            <p className="text-sm text-mtext">
              Predict ETH price movements, earn points, and win a share of the
              SUPR prize pool.
            </p>
          </div>

          {/* Quick links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-heading text-mtext mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-mtext hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/play" className="text-sm text-mtext hover:underline">
                  Play
                </Link>
              </li>
              <li>
                <Link
                  to="/leaderboard"
                  className="text-sm text-mtext hover:underline"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-mtext hover:underline"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-heading text-mtext mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://superseed.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-mtext hover:underline"
                >
                  Superseed
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-mtext hover:underline">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-mtext hover:underline">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-mtext hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-heading text-mtext mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-mtext hover:text-text">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" />
                </svg>
              </a>
              <a href="#" className="text-mtext hover:text-text">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="#" className="text-mtext hover:text-text">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-mtext mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Super Predict. All rights
            reserved.
          </p>
          <p className="text-sm text-mtext">
            Built for{' '}
            <a
              href="https://superseed.io"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              Superseed
            </a>{' '}
            competition
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
