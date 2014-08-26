window.filelist = null;
function parseData() {
	fields = ['field1', 'field2', 'field3'];
	data = [];
	for(var k = 0; k < window.filelist.length; k++) {
		var f3 = "Private";
		if(filelist[k][2] == 1)
			f3 = "Public";

		var f1 = "<a href='/list?name=" + window.filelist[k][1] + "'>" + window.filelist[k][1] + "</a>";

		data.push({field1: f1, field2: window.filelist[k][0], field3: f3});
	}
	var rows = '';
	$.each(data, function(index, item) {
		var row = '<tr>';
			$.each(fields, function(index, field) {
    		row += '<td>' + item[field+''] + '</td>';
		});
		rows += row + '<tr>';
	});
	$('#' + 'filetable' + ' tbody').html(rows);
}
function WebSocketActivate() {
	if ("WebSocket" in window) {
    	var ws = new WebSocket("ws://localhost:8888/w?Id=123456789");
    	ws.onopen = function() {
        	ws.send('0');
    	};
    	ws.onmessage = function (evt) { 
    	    var received_msg = evt.data;
    	    console.log(received_msg);
    	    window.filelist = $.parseJSON(received_msg);
    	    parseData();
    	};
    	ws.onclose = function() { 
        	return;
    	};
	} else {
    	//WebSockets not supported by browser
    	return;
	}
}
function pause(t) { sTime = new Date().getTime(); while(new Date().getTime() - sTime < t); }
window.onload = WebSocketActivate;