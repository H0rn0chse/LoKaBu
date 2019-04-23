#! python3.7

import sys
import os
import sqlite3

#local files
sys.path.append("modules")
from database import *

sys.argv.append("--disable-web-security")
APP = QApplication(sys.argv)

CONN = sqlite3.connect("database.sql")
CURSOR = CONN.cursor()

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
