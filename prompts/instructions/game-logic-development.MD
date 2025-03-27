# Game logic development

## Game rules
Playing a game costs coins and wins points.
Minimum bet is 100 coins.
Maximum bet is 500 coins.
Increment bet is 100 coins.
A won game awards points equal to bet coins multiplied by 2
A lost game awards points equal to bet coins multiplied by 0.1

User's inputs to start a game are bet amount (in points) and the prediction (Long - Greater than or Short - Lower than).

When a game starts, we check the price of ETH at the current timestamp, persist the new game with known informations and status pending. After exactly 60 seconds, we check again the price of ETH and update the game with needed information cu conclude the game (result, status, priceAtEnd).
The game is won if:
 - prediction is 'long' and priceAtStart < priceAtEnd
 - prediction is 'short' and priceAtStart > priceAtEnd

To check the price of ETH at a specific timestamp, we use Hermes (from Pyth) and make a request to https://hermes.pyth.network/v2/updates/price/[TIMESTAMP]?ids%5B%5D=0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace&parsed=true ([TIMESTAMP] example: 1742985943).
Response example:
```
{
  "binary": {
    "encoding": "hex",
    "data": [
      "PAYLOAD.."
    ]
  },
  "parsed": [
    {
      "id": "ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
      "price": {
        "price": "207001450090",
        "conf": "88033236",
        "expo": -8,
        "publish_time": 1742985943
      },
      "ema_price": {
        "price": "206637977000",
        "conf": "91477099",
        "expo": -8,
        "publish_time": 1742985943
      },
      "metadata": {
        "slot": 206494762,
        "proof_available_time": 1742985944,
        "prev_publish_time": 1742985942
      }
    }
  ]
}
```
The price is at parsed[0].price.price (string) and by using the parsed[0].price.expo (move float point to left if negative or to right if positive), we obtain the actual price (in the above example, the actual price is 2070.01450090)

## Implementation

### API
A new route '/game' that has:
- a POST at '/new' to create games: user is taken from context, betAmount and prediction come from POST's body. We return the newly created game to the user as response to the request. Use setTimeout to schedule the game update executed after 60 seconds. System's date is used for timestamps used in requests to get ETH price. If the user has a game in progress (status = 'pending'), he cannot create a new game. 
- a GET at '/:id' to get the game by id. this route returns the game entity and a new property called 'timeLeft' and is the number of seconds left until the 60 seconds elapses (if the status is settled, this property is null)


### Client
After the user submits the game and the response with newly created game is received, the route changes to /game/:id. In this new route, we make a request to api at /game/:id and: 
- if the game is in pending status, a in progress screen with the bet size, prediction, priceAtStart, the current ETH price, a countdown timer in seconds from timeLeft value and the current result (win or loss).
- if the game is in settled status, show a results screen with the bet size, prediction, priceAtStart, priceAtEnd, the result (win or loss) and the amounts of points won.
