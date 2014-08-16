##__Begin Imports__##
import tornado.ioloop, tornado.web, tornado.websocket
from tornado.options import define, options, parse_command_line
import sqlite3 as sql
import json
from sqlManager import Database;
##__End Imports__##

##__Begin Variable Definitions__##
clients = dict()
db = Database("./data/main.db")
delImg = open("./img/del.png")
##__End Variable Definitions__##

##__Begin Class Definitions__##
class MainHandler(tornado.web.RequestHandler):
	@tornado.web.asynchronous
	def get(self):
		self.render("index.html")
class jqueryHandler(tornado.web.RequestHandler):
	@tornado.web.asynchronous
	def get(self):
		self.render("./js/jquery.js");

class WebSocketHandler(tornado.websocket.WebSocketHandler):
    def open(self, *args):
        self.id = self.get_argument("Id")
        self.stream.set_nodelay(True)
        clients[self.id] = {"id": self.id, "object": self}

    def on_message(self, message):        
        #prints what has been requested and by whom
        print "Client %s requested : %s" % (self.id, message)

        #returns what has been requested to client
        #0 = the file list; otherwise a file
        try:
        	if int(message) == 0:
        		self.write_message(json.dumps(db.getFileList()))
        except:
        	self.write_message(json.dumps(db.getFile(message)))
        
    def on_close(self):
        if self.id in clients:
            del clients[self.id]

class ListHandler(tornado.web.RequestHandler):
	@tornado.web.asynchronous
	def get(self):
		self.render("list.html");

class DelHandler(tornado.web.RequestHandler):
	@tornado.web.asynchronous
	def get(self):
		self.write(delImg.read())
		self.finish()

class Application(tornado.web.Application):
	def __init__(self):
		handlers = [
		(r"/", MainHandler),
		(r"/w", WebSocketHandler),
		(r"/jquery", jqueryHandler),
		(r"/list", ListHandler),
		(r"/del", DelHandler),
		]
		settings = {
			"debug": True,
		}
		tornado.web.Application.__init__(self, handlers, **settings)
##__End Class Definitions__##

##__Begin Initialization__##
if __name__ == "__main__":
	application = Application()
	application.listen(8888)
	tornado.ioloop.IOLoop.instance().start()
##__End Initialization__##