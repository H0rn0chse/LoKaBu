#! python3.7

import sys
import sqlite3
from time import sleep

from schema import Schema, And, Use, Optional, SchemaError

from PyQt5.QtCore import QObject, QVariant, QUrl, pyqtProperty, pyqtSignal, pyqtSlot
from PyQt5.QtWebChannel import QWebChannel
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtWidgets import QApplication

sys.argv.append("--disable-web-security")
APP = QApplication(sys.argv)

CONN = sqlite3.connect("database.sql")
CURSOR = CONN.cursor()


class Database(QObject):
	def __init__(self):
		QObject.__init__(self)

		CURSOR.execute("SELECT * FROM Settings")
		res = CURSOR.fetchall()
		for i in res:
			self._settings = {}
			self._settings["defaultBillingAccount"] = i[0]
			self._settings["defaultTyp"] = i[1]
		
		CURSOR.execute("SELECT ID FROM Lines WHERE ID = (SELECT max(ID) FROM Lines)")
		res = CURSOR.fetchall()
		for i in res:
			self._lineCount = int(i[0])

		#list of payment types
		self._types = []
		CURSOR.execute("SELECT * FROM Types")
		res = CURSOR.fetchall()
		for i in res:
			obj = {}
			obj["id"] = i[0]
			obj["displayName"] = i[1]
			self._types.append(obj)

		#list of Persons
		self._persons = []
		CURSOR.execute("SELECT * FROM Persons")
		res = CURSOR.fetchall()
		for i in res:
			obj = {}
			obj["id"] = i[0]
			obj["displayName"] = i[1]
			self._persons.append(obj)

		#list of accounts
		self._accounts = []
		CURSOR.execute("SELECT * FROM Accounts")
		res = CURSOR.fetchall()
		for i in res:
			obj = {}
			obj["id"] = i[0]
			obj["displayName"] = i[1]
			obj["owner"] = i[2]
			self._accounts.append(obj)

		#aggregated cost items
		self._receipts = []
		CURSOR.execute("SELECT * FROM Receipts")
		res = CURSOR.fetchall()
		for i in res:
			obj = {}
			obj["id"] = i[0]
			obj["date"] = i[1]
			obj["account"] = i[2]
			obj["comment"] = i[3]
			obj["lines"] = []
			res2 = CURSOR.execute("SELECT * FROM Lines WHERE Receipt = "+str(obj["id"]))
			for j in res2:
				obj2 = {}
				obj2["id"] = j[0]
				obj2["value"] = j[2]
				obj2["billing"] = j[3]
				obj2["typ"] = j[4]
				obj["lines"].append(obj2)
			self._receipts.append(obj)

	def __str__(self):
		return str(self.__class__) + ": " + str(self.__dict__)

	changed = pyqtSignal()

	@pyqtProperty(int, constant=True)
	def lineCount(self):
		return int(self._lineCount)

	@pyqtProperty(QVariant, notify=changed)
	def settings(self):
		return QVariant(self._settings)
	@pyqtSlot(QVariant)
	def settings_set(self, obj):
		if checkSchema(settingsSchema, obj):
			CURSOR.execute("UPDATE Settings SET Person=" + str(obj["defaultBillingAccount"]) + ", Typ=" + str(obj["defaultTyp"]))
			self._settings = obj
			CONN.commit()
			self.changed.emit()

	@pyqtProperty(QVariant, notify=changed)
	def types(self):
		return QVariant(self._types)
	@pyqtSlot(QVariant)
	def types_add(self, obj):
		if checkSchema(typSchema, obj):
			CURSOR.execute("INSERT INTO Types (ID, DisplayName) VALUES(" + str(obj["id"]) + ",'" + obj["displayName"] + "')")
			self._types.append(obj)
			CONN.commit()
			self.changed.emit()
	@pyqtSlot(QVariant)
	def types_update(self, obj):
		if checkSchema(typSchema, obj):
			CURSOR.execute("UPDATE Types SET DisplayName='" + str(obj["displayName"]) + "' WHERE ID=" + str(obj["id"]))
			[x for x in self._types if x["id"] == obj["id"]][0] = obj
			CONN.commit()
			self.changed.emit()

	@pyqtProperty(QVariant, notify=changed)
	def persons(self):
		return QVariant(self._persons)
	@pyqtSlot(QVariant)
	def persons_add(self, obj):
		if checkSchema(personSchema, obj):
			CURSOR.execute("INSERT INTO Persons (ID, DisplayName) VALUES(" + str(obj["id"]) + ",'" + str(obj["displayName"]) + "')")
			self._persons.append(obj)
			CONN.commit()
			self.changed.emit()
	@pyqtSlot(QVariant)
	def persons_update(self, obj):
		if checkSchema(personSchema, obj):
			CURSOR.execute("UPDATE Persons SET DisplayName='" + str(obj["displayName"]) + "' WHERE ID=" + str(obj["id"]))
			[x for x in self._persons if x["id"] == obj["id"]][0] = obj
			CONN.commit()
			self.changed.emit()

	@pyqtProperty(QVariant, notify=changed)
	def accounts(self):
		return QVariant(self._accounts)
	@pyqtSlot(QVariant)
	def accounts_add(self, obj):
		if checkSchema(accountSchema, obj):
			CURSOR.execute("INSERT INTO Accounts (ID, DisplayName, Owner) VALUES(" + str(obj["id"]) + ",'" + str(obj["displayName"]) + "'," + str(obj["owner"]) + ")")
			self._accounts.append(obj)
			CONN.commit()
			self.changed.emit()
	@pyqtSlot(QVariant)
	def accounts_update(self, obj):
		if checkSchema(accountSchema, obj):
			CURSOR.execute("UPDATE Accounts SET DisplayName='" + str(obj["displayName"]) + "', Owner=" + str(obj["owner"]) + " WHERE ID=" + str(obj["id"]))
			[x for x in self._accounts if x["id"] == obj["id"]][0] = obj
			CONN.commit()
			self.changed.emit()

	@pyqtProperty(QVariant, notify=changed)
	def receipts(self):
		return QVariant(self._receipts)
	@pyqtSlot(QVariant)
	def receipts_add(self, obj):
		if checkSchema(receiptSchema, obj):
			CURSOR.execute("INSERT INTO Receipts (ID, Date, Account, Comment) VALUES(" + str(obj["id"]) + "," + str(obj["date"]) + "," + str(obj["account"]) + ",'" + str(obj["comment"]) + "')")
			for line in obj["lines"]:
				CURSOR.execute("INSERT INTO Lines (ID, Receipt, Value, Billing, Typ) VALUES(" + str(line["id"]) + "," + str(obj["id"]) + "," + str(line["value"]) + "," + str(line["billing"]) + "," + str(line["typ"]) + ")")
			self._receipts.append(obj)
			CONN.commit()
			self.changed.emit()
	@pyqtSlot(QVariant)
	def receipts_update(self, obj):
		if checkSchema(receiptSchema, obj):
			CURSOR.execute("UPDATE Receipts SET Date=" + str(obj["date"]) + ", Acount=" + str(obj["account"]) + ", Comment='" + str(obj["comment"]) + "' WHERE ID=" + str(obj["id"]))
			CURSOR.execute("DELETE FROM Lines WHERE Receipt=" + obj["id"])
			for line in obj["lines"]:
				CURSOR.execute("INSERT INTO Lines (ID, Receipt, Value, Billing, Typ) VALUES(" + str(line["id"]) + "," + str(obj["id"]) + "," + str(line["value"]) + "," + str(line["billing"]) + "," + str(line["typ"]) + ")")
			[x for x in self._receipts if x["id"] == obj["id"]][0] = obj
			CONN.commit()
			self.changed.emit()
	@pyqtSlot(QVariant)
	def receipts_delete(self, obj):
		if checkSchema(receiptSchema, obj):
			CURSOR.execute("DELETE FROM Lines WHERE Receipt=" + str(obj["id"]))
			CURSOR.execute("DELETE FROM Receipts WHERE ID=" + str(obj["id"]))
			self._receipts = filter(lambda x: x.id != obj["id"], self._receipts)
			CONN.commit()
			self.changed.emit()

