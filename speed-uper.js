document.getElementsByTagName('*').length //1000 elements DOM per pagina
//document.getElementsByTagName('link').attr('stylesheet').length //els minims css

// links CSS
var link = document.getElementsByTagName('link');
var countCss = [];
for(x=0;x<link.length;x++){
	if(link[x].getAttribute('type') == 'text/css' || link[x].getAttribute('rel') == 'stylesheet' || link[x].getAttribute('href').indexOf('.css')!=-1){
		console.log("hi ha css");
		countCss.push(link[x]);
		console.log(link[x]);
	}
}

// Scripts
var script = document.getElementsByTagName('script');
var countScript = [];
for(x=0;x<script.length;x++){
	if(script[x].getAttribute('type') == 'text/javascript' || script[x].getAttribute('src')!=null){
		countScript.push(script[x]);
		console.log(script[x]);
	}
}

// HTTP Response Headers
var req = new XMLHttpRequest();
req.open('GET', document.location, false);
req.send(null);
var headers = req.getAllResponseHeaders(); //.toLowerCase();

headers = headers.split(/\n/);

for(i = 0; i < headers.length; i++){
	headers[i] = headers[i].split(": ");
}