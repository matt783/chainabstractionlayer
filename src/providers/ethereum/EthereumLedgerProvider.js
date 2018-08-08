import Provider from '../../Provider'

import Transport from '@alias/ledger-transport'
import LedgerEth from '@ledgerhq/hw-app-eth'

import { networks } from './EthereumUtil'

export default class EthereumLedgerProvider extends Provider {
  constructor (chain = 'ethereum') {
    super()
    this._ledgerEth = false
    this._coinType = networks[chain].coinType
    this._derivationPath = `44'/${this._coinType}'/0'/0'/0`
  }

  async _connectToLedger () {
    if (!this._ledgerEth) {
      const transport = await Transport.create()
      this._ledgerEth = new LedgerEth(transport)
    }
  }

  async _updateDerivationPath (path) {
    this._derivationPath = path
  }

  async getAddresses () {
    await this._connectToLedger()

    const { address } = await this._ledgerEth.getAddress(this._derivationPath)

    return [ address ]
  }

  async signMessage (message, path) {
    await this._connectToLedger()

    const hex = Buffer.from(message).toString('hex')

    return this._ledgerEth.signPersonalMessage(path, hex)
  }
}
