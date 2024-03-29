// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/materialize.min.css'
import '../stylesheets/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'
import { default as BigNumber } from 'bignumber.js'

// Import our contract artifacts and turn them into usable abstractions.
import maintoken_artifacts from '../../build/contracts/MainToken.json'
import regtoken_artifacts from '../../build/contracts/RegionalToken.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
const MainToken = contract(maintoken_artifacts)
const RegToken = contract(regtoken_artifacts)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account
let regAccounts
let web3Main = new Web3()
let web3Reg = new Web3()
web3Main.setProvider(new web3Main.providers.HttpProvider('http://127.0.0.1:8545'))
web3Reg.setProvider(new web3Reg.providers.HttpProvider('http://127.0.0.1:22000'))
window.App = {

  start: function () {
    // Bootstrap the MetaCoin abstraction for Use.
    MainToken.setProvider(web3Main.currentProvider)
    RegToken.setProvider(web3Reg.currentProvider)
    // Get the initial account balance so it can be displayed.
    web3Main.eth.getAccounts(function (err, accs) {
      if (err != null) {
        window.alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        window.alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]
    })

    // get the accounts from quorum
    web3Reg.eth.getAccounts(function (err, accs) {
      if (err != null) {
        window.alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        window.alert("Couldn't get any accounts! Make sure your Quorum client is configured correctly.")
        return
      }

      regAccounts = accs
    })
    MainToken.deployed().then(function (f) {
      let mtContract = f
      mtContract.totalSupply().then(function(val) {
        $('#mainTotal').text(val.toString());
      })
      mtContract.availableSupply().then(function(val) {
        $('#mainAvailable').text(val.toString());
      })
      let tLock = mtContract.TokenLock({}, { fromBlock: 0, toBlock: 'latest' })
      tLock.watch(function (error, result) {
        if (!error) {
          $('#mainLoader').hide()
          $('#main').append(` <li class="collection-item">${result.args.value} tokens have been locked on the main network</li>`)
        } else {
          console.log(error)
        }
      })
      let tUnlock = mtContract.TokenUnlock({}, { fromBlock: 0, toBlock: 'latest' })
      tUnlock.watch(function (error, result) {
        if (!error) {
          $('#mainLoader').hide()
          $('#main').append(`<li class="collection-item">${result.args.value} tokens have been unlocked
          on the main network</li>`)
        } else {
          console.log(error)
        }
      })
    })
    RegToken.deployed().then(function (f) {
      const regContract = f
      regContract.totalSupply().then(function(val) {
        $('#regTotal').text(val.toString());
      })
      let mint = regContract.Mint({}, { fromBlock: 0, toBlock: 'latest' })
      mint.watch(function (error, result) {
        if (!error) {
          $('#regLoader').hide()
          $('#regional').append(`<li class="collection-item">${result.args.amount} tokens have been minted</li>`)
        } else {
          console.log(error)
        }
      })

      let burn = regContract.Burn({}, { fromBlock: 0, toBlock: 'latest' })
      burn.watch(function (error, result) {
        if (!error) {
          $('#regLoader').hide()
          $('#regional').append(`<li class="collection-item">${result.args.value} tokens have been burned</li>`)
        } else {
          console.log(error)
        }
      })

      let mintFin = regContract.MintFinished({}, { fromBlock: 0, toBlock: 'latest' })
      mintFin.watch(function (error, result) {
        if (!error) {
          $('#regLoader').hide()
          $('#regional').append(`Minting has finished\n`)
        } else {
          console.log(error)
        }
      })
    })
  },
  allocateTokens : function (tokenAmount) {
    const amount = new BigNumber(tokenAmount)
    MainToken.deployed().then(function (main) {
      main.availableSupply().then(function(val) {
        let available = val.minus(amount)
        $('#mainAvailable').text(available.toString());
      })
      return main.lock(tokenAmount, {from: account})
    }).then(function (res) {
      console.log('Lock successful')
    }).catch(function(e) {
      console.log(e)
    })

    RegToken.deployed().then(function (main) {
      main.totalSupply().then(function(val) {
        let total = val.plus(amount)
        $('#regTotal').text(total.toString());
      })
      return main.mint(regAccounts[0].valueOf(), tokenAmount, {from: regAccounts[0]})
    }).then(function (res) {
      console.log('Mint successful')
    }).catch(function(e) {
      console.log(e)
    })
  },
  deallocate : function (tokenAmount) {
    const amount = new BigNumber(tokenAmount)
    MainToken.deployed().then(function (main) {
      main.availableSupply().then(function(val) {
        let available = val.plus(amount)
        $('#mainAvailable').text(available.toString());
      })
      return main.unlock(tokenAmount, {from: account})
    }).then(function (res) {
      console.log('Unlock successful')
    }).catch(function(e) {
      console.log(e)
    })

    RegToken.deployed().then(function (main) {
      main.totalSupply().then(function(val) {
        let total = val.minus(amount)
        $('#regTotal').text(total.toString());
      })
      return main.burn(tokenAmount, {from: regAccounts[0]})
    }).then(function (res) {
      console.log('Burn successful')
    }).catch(function(e) {
      console.log(e)
    })
  }
}

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
// Is there is an injected web3 instance?

  App.start()
})
