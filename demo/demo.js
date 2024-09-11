const components = require('../src/index.js')

async function start (alby_sdk, btc_connect, LnurlPay) {
  
  const connectForm = await components.connectForm(alby_sdk, cb)
  const payForm = await components.payForm(LnurlPay)
  
  document.body.append(connectForm)

  function cb (status) {
    if (status === 'connected') document.body.append(payForm)
  }
}


window.start = start