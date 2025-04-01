import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { HandCoins, Repeat, Twitter, Wallet } from 'lucide-react';

export function About() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-heading mb-4">About Super Predict</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Learn about our ETH price prediction game and how you can win a share
          of the SUPR prize pool!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card className="border-2 border-border shadow-shadow bg-slate-50">
          <CardHeader className="bg-main border-b-2 border-border">
            <CardTitle className="font-heading text-2xl">Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-slate-50">
            <p className="mb-6">
              Super Predict is a project built for Superseed blockchain's
              competition with a prize pool of $34,750. The contest challenged
              developers to create an engaging game around Superseed's values
              and identity using AI.
            </p>
            <p className="mb-6">
              We've created a web app where users engage in a gamified
              experience with time cooldown mechanics, earn points by predicting
              ETH price movements, climb the leaderboard, and ultimately share
              in the SUPR prize pool.
            </p>
            <p className="mb-6">
              A big amount of prize pool will be used to buy SUPR tokens over
              the first 5 weeks of launch, which will then be distributed to top
              leaderboard players in multiple phases.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border shadow-shadow bg-slate-50">
          <CardHeader className="bg-main border-b-2 border-border">
            <CardTitle className="font-heading text-2xl">
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pb-8">
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mr-4 mt-1 bg-main rounded-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <strong className="font-medium">ETH Price Predictions</strong>
                  <p className="text-sm text-muted-foreground">
                    Bet on whether ETH price will rise or fall in the next
                    minute
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-4 mt-1 bg-main rounded-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <strong className="font-medium">Hourly Coin Rewards</strong>
                  <p className="text-sm text-muted-foreground">
                    Receive 100 coins every hour, up to a maximum of 1000 coins
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-4 mt-1 bg-main rounded-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <strong className="font-medium">Point System</strong>
                  <p className="text-sm text-muted-foreground">
                    Win double your bet in points for correct predictions
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-4 mt-1 bg-main rounded-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <strong className="font-medium">Game Boosts</strong>
                  <p className="text-sm text-muted-foreground">
                    Unlock special features and earn more points with various
                    game boosts
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-4 mt-1 bg-main rounded-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <strong className="font-medium">SUPR Prize Pool</strong>
                  <p className="text-sm text-muted-foreground">
                    Top leaderboard users will share in the $25000 (in SUPR
                    tokens) prize pool
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-border shadow-shadow mb-16">
        <CardHeader className="bg-main border-b-2 border-border">
          <CardTitle className="font-heading text-2xl">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-main mb-4 flex items-center justify-center text-xl font-bold">
                1
              </div>
              <h3 className="font-heading text-lg">Connect</h3>
              <p className="text-sm">
                Connect with your X account to start playing and track your
                progress on the leaderboard.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-main mb-4 flex items-center justify-center text-xl font-bold">
                2
              </div>
              <h3 className="font-heading text-lg">Collect</h3>
              <p className="text-sm">
                Receive 100 coins every hour (max 1000) to use for your
                predictions.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-main mb-4 flex items-center justify-center text-xl font-bold">
                3
              </div>
              <h3 className="font-heading text-lg">Predict</h3>
              <p className="text-sm">
                Bet coins on whether ETH price will rise or fall in the next
                minute.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-main mb-4 flex items-center justify-center text-xl font-bold">
                4
              </div>
              <h3 className="font-heading text-lg">Win</h3>
              <p className="text-sm">
                Earn points for correct predictions and climb the leaderboard to
                win SUPR tokens.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Boosts Section */}
      <Card className="border-2 border-border shadow-shadow mb-16">
        <CardHeader className="bg-main border-b-2 border-border">
          <CardTitle className="font-heading text-2xl">Game Boosts</CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-slate-50">
          <p className="mb-6">
            Enhance your gameplay experience with various boosts that help you
            earn more points and coins. Spend your earned points to unlock
            powerful features!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-heading text-xl mb-4 flex items-center">
                <HandCoins className="h-5 w-5 mr-2" />
                Super Distributor
              </h3>
              <p className="mb-4">
                Distribute coins to all players and help the community while
                earning points yourself. Available in three levels with improved
                capabilities:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Level 1:</strong> Distribute 100 coins to all players
                  every 12 hours
                  <span className="text-sm text-gray-500 ml-2">
                    (Cost: 4,000 points)
                  </span>
                </li>
                <li>
                  <strong>Level 2:</strong> Distribute 200 coins to all players
                  every 10 hours
                  <span className="text-sm text-gray-500 ml-2">
                    (Cost: 10,000 points)
                  </span>
                </li>
                <li>
                  <strong>Level 3:</strong> Distribute 300 coins to all players
                  every 8 hours
                  <span className="text-sm text-gray-500 ml-2">
                    (Cost: 25,000 points)
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-xl mb-4 flex items-center">
                <Repeat className="h-5 w-5 mr-2" />
                Super Automator
              </h3>
              <p className="mb-4">
                Let the automator play games for you automatically. The bot will
                make random predictions using 100 coins per game. Available in
                three levels:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Level 1:</strong> Auto play every 190 minutes
                  <span className="text-sm text-gray-500 ml-2">
                    (Cost: 5,000 points)
                  </span>
                </li>
                <li>
                  <strong>Level 2:</strong> Auto play every 130 minutes
                  <span className="text-sm text-gray-500 ml-2">
                    (Cost: 14,000 points)
                  </span>
                </li>
                <li>
                  <strong>Level 3:</strong> Auto play every 70 minutes
                  <span className="text-sm text-gray-500 ml-2">
                    (Cost: 34,000 points)
                  </span>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-heading text-xl mb-4 flex items-center">
                <Twitter className="h-5 w-5 mr-2" />
                Action Boosts
              </h3>
              <p className="mb-4">
                Complete one-time actions to earn instant point rewards:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Follow Superseed on X:</strong> Earn 500 points
                  </li>
                  <li>
                    <strong>RT Post of Game Submission:</strong> Earn 800 points
                  </li>
                </ul>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Genesis Seeders - Connect Wallet:</strong> To be
                    announced
                    <span className="text-sm text-gray-500 ml-2">
                      (Coming Soon)
                    </span>
                  </li>
                  <li>
                    <strong>Superseed Points System - Connect Wallet:</strong>{' '}
                    To be announced
                    <span className="text-sm text-gray-500 ml-2">
                      (Coming Soon)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => navigate('/play')}
              className="px-6 py-3 bg-main text-text border-2 border-border shadow-shadow rounded flex items-center justify-center hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none font-bold"
            >
              Explore Game Boosts
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-border shadow-shadow mb-16">
        <CardHeader className="bg-main border-b-2 border-border">
          <CardTitle className="font-heading text-2xl">
            SUPR Prize Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-heading text-xl mb-4">Prize Pool</h3>
              <p className="mb-2">
                A big chunk of prize pool ($25000) will be used used to buy SUPR
                tokens over the first 5 weeks of launch (or date of receiving).
              </p>
              <p>
                These SUPR tokens will be distributed to top leaderboard players
                in multiple phases (to be determined).
              </p>
            </div>

            <div>
              <h3 className="font-heading text-xl mb-4">
                Genesis Seeder Benefits
              </h3>
              <p className="mb-2">
                After Superseed's mainnet launch, Genesis Seeders will receive
                special benefits:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Connect your wallet to receive a generous amount of points
                </li>
                <li>
                  Benefit from Superseed's points system to increase your
                  in-game points (% to be determined)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <button
          onClick={() => navigate('/play')}
          className="px-6 py-3 bg-main text-text border-2 border-border shadow-shadow rounded flex items-center justify-center hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none text-lg font-bold mx-auto"
        >
          Start playing now
        </button>
      </div>
    </div>
  );
}

export default About;
