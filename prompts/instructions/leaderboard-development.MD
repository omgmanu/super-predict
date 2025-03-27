# Leaderboard development
On the Leaderboard page (/leaderboard on client) we list the players (users) in descending order by points.

## On client
The Leaderboard page (/leaderboard) is a table that lists top 100 players (by points) with the following columns: Rank, User, Points, Games played, Win rate.
The currently logged user is highlighted in the table.
If the currently logged user's rank is lower than 10, a line in the table is visible before all others to showcase user's ranking.


## On api
We have a new route called '/leaderboard' that will return users ordered by points
This is a public route.
Add these new properties on user: 'gamesPlayed' and 'gamesWon'. Set them in completeGame method.