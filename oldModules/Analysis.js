/**
 * Analysis Tab
 */
GUI.Analysis = {};

/**
 * default HTML content
 */
GUI.Analysis.html = "";

/**
 * @typedef {Object} AnalysisTemp
 * @property {Boolean} isWaiting
 * @property {Boolean} initFilter
 * @property {String} sortField
 * @property {String} sortDirection
 * @property {String} groupField
 * @property {String} xField
 * @property {String} yField
 * @property {Filter} filterInstance
 * @property {Function} requestData
 */

/**
 * Tab specific variables
 */
GUI.Analysis.Temp = {
	isWaiting: false,
	initFilter: true,
	sortField: "sortDate",
	sortDirection: "ASC",
	groupField: "xTyp",
	xField: "xTime",
	yField: "ySum",
	filterInstance : {},
	requestData: function(filterList){
		this.isWaiting = true;
		GUI.Analysis.resetTab()

		this.sortField = this.xField == "xTime" ? "sortDate" : this.xField

		let order = "ORDER BY " + this.sortField + " " + this.sortDirection;
		let group = this.groupField == "None" ? this.xField : this.xField + "," + this.groupField;

		database.receiptAnalysis_filter(filterList, group, order);
	}
};

/**
 * Returns a boolean whether this objectType is used in this tab
 * @returns {bool}
 */
GUI.Analysis.isObjectRegistered = function(objectType){
	arr = ["types", "persons", "accounts", "stores", "receiptAnalysis"];
	return arr.includes(objectType);
};

/**
 * Resets Tab to default
 */
GUI.Analysis.resetTab = function(){
	var displayStatus = $("#Analysis").css("display");
	$("#Analysis").replaceWith(GUI.Analysis.html);
	GUI.Analysis.Temp.filterInstance.buildFilter();
	$("#Analysis").css("display", displayStatus);
};

/**
 * Builds Tab with data
 */
GUI.Analysis.build = function(){
	var tH = GUI.Analysis.Temp;

	if(tH.initFilter){
		tH.initFilter = false;
		let defaultFilter = [{
			"name": "yID",
			"valConjunction": "greater",
			"varConjunction": "",
			"value": "0"
		}];

		let parent = function(){return document.getElementById("Analysis_Filter");};
		let submitFilter = tH.requestData.bind(GUI.Analysis.Temp);

		tH.filterInstance = new Filter(parent , submitFilter, database.ReceiptAnalysis_filterTypes, defaultFilter);
		tH.filterInstance.buildFilter();
	}

	if(!tH.isWaiting){
		tH.isWaiting = true;

		tH.filterInstance.applyFilter();
	}else{	
		tH.isWaiting = false;
		xList = ["xTime", "xAccount", "xStore", "xTyp", "xBilling"]
		yList = ["ySum", "yCount"]
		xList.forEach(function(key){
			$("#Analysis_Group").append(new Option(Lang.getText(key), key));
			$("#Analysis_xAxis").append(new Option(Lang.getText(key), key));
		});		
		yList.forEach(function(key){
			$("#Analysis_yAxis").append(new Option(Lang.getText(key), key));
		});
		$("#Analysis_Group").append(new Option(Lang.getText("None"), 'None'));
		$("#Analysis_Group").val(tH.groupField);
		$("#Analysis_xAxis").val(tH.xField);
		$("#Analysis_yAxis").val(tH.yField);

		//Data-Transformation===============================================================
		var data = {};
		data.xLabels = [];
		data.series = [];
		var series = {};

		database.receiptAnalysis.forEach(function(line){
			data.xLabels.push(line[tH.xField]);
			series[line[tH.groupField]] = [];
		});
		data.xLabels = Array.from(new Set(data.xLabels));

		Object.keys(series).forEach(key => {
			obj = {};
			obj.name = key;
			obj.values = new Array(data.xLabels.length).fill(0);
			data.series.push(obj);
		});

		database.receiptAnalysis.forEach(function(line){
			let valueIndex = data.xLabels.indexOf(line[tH.xField]);
			let seriesIndex = data.series.findIndex(xLabels => xLabels.name == line[tH.groupField]);
			if(tH.yField == "ySum"){
				data.series[seriesIndex].values[valueIndex] = parseFloat(line[tH.yField])/100;
			}else{
				data.series[seriesIndex].values[valueIndex] = parseFloat(line[tH.yField]);
			}
			
		});

		//Build-Graph===============================================================
		if(!drawLineGraph("#Analysis_svg", data, $(".tabContent:visible:first").width())){
			console.log("D3-Error: invalid data");
		}
	}
};

/**
 * Adds a new line to a list
 * @param {string} list id of List
 * @returns {{}} new line object
 */
GUI.Analysis.addLine = function(list){
	return {};
};

/**
 * Returns available objects within tab
 * @returns {{}}
 */
GUI.Analysis.read = function(){
	return {};
};

/**
 * Handles tab specific events
 * @param {string} type type of event
 * @param {{}} event event object
 */
GUI.Analysis.eventHandler = function(type, event){
	switch(type){
		case "change":
			//sortSelection
			if($(event.target).parent().is("#Analysis_Sort")){
				GUI.Analysis.Temp.groupField = $("#Analysis_Group").val();
				GUI.Analysis.Temp.xField = $("#Analysis_xAxis").val();
				GUI.Analysis.Temp.yField = $("#Analysis_yAxis").val();

				GUI.Analysis.build();
			}
			break;
		case "resize":
				GUI.Analysis.build();
			break;
	}
};