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
	 * @param {typ} type 
	 */
	types_add(type){
		this._base.types_add(type);
	}
	
	/**
	 * @param {typ} type 
	 */
	types_update(type){
		this._base.types_update(type);
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
	 * Transforms data to make it visualizable
	 * @param {string} xAxis 
	 * @param {string} yAxis 
	 * @param {string} groupBy 
	 * @param {{typ:string, value:string}[]} filter 
	 */
	transformData(xAxis, yAxis, groupBy, filter){
		var startDateStamp = 0;
		var endDateStamp = 9999999999;

		var persons = [];
		var accounts = [];
		var stores = [];
		var types = [];

		filter.forEach(function(item, index){
			switch(item.typ){
				case "startDate":
					startDateStamp = item.value;
					break;
				case "endDate":
					endDateStamp = item.value;
					break;
				case "person":
					persons.push(item.value)
					break;
				case "account":
					accounts.push(item.value)
					break;
				case "store":
					stores.push(item.value)
					break;
				case "typ":
					types.push(item.value)
					break;
			}
		});

		var startDate = new Date(startDateStamp*1000);
		var endDate = new Date(endDateStamp*1000);

		var data = {
			series: [],
			xLabels: []
		};

		var dataObject = [];
		database.receipts.forEach(function(receipt){
			if(receipt.date <= startDateStamp || receipt.date > endDateStamp){
				return;
			}
			if(!stores.includes(receipt.store) && stores.length !== 0){
				return;
			}
			receipt.lines.forEach(function(line){
				if((persons.includes(line.billing) || accounts.includes(receipt.account)) || (persons.length === 0 && accounts.length === 0))
				{
					if(types.includes(line.typ) || types.length === 0){
						let d = new Date(receipt.date*1000)
						let str = d.getFullYear() + "-" + ("0" + (d.getMonth()+1)).slice(-2);
						let lineObj = {
							time: str,
							person: database.persons.find(x => x.id === line.billing).displayName,
							account: database.accounts.find(x => x.id === receipt.account).displayName,
							store: database.stores.find(x => x.id === receipt.store).displayName,
							typ: database.types.find(x => x.id === line.typ).displayName,
							value: line.value/100,
							receipt: receipt.id
						};
					dataObject.push(lineObj);
					}
				}
			});
		});

		switch(yAxis){
			case "lineValue":
				dataObject.forEach(function(item, i){
					delete dataObject[i].receipt;
				})
				break;
			case "receiptCount":
				var receiptList = [];
				for (let i = dataObject.length - 1; i >= 0; i -= 1) {
					let item = dataObject[i];
					if(receiptList.includes(item.receipt)){
						dataObject.splice(i, 1);
					}else{
						receiptList.push(item.receipt);
						delete dataObject[i].receipt;
						dataObject[i].value = 1;
					}
				}
				break;
		}
		data.xLabels = [...new Set(dataObject.map(item => item[xAxis]))];

		var groupByList = [...new Set(dataObject.map(item => item[groupBy]))];
		groupByList.forEach(function(item){
			let obj = {
				name: item,
				values: new Array(data.xLabels.length).fill(0)
			}
			data.series.push(obj);
		});

		dataObject.forEach(function(item){
			let i = data.series.findIndex(obj => obj.name === item[groupBy])
			let j = data.xLabels.indexOf(item[xAxis])
			data.series[i].values[j] += item.value;
		});

		return data;
	}
}