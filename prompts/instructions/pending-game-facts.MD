# Pending game facts
While the user is waiting for the game to complete (Game in progress), we'll show some facts about Superseed on the PendingGameState component.

## Display
We are displaying the facts in the PendingGameState one random fact at a time.
We display title, description and the link (open in a new tab).
Each facut is displayed for 6 seconds.
Facts rotate one after another in a sliding effect.

## Facts list
The list is the following:
```
[
  {
    "title": "Ethereum Layer 2 Solution",
    "description": "Superseed operates as a Layer 2 blockchain, built atop Ethereum to improve scalability and performance.",
    "url": "https://docs.superseed.xyz/core-concepts/what-is-superseed"
  },
  {
    "title": "Optimistic Rollup Architecture",
    "description": "Utilizing Optimistic Rollups, Superseed bundles multiple off-chain transactions into single batches for submission to Ethereum, enhancing throughput and reducing fees.",
    "url": "https://docs.superseed.xyz/core-concepts/what-is-superseed"
  },
  {
    "title": "Built on the OP Stack",
    "description": "Superseed leverages the OP Stack, emphasizing simplicity and modularity for a user-friendly and reliable system.",
    "url": "https://docs.superseed.xyz/core-concepts/what-is-superseed"
  },
  {
    "title": "Self-Repaying Loans",
    "description": "The network introduces mechanisms where loans are repaid automatically through protocol-generated fees, including sequencer profits and CDP interest.",
    "url": "https://docs.superseed.xyz/core-concepts/what-is-superseed"
  },
  {
    "title": "Proof-of-Repayment Mechanism",
    "description": "A unique feature where a portion of the native token supply is auctioned daily, with proceeds used to repay loans of Supercollateral users.",
    "url": "https://docs.superseed.xyz/core-concepts/what-is-superseed"
  },
  {
    "title": "Dynamic Repayment Vault",
    "description": "This smart contract channels protocol fees to systematically reduce debt, stabilizing repayment rates for users.",
    "url": "https://docs.superseed.xyz/core-concepts/what-is-superseed"
  },
  {
    "title": "Supercollateral Concept",
    "description": "Superseed's governance token serves as supercollateral, allowing borrowers maintaining a 500% collateralization ratio to secure interest-free loans.",
    "url": "https://docs.superseed.xyz/core-concepts/supercollateral"
  },
  {
    "title": "Fee Utilization for Debt Repayment",
    "description": "Fees from various sources, including sequencer profits and loan interests, are directed towards repaying loans of supercollateral users.",
    "url": "https://docs.superseed.xyz/core-concepts/supercollateral"
  },
  {
    "title": "Overcollateralized Stablecoin",
    "description": "Users can generate a stablecoin by borrowing against assets on the native CDP platform, requiring collateral exceeding 150% of the stablecoin's value.",
    "url": "https://docs.superseed.xyz/core-concepts/what-is-superseed"
  },
  {
    "title": "Initial Token Supply",
    "description": "The Superseed token has a total supply of 10 billion tokens.",
    "url": "https://docs.superseed.xyz/core-concepts/tokenomics"
  },
  {
    "title": "Token Distribution Model",
    "description": "Superseed emphasizes a community-first approach, ensuring widespread participation and long-term sustainability in token allocation.",
    "url": "https://docs.superseed.xyz/core-concepts/tokenomics"
  },
  {
    "title": "Inflation Control",
    "description": "Post CDP platform launch, the protocol introduces a controlled 2% annual inflation rate through the Proof-of-Repayment mechanism.",
    "url": "https://docs.superseed.xyz/core-concepts/tokenomics"
  },
  {
    "title": "MetaMask Integration",
    "description": "Users can add Superseed as a custom network in MetaMask by entering specific network details.",
    "url": "https://docs.superseed.xyz/using-superseed"
  },
  {
    "title": "Sepolia Testnet Details",
    "description": "Superseed's public testnet, Sepolia, has an RPC endpoint at https://sepolia.superseed.xyz and a Chain ID of 53302.",
    "url": "https://docs.superseed.xyz/build-on-superseed/network-information"
  },
  {
    "title": "L1 and L2 Contract Addresses",
    "description": "Superseed provides specific contract addresses for both Layer 1 and Layer 2 on the Sepolia Testnet.",
    "url": "https://docs.superseed.xyz/build-on-superseed/contract-addresses/testnet"
  },
  {
    "title": "Faucet Resources",
    "description": "Developers can access free ETH for testing via multiple faucets, including Alchemy Sepolia Faucet and Quicknode Sepolia Faucet.",
    "url": "https://docs.superseed.xyz/integrations/faucets"
  },
  {
    "title": "Chronicle Oracle Integration",
    "description": "Superseed integrates with Chronicle Protocol, offering over 65 data feeds sourced from Tier 1 primary sources like Coinbase and Binance.",
    "url": "https://docs.superseed.xyz/integrations/oracles"
  },
  {
    "title": "Pyth Network Integration",
    "description": "The Pyth Network provides over 500 high-fidelity price feeds for DeFi applications on Superseed.",
    "url": "https://docs.superseed.xyz/integrations/oracles"
  },
  {
    "title": "Ethereum-Equivalent Environment",
    "description": "Superseed is open-source, permissionless, and Ethereum-equivalent, enabling seamless development with familiar tools.",
    "url": "https://docs.superseed.xyz/core-concepts/what-is-superseed"
  },
  {
    "title": "Developer Tooling Support",
    "description": "The network supports various development tools, including Foundry, Hardhat, and Thirdweb.",
    "url": "https://docs.superseed.xyz"
  },
  {
    "title": "Client Library Compatibility",
    "description": "Superseed is compatible with client libraries like Ethers.js, Viem, and Web3.js.",
    "url": "https://docs.superseed.xyz"
  },
  {
    "title": "Security Focus",
    "description": "The platform emphasizes security, providing resources and guidelines to ensure safe development and usage.",
    "url": "https://docs.superseed.xyz"
  },
  {
    "title": "Community Engagement",
    "description": "Superseed encourages community participation through platforms like Discord and GitHub.",
    "url": "https://docs.superseed.xyz"
  },
  {
    "title": "Brand Kit Availability",
    "description": "A comprehensive brand kit is available for users and developers, ensuring consistent representation of Superseed.",
    "url": "https://docs.superseed.xyz"
  },
  {
    "title": "Transaction Fee Structure",
    "description": "Superseed outlines its transaction fee model, highlighting differences compared to Ethereum.",
    "url": "https://docs.superseed.xyz"
  },
  {
    "title": "Block Explorer Access",
    "description": "Users can explore transactions and blocks via the Superseed Sepolia Testnet block explorer.",
    "url": "https://docs.superseed.xyz/build-on-superseed/network-information"
  },
  {
    "title": "Data Provider Integrations",
    "description": "Superseed collaborates with various data providers to enhance the network's functionality and reliability.",
    "url": "https://docs.superseed.xyz"
  },
  {
    "title": "Bridge Solutions",
    "description": "The platform offers bridging solutions for asset transfers between networks.",
    "url": "https://docs.superseed.xyz"
  }
]
```