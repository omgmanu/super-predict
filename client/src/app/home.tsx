import React, { useState, useEffect } from 'react';
import Marquee from '../components/ui/marquee';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { useNavigate } from 'react-router-dom';
import { HandCoins, Repeat, Award } from 'lucide-react';
import axios from 'axios';

interface WinningGame {
  id: string;
  username: string;
  pointsWon: number;
}

export function Home() {
  const navigate = useNavigate();
  const [marqueeItems, setMarqueeItems] = useState<string[]>([
    'User @crypto_wizard won 350 points!',
    'User @eth_lover123 won 200 points!',
    'User @blockchain_guru won 420 points!',
    'User @trader_pro won 180 points!',
    'User @diamond_hands won 300 points!',
    'User @to_the_moon won 250 points!',
    'User @hodl_king won 400 points!',
  ]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const fetchRecentWins = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/games/recent/wins?limit=10`
        );

        if (response.data.success && response.data.data.length > 0) {
          const winningGames = response.data.data as WinningGame[];

          // Transform the data into the required format for the marquee
          const formattedItems = winningGames.map(
            (game) => `User @${game.username} won ${game.pointsWon} points!`
          );

          setMarqueeItems(formattedItems);
        }
      } catch (error) {
        console.error('Error fetching recent winning games:', error);
        // Keep the placeholder data if there's an error
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentWins();
  }, [API_URL]);

  return (
    <div>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col gap-4 justify-center">
            <h1 className="text-5xl font-heading mb-4">Super Predict</h1>
            <p className="text-xl mb-6">
              Predict ETH price movements, earn points, and climb the
              leaderboard to share the SUPR prize pool!
            </p>
            <button
              onClick={() => navigate('/play')}
              className="px-6 py-3 bg-main text-text border-2 border-border shadow-shadow rounded flex items-center justify-center w-fit hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none text-lg font-bold"
            >
              Play now
            </button>
          </div>
          {/* hide on mobile */}
          <div className="hidden md:flex items-center justify-center ">
            <img
              src="/app-logo-short-v2.svg"
              alt="Superseed"
              className="h-[350px] w-[300px]"
            />
          </div>
        </div>
      </div>

      {/* Marquee */}
      <Marquee items={marqueeItems} />

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-heading mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-50 border-2 border-border shadow-shadow p-6 rounded">
            <div className="w-12 h-12 bg-main rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-heading mb-2 text-center">
              Connect & Collect
            </h3>
            <p className="text-center">
              Connect with your X account to get started. Receive 100 coins
              every hour, up to a maximum of 1000 coins.
            </p>
          </div>
          <div className="bg-slate-50 border-2 border-border shadow-shadow p-6 rounded">
            <div className="w-12 h-12 bg-main rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-heading mb-2 text-center">
              Predict & Play
            </h3>
            <p className="text-center">
              Place a bet on whether ETH's price will rise or fall in the next
              minute. The bigger your bet, the more points you can earn!
            </p>
          </div>
          <div className="bg-slate-50 border-2 border-border shadow-shadow p-6 rounded">
            <div className="w-12 h-12 bg-main rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-heading mb-2 text-center">
              Win & Earn
            </h3>
            <p className="text-center">
              If your prediction is correct, you'll earn double your bet in
              points. Climb the leaderboard to share in the SUPR prize pool!
            </p>
          </div>
        </div>
      </div>

      {/* Game Boosts Section */}
      <div className="container mx-auto px-4 py-12 bg-slate-50">
        <h2 className="text-3xl font-heading mb-8 text-center">Game Boosts</h2>
        <p className="text-lg text-center max-w-3xl mx-auto mb-8">
          Enhance your gameplay with special boosts that help you earn more
          points and coins!
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white border-2 border-border shadow-shadow p-6 rounded">
            <div className="w-16 h-16 bg-main rounded-full flex items-center justify-center mb-4 mx-auto">
              <HandCoins className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-heading mb-2 text-center">
              Super Distributor
            </h3>
            <p className="text-center mb-2">
              Distribute coins to all players and earn points. Available in 3
              levels with reduced cooldowns.
            </p>
            <p className="text-sm text-center text-gray-500">
              Level 1: 100 coins every 12h
              <br />
              Level 2: 200 coins every 10h
              <br />
              Level 3: 300 coins every 8h
            </p>
          </div>

          <div className="bg-white border-2 border-border shadow-shadow p-6 rounded">
            <div className="w-16 h-16 bg-main rounded-full flex items-center justify-center mb-4 mx-auto">
              <Repeat className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-heading mb-2 text-center">
              Super Automator
            </h3>
            <p className="text-center mb-2">
              Let the automator play games for you! Available in 3 levels with
              reduced intervals.
            </p>
            <p className="text-sm text-center text-gray-500">
              Level 1: Every 190 minutes
              <br />
              Level 2: Every 130 minutes
              <br />
              Level 3: Every 70 minutes
            </p>
          </div>

          <div className="bg-white border-2 border-border shadow-shadow p-6 rounded">
            <div className="w-16 h-16 bg-main rounded-full flex items-center justify-center mb-4 mx-auto">
              <Award className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-heading mb-2 text-center">
              Action Boosts
            </h3>
            <p className="text-center mb-2">
              Complete one-time actions to earn instant points rewards.
            </p>
            <p className="text-sm text-center text-gray-500">
              Follow Superseed on X: 500 points
              <br />
              RT Game Submission post: 800 points
              <br />
              Connect wallets: coming soon
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate('/play')}
            className="px-6 py-3 bg-main text-text border-2 border-border shadow-shadow rounded flex items-center justify-center hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none font-bold"
          >
            Unlock Boosts
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16" id="faq">
        <h2 className="text-3xl font-heading mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion
            type="single"
            collapsible
            className="w-full gap-4 flex flex-col"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Super Predict?</AccordionTrigger>
              <AccordionContent>
                Super Predict is a prediction game where users bet virtual coins
                on whether ETH's price will rise or fall in the next minute. Win
                points for correct predictions and climb the leaderboard to
                share in the SUPR prize pool!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I earn coins?</AccordionTrigger>
              <AccordionContent>
                All users receive 100 coins every hour automatically, up to a
                maximum of 1000 coins. You cannot stack more than 1000 coins at
                a time, so make sure to use them!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How do I earn points?</AccordionTrigger>
              <AccordionContent>
                When you make a correct prediction, you earn double your bet in
                points. Even if your prediction is wrong, you still earn 10% of
                your bet in points. Points are used for leaderboard ranking and
                will eventually be used to claim SUPR tokens.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>What are Game Boosts?</AccordionTrigger>
              <AccordionContent>
                Game Boosts are special features that enhance your gameplay
                experience. There are three types: Super Distributor (distribute
                coins to all players), Super Automator (play games automatically
                for you), and Action Boosts (one-time actions for instant
                points). You can unlock boosts by spending your earned points.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>What is the SUPR prize pool?</AccordionTrigger>
              <AccordionContent>
                The SUPR prize pool is worth $25000 and will be distributed to
                top leaderboard users in 5 phases. The pool will be used to buy
                SUPR tokens over the first 5 weeks of launch.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>
                Are there any benefits for Genesis Seeders?
              </AccordionTrigger>
              <AccordionContent>
                Yes! After mainnet launch, Genesis Seeders will be able to
                connect with their wallet and receive a generous amount of
                points (value TBD). Additionally, users will benefit from
                Superseed's points system to increase their in-game points.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="bg-slate-50">
        {/* CTA Section */}
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-heading mb-6">
            Ready to Start Predicting?
          </h2>
          <button
            onClick={() => navigate('/play')}
            className="px-6 py-3 bg-main text-text border-2 border-border shadow-shadow rounded flex items-center justify-center w-fit hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none text-lg font-bold mx-auto"
          >
            Play now
          </button>
        </div>
      </div>
    </div>
  );
}
