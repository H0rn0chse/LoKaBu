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
		var arr = []

		this._base.accounts.forEach(function(item){
			var obj = {};
			obj.id = item.ID;
			obj.displayName = item.DisplayName;
			obj.owner = item.Owner;

			arr.push(obj);
		})

		return arr;
	}
	
	/**
	 * @return {boolean} False if an error occurred
	 */
	get databaseStatus() {
		return this._base.databaseStatus;
	}

	get databaseInfo() {
		var obj = {}
		obj.ReceiptCount = this._base.databaseInfo.ReceiptCount;
		obj.LineIdList = JSON.parse(this._base.databaseInfo.LineIdList);
		obj.ReceiptIdList = JSON.parse(this._base.databaseInfo.ReceiptIdList);

		return obj;
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
		var arr = []

		this._base.persons.forEach(function(item){
			var obj = {};
			obj.id = item.ID;
			obj.displayName = item.DisplayName;

			arr.push(obj);
		})

		return arr;
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

	get receiptList() {
		return this._base.receiptList;
	}

	get receiptDetail() {
		var receipt = {}
		var obj = this._base.receiptDetail;

		if(obj.length > 0){
			receipt.id = obj[0].ReceiptID;
			receipt.date = obj[0].ReceiptDate;
			receipt.account = obj[0].ReceiptAccount;
			receipt.store = obj[0].ReceiptStore;
			receipt.comment = obj[0].ReceiptComment;
			receipt.lines = [];

			obj.forEach(function(val){
				var line = {};
				line.id = val.LineID;
				line.value = val.LineValue;
				line.billing = val.LineBilling;
				line.typ = val.LineType;
	
				receipt.lines.push(line);
			});
		}else{
			receipt.id = "";
			receipt.date = "";
			receipt.account = "";
			receipt.store = "";
			receipt.comment = "";
			receipt.lines = [];
		}

		return receipt;
	}

	get receiptAnalysis() {
		return this._base.receiptAnalysis;
	}
	
	/**
	 * @typedef {object} settings
	 * @property {number} defaultBillingAccount
	 * @property {number} defaultTyp
	 */
	/**
	 */
	get settings() {
		var obj = {}

		obj.defaultBillingAccount = this._base.settings.Person;
		obj.defaultTyp = this._base.settings.Typ;

		return obj;
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
		var arr = []

		this._base.stores.forEach(function(item){
			var obj = {};
			obj.id = item.ID;
			obj.displayName = item.DisplayName;

			arr.push(obj);
		})

		return arr;
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
		var arr = []

		this._base.types.forEach(function(item){
			var obj = {};
			obj.id = item.ID;
			obj.displayName = item.DisplayName;

			arr.push(obj);
		})

		return arr;
	}
	
	/**
	 * @param {account} account 
	 */
	accounts_add(account){
		this._base.submit_data("accounts", "add", account);
	}

	/**
	 * @param {account} account 
	 */
	accounts_update(account){
		this._base.submit_data("accounts", "update", account);
	}

	/**
	 * @param {person} person 
	 */
	persons_add(person){
		this._base.submit_data("persons", "add", person);
	}

	/**
	 * @param {person} person 
	 */
	persons_update(person){
		this._base.submit_data("persons", "update", person);
	}
	/**
	 * Triggers the update of receiptList based on the filter
	 * @param {filterItem[]} filterList 
	 * @param {String} order 
	 * @param {Number} page 
	 */
	receiptList_filter(filterList, order, page){
		this._base.update_data("receiptList", "", filterList, order, page);
	}

	/**
	 * Triggers the update of receiptDetail based on the id
	 * @param {Number} id 
	 */
	receiptDetail_filter(id){
		this._base.update_data("receiptDetail", "", [("ReceiptID="+id)], "", "0");
	}

	/**
	 * @param {receipt} receipt 
	 */
	receiptDetail_add(receipt){
		this._base.submit_data("receiptDetail", "add", receipt);
	}

	/**
	 * @param {receipt} receipt 
	 */
	receiptDetail_delete(receipt){
		this._base.submit_data("receiptDetail", "delete", receipt);
	}

	/**
	 * @param {receipt} receipt 
	 */
	receiptDetail_update(receipt){
		this._base.submit_data("receiptDetail", "update", receipt);
	}

	/**
	 * Triggers the update of receiptDetail based on the id
	 * @param {filterItem[]} filterList 
	 * @param {String} group 
	 * @param {String} order 
	 */
	receiptAnalysis_filter(filterList, group, order){
		this._base.update_data("receiptAnalysis", group, filterList, order, "");
	}

	/**
	 * @param {settings} settings 
	 */
	settings_set(settings){
		this._base.submit_data("settings", "set", settings);
	}

	/**
	 * @param {store} store 
	 */
	stores_add(store){
		this._base.submit_data("stores", "add", store);
	}

	/**
	 * @param {store} store 
	 */
	stores_update(store){
		this._base.submit_data("stores", "update", store);
	}

	/**
	 * @param {typ} type 
	 */
	types_add(type){
		this._base.submit_data("types", "add", type);
	}
	
	/**
	 * @param {typ} type 
	 */
	types_update(type){
		this._base.submit_data("types", "update", type);
	}

	/**
	 * Validates database objects
	 * @param {string} objectType Type of object
	 * @param {receipt|person[]|account[]|typ[]|store[]|settings} object object or array
	 * @param {{}} tempObject object not globally available
	 */
	validate(objectType, object, tempObject = null){
		var validate = true;

		switch(objectType){
			case "Receipt":
				validate = (object.date == "" || isNaN(parseInt(object.date)) ? false : validate);
				validate = (object.account == "" ? false : validate);
				validate = (object.store == "" ? false : validate);
				validate = (object.lines.length == 0 ? false : validate);
				object.lines.forEach(function(line){
					validate = (line.billing == "" ? false : validate);
					validate = (line.typ == "" ? false : validate);
					validate = (line.value == "" ? false : validate);
				})
				break;
			case "Persons":
				validate = GUI.Helper.uniqueAttribute(object, "displayName") ? validate : false;
				break;
			case "Accounts":
				validate = GUI.Helper.uniqueAttribute(object, "displayName") ? validate : false;

				object.forEach(function(item){
					validate = (typeof tempObject.find(x => x.id === parseInt(item.owner)) === "undefined") ? false : validate;
				});
				break;
			case "Types":
				validate = GUI.Helper.uniqueAttribute(object, "displayName") ? validate : false;
				break;
			case "Stores":
				validate = GUI.Helper.uniqueAttribute(object, "displayName") ? validate : false;
				break;
			case "Settings":
				break;
			default:
				validate = false;
		}

		return validate;
	}

	/**
	 * Returns the supported Types for receiptAnalysis
	 * @returns {typeItem[]}
	 */
	get ReceiptAnalysis_filterTypes(){
		var typeList = [{
			"name":"sortDate",
			"valType":"date",
			"varType":"value"
		},{
			"name":"yID",
			"valType":"number",
			"varType":"value"
		},{
			"name":"yValue",
			"valType":"number",
			"varType":"value"
		},{
			"name":"xTime",
			"valType":"text",
			"varType":"value"
		},{
			"name":"xAccount",
			"valType":"text",
			"varType":"value"
		},{
			"name":"xStore",
			"valType":"text",
			"varType":"value"
		},{
			"name":"xTyp",
			"valType":"text",
			"varType":"value"
		},{
			"name":"xBilling",
			"valType":"text",
			"varType":"value"
		}]

		return typeList;
	}

	/**
	 * Returns the supported Types for receiptList
	 * @returns {typeItem[]}
	 */
	get ReceiptList_filterTypes(){
		var typeList = [{
			"name":"ReceiptID",
			"valType":"number",
			"varType":"value"
		},{
			"name":"ReceiptDate",
			"valType":"date",
			"varType":"value"
		},{
			"name":"ReceiptAccount",
			"valType":"text",
			"varType":"value"
		},{
			"name":"ReceiptStore",
			"valType":"text",
			"varType":"value"
		},{
			"name":"ReceiptComment",
			"valType":"text",
			"varType":"value"
		},{
			"name":"ReceiptValue",
			"valType":"number",
			"varType":"value"
		},{
			"name":"LineTypes",
			"valType":"text",
			"varType":"list"
		},{
			"name":"LinePersons",
			"valType":"text",
			"varType":"list"
		},{
			"name":"LineValues",
			"valType":"number",
			"varType":"list"
		}]

		return typeList;
	}
}