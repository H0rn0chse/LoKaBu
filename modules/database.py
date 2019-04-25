import sys
import os
import sqlite3

from PyQt5.QtCore import QObject, QVariant, QUrl, pyqtProperty, pyqtSignal, pyqtSlot
from PyQt5.QtWebChannel import QWebChannel
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtWidgets import QApplication

#local files
from schemes import *

class Database(QObject):
	version = "1.0"
	fileName = "database.sqlite3"
	baseFile = "base_database.sqlite3"

	def __init__(self, CURSOR, CONN):
		QObject.__init__(self)
		self.cursor = CURSOR
		self.conn = CONN

		self.cursor.execute("SELECT * FROM Settings")
		res = self.cursor.fetchall()
		for i in res:
			self._settings = {}
			self._settings["defaultBillingAccount"] = i[0]
			self._settings["defaultTyp"] = i[1]
		
		self._databaseStatus = True

		#list of payment types
		self._types = []
		self.cursor.execute("SELECT * FROM Types")
		res = self.cursor.fetchall()
		for i in res:
			obj = {}
			obj["id"] = i[0]
			obj["displayName"] = i[1]
			self._types.append(obj)

		#list of Persons
		self._persons = []
		self.cursor.execute("SELECT * FROM Persons")
		res = self.cursor.fetchall()
		for i in res:
			obj = {}
			obj["id"] = i[0]
			obj["displayName"] = i[1]
			self._persons.append(obj)

		#list of accounts
		self._accounts = []
		self.cursor.execute("SELECT * FROM Accounts")
		res = self.cursor.fetchall()
		for i in res:
			obj = {}
			obj["id"] = i[0]
			obj["displayName"] = i[1]
			obj["owner"] = i[2]
			self._accounts.append(obj)

		#list of Stores
		self._stores = []
		self.cursor.execute("SELECT * FROM Stores")
		res = self.cursor.fetchall()
		for i in res:
			obj = {}
			obj["id"] = i[0]
			obj["displayName"] = i[1]
			self._stores.append(obj)

		#aggregated cost items
		self._receipts = []
		self.cursor.execute("SELECT * FROM Receipts")
		res = self.cursor.fetchall()
		for i in res:
			obj = {}
			obj["id"] = i[0]
			obj["date"] = i[1]
			obj["account"] = i[2]
			obj["comment"] = i[3]
			obj["store"] = i[4]
			obj["lines"] = []
			res2 = self.cursor.execute("SELECT * FROM Lines WHERE Receipt = "+str(obj["id"]))
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

	changed = pyqtSignal(QVariant)

	@pyqtProperty(bool, notify=changed)
	def databaseStatus(self):
		return int(self._databaseStatus)

	@pyqtProperty(QVariant, notify=changed)
	def settings(self):
		return QVariant(self._settings)
	@pyqtSlot(QVariant)
	def settings_set(self, obj):
		if checkSchema(settingsSchema, obj):
			try:
				self.cursor.execute("UPDATE Settings SET Person=" + str(obj["defaultBillingAccount"]) + ", Typ=" + str(obj["defaultTyp"]))
				self.conn.commit()
				self._settings = obj
				self._databaseStatus = True
			except sqlite3.Error as er:
				self._databaseStatus = False
		else:
			self._databaseStatus = False
		self.changed.emit(self._settings)

	@pyqtProperty(QVariant, notify=changed)
	def types(self):
		return QVariant(self._types)
	@pyqtSlot(QVariant)
	def types_add(self, obj):
		if checkSchema(typSchema, obj):
			try:
				self.cursor.execute("INSERT INTO Types (ID, DisplayName) VALUES(" + str(obj["id"]) + ",'" + obj["displayName"] + "')")
				self.conn.commit()
				self._types.append(obj)
				self._databaseStatus = True
			except sqlite3.Error as er:
				self._databaseStatus = False
		else:
			self._databaseStatus = False
		self.changed.emit(self._types)
	@pyqtSlot(QVariant)
	def types_update(self, obj):
		if checkSchema(typSchema, obj):
			try:
				self.cursor.execute("UPDATE Types SET DisplayName='" + str(obj["displayName"]) + "' WHERE ID=" + str(obj["id"]))
				self.conn.commit()
				for key, value in enumerate(self._types):
					if value["id"] == obj["id"]:
						self._types[key] = obj
				self._databaseStatus = True
			except sqlite3.Error as er:
				self._databaseStatus = False
		else:
			self._databaseStatus = False
		self.changed.emit(self._types)

	@pyqtProperty(QVariant, notify=changed)
	def persons(self):
		return QVariant(self._persons)
	@pyqtSlot(QVariant)
	def persons_add(self, obj):
		if checkSchema(personSchema, obj):
			try:
				self.cursor.execute("INSERT INTO Persons (ID, DisplayName) VALUES(" + str(obj["id"]) + ",'" + str(obj["displayName"]) + "')")
				self.conn.commit()
				self._persons.append(obj)
				self._databaseStatus = True
			except sqlite3.Error as er:
				self._databaseStatus = False
		else:
			self._databaseStatus = False
		self.changed.emit(self._persons)
	@pyqtSlot(QVariant)
	def persons_update(self, obj):
		if checkSchema(personSchema, obj):
			try:
				self.cursor.execute("UPDATE Persons SET DisplayName='" + str(obj["displayName"]) + "' WHERE ID=" + str(obj["id"]))
				self.conn.commit()
				for key, value in enumerate(self._persons):
					if value["id"] == obj["id"]:
						self._persons[key] = obj
				self._databaseStatus = True
			except sqlite3.Error as er:
				self._databaseStatus = False
		else:
			self._databaseStatus = False
		self.changed.emit(self._persons)

	@pyqtProperty(QVariant, notify=changed)
	def accounts(self):
		return QVariant(self._accounts)
	@pyqtSlot(QVariant)
	def accounts_add(self, obj):
		if checkSchema(accountSchema, obj):
			try:
				self.cursor.execute("INSERT INTO Accounts (ID, DisplayName, Owner) VALUES(" + str(obj["id"]) + ",'" + str(obj["displayName"]) + "'," + str(obj["owner"]) + ")")
				self.conn.commit()
				self._accounts.append(obj)
				self._databaseStatus = True
			except sqlite3.Error as er:
				self._databaseStatus = False
		else:
			self._databaseStatus = False
		self.changed.emit(self._accounts)
	@pyqtSlot(QVariant)
	def accounts_update(self, obj):
		if checkSchema(accountSchema, obj):
			try:
				self.cursor.execute("UPDATE Accounts SET DisplayName='" + str(obj["displayName"]) + "', Owner=" + str(obj["owner"]) + " WHERE ID=" + str(obj["id"]))
				self.conn.commit()
				for key, value in enumerate(self._accounts):
					if value["id"] == obj["id"]:
						self._accounts[key] = obj
				self._databaseStatus = True
			except sqlite3.Error as er:
				self._databaseStatus = False
		else:
			self._databaseStatus = False
		self.changed.emit(self._accounts)

	@pyqtProperty(QVariant, notify=changed)
	def stores(self):
		return QVariant(self._stores)
	@pyqtSlot(QVariant)
	def stores_add(self, obj):
		if checkSchema(storeSchema, obj):
			try:
				self.cursor.execute("INSERT INTO Stores (ID, DisplayName) VALUES(" + str(obj["id"]) + ",'" + str(obj["displayName"]) + "')")
				self.conn.commit()
				self._stores.append(obj)
				self._databaseStatus = True
			except sqlite3.Error as er:
				self._databaseStatus = False
		else:
			self._databaseStatus = False
		self.changed.emit(self._stores)
	@pyqtSlot(QVariant)
	def stores_update(self, obj):
		if checkSchema(storeSchema, obj):
			try:
				self.cursor.execute("UPDATE Stores SET DisplayName='" + str(obj["displayName"]) + "'" + " WHERE ID=" + str(obj["id"]))
				self.conn.commit()
				for key, value in enumerate(self._stores):
					if value["id"] == obj["id"]:
						self._stores[key] = obj
				self._databaseStatus = True
			except sqlite3.Error as er:
				self._databaseStatus = False
		else:
			self._databaseStatus = False
		self.changed.emit(self._stores)

	@pyqtProperty(QVariant, notify=changed)
	def receipts(self):
		return QVariant(self._receipts)
	@pyqtSlot(QVariant)
	def receipts_add(self, obj):
		if checkSchema(receiptSchema, obj):
			try:
				self.cursor.execute("INSERT INTO Receipts (ID, Date, Account, Comment, Store) VALUES(" + str(obj["id"]) + "," + str(obj["date"]) + "," + str(obj["account"]) + ",'" + str(obj["comment"]) + "'," + str(obj["store"]) + ")")
				for line in obj["lines"]:
					self.cursor.execute("INSERT INTO Lines (ID, Receipt, Value, Billing, Typ) VALUES(" + str(line["id"]) + "," + str(obj["id"]) + "," + str(line["value"]) + "," + str(line["billing"]) + "," + str(line["typ"]) + ")")
				self.conn.commit()
				self._receipts.append(obj)
				self._databaseStatus = True
			except sqlite3.Error as er:
				self._databaseStatus = False
		else:
			self._databaseStatus = False
		self.changed.emit(self._receipts)
	@pyqtSlot(QVariant)
	def receipts_update(self, obj):
		if checkSchema(receiptSchema, obj):
			try:
				self.cursor.execute("UPDATE Receipts SET Date=" + str(obj["date"]) + ", Account=" + str(obj["account"]) + ", Comment='" + str(obj["comment"]) + "', Store=" + str(obj["store"]) + " WHERE ID=" + str(obj["id"]))
				self.cursor.execute("DELETE FROM Lines WHERE Receipt=" + str(obj["id"]))
				for line in obj["lines"]:
					self.cursor.execute("INSERT INTO Lines (ID, Receipt, Value, Billing, Typ) VALUES(" + str(line["id"]) + "," + str(obj["id"]) + "," + str(line["value"]) + "," + str(line["billing"]) + "," + str(line["typ"]) + ")")
				self.conn.commit()
				for key, value in enumerate(self._receipts):
					if value["id"] == obj["id"]:
						self._receipts[key] = obj
				self._databaseStatus = True
			except sqlite3.Error as er:
				self._databaseStatus = False
		else:
			self._databaseStatus = False
		self.changed.emit(self._receipts)
	@pyqtSlot(QVariant)
	def receipts_delete(self, obj):
		if checkSchema(receiptSchema, obj):
			try:
				self.cursor.execute("DELETE FROM Lines WHERE Receipt=" + str(obj["id"]))
				self.cursor.execute("DELETE FROM Receipts WHERE ID=" + str(obj["id"]))
				self.conn.commit()
				for key, value in enumerate(self._receipts):
					if value["id"] == obj["id"]:
						del self._receipts[key]

				self._databaseStatus = True
			except sqlite3.Error as er:
				self._databaseStatus = False
		else:
			self._databaseStatus = False
		self.changed.emit(self._receipts)

	def checkVersion(cursor):
		try:
			cursor.execute("SELECT Version FROM Settings")
			version = cursor.fetchone()[0]
			if version == Database.version:
				return True
			else:
				return False

		except sqlite3.Error as er:
			return False
		