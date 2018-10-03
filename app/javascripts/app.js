// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/materialize.min.css'
import '../stylesheets/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'
import { default as BigNumber } from 'bignumber.js'

// Import our contract artifacts and turn them into usable abstractions.
import maintokenArtifacts from '../../build/contracts/MainToken.json'
import rentisTokenArtifacts from '../../build/contracts/RentisToken.json'
import insurelyTokenArtifacts from '../../build/contracts/InsurelyToken.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
const MainToken = contract(maintokenArtifacts)
const RegToken = contract(rentisTokenArtifacts)
const InsToken = contract(insurelyTokenArtifacts)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account
let regAccounts
let insAccounts
let web3Main = new Web3()
let web3Reg = new Web3()
let web3Ins = new Web3()

web3Main.setProvider(new web3Main.providers.HttpProvider('http://127.0.0.1:9545'))
web3Reg.setProvider(new web3Reg.providers.HttpProvider('http://127.0.0.1:9545'))
web3Ins.setProvider(new web3Ins.providers.HttpProvider('http://127.0.0.1:9545'))

window.App = {

  start: function () {
    // Bootstrap the MetaCoin abstraction for Use.
    MainToken.setProvider(web3Main.currentProvider)
    RegToken.setProvider(web3Reg.currentProvider)
    InsToken.setProvider(web3Ins.currentProvider)
    // Get the initial account balance so it can be displayed.
    web3Main.eth.getAccounts(function (err, accs) {
      if (err != null) {
        window.alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        window.alert('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.')
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
        window.alert('Couldn\'t get any accounts! Make sure your Quorum client is configured correctly.')
        return
      }

      regAccounts = accs
    })

    // get the accounts from quorum
    web3Ins.eth.getAccounts(function (err, accs) {
      if (err != null) {
        window.alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        window.alert('Couldn\'t get any accounts! Make sure your Quorum client is configured correctly.')
        return
      }

      insAccounts = accs
    })

    MainToken.deployed().then(function (f) {
      let mtContract = f
      mtContract.totalSupply().then(function (val) {
        $('#mainTotal').text(val.toString())
      })
      mtContract.availableSupply().then(function (val) {
        $('#mainAvailable').text(val.toString())
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
      regContract.totalSupply().then(function (val) {
        $('#regTotal').text(val.toString())
      })
      let mint = regContract.Mint({}, { fromBlock: 0, toBlock: 'latest' })
      mint.watch(function (error, result) {
        if (!error) {
          $('#main').append(`<li class="collection-item">${result.args.amount} Rentis Rewards Tokens have been minted</li>`)
        } else {
          console.log(error)
        }
      })

      let burn = regContract.Burn({}, { fromBlock: 0, toBlock: 'latest' })
      burn.watch(function (error, result) {
        if (!error) {
          $('#main').append(`<li class="collection-item">${result.args.value} Rentis Rewards Tokens have been burned</li>`)
        } else {
          console.log(error)
        }
      })

      let mintFin = regContract.MintFinished({}, { fromBlock: 0, toBlock: 'latest' })
      mintFin.watch(function (error, result) {
        if (!error) {
          $('#main').append(`Rentis minting has finished\n`)
        } else {
          console.log(error)
        }
      })
    })
    InsToken.deployed().then(function (f) {
      const insContract = f
      insContract.totalSupply().then(function (val) {
        $('#insTotal').text(val.toString())
      })
      let mint = insContract.Mint({}, { fromBlock: 0, toBlock: 'latest' })
      mint.watch(function (error, result) {
        if (!error) {
          $('#main').append(`<li class="collection-item">${result.args.amount} Insurely Loyalty Tokens have been minted</li>`)
        } else {
          console.log(error)
        }
      })

      let burn = insContract.Burn({}, { fromBlock: 0, toBlock: 'latest' })
      burn.watch(function (error, result) {
        if (!error) {
          $('#main').append(`<li class="collection-item">${result.args.value} Insurely Loyalty Tokens have been burned</li>`)
        } else {
          console.log(error)
        }
      })

      let mintFin = insContract.MintFinished({}, { fromBlock: 0, toBlock: 'latest' })
      mintFin.watch(function (error, result) {
        if (!error) {
          $('#main').append(`Insurely minting has finished\n`)
        } else {
          console.log(error)
        }
      })
    })
  },
  allocateTokens: function (tokenAmount, allocNet) {
    const amount = new BigNumber(tokenAmount)
    MainToken.deployed().then(function (main) {
      main.availableSupply().then(function (val) {
        let available = val.minus(amount)
        $('#mainAvailable').text(available.toString())
      })
      return main.lock(tokenAmount, { from: account })
    }).then(function (res) {
      console.log('Lock successful')
    }).catch(function (e) {
      console.log(e)
    })

    if (allocNet === 'rentis') {

      RegToken.deployed().then(function (main) {
        main.totalSupply().then(function (val) {
          let total = val.plus(amount)
          $('#regTotal').text(total.toString())
        })
        return main.mint(regAccounts[0].valueOf(), tokenAmount, { from: regAccounts[0] })
      }).then(function (res) {
        console.log('Mint successful')
        $('#revTokenAmount').val("")
      }).catch(function (e) {
        console.log(e)
      })
    } else {
      InsToken.deployed().then(function (main) {
        main.totalSupply().then(function (val) {
          let total = val.plus(amount)
          $('#insTotal').text(total.toString())
        })
        return main.mint(insAccounts[0].valueOf(), tokenAmount, { from: insAccounts[0] })
      }).then(function (res) {
        console.log('Mint successful')
        $('#insTokenAmount').val("")
      }).catch(function (e) {
        console.log(e)
      })
    }
  }
  ,
  deallocate: function (tokenAmount, deallocNet) {

    const amount = new BigNumber(tokenAmount)
    MainToken.deployed().then(function (main) {
      main.availableSupply().then(function (val) {
        let available = val.plus(amount)
        $('#mainAvailable').text(available.toString())
      })
      return main.unlock(tokenAmount, { from: account })
    }).then(function (res) {
      console.log('Unlock successful')
    }).catch(function (e) {
      console.log(e)
    })

    if (deallocNet === 'rentis') {
      RegToken.deployed().then(function (main) {
        main.totalSupply().then(function (val) {
          let total = val.minus(amount)
          $('#regTotal').text(total.toString())
        })
        return main.burn(tokenAmount, { from: regAccounts[0] })
      }).then(function (res) {
        console.log('Burn successful')
        $('#revTokenAmount').val("")
      }).catch(function (e) {
        console.log(e)
      })
    } else {
      InsToken.deployed().then(function (main) {
        main.totalSupply().then(function (val) {
          let total = val.minus(amount)
          $('#insTotal').text(total.toString())
        })
        return main.burn(tokenAmount, { from: insAccounts[0] })
      }).then(function (res) {
        console.log('Burn successful')
        $('#insTokenAmount').val("")
      }).catch(function (e) {
        console.log(e)
      })
    }
  }
}

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
// Is there is an injected web3 instance?
  if (typeof web3 !== 'undefined') {
    console.warn('Using web3 detected from external source like Metamask')
    // Use Mist/MetaMask's provider
    web3Main = new Web3(web3.currentProvider)
  } else {
    console.warn('No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    //window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  }
  App.start()
})
