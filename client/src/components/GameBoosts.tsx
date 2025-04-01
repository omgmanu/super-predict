import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/UserContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { formatDistance } from 'date-fns';
import {
  Rocket,
  CheckCircle,
  Twitter,
  Repeat,
  HandCoins,
  Bean,
  Award,
} from 'lucide-react';
import { useToast } from './ui/toast/use-toast';

// Boost details
const BOOSTS = {
  // Unlock features - costs points to unlock
  superDistributor: [
    {
      level: 1,
      name: 'Super Distributor (Level 1)',
      description: 'Distribute 100 coins to all players once every 12h',
      cost: 4000,
      cooldown: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
      icon: <HandCoins className="h-6 w-6" />,
    },
    {
      level: 2,
      name: 'Super Distributor (Level 2)',
      description: 'Distribute 200 coins to all players once every 10h',
      cost: 10000,
      cooldown: 10 * 60 * 60 * 1000, // 10 hours in milliseconds
      icon: <HandCoins className="h-6 w-6" />,
    },
    {
      level: 3,
      name: 'Super Distributor (Level 3)',
      description: 'Distribute 300 coins to all players once every 8h',
      cost: 25000,
      cooldown: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
      icon: <HandCoins className="h-6 w-6" />,
    },
  ],
  superAutomator: [
    {
      level: 1,
      name: 'Super Automator (Level 1)',
      description: 'Auto play 100 coins every 190 minutes (random prediction)',
      cost: 5000,
      cooldown: 190 * 60 * 1000, // 190 minutes in milliseconds
      icon: <Repeat className="h-6 w-6" />,
    },
    {
      level: 2,
      name: 'Super Automator (Level 2)',
      description: 'Auto play 100 coins every 130 minutes (random prediction)',
      cost: 14000,
      cooldown: 130 * 60 * 1000, // 130 minutes in milliseconds
      icon: <Repeat className="h-6 w-6" />,
    },
    {
      level: 3,
      name: 'Super Automator (Level 3)',
      description: 'Auto play 100 coins every 70 minutes (random prediction)',
      cost: 34000,
      cooldown: 70 * 60 * 1000, // 70 minutes in milliseconds
      icon: <Repeat className="h-6 w-6" />,
    },
  ],
  // Earn more points by action
  followX: {
    name: 'Follow Superseed on X',
    description: 'Follow Superseed on X to earn points',
    reward: 500,
    icon: <Twitter className="h-6 w-6" />,
  },
  rtPost: {
    name: 'RT Post of Game Submission',
    description: 'Retweet our game submission to earn points',
    reward: 800,
    icon: <Twitter className="h-6 w-6" />,
  },
  connectGenesis: {
    name: 'Genesis Seeders - Connect Wallet',
    description: 'Connect your Genesis Seeder wallet to earn points',
    reward: 'To be announced',
    available: false,
    icon: <Bean className="h-6 w-6" />,
  },
  connectSuperseed: {
    name: 'Superseed Points System - Connect Wallet',
    description: 'Connect your Superseed Points wallet to earn points',
    reward: 'To be announced',
    available: false,
    icon: <Award className="h-6 w-6" />,
  },
};

