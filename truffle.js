const HDWalletProvider = require('truffle-hdwallet-provider')

// Be sure to match this mnemonic with that in Ganache!
const mnemonic = 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'

module.exports = {
  compilers: {
    solc: {
      version: '^0.4.23',
    },
  },
  networks: {
    development: {
      provider() {
        return new HDWalletProvider(mnemonic, 'http://127.0.0.1:8545/', 0, 10)
      },
      network_id: '*',
    },
  },
}
