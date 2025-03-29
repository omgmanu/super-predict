import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink } from 'lucide-react';

// Define the fact type
interface Fact {
  title: string;
  description: string;
  url: string;
}

// The list of facts as provided
const superceedFacts: Fact[] = [
  {
    title: "Ethereum Layer 2 Solution",
    description: "Superseed operates as a Layer 2 blockchain, built atop Ethereum to improve scalability and performance.",
    url: "https://docs.superseed.xyz/core-concepts/what-is-superseed"
  },
  {
    title: "Optimistic Rollup Architecture",
    description: "Utilizing Optimistic Rollups, Superseed bundles multiple off-chain transactions into single batches for submission to Ethereum, enhancing throughput and reducing fees.",
    url: "https://docs.superseed.xyz/core-concepts/what-is-superseed"
  },
  {
    title: "Built on the OP Stack",
    description: "Superseed leverages the OP Stack, emphasizing simplicity and modularity for a user-friendly and reliable system.",
    url: "https://docs.superseed.xyz/core-concepts/what-is-superseed"
  },
  {
    title: "Self-Repaying Loans",
    description: "The network introduces mechanisms where loans are repaid automatically through protocol-generated fees, including sequencer profits and CDP interest.",
    url: "https://docs.superseed.xyz/core-concepts/what-is-superseed"
  },
  {
    title: "Proof-of-Repayment Mechanism",
    description: "A unique feature where a portion of the native token supply is auctioned daily, with proceeds used to repay loans of Supercollateral users.",
    url: "https://docs.superseed.xyz/core-concepts/what-is-superseed"
  },
  {
    title: "Dynamic Repayment Vault",
    description: "This smart contract channels protocol fees to systematically reduce debt, stabilizing repayment rates for users.",
    url: "https://docs.superseed.xyz/core-concepts/what-is-superseed"
  },
  {
    title: "Supercollateral Concept",
    description: "Superseed's governance token serves as supercollateral, allowing borrowers maintaining a 500% collateralization ratio to secure interest-free loans.",
    url: "https://docs.superseed.xyz/core-concepts/supercollateral"
  },
  {
    title: "Fee Utilization for Debt Repayment",
    description: "Fees from various sources, including sequencer profits and loan interests, are directed towards repaying loans of supercollateral users.",
    url: "https://docs.superseed.xyz/core-concepts/supercollateral"
  },
  {
    title: "Overcollateralized Stablecoin",
    description: "Users can generate a stablecoin by borrowing against assets on the native CDP platform, requiring collateral exceeding 150% of the stablecoin's value.",
    url: "https://docs.superseed.xyz/core-concepts/what-is-superseed"
  },
  {
    title: "Initial Token Supply",
    description: "The Superseed token has a total supply of 10 billion tokens.",
    url: "https://docs.superseed.xyz/core-concepts/tokenomics"
  },
  {
    title: "Token Distribution Model",
    description: "Superseed emphasizes a community-first approach, ensuring widespread participation and long-term sustainability in token allocation.",
    url: "https://docs.superseed.xyz/core-concepts/tokenomics"
  },
  {
    title: "Inflation Control",
    description: "Post CDP platform launch, the protocol introduces a controlled 2% annual inflation rate through the Proof-of-Repayment mechanism.",
    url: "https://docs.superseed.xyz/core-concepts/tokenomics"
  },
  {
    title: "MetaMask Integration",
    description: "Users can add Superseed as a custom network in MetaMask by entering specific network details.",
    url: "https://docs.superseed.xyz/using-superseed"
  },
  {
    title: "Sepolia Testnet Details",
    description: "Superseed's public testnet, Sepolia, has an RPC endpoint at https://sepolia.superseed.xyz and a Chain ID of 53302.",
    url: "https://docs.superseed.xyz/build-on-superseed/network-information"
  },
  {
    title: "L1 and L2 Contract Addresses",
    description: "Superseed provides specific contract addresses for both Layer 1 and Layer 2 on the Sepolia Testnet.",
    url: "https://docs.superseed.xyz/build-on-superseed/contract-addresses/testnet"
  },
  {
    title: "Faucet Resources",
    description: "Developers can access free ETH for testing via multiple faucets, including Alchemy Sepolia Faucet and Quicknode Sepolia Faucet.",
    url: "https://docs.superseed.xyz/integrations/faucets"
  },
  {
    title: "Chronicle Oracle Integration",
    description: "Superseed integrates with Chronicle Protocol, offering over 65 data feeds sourced from Tier 1 primary sources like Coinbase and Binance.",
    url: "https://docs.superseed.xyz/integrations/oracles"
  },
  {
    title: "Pyth Network Integration",
    description: "The Pyth Network provides over 500 high-fidelity price feeds for DeFi applications on Superseed.",
    url: "https://docs.superseed.xyz/integrations/oracles"
  },
  {
    title: "Ethereum-Equivalent Environment",
    description: "Superseed is open-source, permissionless, and Ethereum-equivalent, enabling seamless development with familiar tools.",
    url: "https://docs.superseed.xyz/core-concepts/what-is-superseed"
  },
  {
    title: "Developer Tooling Support",
    description: "The network supports various development tools, including Foundry, Hardhat, and Thirdweb.",
    url: "https://docs.superseed.xyz"
  },
  {
    title: "Client Library Compatibility",
    description: "Superseed is compatible with client libraries like Ethers.js, Viem, and Web3.js.",
    url: "https://docs.superseed.xyz"
  },
  {
    title: "Security Focus",
    description: "The platform emphasizes security, providing resources and guidelines to ensure safe development and usage.",
    url: "https://docs.superseed.xyz"
  },
  {
    title: "Community Engagement",
    description: "Superseed encourages community participation through platforms like Discord and GitHub.",
    url: "https://docs.superseed.xyz"
  },
  {
    title: "Brand Kit Availability",
    description: "A comprehensive brand kit is available for users and developers, ensuring consistent representation of Superseed.",
    url: "https://docs.superseed.xyz"
  },
  {
    title: "Transaction Fee Structure",
    description: "Superseed outlines its transaction fee model, highlighting differences compared to Ethereum.",
    url: "https://docs.superseed.xyz"
  },
  {
    title: "Block Explorer Access",
    description: "Users can explore transactions and blocks via the Superseed Sepolia Testnet block explorer.",
    url: "https://docs.superseed.xyz/build-on-superseed/network-information"
  },
  {
    title: "Data Provider Integrations",
    description: "Superseed collaborates with various data providers to enhance the network's functionality and reliability.",
    url: "https://docs.superseed.xyz"
  },
  {
    title: "Bridge Solutions",
    description: "The platform offers bridging solutions for asset transfers between networks.",
    url: "https://docs.superseed.xyz"
  }
];

