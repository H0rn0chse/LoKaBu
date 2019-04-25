#! python3.7

import sys
import os
import sqlite3

#local files
sys.path.append("modules")
from database import *
from shutil import copy2
from time import time

sys.argv.append("--disable-web-security")
APP = QApplication(sys.argv)

def getPath(filename):
	if hasattr(sys, '_MEIPASS'):
		# PyInstaller >= 1.6
		os.chdir(sys._MEIPASS)
		filename = os.path.join(sys._MEIPASS, filename)
	elif '_MEIPASS2' in os.environ:
		# PyInstaller < 1.6 (tested on 1.5 only)
		os.chdir(os.environ['_MEIPASS2'])
		filename = os.path.join(os.environ['_MEIPASS2'], filename)
	else:
		os.chdir(os.path.dirname(sys.argv[0]))
		filename = os.path.join(os.path.dirname(sys.argv[0]), filename)
	return filename

#file does exist
if os.path.isfile(Database.fileName):
	CONN = sqlite3.connect(Database.fileName)
	CURSOR = CONN.cursor()

	#file has false version
	if not Database.checkVersion(CURSOR):
		CURSOR.close()
		CONN.close()

		os.rename(Database.fileName, str(int(time()))+"_" + Database.fileName)
		copy2(getPath(Database.baseFile), Database.fileName)

		CONN = sqlite3.connect(Database.fileName)
		CURSOR = CONN.cursor()

#there is no file
else:
	copy2(getPath(Database.baseFile), Database.fileName)

	CONN = sqlite3.connect(Database.fileName)
	CURSOR = CONN.cursor()

FILE = open(getPath("client.html"), "r", encoding='utf-8')
RAW_HTML = FILE.read()

VIEW = QWebEngineView()
VIEW_INSPECTOR = QWebEngineView()
CHANNEL = QWebChannel()
DB = Database(CURSOR, CONN)

CHANNEL.registerObject('database', DB)
VIEW.page().setWebChannel(CHANNEL)
VIEW_INSPECTOR.page().setInspectedPage(VIEW.page())

VIEW.setHtml(RAW_HTML, QUrl("file://"))
VIEW.setWindowTitle('Kassenbuch - Ultimate Edition')

VIEW_INSPECTOR.show()
VIEW.show()

sys.exit(APP.exec_())
