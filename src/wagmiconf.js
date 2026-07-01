
import { http, createConfig } from '@wagmi/core'
import { injected } from 'wagmi/connectors'


import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  localhost
} from 'wagmi/chains';


// RPC 来源：环境变量 (.env) → 默认 publicnode 公共节点
// Vite 环境变量前缀为 VITE_；CRA 前缀为 REACT_APP_
const env = process.env || {};
const RPC = {
  mainnet:    env.VITE_RPC_MAINNET    || env.REACT_APP_RPC_MAINNET    || 'https://ethereum-rpc.publicnode.com',
  bnb:        env.VITE_RPC_BNB        || env.REACT_APP_RPC_BNB        || 'https://bsc-rpc.publicnode.com',
  polygon:    env.VITE_RPC_POLYGON    || env.REACT_APP_RPC_POLYGON    || 'https://polygon-bor-rpc.publicnode.com',
  optimism:   env.VITE_RPC_OPTIMISM   || env.REACT_APP_RPC_OPTIMISM   || 'https://optimism-rpc.publicnode.com',
  arbitrum:   env.VITE_RPC_ARBITRUM   || env.REACT_APP_RPC_ARBITRUM   || 'https://arbitrum-one-rpc.publicnode.com',
  base:       env.VITE_RPC_BASE       || env.REACT_APP_RPC_BASE       || 'https://base-rpc.publicnode.com',
  sepolia:    env.VITE_RPC_SEPOLIA    || env.REACT_APP_RPC_SEPOLIA    || 'https://ethereum-sepolia-rpc.publicnode.com',
  local:      env.VITE_RPC_LOCAL      || env.REACT_APP_RPC_LOCAL      || 'http://127.0.0.1:8545',
};

const bnbChain = {
  id: 56,
  name: 'BNB Chain',
  network: 'binance',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  rpcUrls: { default: { http: [RPC.bnb] } },
  blockExplorers: { default: { name: 'BscScan', url: 'https://bscscan.com' } },
  testnet: false,
};

const sepoliaChain = {
  id: 11155111,
  name: 'Sepolia',
  network: 'sepolia',
  nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: [RPC.sepolia] } },
  blockExplorers: { default: { name: 'Sepolia Etherscan', url: 'https://sepolia.etherscan.io' } },
  testnet: true,
};

const localChain = {
  id: 31337,
  name: 'Hardhat Local',
  network: 'hardhat',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [RPC.local] },
    public:  { http: [RPC.local] },
  },
  blockExplorers: { default: { name: 'none', url: RPC.local } },
  testnet: true,
};

export const config = createConfig({
  chains: [mainnet, bnbChain, sepoliaChain, polygon, optimism, arbitrum, base, localChain],
  connectors: [
    // injected 覆盖 MetaMask/Rabby 等主流钱包，不需要 coinbaseWallet
    // coinbaseWallet SDK 在 init 时跑 telemetry，浏览器拒绝 inline script 时 reject(undefined)
    // 触发 CRA dev mode "Unknown promise rejection reason" overlay
    injected({ shimDisconnect: true }),
  ],
  transports: {
    [mainnet.id]:  http(RPC.mainnet),
    [bnbChain.id]: http(RPC.bnb),
    [sepoliaChain.id]: http(RPC.sepolia),
    [polygon.id]:  http(RPC.polygon),
    [optimism.id]: http(RPC.optimism),
    [arbitrum.id]: http(RPC.arbitrum),
    [base.id]:     http(RPC.base),
    [localChain.id]: http(RPC.local),
  },
})

// 暴露到 window 方便 E2E 测试
if (typeof window !== 'undefined') {
  window.__wagmiConfig = config;
}