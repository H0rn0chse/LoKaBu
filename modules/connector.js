/**
 * @global
 * @class connector
 */
class connector {
	constructor(obj) {
		this._base = obj;
	}
	get base() {
		return this._base;
	}
    /**
     * @typedef {object} account
     * @property {int} displayName
     * @property {number} id
     * @property {number} owner
     */
    /**
     * @return {account[]}
     */
	get accounts() {
		return this._base.accounts;
    }
    
    /**
     * @return {boolean} False if an error occurred
     */
	get databaseStatus() {
		return this._base.databaseStatus;
    }
    
    /**
     * @typedef {object} person
     * @property {int} displayName
     * @property {number} id
     */
    /**
     * @return {person[]}
     */
	get persons() {
		return this._base.persons;
    }
    
    /**
     * @typedef receipt
     * @property {number} id
     * @property {number} date
     * @property {number} account
     * @property {string} comment
     * @property {number} store
     * @property {receiptLine[]} lines
    */
    /**
     * @typedef receiptLine
     * @property {number} id
     * @property {number} value
     * @property {number} billing
     * @property {number} typ
    */	
    /**
     * @return {receipt[]}
     */
	get receipts() {
		return this._base.receipts;
    }
    
    /**
     * @typedef {object} settings
     * @property {number} defaultBillingAccount
     * @property {number} defaultTyp
     */
    /**
     * @return {settings}
     */
	get settings() {
		return this._base.settings;
    }
    
    /**
     * @typedef {object} store
     * @property {int} displayName
     * @property {number} id
     */
    /**
     * @return {store[]}
     */
	get stores() {
		return this._base.stores;
    }
    
    /**
     * @typedef {object} typ
     * @property {int} displayName
     * @property {number} id
     */
    /**
     * @return {typ[]}
     */
	get types() {
		return this._base.types;
    }
    
    /**
     * @param {account} account 
     */
    accounts_add(account){
        this._base.accounts_add(account);
    }

    /**
     * @param {account} account 
     */
    accounts_update(account){
        this._base.accounts_update(account);
    }

    /**
     * @param {person} person 
     */
    persons_add(person){
        this._base.persons_add(person);
    }

    /**
     * @param {person} person 
     */
    persons_update(person){
        this._base.persons_update(person);
    }

    /**
     * @param {receipt} receipt 
     */
    receipts_add(receipt){
        this._base.receipts_add(receipt);
    }

    /**
     * @param {receipt} receipt 
     */
    receipts_delete(receipt){
        this._base.receipts_delete(receipt);
    }

    /**
     * @param {receipt} receipt 
     */
    receipts_update(receipt){
        this._base.receipts_update(receipt);
    }

    /**
     * @param {settings} settings 
     */
    settings_set(settings){
        this._base.settings_set(settings);
    }

    /**
     * @param {store} store 
     */
    stores_add(store){
        this._base.stores_add(store);
    }

    /**
     * @param {store} store 
     */
    stores_update(store){
        this._base.stores_update(store);
    }

    /**
     * @param {type} type 
     */
    types_add(type){
        this._base.types_add(type);
    }
    
    /**
     * @param {type} type 
     */
    types_update(type){
        this._base.types_update(type);
    }
}
