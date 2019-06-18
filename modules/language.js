/**
 * Returns a text in a different language
 * @param {String} text
 * @returns {String}
 */
Lang.getText = function(text){{
	let testDict = {};
	testDict["ReceiptID"] = "Belegnummer";
	testDict["ReceiptDate"] = "Datum";
	testDict["ReceiptAccount"] = "Konto";
	testDict["ReceiptStore"] = "Laden";
	testDict["ReceiptComment"] = "Kommentar";
	testDict["ReceiptValue"] = "Belegsumme";
	testDict["LineTypes"] = "Positionstyp";
	testDict["LinePersons"] = "Abrechnungsperson";
	testDict["LineValues"] = "Positionswert";
	testDict["equal"] = "gleich";
	testDict["unequal"] = "ungleich";
	testDict["greater"] = "größer";
	testDict["smaller"] = "kleiner";
	testDict["before"] = "vor";
	testDict["after"] = "nach";
	testDict["contains"] = "enthält";
	testDict["contains not"] = "enthält nicht";
	testDict["add Filter"] = "Filter hinzufügen";
	testDict["apply Filter"] = "Filter anwenden";
	testDict["sortDate"] = "Datum";
	testDict["yID"] = "Belegnummer";
	testDict["yValue"] = "Positionswert";
	testDict["xTime"] = "mm/yyyy";
	testDict["xAccount"] = "Konto";
	testDict["xStore"] = "Laden";
	testDict["xTyp"] = "Positionstyp";
	testDict["xBilling"] = "Abrechnungsperson";

	let returnString = testDict.hasOwnProperty(text) ? testDict[text] : text;

	return returnString;
}}