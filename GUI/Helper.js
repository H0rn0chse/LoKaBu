/**
 * Help function for tabs
 */
GUI.Helper = {};

/**
 * Empties html content or resets it to tab default
 * @param {{}|string} elem selector of element or element object
 */
GUI.Helper.resetHTML = function(elem){
	if (elem in GUI){
		GUI[elem].build();
	}else{
		$(elem).empty();
	}
}

/**
 * Updates and resets all tabs
 */
GUI.Helper.UpdateAll = function(){
	activeTab = GUI.Helper.getActiveTab().prop("id");

	switchTab($("button .toNew"), "New");
	GUI.New.build();

	switchTab('', "Edit");
	GUI.Edit.build();

	switchTab($("button .toHistory"), "History");
	GUI.History.build();

	switchTab($("button .toAnalysis"), "Analysis");
	GUI.Analysis.build();

	switchTab($("button .toSettings"), "Settings");
	GUI.Settings.build();

	GUI.reservedLineId = [];

	switchTab($("button .to" + activeTab), activeTab);
}

/**
 * Lookup of tab id
 * @param {{}|string} elem selector of element or element object
 * @returns {string} returns tab id as string or undefined
 */
GUI.Helper.getTab = function(elem){
	var tab;
	if($(elem).hasClass("tabContent")){
		tab = $(elem).prop("id");
	}else{
		tab = $(elem).closest(".tabContent").prop("id");
	}
	return tab;
}

/**
 * Returns list tab names
 * @returns {string[]} list of tab names
 */
GUI.Helper.getTabList = function(){
	return ["New", "Edit", "History", "Settings", "Analysis"];
}

/**
 * Fills dropdown with list
 * @param {{}|string} elem selector of element or element object
 * @param {object} list
 * @param {{}|string} list.id
 * @param {string} list.displayName
 */
GUI.Helper.fillDropdown = function(elem, list){
   var elems = $(elem);
   $.each(elems, function(i, elem){
	   $(elem).empty();
	   $.each(list, function(key, val) {
		   $(elem).append("<option value='" + val.id + "'>" + val.displayName + "</option>");
	   });
	   $(elem).html($(elem).find("option").sort(function (a, b) {
		   return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
	   }))
   });
}

/**
 * Returns a jqueryobject of the next container in the hierachy
 * @param {{}|string} elem selector of element or element object
 * @returns {{}}
 */
GUI.Helper.getContainer = function(elem){
	var obj = $(elem).closest(".flexLineContainer");

	if(obj.hasClass("tabContent")){
		obj = $(elem).closest(".flexLine").prev(".flexLineContainer");
	}
	return obj;
}

/**
 * Returns active tab
 * @returns {{}}
 */
GUI.Helper.getActiveTab = function(){
	return $(".tabContent:visible").first();
}

/**
 * List of temporary rserved id for receipt lines
 * @type {number[]}
 */
GUI.Helper.reservedLineId = [];

/**
 * Returns the next available id for receipt lines
 * @param {number} id
 * @returns {number}
 */
GUI.Helper.nextLineId = function(id=0){
	var arr = [];
		database.receipts.forEach(function(receipt){
			if(receipt.id != id){
				receipt.lines.forEach(function(line){
					arr.push({"id":line.id});
				});
			}
		});
	
		id = GUI.Helper.nextUniqueId(arr, "id", GUI.Helper.reservedLineId);
		GUI.Helper.reservedLineId.push(id);
		return id;
	}

/**
 * Returns the next available id for receipt lines
 * @param {{id:number}[]} obj
 * @param {string} id Id of the unique id
 * @param {number[]} reserved Array of reserved ids
 * @returns {number}
 */
GUI.Helper.nextUniqueId = function(obj, id, reserved=[]){
	next = 1;
	arr = []
	obj.forEach(function(elem){
		arr.push(parseInt(elem[id]));
	});
	arr.sort(function(a,b) {
		return a - b;
	});
	while(arr.includes(next) || reserved.includes(next)){
		next = next + 1;
	}
	return next;
}

/**
 * Checks weather objects are equal or not
 * @param {{}} a object a
 * @param {{}} b object b
 * @returns {boolean}
 */
GUI.Helper.isEquivalent = function(a, b){
	// Create arrays of property names
	/**
	 * List with property names of object a
	 * @type {string[]}
	 */
	var aProps = Object.getOwnPropertyNames(a);
	/**
	 * List with property names of object a
	 * @type {string[]}
	 */
	var bProps = Object.getOwnPropertyNames(b);

	// If number of properties is different, objects are not equivalent
	if (aProps.length != bProps.length) {
		return false;
	}

	for (var i = 0; i < aProps.length; i++) {
		/**
		 * common property name
		 * @type {string}
		 */
		var propName = aProps[i];

		// If values of same property are not equal, objects are not equivalent
		if (a[propName] !== b[propName]) {
			return false;
		}
	}

	return true;
}

/**
 * Checks the uniquness of an field in an array of objects
 * @param {{id:}[]} arr
 * @param {string} field
 * @returns {boolean}
 */
GUI.Helper.uniqueAttribute = function(arr, field){
var unique = true
var dict = {};
arr.forEach(function(item){
   if(dict.hasOwnProperty(item[field])){
	   unique = false;
   }else{
	   dict[item[field]] = 1;
   }
});
return unique;
}

/**
 * Evaluates formulas or numbers into an object
 * @param {string} val input string containing a number or formula
 * @return {{val: Number, val2: Number, isNaN: Boolean}}
 */
GUI.Helper.evalValueInput = function(val){
	var obj = {};

	val = val.replace(/,/g,".");
	val = val.replace(/[^-()\d/*+.]/g, "");

	obj.val2 = parseInt(Math.trunc(parseFloat((parseFloat(eval(val))*100).toFixed(2))));
	obj.val = obj.val2/100;
	obj.isNaN = false;

	if(isNaN(obj.val)){
		obj.val = 0;
		obj.val2 = 0;
		obj.isNaN = true;
	}
	return obj;
}