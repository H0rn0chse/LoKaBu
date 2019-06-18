/**
 * global connector to python and the database
 * @type {connector}
 */
var database = {};

/**
 * GUI object
 */
var GUI = {};

/**
 * QWebChannel object
 * @type {object}
 */
var channel = {};

$(document).ready(function(){
	$(window).focusout(function(event){
		GUI.EventHandler.onfocusout(event);
	});

	$(window).resize(function(){
		GUI.EventHandler.onresize(event);
	});

	$(window).keypress(function(event){
		GUI.EventHandler.onkeypress(event);
	});

	$(window).click(function(event){
		//click on tabLinks
		if(event.target.matches(".tabLinks")){
			Array.from(event.target.classList).forEach(function(item){
				if(item != "tabLinks"){
					switchTab(event.target, item.slice(2, item.length));
				}
			})
		}else{
			GUI.EventHandler.onclick(event);
		}
	});

	var targetNode = document.getElementById("wrapper");
	var config = { childList: true, subtree: true };
	var observer = new MutationObserver(GUI.EventHandler.mutationObserver);
	observer.observe(targetNode, config);

	GUI.New.html = $("#New").prop("outerHTML");
    GUI.Edit.html = $("#Edit").prop("outerHTML");
    GUI.History.html = $("#History").prop("outerHTML");
    GUI.Analysis.html = $("#Analysis").prop("outerHTML");
	GUI.Settings.html = $("#Settings").prop("outerHTML");
	
	initDatePicker()

	channel = new QWebChannel(qt.webChannelTransport, async function (_channel) {
        database = new connector(_channel.objects.database);
		console.log(database)

        database.base.changed.connect(function(objectType){
            if(database.databaseStatus){		
				GUI.EventHandler.ondatabasechange(objectType);
            }else{
                alert("Datenbank Fehler");
            }
		});
		
		GUI.Helper.UpdateAll();

		// Get the element with id="defaultOpen" and click on it
		document.getElementById("defaultOpen").click();
    });
});

/**
 * Initializes datepicker to german
 */
function initDatePicker(){
	( function( factory ) {
		if ( typeof define === "function" && define.amd ) {

			// AMD. Register as an anonymous module.
			define( [ "../widgets/datepicker" ], factory );
		} else {

			// Browser globals
			factory( jQuery.datepicker );
		}
	}( function( datepicker ) {

		datepicker.regional.de = {
			closeText: "Schließen",
			prevText: "&#x3C;Zurück",
			nextText: "Vor&#x3E;",
			currentText: "Heute",
			monthNames: [ "Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember" ],
			monthNamesShort: [ "Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez" ],
			dayNames: [ "Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag" ],
			dayNamesShort: [ "So","Mo","Di","Mi","Do","Fr","Sa" ],
			dayNamesMin: [ "So","Mo","Di","Mi","Do","Fr","Sa" ],
			weekHeader: "KW",
			dateFormat: "mm/dd/yy",
			firstDay: 1,
			isRTL: false,
			showMonthAfterYear: false,
			yearSuffix: "" };
		datepicker.setDefaults( datepicker.regional.de );

		return datepicker.regional.de;

	}));
}

/**
 * Switches between tabs
 * @param {string} element css selector to the element to be marked as active
 * @param {string} tabName name of tab which should be activated
 */
function switchTab(element, tabName){
	/**
	 * iterator
	 * @type {number}
	 */
	var i;
	/**
	 * Array like object, which contains all tab elements
	 * @type {{}[]}
	 */
	var tabContent = document.getElementsByClassName("tabContent");
	/**
	 * Array like object, which contains all tab buttons
	 * @type {{}[]}
	 */
	var tabLinks = document.getElementsByClassName("tabLinks");

	for (i = 0; i < tabContent.length; i++) {
		tabContent[i].style.display = "none";
	}
	for (i = 0; i < tabLinks.length; i++) {
		tabLinks[i].className = tabLinks[i].className.replace(" active", "");
	}
	document.getElementById(tabName).style.display = "inherit";
	$(element).addClass("active")
}

/**
 * Formats a date value to a string
 * @param {number} dateInt timestamp in seconds
 * @returns {string} date with format mm/dd/yyyy
 */
function FormatDate(dateInt){
	/**
	 * Date object of the timestamp
	 * @type {Date}
	 */
	var date = new Date(dateInt*1000);

	/**
	 * number of day
	 * @type {number}
	 */
	var day = date.getDate();
	/**
	 * number of month starting with 1
	 * @type {number}
	 */
	var month = date.getMonth()+1;
	/**
	 * Full year
	 * @type {number}
	 */
	var year = date.getFullYear();

	/**
	 * return string
	 * @type {string}
	 */
	var str = "";
	str += "0".repeat((2-month.toString().length))+month.toString();
	str += "/";
	str += "0".repeat((2-day.toString().length))+day.toString();
	str += "/";
	str += year;

	return str;
}

/**
 * Calculates the difference between account 1 and account 2 (contributed to account 0)
 */
function calcDiff(){
	var a1 = {}; //Julia
	a1.id = 1;
	a1.list = [1,2];
	a1.sum = 0;
	var a2 = {}; //Aaron
	a2.id = 2;
	a2.list = [3,4];
	a2.sum = 0;
	var g = {};
	g.id = 3;
	g.list = [5];

	database.receipts.forEach(function(receipt, i){
		var a;
		if(a1.list.includes(receipt.account)){
			a = a1;
		}else if(a2.list.includes(receipt.account)){
			a = a2;
		}else{
			return;
		}

		receipt.lines.forEach(function(line, i){
			if(g.id === line.billing){
				a.sum += line.value;	
			}else if(a1.id === line.billing && a1.id !== a.id){
				a.sum += line.value;
			}else if(a2.id === line.billing && a2.id !== a.id){
				a.sum += line.value;
			}
		});
	});
	return a1.sum - a2.sum;
}