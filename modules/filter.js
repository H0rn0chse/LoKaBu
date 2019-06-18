/**
 * Representation of a filter
 * @typedef {Object} filterItem
 * @property {String} name
 * @property {String} valConjunction
 * @property {String} varConjunction
 * @property {String\|Number} value
 * 
 */

 /**
 * Representation of a fieldType
 * @typedef {Object} typeItem
 * @property {String} name
 * @property {String} valType
 * @property {String} varType
 * 
 */

/**
 * Represents a filter
 */
class Filter {
	/**
	 * Constructor
	 * @param {Function} parent function which returns the parent element of the filter
	 * @param {Function} submitFilter function which submits the filters via the filterList
	 * @param {typeItem[]} typeList list of supported fields
	 * @param {filterItem[]} filterList list of predefined filters
	 */
	constructor(parent, submitFilter, typeList, filterList = []){
		/** @private */
		this.parent = parent;
		/** @private */
		this.submitFilter = submitFilter;
		/** @private */
		this._typeList = typeList;
		/** @private */
		this._filterList = filterList;
		/** @private */
		this._conjunctionList = {
			"number": ["equal","unequal","greater","smaller"],
			"date": ["equal","unequal","before","after"],
			"text": ["equal","unequal","contains","contains not"],
			"list": ["all","none","at least one"]
		};

		this.buildFilter()
	}

	/**
	 * Adds new empty filter
	 */
	addFilter(){
		
		let defaultFilter = {
			"name": this._typeList[0].name,
			"valConjunction": this._conjunctionList[this._typeList[0].valType][0],
			"varConjunction": "",
			"value": ""
		}
		if(this._typeList[0].varType == "list"){
			defaultFilter.varConjunction = this._conjunctionList["list"][0];
		}

		this._filterList.push(defaultFilter);

		this.buildFilter();
	}

	/**
	 * Removes filter by index
	 * @param {Number} filterIndex 
	 */
	removeFilter(filterIndex){
		this._filterList.splice(filterIndex, 1);
		this.buildFilter();
	}

	/**
	 * Trigger update
	 */
	applyFilter(){
		this.submitFilter(this._filterList);
	}

	/**
	 * Returns the list of filters
	 * @returns {filterItem[]}
	 */
	getFilterList(){
		return this._filterList;
	}

	/**
	 * Builds the html of the filter
	 */
	buildFilter(){
		this.parent().innerHTML = "";
		this.parent().classList.add("filterContainer")
		if(this._filterList.length == 0){
			this.addFilter();
			return;
		}else{
			this._filterList.forEach(function(val, index){
				this.parent().appendChild(this.htmlLine(val, index))
			}.bind(this));
		}
		
		//=======Add=Button=================================================================
		let buAdd = document.createElement("button");
		buAdd.innerText = Lang.getText("add Filter");
		buAdd.onclick = function(e){
			this.addFilter();
		}.bind(this);
		this.parent().appendChild(buAdd);

		//=======Apply=Button=================================================================
		let buApply = document.createElement("button");
		buApply.innerText = Lang.getText("apply Filter");
		buApply.onclick = function(){
			this.applyFilter();
		}.bind(this);
		this.parent().appendChild(buApply);
	}

	htmlLine(filterObj, filterIndex){
		let line = document.createElement("div");

		//========TypeList=Options================================================================
		let typeSelect = document.createElement("select");
		this._typeList.forEach(function(val){
			let typeOption = document.createElement("option");
			typeOption.innerHTML = Lang.getText(val.name);
			typeOption.value = val.name;
			typeSelect.appendChild(typeOption);
		})
		typeSelect.value = filterObj.name;
		typeSelect.onchange = function(e){
			this._filterList[filterIndex].name = e.target.value;
			let valType = this._typeList.find(x => x.name==e.target.value).valType
			this._filterList[filterIndex].valConjunction = this._conjunctionList[valType][0];
			let varType = this._typeList.find(x => x.name==e.target.value).varType
			this._filterList[filterIndex].varConjunction = (varType == "list" ? this._conjunctionList["list"][0] : "");
			this._filterList[filterIndex].value = "";

			this.buildFilter()
		}.bind(this);
		line.appendChild(typeSelect);

		//=======List=Or=Value================================================================
		let varType = this._typeList.find(x => x.name==filterObj.name).varType
		if(varType == "list"){
			var listSelect = document.createElement("select");

			this._conjunctionList["list"].forEach(function(val){
				let listOption = document.createElement("option");
				listOption.innerHTML = Lang.getText(val);
				listOption.value = val;
				listSelect.appendChild(listOption);
			});
			listSelect.value = filterObj.varConjunction;
			listSelect.onchange = function(e){
				this._filterList[filterIndex].varConjunction = e.target.value;
			}.bind(this);
			line.appendChild(listSelect);
		}

		//=======ConjunctionList=Options=================================================================
		let conjunctionSelect = document.createElement("select");
		let valType = this._typeList.find(x => x.name==filterObj.name).valType
		this._conjunctionList[valType].forEach(function(val){
			let conjunctionOption = document.createElement("option");
			conjunctionOption.innerHTML = Lang.getText(val);
			conjunctionOption.value = val;
			conjunctionSelect.appendChild(conjunctionOption);
		});
		conjunctionSelect.onchange = function(e){
			this._filterList[filterIndex].valConjunction = e.target.value;
		}.bind(this);
		conjunctionSelect.value = filterObj.valConjunction;
		line.appendChild(conjunctionSelect);

		//=======Value==================================================================
		let input = document.createElement("input");
		
		//Date
		if(valType == "date"){
			input.setAttribute('type', "text");
			input.setAttribute('name', "Date");
			if(filterObj.value != ""){
				input.value = FormatDate(filterObj.value);
			}
		}else{
			input.setAttribute('type', valType);
			input.value = filterObj.value;
		}

		input.onchange = function(e){
			let value = e.target.value
			switch(valType){
				case "number":
					value = parseInt(value)
					break;
				case "date":
					value = Math.round(new Date(value).getTime()/1000)
					break;
				case "text":
					value = value
					break;
			}
			this._filterList[filterIndex].value = value;
		}.bind(this);
		line.appendChild(input);

		//=======Remove=Button=================================================================
		let buRemove = document.createElement("button");
		buRemove.innerText = "remove";
		buRemove.onclick = function(){
			this.removeFilter(filterIndex)
		}.bind(this);
		line.appendChild(buRemove);

		return line;
	}
}