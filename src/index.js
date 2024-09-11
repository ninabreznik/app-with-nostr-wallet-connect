module.exports = {
  connectForm,
  payForm,
}

var connectBtn
var payBtn

async function connectForm(alby_sdk, cb) {
  const { webln } = alby_sdk
  const el = document.createElement('div') 
  const shadow = el.attachShadow({ mode: 'closed' })
  if (window.provider?.connected) shadow.innerHTML = `<button>Disconnect</button>`
  else shadow.innerHTML = `
    <div>
      <h1>Account</h1>  
      <div> 
        <h2>Connect your Nostr Wallet Connect</h2>
        <input id="NWC" type="text"/>
        <input id="connect" type="submit" value="Connect Wallet" />
      </div>
    </div>
  `
  const connectNWC = shadow.querySelector('input#connect')
  connectNWC.onclick = async () => {
    if (connectNWC.value === 'Connect Wallet') {
      const addr = shadow.querySelector('input#NWC').value
      const provider = new webln.NostrWebLNProvider({ 
        nostrWalletConnectUrl: addr
      });
      await provider.enable(); // connect to the relay    
      console.log({provider})
      cb('connected')
      window.provider = provider
    }
  }
  // TODO: add other possible connectors
  // https://github.com/getAlby/bitcoin-connect/tree/863b0b3ea249ea14d6282cf5d3e03abaa2cdd6b6/src/connectors
  
  return el
}

async function payForm (LnurlPay) {
  const el = document.createElement('div') 
  const shadow = el.attachShadow({ mode: 'closed' })
  shadow.innerHTML = `
    <div>
      <h1>Payment</h1> 
      <div>
        <h2>Send payment</h2>
        <input id="amount" type="number" min="1"/>
        <input id="pay" type="submit" value="Pay for Task in Sats" />
      </div>
    </div>
  `
  payBtn = shadow.querySelector('input#pay')
  payBtn.onclick = async () => {
    const amount = Number(shadow.querySelector('input#amount').value)
    const { invoice, validatePreimage } = await makeInvoice(amount, LnurlPay)
    const confirmation = await confirmPayment(amount)
    console.log({ confirmation })
    if (!confirmation) return
    // const { balance } = await window.provider.getBalance()
    // if (balance < amount) return console.log('Not enough funds for this payment')
    const payResponse = await window.provider.sendPayment(invoice)
    // check if payment done
    if (validatePreimage(payResponse.preimage)) console.log('yay, payment successful') 
// 
    // const { launchPaymentModal } = btc_connect
    // await launchPaymentModal({
    //   invoice: invoice,
    //   onPaid: ({preimage}) => alert('Paid: ' + preimage), // NOTE: only fired if paid with WebLN - see full api documentation below
    // })

  }
  return el
}

async function makeInvoice (amount, LnurlPay) {
  const { requestInvoice, utils } = LnurlPay
  // const addr = 'npub1gl78n6mkwlm5q2vyng8mq723zrrkackyvtpm8gy9v5l0anut6x7q785jlk@npub.cash'  
  const addr = 'blackdeer7@primal.net'
  // const addr = 'ninjabirdy@zeuspay.com'
  var {
    invoice,
    params,
    rawData,
    successAction,
    hasValidAmount,
    hasValidDescriptionHash,
    validatePreimage, 
  } = await requestInvoice({
    lnUrlOrAddress: addr,
    tokens: amount,
    comment: 'QuestApp Payment'
  })
  console.log({invoice})
  return { invoice, validatePreimage }
}

async function confirmPayment (amount) {
  const { promise, resolve, reject } = Promise.withResolvers()
  const el = document.createElement('div') 
  const shadow = el.attachShadow({ mode: 'closed' })
  shadow.innerHTML = `
    <div>
      Confirm payment of ${amount} sats
      <input id="reject" type="submit" value="Reject" />
      <input id="confirm" type="submit" value="Confirm" />
    </div>
  `

  document.body.append(el)

  const rejectBtn = shadow.querySelector('input#reject')
  rejectBtn.onclick = async (e) => { 
    el.remove()
    resolve(false)
  }
  const confirmBtn = shadow.querySelector('input#confirm')
  confirmBtn.onclick = async (e) => { 
    el.remove()
    resolve(true)
  }

  return promise

}


async function walletConnect (cb) {
  // const {
  //   init,
  //   launchModal,
  //   launchPaymentModal,
  //   requestProvider,
  //   onConnected,
  //   onDisconnected,
  //   onModalClosed
  // } = btc_connect

  // window.btc_connect = btc_connect

  // init({
  //   appName: 'My Lightning App', // your app name
  // });
  
  // // launch modal programmatically
  // await launchModal()

  // events

  // const unsub1 = onConnected(async (provider) => {
  //   window.webln = provider
  //   console.log('connected!!!', provider)
  //   connectBtn.textContent = 'Disconnect'
  //   connectBtn.onclick = async () => {
  //     await launchModal()
  //   }
  //   cb('connected')
  // })

  // const unsub3 = onDisconnected(async () => {
  //   connectBtn.textContent = 'Connect Wallet'
  //   connectBtn.onclick = async () => {
  //     await walletConnect(window.btc_connect)
  //   }
  //   cb('disconnected')
  // });

  
}