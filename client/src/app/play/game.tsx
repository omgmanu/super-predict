import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';

const BET_OPTIONS = [100, 200, 300, 400, 500];

// API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const GAME_URL = `${API_URL}/game`;

export default function GameCreation() {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [betAmount, setBetAmount] = useState<number>(100);
  const [prediction, setPrediction] = useState<'long' | 'short' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartGame = async () => {
    if (!prediction) {
      setError('Please select a prediction (Long or Short)');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(`${GAME_URL}/new`, {
        betAmount,
        prediction,
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        // Navigate to the game page
        navigate(`/game/${response.data.data.id}`);
      } else {
        throw new Error(response.data.error || 'Failed to start game');
      }
    } catch (err) {
      console.error('Error starting game:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || 'Failed to start game');
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
      setIsSubmitting(false);
    }
  };

  const canAffordBet = user && user.coins >= betAmount;

  return (
    <Card className="w-full max-w-lg mx-auto bg-slate-50">
      <CardHeader>
        <CardTitle>Start New Game</CardTitle>
        <CardDescription>
          Predict if ETH price will go up or down in 60 seconds
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Choose your bet amount</h3>
          <div className="flex flex-wrap gap-2">
            {BET_OPTIONS.map((amount) => (
              <Button
                key={amount}
                onClick={() => setBetAmount(amount)}
                variant={betAmount === amount ? 'default' : 'outline'}
                className={`flex-1 min-w-[80px] ${
                  user?.coins && user.coins < amount ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={user?.coins ? user.coins < amount : true}
              >
                {amount}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Your balance: {user?.coins || 0} coins
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Make your prediction</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => setPrediction('long')}
              variant={prediction === 'long' ? 'default' : 'outline'}
              className={`h-24 flex flex-col items-center justify-center ${
                prediction === 'long' ? 'bg-green-600 hover:bg-green-700' : ''
              }`}
            >
              <ArrowBigUp className="h-8 w-8 mb-2" />
              <span>Long (Up)</span>
            </Button>
            <Button
              onClick={() => setPrediction('short')}
              variant={prediction === 'short' ? 'default' : 'outline'}
              className={`h-24 flex flex-col items-center justify-center ${
                prediction === 'short' ? 'bg-red-600 hover:bg-red-700' : ''
              }`}
            >
              <ArrowBigDown className="h-8 w-8 mb-2" />
              <span>Short (Down)</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Predict if ETH price will go up (Long) or down (Short) after 60 seconds
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-200 text-red-800 rounded-md">
            {error}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleStartGame}
          disabled={!prediction || isSubmitting || !canAffordBet}
          className="w-full"
        >
          {isSubmitting ? 'Starting Game...' : `Start Game (${betAmount} coins)`}
        </Button>
      </CardFooter>
    </Card>
  );
} 