export function FactsCarousel() {
  // Get a random fact to start with
  const getRandomFact = () => {
    return Math.floor(Math.random() * superceedFacts.length);
  };

  const [currentFactIndex, setCurrentFactIndex] = useState(getRandomFact());
  const [nextFactIndex, setNextFactIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Set up interval to change facts every 6 seconds
    const intervalId = setInterval(() => {
      // Get next fact index (different from current one)
      let nextIndex;
      do {
        nextIndex = getRandomFact();
      } while (nextIndex === currentFactIndex);

      // Start animation
      setNextFactIndex(nextIndex);
      setIsAnimating(true);
    }, 6000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [currentFactIndex]);

  const currentFact = superceedFacts[currentFactIndex];
  const nextFact = nextFactIndex !== null ? superceedFacts[nextFactIndex] : null;

  return (
    <div className="relative h-[170px] overflow-hidden rounded-lg bg-slate-50">
      <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
        <Card className={`w-full bg-muted border-border transition-transform duration-500 ease-in-out ${
          isAnimating ? 'translate-x-[-100%]' : 'translate-x-0'
        }`}>
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-lg font-bold">{currentFact.title}</CardTitle>
          </CardHeader>
          <CardContent className="py-1 px-4">
            <p className="text-md text-muted-foreground">{currentFact.description}</p>
          </CardContent>
          <CardFooter className="p-2 px-4 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs flex items-center gap-1 py-1 h-7" 
              onClick={() => window.open(currentFact.url, '_blank')}
            >
              Learn More
              <ExternalLink className="h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {nextFact && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
          <Card className={`w-full bg-muted border-border transition-transform duration-500 ease-in-out ${
            isAnimating ? 'translate-x-0' : 'translate-x-[100%]'
          }`}>
            <CardHeader className="py-2 px-4">
              <CardTitle className="text-lg font-bold">{nextFact.title}</CardTitle>
            </CardHeader>
            <CardContent className="py-1 px-4">
              <p className="text-md text-muted-foreground">{nextFact.description}</p>
            </CardContent>
            <CardFooter className="p-2 px-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs flex items-center gap-1 py-1 h-7" 
                onClick={() => window.open(nextFact.url, '_blank')}
              >
                Learn More
                <ExternalLink className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
} 