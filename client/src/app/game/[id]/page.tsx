import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../../context/UserContext';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Skeleton } from '../../../components/ui/skeleton';
import { ArrowBigUp, ArrowBigDown, Clock, Trophy, X } from 'lucide-react';
import { formatNumber } from '../../../lib/utils';
import { FactsCarousel } from '../../../components/FactsCarousel';

// API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const GAME_URL = `${API_URL}/game`;

// ETH price feed ID on Pyth
const ETH_PRICE_FEED_ID = '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace';

interface Game {
  id: string;
  userId: string;
  status: 'pending' | 'settled';
  startTime: number;
  endTime: number | null;
  betAmount: number;
  priceAtStart: number;
  priceAtEnd: number | null;
  prediction: 'long' | 'short';
  result: 'win' | 'loss' | null;
  pointsWon: number | null;
  timeLeft: number | null;
}

interface PriceResponse {
  parsed: Array<{
    price: {
      price: string;
      expo: number;
    }
  }>;
}

export default function GamePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: isUserLoading, fetchUser } = useUserContext();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRunningRef = useRef(false);
  const hasFetchedAtZeroRef = useRef(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [previousGameStatus, setPreviousGameStatus] = useState<'pending' | 'settled' | null>(null);

  // Function to fetch current ETH price directly from Hermes API
  const fetchCurrentPrice = async () => {
    try {
      // Use timestamp from 50 seconds ago to ensure data is available
      const timestamp = Math.floor(Date.now() / 1000) - 50;
      const feedId = encodeURIComponent(ETH_PRICE_FEED_ID);
      const url = `https://hermes.pyth.network/v2/updates/price/${timestamp}?ids[]=${feedId}&parsed=true`;
      
      console.log('Fetching ETH price with timestamp: ', timestamp);
      const response = await axios.get<PriceResponse>(url);
      
      if (response.data && response.data.parsed && response.data.parsed.length > 0) {
        const priceData = response.data.parsed[0].price;
        const price = priceData.price;
        const expo = priceData.expo;
        
        // Calculate the actual price by applying the exponent
        const actualPrice = Number(price) * Math.pow(10, expo);
        console.log('Successfully fetched ETH price:', actualPrice);
        setCurrentPrice(actualPrice);
      } else {
        console.warn('No price data found in Hermes response');
        // Try with an even older timestamp (100 seconds ago) as fallback
        const olderTimestamp = Math.floor(Date.now() / 1000) - 100;
        const olderUrl = `https://hermes.pyth.network/v2/updates/price/${olderTimestamp}?ids[]=${feedId}&parsed=true`;
        
        console.log('Attempting fallback with older timestamp:', olderTimestamp);
        const olderResponse = await axios.get<PriceResponse>(olderUrl);
        
        if (olderResponse.data && olderResponse.data.parsed && olderResponse.data.parsed.length > 0) {
          const priceData = olderResponse.data.parsed[0].price;
          const price = priceData.price;
          const expo = priceData.expo;
          
          // Calculate the actual price by applying the exponent
          const actualPrice = Number(price) * Math.pow(10, expo);
          console.log('Successfully fetched ETH price with fallback:', actualPrice);
          setCurrentPrice(actualPrice);
        } else {
          console.warn('Failed to fetch ETH price even with fallback timestamp');
        }
      }
    } catch (error) {
      console.error('Error fetching current ETH price from Hermes:', error);
      // Don't reset currentPrice if it's already set
      // This keeps the last known price instead of showing a loading skeleton
    }
  };

  // Fetch game data
  useEffect(() => {
    if (!user) return;

    const fetchGame = async () => {
      try {
        const response = await axios.get(`${GAME_URL}/${id}`, {
          withCredentials: true
        });

        if (response.data.success) {
          setGame(response.data.data);
          // Fetch current price when we get game data
          fetchCurrentPrice();
        } else {
          throw new Error(response.data.error || 'Failed to fetch game');
        }
      } catch (err) {
        console.error('Error fetching game:', err);
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.error || 'Failed to fetch game');
        } else {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchGame();
  }, [id, user]);

  // Poll for updates if game is pending
  useEffect(() => {
    if (!game || game.status !== 'pending') return;

    const gameId = id; // Capture current ID to use in callback
    
    // Function to fetch game data
    const fetchGameData = async () => {
      try {
        const response = await axios.get(`${GAME_URL}/${gameId}`, {
          withCredentials: true
        });

        if (response.data.success) {
          const updatedGame = response.data.data;
          const previousStatus = game?.status;
          
          setGame(updatedGame);
          
          // If game status changed from pending to settled, refresh user data
          if (previousStatus === 'pending' && updatedGame.status === 'settled') {
            console.log('Game status changed to settled during polling, refreshing user data');
            fetchUser();
          }
          
          // Also fetch current ETH price with each poll
          fetchCurrentPrice();
        }
      } catch (error) {
        console.error('Error polling game:', error);
      }
    };
    
    // Initial fetch
    fetchGameData();

    // Set up interval for polling every 10 seconds
    const intervalId = setInterval(fetchGameData, 10000);

    // Set up additional polling when timer reaches 0
    let timerCheckId: number | null = null;
    
    if (game.timeLeft !== null && game.timeLeft > 0) {
      timerCheckId = window.setTimeout(() => {
        fetchGameData();
      }, game.timeLeft * 1000);
    }

    return () => {
      clearInterval(intervalId);
      if (timerCheckId !== null) clearTimeout(timerCheckId);
    };
  }, [id, game?.status]); // Only re-run when game status changes or ID changes

  // Timer countdown using server's timeLeft property
  useEffect(() => {
    if (!game || game.status !== 'pending' || game.timeLeft === null) return;

    // Don't set up another timer if one is already running
    if (timerRunningRef.current) return;
    
    timerRunningRef.current = true;
    
    const gameId = id; // Capture current ID to avoid dependency on it changing
    
    // Reset the fetch flag when setting up a new timer
    hasFetchedAtZeroRef.current = false;
    
    const fetchLatestData = async () => {
      // Wait 3 seconds before fetching to give the server time to update
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      try {
        const response = await axios.get(`${GAME_URL}/${gameId}`, {
          withCredentials: true
        });

        if (response.data.success) {
          const updatedGame = response.data.data;
          setGame(updatedGame);
          
          // If game is now settled, refresh user data
          if (updatedGame.status === 'settled') {
            console.log('Game is now settled, refreshing user data');
            fetchUser();
          }
          // If game is still pending, wait a bit longer and try again
          else if (updatedGame.status === 'pending') {
            setTimeout(async () => {
              try {
                const finalResponse = await axios.get(`${GAME_URL}/${gameId}`, {
                  withCredentials: true
                });
                if (finalResponse.data.success) {
                  const finalGame = finalResponse.data.data;
                  setGame(finalGame);
                  
                  // Check if now settled and update user data if needed
                  if (finalGame.status === 'settled') {
                    console.log('Game is now settled after retry, refreshing user data');
                    fetchUser();
                  }
                }
              } catch (error) {
                console.error('Error in final fetch attempt:', error);
              }
            }, 5000); // Wait 5 more seconds before trying again
          }
        }
      } catch (error) {
        console.error('Error fetching game after timer reached zero:', error);
      }
    };

    // We'll update the timer display locally every second
    const intervalId = setInterval(() => {
      setGame((prevGame) => {
        if (!prevGame || prevGame.timeLeft === null) return prevGame;
        
        // If already at zero, don't update
        if (prevGame.timeLeft <= 0) return prevGame;
        
        // Decrement the timeLeft property
        const newTimeLeft = prevGame.timeLeft - 1;
        
        // If timer reaches zero and we haven't fetched yet, trigger fetch only once
        if (newTimeLeft === 0 && !hasFetchedAtZeroRef.current) {
          hasFetchedAtZeroRef.current = true;
          fetchLatestData();
        }
        
        return { ...prevGame, timeLeft: newTimeLeft };
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
      timerRunningRef.current = false;
    };
  }, [id, game?.status]); // Only re-run when game status changes or ID changes

  // Watch for game status changes to update user data when game completes
  useEffect(() => {
    // If game status changed from pending to settled, refresh user data
    if (previousGameStatus === 'pending' && game?.status === 'settled') {
      console.log('Game completed, refreshing user data');
      // Refresh user data to update points and coins in the navbar
      fetchUser();
    }

    // Update previous game status
    if (game) {
      setPreviousGameStatus(game.status);
    }
  }, [game?.status, previousGameStatus, fetchUser]);

  if (isUserLoading || isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!game) {
    return <ErrorState error="Game not found" />;
  }

  if (game.status === 'pending') {
    return <PendingGameState game={game} currentPrice={currentPrice} />;
  }

  return <SettledGameState game={game} />;
}

function LoadingState() {
  return (
    <div className="container mx-auto px-4 py-14">
      <Card className="w-full max-w-2xl mx-auto bg-slate-50">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-14">
      <Card className="w-full max-w-2xl mx-auto bg-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center text-red-500">
            <X className="mr-2" /> Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">{error}</p>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function PendingGameState({ 
  game, 
  currentPrice 
}: { 
  game: Game; 
  currentPrice: number | null;
}) {
  const navigate = useNavigate();
  
  // Calculate if user is currently winning or losing based on current price
  const currentResult = currentPrice !== null ? 
    (game.prediction === 'long' ? 
      (currentPrice > game.priceAtStart ? 'win' : 'loss') : 
      (currentPrice < game.priceAtStart ? 'win' : 'loss')) : 
    null;

  // Calculate price difference as percentage
  const priceDifference = currentPrice !== null ?
    ((currentPrice - game.priceAtStart) / game.priceAtStart) * 100 :
    null;
  
  return (
    <div className="container mx-auto px-4 py-14">
      <Card className="w-full max-w-2xl mx-auto bg-slate-50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Prediction Game</CardTitle>
            <Badge 
              className="text-sm py-1 text-black" 
              variant={game.prediction === 'long' ? 'success' : 'destructive'}
            >
              {game.prediction === 'long' ? 'Long Position' : 'Short Position'}
            </Badge>
          </div>
          <CardDescription>
            Game in progress - {game.timeLeft !== null ? `${game.timeLeft} seconds remaining` : 'calculating time...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Starting Price</p>
                  <p className="text-xl font-semibold">${formatNumber(game.priceAtStart)}</p>
                </div>
                
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted-foreground/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Current Position</p>
                  <div className="flex items-center justify-end">
                    {game.prediction === 'long' ? (
                      <ArrowBigUp className="h-5 w-5 text-green-500 mr-1" />
                    ) : (
                      <ArrowBigDown className="h-5 w-5 text-red-500 mr-1" />
                    )}
                    <span className="text-lg font-medium">
                      {game.prediction === 'long' ? 'Long' : 'Short'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Current ETH Price */}
              <div className="mb-4 p-3 border border-border rounded-lg bg-background">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Current ETH Price</p>
                  <div className="flex items-center">
                    {currentPrice !== null ? (
                      <>
                        <p className="font-semibold">${formatNumber(currentPrice)}</p>
                        {priceDifference !== null && (
                          <span className={`ml-2 text-xs font-medium ${priceDifference >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {priceDifference >= 0 ? '↑' : '↓'} {Math.abs(priceDifference).toFixed(2)}%
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center">
                        <Skeleton className="h-6 w-20" />
                        <span className="ml-2 text-xs text-muted-foreground">Loading price...</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {currentPrice !== null && (
                  <div className="mt-2 flex justify-center">
                    <Badge 
                      // variant={currentResult === 'win' ? 'success' : 'destructive'}
                      className={`text-xs ${currentResult === 'win' ? 'bg-green-300' : 'bg-red-300'}`}
                    >
                      {currentResult === 'win' ? 'Currently Winning' : 'Currently Losing'}
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="h-2 bg-muted-foreground/20 rounded-full mb-4 overflow-hidden">
                {game.timeLeft !== null && (
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${Math.max(0, (1 - game.timeLeft / 60) * 100)}%` }}
                  />
                )}
              </div>
              
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-muted-foreground">Bet Amount</p>
                  <p className="font-medium">{game.betAmount} coins</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Potential Win</p>
                  <p className="font-medium">
                    {game.betAmount * 2} points
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border my-4"></div>
            
            {/* Superseed Facts Carousel */}
            <div className="mt-4 bg-muted p-4 rounded-lg">
              <h3 className="text-sm font-medium flex items-center">
                <span className="bg-main text-mtext px-2 py-1 rounded mr-2 text-xs">Superseed Fact</span>
                Did you know?
              </h3>
              <FactsCarousel />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SettledGameState({ game }: { game: Game }) {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-14">
      <Card className="w-full max-w-2xl mx-auto border-t-4 border-t-primary bg-slate-50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Game Results</CardTitle>
            <Badge className={game.result === 'win' ? 'bg-green-500' : 'bg-red-500'}>
              {game.result === 'win' ? 'Win' : 'Loss'}
            </Badge>
          </div>
          <CardDescription>
            Prediction game completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Starting Price</p>
                  <p className="text-xl font-semibold">${formatNumber(game.priceAtStart)}</p>
                </div>
                
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
                  {game.result === 'win' ? (
                    <Trophy className="h-6 w-6 text-yellow-500" />
                  ) : (
                    <X className="h-6 w-6 text-red-500" />
                  )}
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Ending Price</p>
                  <p className="text-xl font-semibold">${formatNumber(game.priceAtEnd || 0)}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center my-4">
                <div className="flex items-center bg-muted-foreground/10 rounded-full px-4 py-2">
                  <span className="text-sm mr-2">Your prediction:</span>
                  <Badge variant={game.prediction === 'long' ? 'success' : 'destructive'}>
                    {game.prediction === 'long' ? 'Long' : 'Short'}
                  </Badge>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Bet Amount</p>
                    <p className="font-medium">{game.betAmount} coins</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Result</p>
                    <p className={`font-bold ${game.result === 'win' ? 'text-green-500' : 'text-red-500'}`}>
                      {game.result === 'win' ? 'WIN' : 'LOSS'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Points Won</p>
                    <p className="font-medium text-primary">
                      {game.pointsWon ? formatNumber(game.pointsWon) : '0'} points
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/leaderboard')}
              >
                View Leaderboard
              </Button>
              <Button className="w-full" onClick={() => navigate('/play')}>
                Play Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 