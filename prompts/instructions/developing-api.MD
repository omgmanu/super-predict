# Api development
The api is a Hono app (typescript nodejs version) with Redis as persistence layer. It's purpose is to fulfill the client's (React app) requests and the main uses are:
- Authentication & authorization of users with X (Twitter)
- Create & list games
- Distribute coins to users

## Structure guidelines
We structure the routes in a folder called 'routes' and import them in 'main.ts'. The logic of these routes will be in 'services' folder (each route has it's own service file).
We have a special kind of service called AppService that will be used as a singleton and will init at the server start. It will have a static method getInstance and will provide access to serveral key app features like connection to redis client.
In the 'utils' folder we have files grouped by domain of interest and contain methods that are usable across the app and help prevent de code duplication.
In the 'db' folder we have one file that provides helper methods for each entity: User and Game.
We have a .env file that is ignored by git tracking and a .env.example file that is used to outline the needed environment variables.

## Redis as persistence layer (DB)
We use a Redis instance from Upstash and we connect to it with 'ioredis' sdk via connection link.
The AppService provides acces to redis client and it will be used in helper methods from 'db' folder.
We'll have 2 entities (user and game) and since in redis we are storing key - value pairs, we'll compose the keys as `PREFIX:REST_OF_THE_KEY` for better fetching with wildcards. The value of the persisted data will the the stringified json.

### User entity
- key format: 'user:userId'. 
- properties: points (number), + ones from XUser (from @hono/oauth-providers/x)

### Game entity
- key format: 'game:gameId:userId:status'
- properties: id: string, status (string) [settled, pending], userId: (string), startTime: (number), endTime: (number), betAmount: (number), priceAtStart: (number), priceAtEnd: (number), prediction: (string) [long, short]

## Authentication & authorization with X (Twitter)
I will provide the TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET and TWITTER_REDIRECT_URI in .env file.
I will provide SESSION_ENCRYPTION_KEY in .env file.
We use login with X and keep the user authenticated with session provided by 'hono-sessions'. we use a middleware for this.
We have a route prefixed with '/auth' that will handle the authentication. fields: 'profile_image_url', 'username', scope: 'users.read', 'tweet.read'
