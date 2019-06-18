import sys
import os
import sqlite3
import copy

from PyQt5.QtCore import QObject, QVariant, QUrl, pyqtProperty, pyqtSignal, pyqtSlot
from PyQt5.QtWebChannel import QWebChannel
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtWidgets import QApplication

#local files
from sqlFilterStatement import *

class Database(QObject):
	version = "1.1"
	fileName = "database.sqlite3"
	baseFile = "base_database.sqlite3"

	def __init__(self, CURSOR, CONN):
		QObject.__init__(self)
		self.cursor = CURSOR
		self.conn = CONN

		self._databaseStatus = True

		self._databaseInfo = []
		self.update_data("databaseInfo")

		self._settings = []
		self.update_data("settings")

		self._types = []
		self.update_data("types")

		self._persons = []
		self.update_data("persons")

		self._accounts = []
		self.update_data("accounts")

		self._stores = []
		self.update_data("stores")	

		self._receiptList = []
		self.update_data("receiptList")

		self._receiptDetail = []
		self.update_data("receiptDetail")

		self._receiptAnalysis = []
		self.update_data("receiptAnalysis")

	def __str__(self):
		return str(self.__class__) + ": " + str(self.__dict__)

	changed = pyqtSignal(QVariant)

	@pyqtProperty(bool, notify=changed)
	def databaseStatus(self):
		return int(self._databaseStatus)

	@pyqtProperty(QVariant, notify=changed)
	def databaseInfo(self):
		return QVariant(self._databaseInfo[0])

	@pyqtProperty(QVariant, notify=changed)
	def settings(self):
		return QVariant(self._settings[0])

	@pyqtProperty(QVariant, notify=changed)
	def types(self):
		return QVariant(self._types)

	@pyqtProperty(QVariant, notify=changed)
	def persons(self):
		return QVariant(self._persons)

	@pyqtProperty(QVariant, notify=changed)
	def accounts(self):
		return QVariant(self._accounts)

	@pyqtProperty(QVariant, notify=changed)
	def stores(self):
		return QVariant(self._stores)

	@pyqtProperty(QVariant, notify=changed)
	def receiptList(self):
		return QVariant(self._receiptList)

	@pyqtProperty(QVariant, notify=changed)
	def receiptDetail(self):
		return QVariant(self._receiptDetail)

	@pyqtProperty(QVariant, notify=changed)
	def receiptAnalysis(self):
		return QVariant(self._receiptAnalysis)
	
	@pyqtSlot(QVariant, QVariant, QVariant)
	def submit_data(self, objectType, method, obj):
		#Settings===============================================================
		if objectType == "settings":
			if method == "set":
				self.cursor.execute("UPDATE Settings SET Person=" + str(obj["defaultBillingAccount"]) + ", Typ=" + str(obj["defaultTyp"]))
		#Types===============================================================
		elif objectType == "types":
			if method == "add":
				self.cursor.execute("INSERT INTO Types (ID, DisplayName) VALUES(" + str(obj["id"]) + ",'" + obj["displayName"] + "')")
			if method == "update":
				self.cursor.execute("UPDATE Types SET DisplayName='" + str(obj["displayName"]) + "' WHERE ID=" + str(obj["id"]))
		#Persons===============================================================
		elif objectType == "persons":
			if method == "add":
				self.cursor.execute("INSERT INTO Persons (ID, DisplayName) VALUES(" + str(obj["id"]) + ",'" + str(obj["displayName"]) + "')")
			if method == "update":
				self.cursor.execute("UPDATE Persons SET DisplayName='" + str(obj["displayName"]) + "' WHERE ID=" + str(obj["id"]))
		#Accounts===============================================================
		elif objectType == "accounts":
			if method == "add":
				self.cursor.execute("INSERT INTO Accounts (ID, DisplayName, Owner) VALUES(" + str(obj["id"]) + ",'" + str(obj["displayName"]) + "'," + str(obj["owner"]) + ")")
			if method == "update":
				self.cursor.execute("UPDATE Accounts SET DisplayName='" + str(obj["displayName"]) + "', Owner=" + str(obj["owner"]) + " WHERE ID=" + str(obj["id"]))
		#Stores===============================================================
		elif objectType == "stores":
			if method == "add":
				self.cursor.execute("INSERT INTO Stores (ID, DisplayName) VALUES(" + str(obj["id"]) + ",'" + str(obj["displayName"]) + "')")
			if method == "update":
				self.cursor.execute("UPDATE Stores SET DisplayName='" + str(obj["displayName"]) + "'" + " WHERE ID=" + str(obj["id"]))
		#ReceiptDetail===============================================================
		elif objectType == "receiptDetail":
			if method == "add":
				self.cursor.execute("INSERT INTO Receipts (ID, Date, Account, Comment, Store) VALUES(" + str(obj["id"]) + "," + str(obj["date"]) + "," + str(obj["account"]) + ",'" + str(obj["comment"]) + "'," + str(obj["store"]) + ")")
				for line in obj["lines"]:
					self.cursor.execute("INSERT INTO Lines (ID, Receipt, Value, Billing, Typ) VALUES(" + str(line["id"]) + "," + str(obj["id"]) + "," + str(line["value"]) + "," + str(line["billing"]) + "," + str(line["typ"]) + ")")
			if method == "update":
				self.cursor.execute("UPDATE Receipts SET Date=" + str(obj["date"]) + ", Account=" + str(obj["account"]) + ", Comment='" + str(obj["comment"]) + "', Store=" + str(obj["store"]) + " WHERE ID=" + str(obj["id"]))
				self.cursor.execute("DELETE FROM Lines WHERE Receipt=" + str(obj["id"]))
				for line in obj["lines"]:
					self.cursor.execute("INSERT INTO Lines (ID, Receipt, Value, Billing, Typ) VALUES(" + str(line["id"]) + "," + str(obj["id"]) + "," + str(line["value"]) + "," + str(line["billing"]) + "," + str(line["typ"]) + ")")
			if method == "delete":
				self.cursor.execute("DELETE FROM Lines WHERE Receipt=" + str(obj["id"]))
				self.cursor.execute("DELETE FROM Receipts WHERE ID=" + str(obj["id"]))
		else:
			
			return
		try:
			self.conn.commit()
			self.update_data(objectType)
			self._databaseStatus = True
		except sqlite3.Error as er:
			print("An database error occurred:", er.args[0])
			self._databaseStatus = False

		self.changed.emit(objectType)

	@pyqtSlot(QVariant, QVariant, QVariant, QVariant, QVariant)
	def update_data(self, objectType, groupBy="", filterList=[], orderString="", page="0"):
		
		if len(filterList) == 1:
			filterString = filterList[0]
		else:
			filterString = ""

		try:
			#databaseInfo===============================================================
			if objectType == "databaseInfo":
				self.cursor.execute("SELECT * FROM view_databaseInfo")
			#Settings===============================================================
			elif objectType == "settings":
				self.cursor.execute("SELECT * FROM Settings")
			#Types===============================================================
			elif objectType == "types":
				self.cursor.execute("SELECT * FROM Types")
			#Persons===============================================================
			elif objectType == "persons":
				self.cursor.execute("SELECT * FROM Persons")
			#Accounts===============================================================
			elif objectType == "accounts":
				self.cursor.execute("SELECT * FROM Accounts")
			#Stores===============================================================
			elif objectType == "stores":
				self.cursor.execute("SELECT * FROM Stores")
			#ReceiptList===============================================================
			elif objectType == "receiptList":
				page = "LIMIT " + str(self._settings[0]["PageItems"]) + " OFFSET " + str(int(self._settings[0]["PageItems"])*int(page))

				baseSQL = SqlFilterStatement("view_ReceiptList")
				filterCount = 0
				for filterObj in filterList:
					filterSql = SqlFilterStatement("filter" + str(filterCount))
					filterSql.setFilter(filterObj)
					filterSql.setGroup("ReceiptID")
					filterSql.insertFrom(baseSQL.convertToSql())

					filterCount += 1
					baseSQL = copy.deepcopy(filterSql)
				baseSQL.appendSelect(", cast(round(count(*) OVER()/s.PageItems+0.5) AS INT) as PageCount")
				baseSQL.appendFrom(", Settings s")
				self.cursor.execute(baseSQL.convertToSql() + " " + orderString + " " + page)
			#ReceiptDetail===============================================================
			elif objectType == "receiptDetail":
				if filterString == "":
					filterString = " WHERE ReceiptID=(SELECT min(ID) FROM Receipts) "
				else:
					filterString = " WHERE " + filterString + " "
				self.cursor.execute("SELECT * FROM view_ReceiptDetail" + filterString)
			#ReceiptAnalysis===============================================================
			elif objectType == "receiptAnalysis":

				baseSQL = SqlFilterStatement("view_ReceiptAnalysis")
				filterCount = 0
				for filterObj in filterList:
					filterSql = SqlFilterStatement("filter" + str(filterCount))
					filterSql.setFilter(filterObj)
					filterSql.setGroup(groupBy)
					filterSql.insertFrom(baseSQL.convertToSql())

					filterCount += 1
					baseSQL = copy.deepcopy(filterSql)

				baseSQL.appendSelect(", count(DISTINCT yID) AS yCount, sum(yValue) AS ySum")
				self.cursor.execute(baseSQL.convertToSql() + " " + orderString)
			#==============================================================================
				
			res = self.cursor.fetchall()
			arr = []
			for row in res:
				obj = {}
				for col in row.keys():
					obj[col] = str(row[col])
				arr.append(obj)

			setattr(self, "_" + objectType, arr)
			self._databaseStatus = True

		except sqlite3.Error as er:
			print("An database error occurred:", er.args[0])
			self._databaseStatus = False

		self.changed.emit(objectType)

	def checkVersion(cursor):
			try:
				cursor.execute("SELECT Version FROM Settings")
				version = cursor.fetchone()[0]
				if version == Database.version:
					return True
				else:
					return False

			except sqlite3.Error as er:
				print("An database error occurred:", er.args[0])
				return False