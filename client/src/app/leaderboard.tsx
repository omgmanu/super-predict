import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

// Placeholder data for the leaderboard
const leaderboardData = [
  {
    id: 1,
    username: 'crypto_wizard',
    avatar: '/avatars/user1.png',
    points: 9875,
    games: 143,
  },
  {
    id: 2,
    username: 'eth_lover123',
    avatar: '/avatars/user2.png',
    points: 9650,
    games: 128,
  },
  {
    id: 3,
    username: 'blockchain_guru',
    avatar: '/avatars/user3.png',
    points: 9320,
    games: 137,
  },
  {
    id: 4,
    username: 'trader_pro',
    avatar: '/avatars/user4.png',
    points: 8940,
    games: 112,
  },
  {
    id: 5,
    username: 'diamond_hands',
    avatar: '/avatars/user5.png',
    points: 8720,
    games: 105,
  },
  {
    id: 6,
    username: 'to_the_moon',
    avatar: '/avatars/user6.png',
    points: 8450,
    games: 98,
  },
  {
    id: 7,
    username: 'hodl_king',
    avatar: '/avatars/user7.png',
    points: 8230,
    games: 94,
  },
  {
    id: 8,
    username: 'crypto_queen',
    avatar: '/avatars/user8.png',
    points: 7980,
    games: 89,
  },
  {
    id: 9,
    username: 'satoshi_fan',
    avatar: '/avatars/user9.png',
    points: 7620,
    games: 82,
  },
  {
    id: 10,
    username: 'blockchain_dev',
    avatar: '/avatars/user10.png',
    points: 7345,
    games: 79,
  },
];

export function Leaderboard() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-screen-lg">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-heading mb-4">Leaderboard</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Top players ranked by points. The leaderboard will determine who
          shares the SUPR prize pool!
        </p>
      </div>
      <Table className="mb-8">
        <TableHeader>
          <TableRow className="hover:bg-bg border-b-2 border-border">
            <TableHead className="font-heading">Rank</TableHead>
            <TableHead className="font-heading">User</TableHead>
            <TableHead className="font-heading text-right">Points</TableHead>
            <TableHead className="font-heading text-right">
              Games Played
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboardData.map((player, index) => (
            <TableRow
              key={player.id}
              className={`border-b border-border bg-white`}
            >
              <TableCell className="font-bold">{index + 1}</TableCell>
              <TableCell className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={player.avatar} alt={player.username} />
                  <AvatarFallback>
                    {player.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>@{player.username}</span>
              </TableCell>
              <TableCell className="text-right font-medium">
                {player.points.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">{player.games}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Leaderboard;
