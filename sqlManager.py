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
	
	def changeRank(self, filename, name, rank):
		cursor = self.connection.cursor()
		cursor.execute("update files set rank=" + str(rank + 1) + " where filename = '" + filename + "' and rank=" + str(rank))
		cursor.execute("update files set rank=" + str(rank) + " where filename= '" + filename + "' and name='" + name + "'")
		self.connection.commit()

	def add(self, filename, image, name, rank):
		cursor = self.connection.cursor()
		cursor.execute("insert into files values ('" + image + "'," + "'" + name + "'," + str(rank) + ",'" + filename + "')")
		self.connection.commit()

	def update(self, filename, array):
		cursor = self.connection.cursor()
		cursor.execute("delete from files where filename = '" + filename + "'")
		self.connection.commit()
		for k in range(0, len(array)):
			self.add(filename, ".", array[k], k)

##__End Class Definitions__##