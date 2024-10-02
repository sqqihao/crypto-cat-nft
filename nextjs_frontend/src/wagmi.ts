import { createConfig, http } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  localhost
} from 'wagmi/chains';

import { walletConnect, coinbaseWallet, injected } from "wagmi/connectors";

import { isProdEnv } from "./data/constant";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw Error("WalletConnect project ID missing.");
}



const bnbChain = {
  id: 56,
  name: 'BNB Chain',
  network: 'binance',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  rpcUrls: { default: 'https://bsc-dataseed.binance.org/' },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://bscscan.com' },
  },
  testnet: false,
};


const localChain = {
  id: 1337,
  name: 'local Chain',
  network: 'local',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: 'http://127.0.0.1:8545/' },
  blockExplorers: {
    default: { name: 'nonono', url: 'https://nonoo.com' },
  },
  testnet: true,
};

// alert(localhost.id)

export const client = createConfig({
  chains: [mainnet ,bnbChain,localChain],
  ssr: true, // If your dApp uses server side rendering (SSR)
  connectors:[],
  transports: {
    [mainnet.id]:  http(''),
    [bnbChain.id]:  http(''),
    [localhost.id]:   http("http://localhost:8545")
  }
});

/*
export const client = createConfig({
  chains: [mainnet,localChain],
  autoConnect: true, 
  
  connectors: [
    injected({ target: "metaMask" }),
    coinbaseWallet({
      appName: "CryptoCats",
    }),
    walletConnect({
      projectId: projectId,
      // metadata: {
      //   name: "加密猫",
      //   description: "加密猫猫!",
      //   url: "https://cat.app/",
      //   icons: ["https://crypto-cats.netlify.app/favicon.ico"],
      // },
    }),
  ],
  
  transports: {
    [mainnet.id]: http(),
    [localhost.id]: http("http://localhost:8545")
  },
  ssr: true,
});
*/
/*
const localChain = {
  id: 31337,
  name: 'local Chain',
  network: 'local',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: 'http://127.0.0.1:8545/' },
  blockExplorers: {
    default: { name: 'nonono', url: 'https://nonoo.com' },
  },
  testnet: true,
};


export const client = createConfig({
  chains: [mainnet,localChain],
  autoConnect: true, 
  connectors: [
    injected({ target: "metaMask" }),
    coinbaseWallet({
      appName: "CryptoCats",
    }),
    walletConnect({
      projectId: projectId,
      // metadata: {
      //   name: "加密猫",
      //   description: "加密猫猫!",
      //   url: "https://cat.app/",
      //   icons: ["https://crypto-cats.netlify.app/favicon.ico"],
      // },
    }),
  ],
  
  transports: {
    [mainnet.id]: http(),
    [localhost.id]: http("http://localhost:8545")
  },
  ssr: true,
});

*/