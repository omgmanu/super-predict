import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Slider } from '../components/ui/slider';
import { useForm } from 'react-hook-form';
import { Badge } from '../components/ui/badge';

// Type for form values
type FormValues = {
  betSize: number;
  prediction: 'long' | 'short';
};

// Placeholder previous games data - now with 10 items
const previousGames = [
  {
    id: 1,
    date: '2023-06-22 14:30',
    betSize: 300,
    prediction: 'long',
    result: 'win',
    points: 600,
  },
  {
    id: 2,
    date: '2023-06-22 13:15',
    betSize: 200,
    prediction: 'short',
    result: 'loss',
    points: 20,
  },
  {
    id: 3,
    date: '2023-06-22 11:45',
    betSize: 500,
    prediction: 'long',
    result: 'win',
    points: 1000,
  },
  {
    id: 4,
    date: '2023-06-22 10:20',
    betSize: 100,
    prediction: 'short',
    result: 'win',
    points: 200,
  },
  {
    id: 5,
    date: '2023-06-21 16:00',
    betSize: 400,
    prediction: 'long',
    result: 'loss',
    points: 40,
  },
  {
    id: 6,
    date: '2023-06-21 14:45',
    betSize: 300,
    prediction: 'short',
    result: 'win',
    points: 600,
  },
  {
    id: 7,
    date: '2023-06-21 11:30',
    betSize: 200,
    prediction: 'long',
    result: 'win',
    points: 400,
  },
  {
    id: 8,
    date: '2023-06-21 09:15',
    betSize: 500,
    prediction: 'short',
    result: 'loss',
    points: 50,
  },
  {
    id: 9,
    date: '2023-06-20 17:45',
    betSize: 100,
    prediction: 'long',
    result: 'win',
    points: 200,
  },
  {
    id: 10,
    date: '2023-06-20 15:30',
    betSize: 400,
    prediction: 'short',
    result: 'loss',
    points: 40,
  },
];

export function Play() {
  const [ethPrice, setEthPrice] = useState(3475.82);
  const [availableCoins, setAvailableCoins] = useState(1000);

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    defaultValues: {
      betSize: 100,
      prediction: 'long',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    alert(
      `Prediction submitted! Bet: ${data.betSize} coins, Prediction: ${data.prediction}. Waiting 1 minute for results...`
    );
    // In a real implementation, we would start the game timer and call the API
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-heading mb-4">Predict ETH Price</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Make your prediction on ETH price movements in the next minute and
          earn points!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left section - 60% width */}
        <div className="lg:col-span-3">
          <Card className="border-2 border-border shadow-shadow h-full">
            <CardHeader className="bg-main border-b-2 border-border">
              <CardTitle className="font-heading text-2xl">
                Ethereum Price Prediction
              </CardTitle>
              <CardDescription>
                Predict if ETH price will go up (Long) or down (Short) in the
                next minute
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 bg-slate-50">
              <div className="mb-8 text-center">
                <h3 className="text-lg font-medium mb-2">Current ETH Price</h3>
                <div className="text-4xl font-bold">
                  ${ethPrice.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Updated just now
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="betSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bet Size</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Slider
                              min={100}
                              max={500}
                              step={100}
                              value={[field.value]}
                              onValueChange={(value) =>
                                field.onChange(value[0])
                              }
                            />
                            <div className="flex justify-between">
                              <span>100</span>
                              <span className="font-bold">
                                {field.value} coins
                              </span>
                              <span>500</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Your available coins: {availableCoins}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="prediction"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Prediction</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="long" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Long (Price will go up) ↗️
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="short" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Short (Price will go down) ↘️
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Predict
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="border-t-2 py-3 border-border bg-bw flex justify-between items-center">
              <div>
                <span className="text-sm text-muted-foreground">
                  Your current points:{' '}
                </span>
                <span className="font-bold">1,860</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Predictions made:{' '}
                </span>
                <span className="font-bold">5</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Right section - 40% width */}
        <div className="lg:col-span-2">
          <Card className="border-2 border-border shadow-shadow h-full flex flex-col">
            <CardHeader className="bg-main border-b-2 border-border">
              <CardTitle className="font-heading text-2xl">
                Previous Games
              </CardTitle>
              <CardDescription>
                Your prediction history and results
              </CardDescription>
            </CardHeader>
            <CardContent
              className="p-0 overflow-auto flex-grow bg-slate-50"
              style={{ maxHeight: '456px' }}
            >
              <ul className="divide-y divide-border">
                {previousGames.map((game) => (
                  <li key={game.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{game.date}</h3>
                        <p className="text-sm">
                          Bet: {game.betSize} coins • Prediction:{' '}
                          {game.prediction}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge
                          variant={
                            game.result === 'win' ? 'default' : 'neutral'
                          }
                          className="mb-1"
                        >
                          {game.result === 'win' ? 'Won' : 'Lost'}
                        </Badge>
                        <span className="text-sm font-medium">
                          {game.points} points
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="border-t-2 py-3 border-border bg-bw mt-auto">
              <p className="text-sm text-muted-foreground">
                Wins: <span className="font-bold">6</span> • Losses:{' '}
                <span className="font-bold">4</span> • Win rate:{' '}
                <span className="font-bold">60%</span>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Play;
