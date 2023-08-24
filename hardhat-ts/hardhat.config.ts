require('@nomicfoundation/hardhat-toolbox');

require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.18',
  etherscan: {
    apiKey: {
      'base-mainnet': process.env.ETHERSCAN_API_KEY,
    },
  },
  customChains: [
    {
      network: 'base-mainnet',
      chainId: 8453,
      urls: {
        apiURL: 'https://mainnet.base.org',
        browserURL: 'https://mainnet.base.org',
      },
    },
  ],
  networks: {
    'base-mainnet': {
      url: 'https://mainnet.base.org',
      accounts: [process.env.WALLET_KEY as string],
      gasPrice: 1000000000,
    },
    'base-goerli': {
      url: 'https://goerli.base.org',
      accounts: [process.env.WALLET_KEY as string],
      gasPrice: 1000000000,
    },
    'base-local': {
      url: 'http://localhost:8545',
      accounts: [process.env.WALLET_KEY as string],
    },
  },
  defaultNetwork: 'hardhat',
};
