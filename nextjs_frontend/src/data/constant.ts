// export const isProdEnv = process.env.NODE_ENV === "production";
export const isProdEnv = false; // Bypass Netlify prod deployment

export const SUPPORTED_CHAIN = {
  mainnet: 1,
  testnet: 11155111,
};



// CatContract deployed to:  0x5FbDB2315678afecb367f032d93F642f64180aa3
// Marketplace deployed to:  0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512



// Sepolia Testnet
export const CAT_CONTRACT_ADD_TEST: `0x${string}` = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";
export const MARKETPLACE_CONTRACT_ADD_TEST: `0x${string}` = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";

// Ethereum Mainnet
export const CAT_CONTRACT_ADD: `0x${string}` = "0x";
export const MARKETPLACE_CONTRACT_ADD: `0x${string}` = "0x";

export const getContractAddresses = () => {
  if (isProdEnv) {
    return {
      catAddress: CAT_CONTRACT_ADD,
      marketplaceAddress: MARKETPLACE_CONTRACT_ADD,
    };
  } else
    return {
      catAddress: CAT_CONTRACT_ADD_TEST,
      marketplaceAddress: MARKETPLACE_CONTRACT_ADD_TEST,
    };
};

export const getChain = (): number => {
  if (isProdEnv) {
    return SUPPORTED_CHAIN.mainnet;
  } else {
    return SUPPORTED_CHAIN.testnet;
  }
};