def checkSchema(conf_schema, conf):
	print(conf)
	try:
		conf_schema.validate(conf)
		return True
	except SchemaError:
		return False

settingsSchema = Schema({
	'defaultBillingAccount': Use(int),
	'defaultTyp': Use(int)
})

typSchema = Schema({
	'id': Use(int),
	'displayName': str
})

personSchema = Schema({
	'id': Use(int),
	'displayName': str
})

accountSchema = Schema({
	'id': Use(int),
	'displayName': str,
	'owner': Use(int)
})

receiptSchema = Schema({
	'id': Use(int),
	'date': Use(int),
	'account': Use(int),
	'comment': Use(str),
	'lines': [{
		'id': Use(int),
		'value': Use(int),
		'billing': Use(int),
		'typ': Use(int)
	}]
})

FILE = open("client.html", "r", encoding='utf-8')
RAW_HTML = FILE.read()

VIEW = QWebEngineView()
VIEW_INSPECTOR = QWebEngineView()
CHANNEL = QWebChannel()
db = Database()

CHANNEL.registerObject('database', db)
VIEW.page().setWebChannel(CHANNEL)
VIEW_INSPECTOR.page().setInspectedPage(VIEW.page())

VIEW.setHtml(RAW_HTML, QUrl("file://"))
VIEW.setWindowTitle('Kassenbuch - Ultimate Edition')

#VIEW_INSPECTOR.show()
VIEW.show()

sys.exit(APP.exec_())
