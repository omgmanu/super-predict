import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCreation from './play/game';
import { useUserContext } from '../context/UserContext';
import { Button } from '../components/ui/button';
import GameBoosts from '../components/GameBoosts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import axios from 'axios';
import { formatDistance, fromUnixTime } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { ArrowBigUp, ArrowBigDown, Clock, Trophy, X } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { Badge } from '../components/ui/badge';
import { formatNumber } from '../lib/utils';

// API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const GAMES_URL = `${API_URL}/games`;

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
}

export function Play() {
  const navigate = useNavigate();
  const { user, loading, login } = useUserContext();
  const [games, setGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [gamesError, setGamesError] = useState<string | null>(null);

  // Fetch user's games when component mounts
  useEffect(() => {
    if (!user) return;

    const fetchGames = async () => {
      setLoadingGames(true);
      setGamesError(null);
      
      try {
        const response = await axios.get(GAMES_URL, {
          withCredentials: true
        });
        
        if (response.data.success) {
          // Sort games by start time (newest first) and limit to 10
          const sortedGames = response.data.data
            .sort((a: Game, b: Game) => b.startTime - a.startTime)
            .slice(0, 20);
          
          setGames(sortedGames);
        } else {
          throw new Error(response.data.error || 'Failed to fetch games');
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        setGamesError('Failed to load game history');
      } finally {
        setLoadingGames(false);
      }
    };
    
    fetchGames();
  }, [user]);

  // Show login screen if user is not authenticated
  if (!loading && !user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-heading mb-6">Authentication Required</h1>
          <Card className="border-2 border-border shadow-shadow">
            <CardHeader className="bg-main border-b-2 border-border">
              <CardTitle className="font-heading text-2xl">
                Connect to Play
              </CardTitle>
              <CardDescription>
                You need to connect with your X account to play the prediction game
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 bg-slate-50 flex flex-col items-center">
              <div className="mb-8 text-center max-w-md">
                <p className="text-lg mb-4">
                  Super Predict is a game where you can earn points by correctly predicting
                  the price movement of Ethereum in a 1-minute time frame.
                </p>
                <p className="text-lg mb-4">
                  Connect with X to start playing, track your progress, and compete on the leaderboard!
                </p>
              </div>
              <Button 
                onClick={login} 
                size="lg" 
                className="flex items-center justify-center text-lg"
              >
                Connect with <span className="font-bold text-xl ml-2">𝕏</span>
              </Button>
            </CardContent>
            <CardFooter className="border-t-2 py-3 border-border bg-bw text-sm text-gray-500 text-center">
              We only require basic access to your X account profile
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // If loading, show a loading indicator
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-heading mb-4">Predict ETH Price</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Make your prediction on ETH price movements in the next minute and
          earn points!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <GameCreation />
        </div>
        
        <div>
          <Card className="w-full bg-slate-50 h-full flex flex-col">
            <CardHeader>
              <CardTitle>Your Recent Games</CardTitle>
              <CardDescription>
                Last 20 games you've played
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto" style={{ maxHeight: "450px" }}>
              {loadingGames ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : gamesError ? (
                <div className="p-4 text-center bg-red-50 text-red-500 rounded-md">
                  {gamesError}
                </div>
              ) : games.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p>You haven't played any games yet.</p>
                  <p className="mt-2">Start your first game now!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Bet</TableHead>
                        <TableHead>Prediction</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Result</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {games.map((game) => (
                        <TableRow 
                          key={game.id} 
                          className="cursor-pointer hover:bg-slate-200 transition-colors bg-slate-50"
                          onClick={() => navigate(`/game/${game.id}`)}
                        >
                          <TableCell className="whitespace-nowrap">
                            {formatDistance(fromUnixTime(game.startTime / 1000), new Date(), { addSuffix: true })}
                          </TableCell>
                          <TableCell>{game.betAmount} coins</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {game.prediction === 'long' ? (
                                <ArrowBigUp className="h-4 w-4 text-green-500 mr-1" />
                              ) : (
                                <ArrowBigDown className="h-4 w-4 text-red-500 mr-1" />
                              )}
                              {game.prediction === 'long' ? 'Long' : 'Short'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={game.status === 'pending' ? 'neutral' : 'default'}
                              className="flex items-center gap-1"
                            >
                              {game.status === 'pending' ? (
                                <>
                                  <Clock className="h-3 w-3" />
                                  <span>In Progress</span>
                                </>
                              ) : (
                                <>
                                  {game.result === 'win' ? (
                                    <Trophy className="h-3 w-3" />
                                  ) : (
                                    <X className="h-3 w-3" />
                                  )}
                                  <span>Completed</span>
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {game.status === 'settled' ? (
                              <span className={game.result === 'win' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                {game.pointsWon !== null ? `${formatNumber(game.pointsWon)} points` : 'N/A'}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Pending</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Game Boosts Component - Centered below both cards */}
      <div className="max-w-4xl mx-auto">
        <GameBoosts />
      </div>
    </div>
  );
}

export default Play;
