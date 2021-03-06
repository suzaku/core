/**
 * This is a classic account that can send all his funds or receive any transaction.
 * All outgoing transactions are signed using the any key corresponding to this address.
 */
class BasicAccount extends Account {
    /**
     * @param {BasicAccount} o
     * @returns {BasicAccount}
     */
    static copy(o) {
        if (!o) return o;
        return new BasicAccount(o._balance, o._nonce);
    }

    /**
     * @param {number} [balance]
     * @param {number} [nonce]
     */
    constructor(balance = 0, nonce = 0) {
        super(Account.Type.BASIC, balance, nonce);
    }

    /**
     * @param {SerialBuffer} buf
     * @return {BasicAccount}
     */
    static unserialize(buf) {
        const type = buf.readUint8();
        if (type !== Account.Type.BASIC) throw new Error('Invalid account type');

        const balance = buf.readUint64();
        const nonce = buf.readUint32();
        return new BasicAccount(balance, nonce);
    }

    toString() {
        return `BasicAccount{balance=${this._balance}, nonce=${this._nonce}}`;
    }
    
    /**
     * @param {Transaction} transaction
     * @return {Promise.<boolean>}
     */
    static verifyOutgoingTransaction(transaction) {
        return SignatureProof.verifyTransaction(transaction);
    }

    /**
     * @param {Transaction} transaction
     * @return {Promise.<boolean>}
     */
    static verifyIncomingTransaction(transaction) {
        return Promise.resolve(true); // Accept everything
    }

    /**
     * @param {number} balance
     * @param {number} [nonce]
     * @return {Account|*}
     */
    withBalance(balance, nonce) { 
        return new BasicAccount(balance, typeof nonce === 'undefined' ? this._nonce : nonce);
    }
}
BasicAccount.INITIAL = new BasicAccount(0, 0);
Account.TYPE_MAP.set(Account.Type.BASIC, BasicAccount);
Class.register(BasicAccount);
