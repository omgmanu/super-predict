import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { useUserContext } from '../context/UserContext';
import { Skeleton } from '../components/ui/skeleton';
import axios from 'axios';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { GameBoost } from '../context/UserContext';
import { CheckCircle } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  id: string;
  username: string;
  profileImageUrl: string;
  points: number;
  gamesPlayed: number;
  winRate: string;
  boosts?: GameBoost[];
}

// Component to display boost details in the tooltip
const BoostDetails = ({ boosts }: { boosts?: GameBoost[] }) => {
  if (!boosts || boosts.length === 0) {
    return <div className="text-sm">No boosts unlocked</div>;
  }

  // Function to get friendly boost name
  const getBoostName = (boostType: string): string => {
    const boostNames: Record<string, string> = {
      superDistributor: "Super Distributor",
      superAutomator: "Super Automator",
      followX: "Follow Superseed on X",
      rtPost: "RT Post of Game Submission",
      connectGenesis: "Genesis Seeders - Connect Wallet",
      connectSuperseed: "Superseed Points System - Connect Wallet"
    };

    return boostNames[boostType] || boostType;
  };

  return (
    <div className="space-y-2 max-w-xs p-4 rounded-lg">
      <h4 className="font-medium text-sm text-left">Unlocked Boosts:</h4>
      <ul className="space-y-1 text-sm">
        {boosts.map((boost) => (
          <li key={boost.id} className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>
              {getBoostName(boost.type)}
              {boost.level ? ` (Level ${boost.level})` : ''}
              {boost.type === 'superDistributor' && boost.usageCount !== undefined && 
                ` - Used ${boost.usageCount} time${boost.usageCount !== 1 ? 's' : ''}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserContext();
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardUser | null>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/leaderboard`, { withCredentials: true });
        
        if (response.data.success) {
          const data = response.data.data as LeaderboardUser[];
          setLeaderboardData(data);
          
          // Find current user in the leaderboard
          if (user) {
            const currentUser = data.find(item => item.id === user.id);
            if (currentUser) {
              setCurrentUserRank(currentUser);
            }
          }
        } else {
          setError('Failed to load leaderboard data');
        }
      } catch (err) {
        setError('Error connecting to the server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user, API_URL]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-screen-lg">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-heading mb-4">Leaderboard</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Top players ranked by points. The leaderboard will determine who
          shares the SUPR prize pool!
        </p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6 text-center">
          {error}
        </div>
      )}

      {loading ? (
        <LeaderboardSkeleton />
      ) : (
        <Table className="mb-8">
          <TableHeader>
            <TableRow className="hover:bg-bg border-b-2 border-border">
              <TableHead className="font-heading">Rank</TableHead>
              <TableHead className="font-heading">User</TableHead>
              <TableHead className="font-heading text-right">Points</TableHead>
              <TableHead className="font-heading text-right">
                Games Played
              </TableHead>
              <TableHead className="font-heading text-right">
                Win Rate
              </TableHead>
              <TableHead className="font-heading text-right">
                Boosts
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Show current user's rank if not in top 10 */}
            {currentUserRank && currentUserRank.rank > 10 && (
              <>
                <TableRow className="border-b border-border bg-primary/5">
                  <TableCell className="font-bold">{currentUserRank.rank}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={currentUserRank.profileImageUrl} alt={currentUserRank.username} />
                      <AvatarFallback>
                        {currentUserRank.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>@{currentUserRank.username}</span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {currentUserRank.points.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">{currentUserRank.gamesPlayed}</TableCell>
                  <TableCell className="text-right">{currentUserRank.winRate}</TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="hover:bold underline cursor-help">
                          {currentUserRank.boosts?.filter(b => b.unlocked).length || 0}
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <BoostDetails boosts={currentUserRank.boosts?.filter(b => b.unlocked)} />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-border">
                  <TableCell colSpan={6} className="text-center py-1 text-gray-500 text-sm italic">
                    ...
                  </TableCell>
                </TableRow>
              </>
            )}

            {/* Top 100 leaderboard */}
            {leaderboardData.map((player) => (
              <TableRow
                key={player.id}
                className={`border-b border-border ${
                  user && player.id === user.id ? 'bg-primary/5' : 'bg-white'
                }`}
              >
                <TableCell className="font-bold">{player.rank}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={player.profileImageUrl} alt={player.username} />
                    <AvatarFallback>
                      {player.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>@{player.username}</span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {player.points.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">{player.gamesPlayed}</TableCell>
                <TableCell className="text-right">{player.winRate}</TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="hover:bold underline cursor-help">
                        {player.boosts?.filter(b => b.unlocked).length || 0}
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <BoostDetails boosts={player.boosts?.filter(b => b.unlocked)} />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <Table className="mb-8">
      <TableHeader>
        <TableRow className="hover:bg-bg border-b-2 border-border">
          <TableHead className="font-heading">Rank</TableHead>
          <TableHead className="font-heading">User</TableHead>
          <TableHead className="font-heading text-right">Points</TableHead>
          <TableHead className="font-heading text-right">
            Games Played
          </TableHead>
          <TableHead className="font-heading text-right">
            Win Rate
          </TableHead>
          <TableHead className="font-heading text-right">
            Boosts
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index} className="border-b border-border">
            <TableCell>
              <Skeleton className="h-6 w-6" />
            </TableCell>
            <TableCell className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4 w-16 ml-auto" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4 w-10 ml-auto" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4 w-12 ml-auto" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4 w-8 ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default Leaderboard;
