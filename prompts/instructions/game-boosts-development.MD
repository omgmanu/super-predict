# Game boosts
We have some actions called game boosts that enhances the gameplay and helps users gain more points.

## Types of game boosts:

### Unlock features - costs points to unlock:
- Super distributor (level 1): can distribute 100 coins to all players once every 12h (cost: 4000 points)
- Super distributor (level 2): can distribute 200 coins to all players once every 10h (cost: 10000 points)
- Super distributor (level 3): can distribute 300 coins to all players once every 8h (cost: 25000 points)
- Super automator (level 1): auto play 100 coins every 190 minutes (random prediction) (cost: 5000 points)
- Super automator (level 2): auto play 100 coins every 130 minutes (random prediction) (cost: 14000 points)
- Super automator (level 3): auto play 100 coins every 70 minutes (random prediction) (cost: 34000 points)

### Earn more points by action - get a fixed number of points per action:
- Follow superseed on X (awards 500 points)
- RT post of game submission (awards 800 points)
- Genesis seeders - connect wallet (awards 5000 points)
- Superseed points system - conect wallet (awards a % of those points - TBD)

## Display
These game boosts will be listed on the Play page, under "Start New Game" and "Your Recent Games".
The ones from "Unlock features" have a "Buy boost for X points" button and the ones from "Earn more points by action" have a "Earn X points" button.
For the "Unlock features", if the user does not have enough points, the buy button is disabled.
The "Super distributor" ones also have a "Distribute X points" button (disabled if not bought).

## Rules
Users can have one of each boosts.
When a user buys an "Unlock features" boosts, the points are deducted from his points balance.
For the "Unlock features" we have levels for both "Super distributor" and "Super automator". The rule is that next level is unlocked only if previous one was bought. For example, if an user want to buy "Super distributor (level 2)", he has to buy "Super distributor (level 1)" first.
The rules are enforced and validated on api.

