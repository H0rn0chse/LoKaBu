		/**
		 * global connector to python and the database
		 * @type {connector}
		 */
		var database = {};

		/**
		 * global backup strings for resetting the gui
		 * @type {{New : String, Edit : String, History : String, Analysis : String, Settings : String}}
		 */
		var html = {};

		/**
		 * QWebChannel object
		 * @type {object}
		 */
		var channel = {};

		function initGlobals(){
			
			// Get the element with id="defaultOpen" and click on it
			document.getElementById("defaultOpen").click();

			html.New = $("#New").prop("outerHTML");
			html.Edit = $("#Edit").prop("outerHTML");
			html.History = $("#History").prop("outerHTML");
			html.Analysis = $("#Analysis").prop("outerHTML");
			html.Settings = $("#Settings").prop("outerHTML");

			initDatePicker()

			channel = new QWebChannel(qt.webChannelTransport, async function (_channel) {
				database = new connector(await _channel.objects.database);
				//console.log(database)
				fillData();
				initFormat();
			});
		}
		function initDatePicker(){
			/**
			 * @type {connector}
			 */
			var test = new connector(database);
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
					monthNames: [ "Januar","Februar","März","April","Mai","Juni",
					"Juli","August","September","Oktober","November","Dezember" ],
					monthNamesShort: [ "Jan","Feb","Mär","Apr","Mai","Jun",
					"Jul","Aug","Sep","Okt","Nov","Dez" ],
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
		
		function switchTab(element, tabName){
			var i, tabContent, tabLinks;
			tabContent = document.getElementsByClassName("tabContent");
			for (i = 0; i < tabContent.length; i++) {
				tabContent[i].style.display = "none";
			}
			tabLinks = document.getElementsByClassName("tabLinks");
			for (i = 0; i < tabLinks.length; i++) {
				tabLinks[i].className = tabLinks[i].className.replace(" active", "");
			}
			document.getElementById(tabName).style.display = "inherit";
			$(element).addClass("active")
		}

		function isEquivalent(a, b) {
			// Create arrays of property names
			var aProps = Object.getOwnPropertyNames(a);
			var bProps = Object.getOwnPropertyNames(b);

			// If number of properties is different,
			// objects are not equivalent
			if (aProps.length != bProps.length) {
				return false;
			}

			for (var i = 0; i < aProps.length; i++) {
				var propName = aProps[i];

				// If values of same property are not equal,
				// objects are not equivalent
				if (a[propName] !== b[propName]) {
					return false;
				}
			}

			// If we made it this far, objects
			// are considered equivalent
			return true;
		}

		function FormatDate(dateInt){
			var date = new Date(dateInt*1000);

			var day = date.getDate();
			var month = date.getMonth()+1;
			var year = date.getFullYear();

			var str = "";
			str += "0".repeat((2-month.toString().length))+month.toString();
			str += "/";
			str += "0".repeat((2-day.toString().length))+day.toString();
			str += "/";
			str += year;

			return str;
		}

		function initFormat(){
			//remove format event listener
			$("*").off(".format");

			//=  Date  =====================================================================
			elems = $("[name=Date]");
			$.each(elems, function(i, elem){
				$(elem).datepicker();
			});

			//=  #New_Lines Value  ================================================================
			elems = $("#New_Lines [name=Value]");
			$.each(elems, function(i, elem){
				$(elem).on("focusout.format", function(){
					
					elems = $("#New_Lines [name=Value]");
					$("#New_Result").text(0.0);
					let res = 0;
					$.each(elems, function(i, elem){
						
						if(evalValueInput($(elem).val()).isNaN){
							$(elem).css("background-color", "orangered");
						}else{
							$(elem).css("background-color", "");
						}

						res = res + evalValueInput($(elem).val()).val
					});
					res = Math.trunc(parseFloat((res*100).toFixed(2)))/100
					$("#New_Result").text(res);
				});
				$(elem).on('keypress.format',function(e) {
					if(e.which == 13) {
						addLine('New_Lines');
					}
				});
			});

			//=  #Edit_Lines Value  ================================================================
			elems = $("#Edit_Lines [name=Value]");
			$.each(elems, function(i, elem){
				$(elem).on("focusout.format", function(){
					
					elems = $("#Edit_Lines [name=Value]");
					$("#Edit_Result").text(0.0);
					let res = 0;
					$.each(elems, function(i, elem){

						if(evalValueInput($(elem).val()).isNaN){
							$(elem).css("background-color", "orangered");
						}else{
							$(elem).css("background-color", "");
						}

						res = res + evalValueInput($(elem).val()).val
					});
					res = Math.trunc(parseFloat((res*100).toFixed(2)))/100
					$("#Edit_Result").text(res);
				});
				$(elem).on('keypress.format',function(e) {
					if(e.which == 13) {
						addLine('Edit_Lines');
					}
				});
			});
		}

		function evalValueInput(val){
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

		function fillData(list = ["New", "History", "Analysis", "Settings"]){
			list.forEach(function(entry){
				//=  New Tab  ===================================================================
				if(entry == "New"){
					fillDropdown("#New_Account", database.accounts);
					fillDropdown("#New .BillingAccount", database.persons)
					$("#New .BillingAccount").val(database.settings.defaultBillingAccount);
					fillDropdown("#New .Typ", database.types);
					fillDropdown("#New_Store", database.stores);
					$("#New_Store").val(1);
					$("#New .Typ").val(database.settings.defaultTyp)
				}

				//=  Edit Tab  ===================================================================
				if(entry == "Edit"){
					var receiptId = $("#Edit [name=ID]").val();
					var receipt = database.receipts.find(x => x.id === parseInt(receiptId));
					$("#Edit").replaceWith(html.Edit);
					fillDropdown("#Edit_Account", database.accounts);
					fillDropdown("#Edit_Store", database.stores);
					

					$("#Edit [name=ID]").val(receiptId);
					$("#Edit_Account").val(receipt.account);
					$("#Edit_Store").val(typeof receipt.store === "undefined" ? 1 : receipt.store);
					$("#Edit [name=Date]").val(FormatDate(receipt.date));
					$("#Edit_Comment").val(receipt.comment);

					$("#Edit_Lines").empty();
					receipt.lines.forEach(function(item){
						addLine("Edit_Lines");
						$("#Edit [name=Value]:last").val(parseFloat(item.value)/100);
						$("#Edit .Typ:last").val(item.typ);
						$("#Edit .BillingAccount:last").val(item.billing);
					});
				}

				//=  History Tab  ================================================================
				if(entry == "History"){
					$("#History_Receipts").empty();
					database.receipts.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0)); 
					for(var i=database.receipts.length - 1; i >= 0; i--){
						var item = database.receipts[i];
						var newLine = $($.parseHTML(html.History)).find("#History_Receipts").children().last();
						$("#History_Receipts").append(newLine);

						$(newLine).find("[name=ID]").val(item.id);
						$(newLine).find("[name=Date]").val(FormatDate(item.date));
						$(newLine).find("[name=Account]").val(database.accounts.find(x => x.id === parseInt(item.account)).displayName);
						var sum = 0;
						item.lines.forEach(function(i){
							sum += i.value;
						});
						$(newLine).find("[name=Value]").val(parseFloat(sum)/100);
					}
				}

				//=  Analysis Tab  ================================================================
				if(entry == "Analysis"){
					let val = calcDiff()/100;
					if(val > 0){
						$("#Analysis_Result").text("Ergebnis: Aaron schuldet Julia " + val + "€");
					}else if(val < 0){
						$("#Analysis_Result").text("Ergebnis: Julia schuldet Aaron" + -val + "€");
					}else{
						$("#Analysis_Result").text("Ergebnis: Alles ausgeglichen.");
					}
					redrawSvg();
				}

				//=  Settings Tab  ================================================================
				if(entry == "Settings"){
					fillDropdown("#Settings .BillingAccount", database.persons);
					$("#Settings .BillingAccount").val(database.settings.defaultBillingAccount);
					fillDropdown("#Settings .Typ", database.types);
					$("#Settings .Typ").val(database.settings.defaultTyp);

					$("#Settings_Persons").empty();
					database.persons.forEach(function(item){
						var newLine = $($.parseHTML(html.Settings)).find("#Settings_Persons").children().last();
						$("#Settings_Persons").append(newLine);

						$(newLine).find("[name=ID]").val(item.id);
						$(newLine).find("[name=DisplayName]").val(item.displayName);
					});
					$("#Settings_Accounts").empty();
					database.accounts.forEach(function(item){
						var newLine = $($.parseHTML(html.Settings)).find("#Settings_Accounts").children().last();
						$("#Settings_Accounts").append(newLine);

						$(newLine).find("[name=ID]").val(item.id);
						$(newLine).find("[name=DisplayName]").val(item.displayName);
						$(newLine).find("[name=Owner]").val(item.owner);
					});
					$("#Settings_Types").empty();
					database.types.forEach(function(item){
						var newLine = $($.parseHTML(html.Settings)).find("#Settings_Types").children().last();
						$("#Settings_Types").append(newLine);

						$(newLine).find("[name=ID]").val(item.id);
						$(newLine).find("[name=DisplayName]").val(item.displayName);
					});
					$("#Settings_Stores").empty();
					database.stores.forEach(function(item){
						var newLine = $($.parseHTML(html.Settings)).find("#Settings_Stores").children().last();
						$("#Settings_Stores").append(newLine);

						$(newLine).find("[name=ID]").val(item.id);
						$(newLine).find("[name=DisplayName]").val(item.displayName);
					});
				}
			})
		}

		function fillDropdown(selector, list){
			var elems = $(selector);
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

		function addLine(elemId){
			var parent = $("#"+elemId).parent().closest("div").first().prop("id");
			var newElem = $($.parseHTML(html[parent])).find("#"+elemId).children().last();
			var lastElem = $("#"+elemId).children().last()
			//newElem.insert(lastElem);
			$("#"+elemId).append(newElem);

			fillDropdown("#"+elemId+" .BillingAccount:last", database.persons);
			fillDropdown("#"+elemId+" .Typ:last", database.types);
			

			//empty inputs
			$("#"+elemId).children().last().find(":input").val("");
			//select dropdown option
			$("#"+elemId+" .BillingAccount:last").val(database.settings.defaultBillingAccount);
			$("#"+elemId+" .Typ:last").val(database.settings.defaultTyp);
			$("#"+elemId).children().last().find(":input").focus();
			
			initFormat();
		}

		function removeLine(elem){
			var parent = $(elem).parent()

			if(parent.parent().children().length > 1){
				parent.remove();
			}
		}

		function resetHTML(elemId){
			if (elemId in html){
				$("#"+elemId).replaceWith(html[elemId]);
				fillData([elemId]);
				initFormat();
			}else{
				$("#"+elemId).empty();
			}
		}

		function saveSettings(){
			var validate = true;
			var persons = []
			$.each($("#Settings_Persons").children(),function(i, elem){
				var person = {};
				person.id = parseInt($(elem).find("[name=ID]").val());
				person.displayName = $(elem).find("[name=DisplayName]").val();
				persons.push(person);
			});

			var accounts = []
			$.each($("#Settings_Accounts").children(),function(i, elem){
				var account = {};
				account.id = parseInt($(elem).find("[name=ID]").val());
				account.displayName = $(elem).find("[name=DisplayName]").val();
				account.owner = parseInt($(elem).find("[name=Owner]").val());
				accounts.push(account);
			});

			var types = []
			$.each($("#Settings_Types").children(),function(i, elem){
				var typ = {};
				typ.id = parseInt($(elem).find("[name=ID]").val());
				typ.displayName = $(elem).find("[name=DisplayName]").val();
				types.push(typ);
			});

			var stores = []
			$.each($("#Settings_Stores").children(),function(i, elem){
				var store = {};
				store.id = parseInt($(elem).find("[name=ID]").val());
				store.displayName = $(elem).find("[name=DisplayName]").val();
				stores.push(store);
			});

			validate = uniqueAttribute(persons, "id") ? validate : false;
			validate = uniqueAttribute(persons, "displayName") ? validate : false;

			validate = uniqueAttribute(accounts, "id") ? validate : false;
			validate = uniqueAttribute(accounts, "displayName") ? validate : false;

			validate = uniqueAttribute(types, "id") ? validate : false;
			validate = uniqueAttribute(types, "displayName") ? validate : false;

			validate = uniqueAttribute(stores, "id") ? validate : false;
			validate = uniqueAttribute(stores, "displayName") ? validate : false;
			
			//all owner in persons?
			accounts.forEach(function(item){
				validate = (typeof persons.find(x => x.id === parseInt(item.owner)) === "undefined") ? false : validate;
			});

			if(validate){
				if(confirm("Abschicken?")){
					//settings.defaultBillingAccount = $("#Settings .BillingAccount").val();
					//settings.defaultTyp = $("#Settings .Typ").val();
					database.settings_set({
						"defaultBillingAccount": $("#Settings .BillingAccount").val(),
						"defaultTyp": $("#Settings .Typ").val()
					});
					database.base.changed.connect(function(){
						if(database.databaseStatus){
							fillData();
							initFormat();
						}else{
							alert("Datenbank Fehler");
						}
						database.base.changed.disconnect(this);
					});
					
					persons.forEach(function(person, i){
						persond = database.persons.find(x => x.id == person.id);
						if(typeof persond === "undefined"){
							database.persons_add(person);
							database.base.changed.connect(function(){
								if(database.databaseStatus){
									fillData();
									initFormat();
								}else{
									alert("Datenbank Fehler");
								}
								database.base.changed.disconnect(this);
							});
						}else if(!isEquivalent(persond, person)){
							database.persons_update(person);
							database.base.changed.connect(function(){
								if(database.databaseStatus){
									fillData();
									initFormat();
								}else{
									alert("Datenbank Fehler");
								}
								database.base.changed.disconnect(this);
							});
						}
					});

					accounts.forEach(function(account, i){
						accountd = database.accounts.find(x => x.id == account.id);
						if(typeof accountd === "undefined"){
							database.accounts_add(account);
							database.base.changed.connect(function(){
								if(database.databaseStatus){
									fillData();
									initFormat();
								}else{
									alert("Datenbank Fehler");
								}
								database.base.changed.disconnect(this);
							});
						}else if(!isEquivalent(accountd, account)){
							database.accounts_update(account);
							database.base.changed.connect(function(){
								if(database.databaseStatus){
									fillData();
									initFormat();
								}else{
									alert("Datenbank Fehler");
								}
								database.base.changed.disconnect(this);
							});
						}
					});

					types.forEach(function(typ, i){
						typd = database.types.find(x => x.id == typ.id);
						if(typeof typd === "undefined"){
							database.types_add(typ);
							database.base.changed.connect(function(){
								if(database.databaseStatus){
									fillData();
									initFormat();
								}else{
									alert("Datenbank Fehler");
								}
								database.base.changed.disconnect(this);
							});
						}else if(!isEquivalent(typd, typ)){
							database.types_update(typ);
							database.changed.connect(function(){
								if(database.base.databaseStatus){
									fillData();
									initFormat();
								}else{
									alert("Datenbank Fehler");
								}
								database.base.changed.disconnect(this);
							});
						}
					});

					stores.forEach(function(store, i){
						stored = database.stores.find(x => x.id == store.id);
						if(typeof stored === "undefined"){
							database.stores_add(store);
							database.base.changed.connect(function(){
								if(database.databaseStatus){
									fillData();
									initFormat();
								}else{
									alert("Datenbank Fehler");
								}
								database.base.changed.disconnect(this);
							});
						}else if(!isEquivalent(stored, store)){
							database.stores_update(store);
							database.base.changed.connect(function(){
								if(database.databaseStatus){
									fillData();
									initFormat();
								}else{
									alert("Datenbank Fehler");
								}
								database.base.changed.disconnect(this);
							});
						}
					});
					
					fillData();
					initFormat();
				}	
			}else{
				alert("Eingabefehler")
			}
		}

		function addReceipt(){
			var receipt = {};

			var validate = true

			receipt.id = nextUniqueId(database.receipts, "id");
			receipt.date = Math.round(new Date($("#New [name=Date]").first().val()).getTime()/1000);
			receipt.account = parseInt($("#New_Account").val());
			receipt.store = parseInt($("#New_Store").val());
			receipt.comment = $("#New_Comment").val()
			receipt.lines = [];

			$.each($("#New_Lines").children(), function(i, elem){
				var line = {};

				line.id = nextLineId();
				line.billing = parseInt($(elem).find(".BillingAccount").val());
				line.typ = parseInt($(elem).find(".Typ").val());
				line.value = parseInt(evalValueInput($(elem).find("[name=Value]").val()).val2);

				receipt.lines.push(line);
			});

			//=  Validation  ==================================================================
			validate = (receipt.date == "" || isNaN(parseInt(receipt.date)) ? false : validate);
			validate = (receipt.account == "" ? false : validate);
			validate = (receipt.store == "" ? false : validate);
			validate = (receipt.lines.length == 0 ? false : validate);
			receipt.lines.forEach(function(line){
				validate = (line.billing == "" ? false : validate);
				validate = (line.typ == "" ? false : validate);
				validate = (line.value == "" ? false : validate);
			})

			if(validate){
				if(confirm("Abschicken?")){
					database.receipts_add(receipt);
					database.base.changed.connect(function(){
						if(database.databaseStatus){
							reservedLineId = [];
						
							$("#New").replaceWith(html.New);
							fillData(["New", "History", "Analysis"]);
							initFormat();
						}else{
							alert("Datenbank Fehler");
						}
						database.base.changed.disconnect(this);
					});
				}
			}else{
				alert("Eingabefehler")
			}
		}

		function removeReceipt(){
			var receiptId = $("#Edit [name=ID]").val();

			if(confirm("Abschicken?")){		
				var receipt = database.receipts.splice(database.receipts.findIndex(x => x.id === parseInt(receiptId)))[0];
				database.receipts_delete(receipt);
				database.base.changed.connect(function(){
					if(database.databaseStatus){
						fillData(["History", "Analysis"]);
						switchTab('button:contains("Verlauf")', "History");
					}else{
						alert("Datenbank Fehler");
					}
					database.base.changed.disconnect(this);
				});
			}
		}

		function editReceipt(elem){
			var receiptId = $(elem).parent().find("[name=ID]").val();
			$("#Edit [name=ID]").val(receiptId);
			fillData(["Edit"]);
			initFormat();
			$("#Edit [name=Value]:last").trigger("focusout");
			switchTab('', "Edit");
		}

		function updateReceipt(){
			var receiptId = parseInt($("#Edit [name=ID]").val());
			var receiptIndex = database.receipts.findIndex(x => x.id === parseInt(receiptId)); 
			var receipt = {}

			var validate = true

			receipt.id = receiptId;
			receipt.date = Math.round(new Date($("#Edit [name=Date]").first().val()).getTime()/1000);
			receipt.account = parseInt($("#Edit_Account").val());
			receipt.store = parseInt($("#Edit_Store").val());
			receipt.comment = $("#Edit_Comment").val()
			receipt.lines = [];

			$.each($("#Edit_Lines").children(), function(i, elem){
				var line = {};

				line.id = nextLineId(receiptId);
				line.billing = parseInt($(elem).find(".BillingAccount").val());
				line.typ = parseInt($(elem).find(".Typ").val());
				line.value = parseInt(evalValueInput($(elem).find("[name=Value]").val()).val2);

				receipt.lines.push(line);
			});

			//=  Validation  ==================================================================
			validate = (receipt.date == "" ? false : validate);
			validate = (receipt.account == "" ? false : validate);
			validate = (receipt.store == "" ? false : validate);
			validate = (receipt.lines.length == 0 ? false : validate);
			receipt.lines.forEach(function(line){
				validate = (line.billing == "" ? false : validate);
				validate = (line.typ == "" ? false : validate);
				validate = (line.value == "" ? false : validate);
			})

			if(validate){
				if(confirm("Abschicken?")){
					database.receipts_update(receipt);
					database.base.changed.connect(function(){
						if(database.databaseStatus){
							reservedLineId = [];
							
							fillData(["History", "Analysis"]);
							initFormat();
							switchTab('button:contains("Verlauf")', "History");
						}else{
							alert("Datenbank Fehler");
						}
						database.base.changed.disconnect(this);
					});
				}
			}else{
				alert("Eingabefehler")
			}
		}

		function addPerson(){
			var newElem = $($.parseHTML(html.Settings)).find("#Settings_Persons").children().last();
			
			$("#Settings_Persons").append(newElem);
			$("#Settings_Persons [name=ID]:last").val($("#Settings_Persons").children().length);
			$("#Settings_Persons [name=DisplayName]:last").val("NewPerson");
		}

		function addAccount(){
			var newElem = $($.parseHTML(html.Settings)).find("#Settings_Accounts").children().last();
			
			$("#Settings_Accounts").append(newElem);
			$("#Settings_Accounts [name=ID]:last").val($("#Settings_Accounts").children().length);
			$("#Settings_Accounts [name=DisplayName]:last").val("NewAccount");
			$("#Settings_Accounts [name=Owner]:last").val(1);
		}

		function addTyp(){
			var newElem = $($.parseHTML(html.Settings)).find("#Settings_Types").children().last();
			
			$("#Settings_Types").append(newElem);
			$("#Settings_Types [name=ID]:last").val($("#Settings_Types").children().length);
			$("#Settings_Types [name=DisplayName]:last").val("NewTyp");
		}

		function addStore(){
			var newElem = $($.parseHTML(html.Settings)).find("#Settings_Types").children().last();
			
			$("#Settings_Stores").append(newElem);
			$("#Settings_Stores [name=ID]:last").val($("#Settings_Stores").children().length);
			$("#Settings_Stores [name=DisplayName]:last").val("NewStore");
		}

		var reservedLineId = [];
		function nextLineId(id=0){
			var arr = [];
			database.receipts.forEach(function(receipt){
				if(receipt.id != id){
					receipt.lines.forEach(function(line){
						arr.push({"id":line.id});
					});
				}
			});
			
			id = nextUniqueId(arr, "id", reservedLineId);
			reservedLineId.push(id);
			return id;
		}

		function uniqueAttribute(arr, field){
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

		function nextUniqueId(obj, id, reserved=[]){
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

		function redrawSvg(){
			data = collectData("typ", "receiptCount", "time", [])
			if(!drawLineGraph("#Analysis_svg", data, $(".tabContent:visible:first").width())){
				//console.log("D3-Error: invalid data");
			}
		}
			
		function collectData(xAxis, yAxis, groupBy, filter){
			var startDateStamp = 0;
			var endDateStamp = 9999999999;

			var persons = [];
			var accounts = [];
			var stores = [];
			var types = [];

			filter.forEach(function(item, index){
				switch(item,typ){
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
					//console.log("date")
					return;
				}
				if(!stores.includes(receipt.store) && stores.length !== 0){
					//console.log("store")
					return;
				}
				receipt.lines.forEach(function(line){
					if((persons.includes(line.billing) || accounts.includes(receipt.account)) || (persons.length === 0 && accounts.length === 0))
					{
						if(types.includes(line.typ) || types.length === 0){
							let d = new Date(receipt.date*1000)
							let str = d.getFullYear() + "-" + ("0" + (d.getMonth()+1)).slice(-2);
							lineObj = {
								time: str,
								person: database.persons.find(x => x.id === line.billing).displayName,
								account: database.accounts.find(x => x.id === receipt.account).displayName,
								store: database.stores.find(x => x.id === receipt.store).displayName,
								typ: database.types.find(x => x.id === line.typ).displayName,
								value: line.value/100,
								receipt: receipt.id
							};
						dataObject.push(lineObj);
						}else{
							//console.log("typ")
						}
					}else{
						//console.log("person or account")
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
					receiptList = []
					for (i = dataObject.length - 1; i >= 0; i -= 1) {
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
			//console.log(dataObject);
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
				i = data.series.findIndex(obj => obj.name === item[groupBy])
				j = data.xLabels.indexOf(item[xAxis])
				data.series[i].values[j] += item.value;
			});

			//console.log(data);
			
			return data;
		}