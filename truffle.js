// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // Match any network id
      gas: 4500000
    },
    rinkeby: {
        host: '127.0.0.1',
        port: 8545,
        network_id: '4', 
        gas: 4612388,
        //gasPrice: 1,
        from: '0xf01679f083a9539c7fa5271ac7aa67731f78a0af'
      },
    q1: {
      host: '127.0.0.1',
      port: 22000,
      network_id: '*', // Match any network id
      gasPrice: 0,
      gas: 2000000
    }
  }
}
