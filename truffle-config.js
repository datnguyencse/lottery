const { projectId, mnemonic, api_key } = require('./secrets.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    kovan: {
      provider: function() {
        return new HDWalletProvider(mnemonic, `https://kovan.infura.io/v3/${projectId}`);
      },
      network_id: '42',
    }
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: api_key
  },
  compilers: {
    solc: {
      version: "^0.8.0",
    }
  }
};
