##__Begin Imports__##
import sqlite3 as sql
##__End Imports__##

##__Begin Class Definitions__##
class Database:
	def __init__(self, filename):
		self.connection = sql.connect(filename)

	def getFileList(self):
		cursor = self.connection.cursor()
		return cursor.execute("select * from filelist").fetchall()
	def getFile(self, filename):
		cursor = self.connection.cursor()
		return cursor.execute("select img, name, rank from files where filename = '" + filename + "' order by rank").fetchall()

##__End Class Definitions__##