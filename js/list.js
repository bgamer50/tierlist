window.filename = "";
function getArguments() {
	var parameters = location.search.substring(1).split("&");

	var temp = parameters[0].split("=");
	window.filename = unescape(temp[1]);
	WebSocketActivate();
}
function WebSocketActivate() {
	if ("WebSocket" in window) {
    	var ws = new WebSocket("ws://localhost:8888/w?Id=123456789");
    	ws.onopen = function() {
        	ws.send(window.filename);
    	};
    	ws.onmessage = function (evt) { 
    	    var received_msg = evt.data;
    	    console.log(received_msg);
    	    window.file = $.parseJSON(received_msg);
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
function parseData() {
	list = document.getElementById('thelist');
	/*remove all children*/ while(list.firstChild) { list.removeChild(list.firstChild); }
	for(var k = 0; k < window.file.length; k++) {
		e = document.createElement('li');
		e.textContent = window.file[k][1];
		list.appendChild(e);
	}

	var f3 = window.file[window.file.length - 1][window.file[0].length - 1] + 1;
	//add button
	var addbutton = document.createElement('input');
	addbutton.setAttribute('type', 'button');
	addbutton.setAttribute('value', "Add");
	addbutton.setAttribute('id', 'addbutton'); 
	addbutton.addEventListener("click", function(event) { 
		$.post("/x", JSON.stringify([window.filename, ".", document.getElementById("namebox").value, window.file[window.file.length - 1][2] + 1])); 
		WebSocketActivate();
		event.preventDefault(); 
	});

	//the text field "name box"
	var namebox = document.createElement('input');
	namebox.setAttribute('type', 'text');
	namebox.setAttribute('value', 'Enter Name');
	namebox.setAttribute('id', 'namebox');

	var addholder = document.createElement('li');
	addholder.appendChild(namebox);
	addholder.appendChild(addbutton);

	list.appendChild(addholder);

	//$('.sortable').sortable();
	$('.sortable').sortable().bind('sortupdate', function() {
		array = [];
		for(var k = 0; k < list.childNodes.length - 1; k++) {
			array.push(list.childNodes[k].innerText);
		}
		array.push(window.filename);
		$.post("/z", JSON.stringify(array));
	});

}
function WebSocketChangeRank(name, rank) {
	if ("WebSocket" in window) {
    	var ws = new WebSocket("ws://localhost:8888/ww?Id=123456789");
    	ws.onopen = function() {
    		data = [window.filename, name, rank];
        	ws.send(JSON.stringify(data));
    	};
    	ws.onmessage = function (evt) { 
    	    var received_msg = evt.data;
    	    console.log(received_msg);
    	    //update the table
    	    WebSocketActivate();
    	};
    	ws.onclose = function() { 
        	return;
    	};
	} else {
    	console.log("WebSockets not supported by browser.");
    	return;
	}
}