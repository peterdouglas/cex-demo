// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*' // Match any network id
    },
    q1: {
      host: '127.0.0.1',
      port: 22000,
      network_id: '*', // Match any network id
      gasPrice: 0,
      gas: 4500000
    }
  }
}