export default function GameBoosts() {
  const {
    user,
    buyBoost,
    useBoost: activateBoost,
    login,
    fetchUser,
  } = useUserContext();
  const [loadingBoost, setLoadingBoost] = useState<string | null>(null);
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [cooldownRefreshKey, setCooldownRefreshKey] = useState(0);

  // Refresh cooldown timers periodically
  useEffect(() => {
    // Update cooldown timers every minute
    const interval = setInterval(() => {
      setCooldownRefreshKey((prev) => prev + 1);
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  // Function to refresh user boosts after an action
  const fetchUserBoosts = async () => {
    // This will trigger a refresh in the UserContext
    // The context already handles refreshing, so we don't need to do anything more
  };

  // Check if user has a specific boost
  const hasBoost = (type: string, level?: number) => {
    if (!user.boosts) return false;
    return user.boosts.some(
      (boost) =>
        boost.type === type &&
        (level === undefined || boost.level === level) &&
        boost.unlocked
    );
  };

  // Check if user has previous level of a boost
  const hasPreviousLevel = (type: string, level: number) => {
    if (level === 1) return true; // Level 1 doesn't require previous level
    return hasBoost(type, level - 1);
  };

  // Check if boost is on cooldown
  const isOnCooldown = (type: string, level?: number) => {
    if (!user.boosts) return false;

    const boost = user.boosts.find(
      (b) => b.type === type && (level === undefined || b.level === level)
    );

    if (!boost || !boost.lastUsed) return false;

    const cooldownTime =
      type === 'superDistributor'
        ? BOOSTS.superDistributor[level ? level - 1 : 0].cooldown
        : BOOSTS.superAutomator[level ? level - 1 : 0].cooldown;

    return Date.now() - boost.lastUsed < cooldownTime;
  };

  // Get time remaining on cooldown
  const getCooldownRemaining = (type: string, level?: number) => {
    if (!user.boosts) return '';

    const boost = user.boosts.find(
      (b) => b.type === type && (level === undefined || b.level === level)
    );

    if (!boost || !boost.lastUsed) return '';

    const cooldownTime =
      type === 'superDistributor'
        ? BOOSTS.superDistributor[level ? level - 1 : 0].cooldown
        : BOOSTS.superAutomator[level ? level - 1 : 0].cooldown;

    const remaining = boost.lastUsed + cooldownTime - Date.now();
    if (remaining <= 0) return '';

    return formatDistance(new Date(), new Date(Date.now() + remaining), {
      addSuffix: false,
    });
  };

  // Handle buying a boost
  const handleBuyBoost = async (type: string, level: number) => {
    setLoadingBoost(`${type}-${level}`);
    try {
      const result = await buyBoost(type, level);
      if (result.success) {
        toast({
          title: 'Boost Purchased!',
          description: `You have successfully unlocked the boost.`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Purchase Failed',
          description:
            result.error || 'Not enough points or boost already unlocked.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Purchase Failed',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingBoost(null);
    }
  };

  // Social media links
  const socialLinks = {
    followX: 'https://twitter.com/superseedxyz',
    rtPost: 'https://x.com/ment0san/status/1907127259569258985',
  };

  const getSocialActionDescription = (boostType: string) => {
    if (boostType === 'followX') {
      return 'Make sure to follow @superseedxyz on X (Twitter) to earn points.';
    } else if (boostType === 'rtPost') {
      return 'Make sure to retweet the post to earn points.';
    }
    return '';
  };

  const handleAction = async (boostType: string, level?: number) => {
    // If it's a social media action, open the link in a new tab
    if (boostType === 'followX' || boostType === 'rtPost') {
      setActionLoading(boostType);

      // Open link in new tab
      const link = socialLinks[boostType as keyof typeof socialLinks];
      window.open(link, '_blank');

      // Show instruction tooltip
      toast({
        title: 'Action Required',
        description: getSocialActionDescription(boostType),
        variant: 'default',
      });

      // After a short delay, try to claim the boost
      setTimeout(async () => {
        try {
          // Try to activate the boost
          const response = await activateBoost(boostType);
          console.log('Social media boost response:', response);

          if (response.success) {
            // Get the reward amount from either the response or fallback to the predefined values
            const reward =
              response.reward ||
              (boostType === 'followX'
                ? 500
                : boostType === 'rtPost'
                ? 800
                : 0);

            toast({
              title: 'Success!',
              description: `Successfully earned ${reward} points!`,
              variant: 'default',
            });
          } else if (response.error === 'Unauthorized') {
            // Handle authentication error specifically
            toast({
              title: 'Authentication Required',
              description: 'Please log in to earn points',
              variant: 'destructive',
            });
            // Redirect to login after a short delay
            setTimeout(() => {
              login(); // Use the login function from UserContext
            }, 1500);
          } else if (response.error === 'Boost already used') {
            toast({
              title: 'Already Completed',
              description: 'You have already earned points for this action',
              variant: 'default',
            });
          } else {
            toast({
              title: 'Error',
              description: response.error || 'Failed to earn points',
              variant: 'destructive',
            });
          }
        } catch (error) {
          console.error('Error activating social boost:', error);
          toast({
            title: 'Error',
            description: 'Failed to earn points. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setActionLoading(null);
        }
      }, 3000); // Longer delay to give user time to interact with social media
    } else {
      // Regular action boost
      try {
        // Set action loading with level information if available
        const actionId = level ? `${boostType}-${level}` : boostType;
        setActionLoading(actionId);

        const response = await activateBoost(boostType, level);
        if (response.success) {
          let message;

          if (boostType === 'superDistributor' && level) {
            message = `Successfully distributed ${
              level * 100
            } coins to all players!`;

            toast({
              title: 'Success!',
              description: message,
              variant: 'default',
            });

            // For the distributor boost, update the UI without a full refresh
            // by fetching fresh user data
            await fetchUser();

            // Update the cooldown UI state without a refresh
            setActionLoading(null);
          } else if (response.reward) {
            message = `Successfully earned ${response.reward} points!`;

            toast({
              title: 'Success!',
              description: message,
              variant: 'default',
            });
          } else {
            message = `Successfully completed action!`;

            toast({
              title: 'Success!',
              description: message,
              variant: 'default',
            });
          }
        } else if (response.error === 'Unauthorized') {
          // Handle authentication error
          toast({
            title: 'Authentication Required',
            description: 'Please log in to use this boost',
            variant: 'destructive',
          });
          setTimeout(() => {
            login(); // Use the login function from UserContext
          }, 1500);
        } else {
          toast({
            title: 'Error',
            description: response.error || 'Failed to use boost',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error using regular boost:', error);
        toast({
          title: 'Error',
          description: 'Failed to use boost',
          variant: 'destructive',
        });
      } finally {
        if (!boostType.includes('superDistributor')) {
          setActionLoading(null);
        }
      }
    }
  };

  // Render a Super Distributor boost item
  const renderDistributorBoost = (boost: any) => {
    const isUnlocked = hasBoost('superDistributor', boost.level);
    const cooldown = isOnCooldown('superDistributor', boost.level);
    const canBuy =
      user.points >= boost.cost &&
      hasPreviousLevel('superDistributor', boost.level);

    // Get distributor stats
    const getDistributorUsageCount = () => {
      if (!user.boosts) return 0;

      const boostData = user.boosts.find(
        (b) => b.type === 'superDistributor' && b.level === boost.level
      );

      return boostData?.usageCount || 0;
    };

    const usageCount = getDistributorUsageCount();

    return (
      <div
        key={`distributor-${boost.level}`}
        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-md bg-slate-50"
      >
        <div className="flex items-start gap-3">
          <div className="bg-main text-black p-3 rounded-md">{boost.icon}</div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{boost.name}</h4>
              {isUnlocked && (
                <Badge variant="default" className="text-xs bg-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Unlocked
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{boost.description}</p>
            {isUnlocked && (
              <p className="text-xs text-gray-500 mt-1.5">
                Used {usageCount} time{usageCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
          {!isUnlocked ? (
            <Button
              variant="default"
              size="sm"
              disabled={
                !canBuy || loadingBoost === `superDistributor-${boost.level}`
              }
              onClick={() => handleBuyBoost('superDistributor', boost.level)}
            >
              {loadingBoost === `superDistributor-${boost.level}`
                ? 'Buying...'
                : `Buy for ${boost.cost} points`}
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="bg-green-500 hover:bg-green-600"
              disabled={
                cooldown || actionLoading === `superDistributor-${boost.level}`
              }
              onClick={() => handleAction('superDistributor', boost.level)}
            >
              {actionLoading === `superDistributor-${boost.level}`
                ? 'Distributing...'
                : cooldown
                ? `Cooldown: ${getCooldownRemaining(
                    'superDistributor',
                    boost.level
                  )}`
                : `Distribute ${boost.level * 100} coins`}
            </Button>
          )}
        </div>
      </div>
    );
  };

  // Render a Super Automator boost item
  const renderAutomatorBoost = (boost: any) => {
    const isUnlocked = hasBoost('superAutomator', boost.level);
    const canBuy =
      user.points >= boost.cost &&
      hasPreviousLevel('superAutomator', boost.level);

    // Get last used time info for the automator
    const getLastRunInfo = () => {
      if (!user.boosts) return null;

      const boostData = user.boosts.find(
        (b) => b.type === 'superAutomator' && b.level === boost.level
      );

      if (!boostData || !boostData.lastUsed) return null;

      return formatDistance(new Date(boostData.lastUsed), new Date(), {
        addSuffix: true,
      });
    };

    const lastRunInfo = getLastRunInfo();

    return (
      <div
        key={`automator-${boost.level}`}
        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-md bg-slate-50"
      >
        <div className="flex items-start gap-3">
          <div className="bg-main text-black p-3 rounded-md">{boost.icon}</div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{boost.name}</h4>
              {isUnlocked && (
                <Badge variant="default" className="text-xs bg-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Unlocked
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{boost.description}</p>
          </div>
        </div>

        <div className="mt-3 sm:mt-0">
          {!isUnlocked ? (
            <Button
              variant="default"
              size="sm"
              disabled={
                !canBuy || loadingBoost === `superAutomator-${boost.level}`
              }
              onClick={() => handleBuyBoost('superAutomator', boost.level)}
            >
              {loadingBoost === `superAutomator-${boost.level}`
                ? 'Buying...'
                : `Buy for ${boost.cost} points`}
            </Button>
          ) : (
            <div className="flex flex-col items-end">
              <Badge
                variant="default"
                className="text-xs px-2 py-1 bg-green-500"
              >
                <Rocket className="h-3 w-3 mr-1" />
                Active
              </Badge>
              {isUnlocked && lastRunInfo && (
                <p className="text-xs text-gray-500 mt-1.5">
                  Last run: {lastRunInfo}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render an action boost item
  const renderActionBoost = (name: string, boostDetails: any) => {
    // Check if the boost is available, default to true if not specified
    const isAvailable = boostDetails.available !== false;

    return (
      <div
        key={name}
        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-md bg-slate-50"
      >
        <div className="flex items-start gap-3">
          <div className="bg-main text-black p-3 rounded-md">
            {boostDetails.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{boostDetails.name}</h4>
              {!isAvailable && (
                <Badge
                  variant="default"
                  className="text-xs bg-gray-300 text-gray-700"
                >
                  Coming Soon
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {boostDetails.description}
            </p>
          </div>
        </div>
        <div className="mt-3 sm:mt-0">
          <Button
            variant="default"
            size="sm"
            className={!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
            onClick={() => isAvailable && handleAction(name)}
            disabled={!isAvailable || actionLoading === name || hasBoost(name)}
          >
            {hasBoost(name) ? (
              'Completed'
            ) : actionLoading === name ? (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Processing...</span>
              </div>
            ) : isAvailable ? (
              `Earn ${boostDetails.reward} points`
            ) : (
              'Coming Soon'
            )}
          </Button>
        </div>
      </div>
    );
  };

  // Render the boost items
  const renderBoostItems = () => {
    return (
      <div className="space-y-6">
        <Card className="shadow-md border-2 border-border">
          <CardHeader className="bg-main border-b-2 border-border">
            <CardTitle className="font-heading text-2xl">Game Boosts</CardTitle>
            <CardDescription className="text-gray-800">
              Unlock special features to enhance your gameplay and earn more
              points
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 bg-white pt-6">
            {/* Super Distributor Boosts */}
            <div>
              <h3 className="font-medium text-lg mb-2">Super Distributor</h3>
              <div className="space-y-3">
                {BOOSTS.superDistributor.map(renderDistributorBoost)}
              </div>
            </div>

            {/* Super Automator Boosts */}
            <div>
              <h3 className="font-medium text-lg mb-2">Super Automator</h3>
              <div className="space-y-3">
                {BOOSTS.superAutomator.map(renderAutomatorBoost)}
              </div>
            </div>

            {/* Action Boosts */}
            <div>
              <h3 className="font-medium text-lg mb-2">
                Earn Points by Action
              </h3>
              <div className="space-y-3">
                {renderActionBoost('followX', BOOSTS.followX)}
                {renderActionBoost('rtPost', BOOSTS.rtPost)}
                {renderActionBoost('connectGenesis', BOOSTS.connectGenesis)}
                {renderActionBoost('connectSuperseed', BOOSTS.connectSuperseed)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return renderBoostItems();
}
