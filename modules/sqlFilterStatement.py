class SqlFilterStatement:
	tableName = ""
	selectSql = ""
	fromSql = ""
	whereSql = ""
	groupSql = ""
	havingSql = ""

	def __init__(self, tableName):
		self.tableName = tableName
		self.selectSql = "SELECT " + tableName + ".*"
		self.fromSql = "FROM " + tableName + " AS " + tableName
		self.whereSql = ""
		self.groupSql = ""
		self.havingSql = ""

	def setFilter(self, filterObj, controlColumn = "ReceiptID"):
		if filterObj["varConjunction"] == "": #value
			self.whereSql = "WHERE " + self.buildFilterString(filterObj)
		elif filterObj["varConjunction"] == "all": #list
			self.whereSql = "WHERE " + self.buildFilterString(filterObj)
			self.fromSql = "FROM " + self.tableName + " AS " + self.tableName + ", json_each(" + self.tableName + "." + filterObj["name"] + ")"
			self.havingSql = "HAVING count(" + controlColumn + ") = json_array_length(" + filterObj["name"] + ")"
			self.setGroup(controlColumn)

		elif filterObj["varConjunction"] == "none": #list
			self.whereSql = "WHERE NOT " + self.buildFilterString(filterObj)
			self.fromSql = "FROM " + self.tableName + " AS " + self.tableName + ", json_each(" + self.tableName + "." + filterObj["name"] + ")"
			self.havingSql = "HAVING count(" + controlColumn + ") = json_array_length(" + filterObj["name"] + ")"
			self.setGroup(controlColumn)

		elif filterObj["varConjunction"] == "at least one": #list
			self.fromSql = "FROM " + self.tableName + " AS " + self.tableName + ", json_each(" + self.tableName + "." + filterObj["name"] + ")"
			self.whereSql = "WHERE " + self.buildFilterString(filterObj)
			self.setGroup(controlColumn)
	
	def buildFilterString(self, filterObj):
		conjunctionList = {}
		conjunctionList["equal"] = "="
		conjunctionList["unequal"] = "!="
		conjunctionList["greater"] = ">"
		conjunctionList["smaller"] = "<"
		conjunctionList["before"] = "<"
		conjunctionList["after"] = ">"
		conjunctionList["contains"] = "like"
		conjunctionList["contains not"] = "not like"

		value = filterObj["value"]
		if isinstance(value, str):
			if filterObj["valConjunction"] not in ["contains", "contains not"]:
				value = "\"" + value + "\""
			else:
				value = "\"%" + value + "%\""
		else:

			value = str(value)

		if filterObj["varConjunction"] == "":
			filterString = filterObj["name"]
		else:
			filterString = "json_each.value"
		
		filterString += " " + conjunctionList[filterObj["valConjunction"]]
		filterString += " " + value

		return filterString

	def setGroup(self, column):
		self.groupSql = "GROUP BY " + column

	def insertFrom(self, sql):
		self.fromSql = "FROM (" + sql + ")" + self.fromSql[self.fromSql.find(" AS "):]

	def appendFrom(self, sql):
		self.fromSql += sql

	def appendSelect(self, sql):
		self.selectSql += sql
	
	def convertToSql(self):
		arr = []
		if self.selectSql != "":
			arr.append(self.selectSql)
		if self.fromSql != "":
			arr.append(self.fromSql)
		if self.whereSql != "":
			arr.append(self.whereSql)
		if self.groupSql != "":
			arr.append(self.groupSql)
		if self.havingSql != "":
			arr.append(self.havingSql)
		return " ".join(arr)