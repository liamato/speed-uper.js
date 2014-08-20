"use strict";

/* 
*   
*   @author = Marc Duran Olivé
*
*   @license = BSD 3-Clause License
*
*
*   serverside = path to the serverside file
*    
*   server = local / remote
*
*
*/


var server = 'local';

var serverside = 'serverside.php';


var locationAjaxHeaders, httpVersion;
ajax(serverside + '?url=' + encodeURIComponent(document.location.href),
 function(data, xmlhttp){
     locationAjaxHeaders = JSON.parse(data);
     httpVersion = locationAjaxHeaders['Headers']['httpVersion'];
     //console.log(data);
     //return JSON.parse(data)['cURL']['http_code'];
 },function(error, xmlhttp){
     //console.log('Error: ' + error);
     return "No Internet Connection or the Public Validation Server is down";
 }, 'POST', false);


//source
var source;
function linea(lineToSearch){
    if(source != undefined){
	if(location.href.indexOf(('http://localhost'||'https://localhost')) === -1){
	    source = 'error';
	    ajax(serverside + '?opts=content&url=' + encodeURIComponent(location.href), function(data, xmlhttp){source = data;},function(){}, 'POST', 'false');
	}//else{source = location.href.indexOf(('http://localhost'||'https://localhost'));}
    }
    if(source != undefined){
	if(source != 'error'){
	    var lineArray = source.split('\n');
	    return lineArray.indexOf(lineToSearch);
	}else{linea(lineToSearch);}
    }
}

var elems = document.getElementsByTagName('*'), domElems = elems.length; //1000 elements DOM per pagina
//document.getElementsByTagName('link').attr('stylesheet').length //els minims css

var GET = getUrlVars();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

var debug = false;

if(GET['debug'] === "true"){debug = true;}

if(debug == true){
	console.log("\n%c<Speed-uper>\n", "color: rgb(236, 113, 0);");

	console.log('%c File path: %c' + document.location/*.getAttribute('herf')*/,'color:rgb(255, 255, 127);background-color:yellowgreen;display:block;hxbeight:100%;with:100%;','color:black;background-color:yellowgreen;display:block;height:100%;with:100%;');
	if(domElems > 1000){
		console.warn("DOM elements: " + domElems);
	}else{
		console.info("%cDOM elements: %c" + domElems,'color:blue;','color: black;');
	}}

// links CSS
var link = document.getElementsByTagName('link');
var countCss = [];
if(debug == true){console.log('Links CSS:');}
for(var x=0;x<link.length;x++){
	if(link[x].getAttribute('type') == 'text/css' || link[x].getAttribute('rel') == 'stylesheet' || link[x].getAttribute('href').indexOf('.css')!=-1 || link[x].getAttribute('href').indexOf('.css')!=-1){
		//console.log("hi ha css");
		countCss.push(link[x]);
		if(debug == true){console.log("\t" + countCss[x].getAttribute('href'));}
	}
}

// Scripts
var script = document.getElementsByTagName('script');
var countScript = [];
if(debug == true){console.log('Links to scripts:');}
for(var x = 0; script.length > x; x++){
	if(/*script[x].getAttribute('type') == 'text/javascript' || */script[x].getAttribute('src')!=null){
		countScript.push(script[x]);
		if(debug == true){console.log("\t" + script[x].getAttribute('src'));}
	}
}

// Embed CSS & JS
var embedCSS = [], embedJS = [], inlineCSS = [], inlineJS = [];
var events = ['onclick', 'ondblclick', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseover', 'onmouseout', 'onmouseup', 'onkeydown', 'onkeypress', 'onkeyup', 'onabort', 'onerror', 'onload', 'onresize', 'onscrll', 'onunload'];

//embedCSS
for(var x = 0; document.getElementsByTagName('style').length > x; x++){
	if(document.getElementsByTagName('style')[x].childNodes[0] != undefined){
		embedCSS.push(document.getElementsByTagName('style')[x]);
}}

//embedJS
for(var x = 0; script.length > x; x++){
	if(script[x].getAttribute('src') === null){
		embedJS.push(script[x]);
}}

//inlineCSS
for(var x = 0; elems.length > x; x++){
	if(elems[x].getAttribute('style') != null){
		inlineCSS.push(elems[x]);
}}

//inlineJS
for(var x = 0; elems.length > x; x++){
    for(var y = 0; events.length > y; y++){
	if(elems[x].getAttribute(events[y]) != null){
		inlineJS.push(elems[x]);
	}
    }
}


/* ++Ajax++ */

function ajax(url, callback, error, meth, async){
    if(meth === undefined){meth = 'GET';}
    if(async === undefined){async = true;}else if(async === 'false'){async = false;}
    var xmlhttp = (window.XMLHttpRequest) ? new window.XMLHttpRequest() : new window.ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.onreadystatechange = function(){
	if(xmlhttp.readyState === 4){
	    if(xmlhttp.status === 200){

		if(typeof callback === 'function'){
		    callback(xmlhttp.responseText, xmlhttp);
		}

	    }else{
		if(typeof error === 'function'){
		    error(xmlhttp.statusText, xmlhttp);
		}
	    }
	}
    };

    xmlhttp.open(meth, url, async);
    xmlhttp.send();
}

/* --Ajax-- */

var JSONdata;
function publicAjax(URI, async){
    if(debug){console.log(URI + '\n' + encodeURIComponent(URI) + '\n' + serverside + '?url=' + encodeURIComponent(URI));}
    ajax(serverside + '?url=' + encodeURIComponent(URI),
	 function(data, xmlhttp){
	     JSONdata = JSON.parse(data);
	     //console.log(data);
	     //return JSON.parse(data)['cURL']['http_code'];
	 },function(error, xmlhttp){
	     //console.log('Error: ' + error);
	     return "No Internet Connection or the Validation Server is down";
	 }, 'POST', async);
}



// HTTP Response Headers as array and HTTP status
function httpReq(meth, loc, ret){
	if(!ret){ret = 'all'}
	var req = new XMLHttpRequest();
		req.open(meth, loc, false);
		req.send();
	if(ret == 'all'){

		var headers = req.getAllResponseHeaders();
		headers = headers.split(/\n/);

		for(i = 0; i < headers.length; i++){
			headers[i] = headers[i].split(": ");
		}

		return headers

	}else if(ret == 'status'){
		return req.status;
	}
}

var headers = httpReq('GET', document.location['href']);

var headersSet = [];

// Gzip & Deflate
	// gzip or deflate, compresion;
if (headers.indexOf('Content-Encoding') == 'gzip'){headersSet['gzip'] = true;}else{headersSet['gzip'] = false;}
if (headers.indexOf('Content-Encoding') == 'deflate'){headersSet['deflate'] = true;}else{headersSet['deflate'] = false;}


// Cache Control
if (headers.indexOf('Cache-Control')){headersSet['cache'] = true;}else{headersSet['cache'] = false;}
if (headers.indexOf('Expires')){headersSet['expires'] = true;}else{headersSet['expires'] = false;}


// ETag
if (headers.indexOf('ETag')){headersSet['etag'] = true;}else{headersSet['etag'] = false;}


// Broken links
if(debug == true){console.log('Broken links:');}
var blinks = [];
var tags = ['a', 'audio', 'base', 'embed', 'form', 'img', 'link', 'object', 'script', 'source', 'track', 'video'];
var attrs = ['href', 'src', 'action', 'data'];
var atrTag = [[tags[0], attrs[0]], [tags[1], attrs[1]], [tags[2], attrs[0]], [tags[3], attrs[1]], [tags[4], attrs[2]], [tags[5], attrs[1]], [tags[6], attrs[0]], [tags[7], attrs[3]], [tags[8], attrs[1]], [tags[9], attrs[1]], [tags[10], attrs[1]], [tags[11], attrs[1]]];
var attr;
for(var i = 0; i < tags.length; i++){
	//console.log('for 1, i: <' + tags[i] + '>');
	switch(i){
		case 0:
			attr = attrs[0];
			break;
		case 1:
			attr = attrs[1];
			break;
		case 2:
			attr = attrs[0];
			break;
		case 3:
			attr = attrs[1];
			break;
		case 4:
			attr = attrs[2];
			break;
		case 5:
			attr = attrs[1];
			break;
		case 6:
			attr = attrs[0];
			break;
		case 7:
			attr = attrs[3];
			break;
		case 8:
			attr = attrs[1];
			break;
		case 9:
			attr = attrs[1];
			break;
		case 10:
			attr = attrs[1];
			break;
		case 11:
			attr = attrs[1];
			break;}
	if(document.getElementsByTagName(tags[i]).length > 0){
		tags[tags[i]] = document.getElementsByTagName(tags[i]);
		for(var e = 0; e < tags[tags[i]].length; e++){
			//console.log('for 2 if, i: ' + tags[i] + "[" + e + "]");
			//console.log(tags[i][e]);
            if(tags[tags[i]][e].getAttribute(attr)!= null){
                if(tags[tags[i]][e].getAttribute(attr).indexOf("http")!= -1){
			         publicAjax(tags[tags[i]][e].getAttribute(attr), 'false');
			         blinks[tags[tags[i]][e]] = JSONdata['cURL']['http_code'];
			         if(debug === true){console.log(JSONdata);}
		        }else{
                    if(server === 'local'){
			             blinks[tags[tags[i]][e]] = httpReq('GET', tags[tags[i]][e].getAttribute(attr), 'status');
                    }else if(server === 'remote'){
                        if(blinks[tags[tags[i]][e]] != 200){
                            if(location.search != ''){
			                     var folder = location.href.split('?');
			                     folder = folder[0].slice(0, folder[0].lastIndexOf('/') + 1);
			                 }else{
			         	       var folder = location.href.slice(0, location.href.lastIndexOf('/') + 1);
                             }
			                 console.log(folder + tags[tags[i]][e].getAttribute(attr));
			                 publicAjax(folder + tags[tags[i]][e].getAttribute(attr), 'false');
			                 blinks[tags[tags[i]][e]] = JSONdata['cURL']['http_code'];
			                 if(debug === true){console.log(JSONdata);}
                        }
                    }
                }
            }

			if(debug == true){
				var trencat;
				if(blinks[tags[tags[i]][e]] == 200){trencat = ' No Problem';}else{ trencat = '';}
				console.log("\t" + tags[tags[i]][e].getAttribute(attr));
				console.log("\t\tHTTP status: %c" + blinks[tags[tags[i]][e]] + trencat, "color: #00B8FF;");
			}
		}
	}
}

// UserAgent
var ua = window.navigator.userAgent;
if(debug == true){console.log(ua);}
if(ua.toLowerCase().indexOf('firefox') > 0){
    ua = 'firefox';
}else if(ua.toLowerCase().indexOf('safari') > 0){
    if(ua.toLowerCase().indexOf('chrome') > 0){
	if(ua.indexOf('OPR') > 0){
	    ua = 'opera';
	}else{
	    ua = 'chrome';
	}
    }else{
	ua = 'safari';
    }
}
if(debug == true){console.log(ua);}

if(debug == true){console.log("\n%c<Speed-uper>\n", "color: rgb(236, 113, 0);");}



/*********************************\
 **                             **
 **           Design            **
 **                             **
\*********************************/




if(debug != true){

	console.clear();
	console.log("\n%c<Speed-uper>\n", "color: rgb(236, 113, 0);");

	// Document path
	console.log('%c File path: %c' + document.location/*.getAttribute('herf')*/,'color:rgb(255, 255, 127);background-color:yellowgreen;display:block;height:100%;with:100%;','color:black;background-color:yellowgreen;display:block;height:100%;with:100%;');

    console.group('Backend');
	// HTTP version
	if(httpVersion === 'HTTP/1.0'){
	    console.warn('HTTP Version:');
	    console.log('\t%cYou use HTTP 1.0, that doesn\'t allow HTTP compresion','color:red;');
	}else if(httpVersion === 'HTTP/1.1'){
	    console.log('HTTP Version:');
	    console.log('\t%cWell Done, you use ' + httpVersion,'color:green;');
	}

        // GZIP & DEFLATE
        if(headersSet['gzip'] === true || headersSet['deflate'] === true){
	    console.log('HTTP Compresion:');
	    console.log('\t%cWell Done, you have HTTP Compresion activated', 'color:green;');
	}else{
	    console.warn('HTTP Compresion:');
	    console.log('\t%cThere should activate HTTP Compresion', 'color:red;');
	}

        // Cache Control
        if(headersSet['cache'] === true || headersSet['expires'] === true){
	    console.log('Cache Control:');
	    console.log('\t%cWell Done, you are Caching files', 'color:green;');
	}else{
	    console.warn('Cache Control:');
	    console.log('\t%cThere should Cache the static files', 'color:red;');
	}

        // ETag
        if(headersSet['etag'] === true){
	    console.log('ETag:');
	    console.log('\t%cWell Done, you have ETag enabled','color:green;');
	}else{
	    console.warn('ETag:');
	    console.log('\t%cThere should ','color:red;');
	}
    console.groupEnd();

    console.group('Frontend');    
	// DOM elements
	if(domElems > 1000){
		console.warn("DOM elements: " + domElems + " Only hould have 1000 DOM elements per page");
	}else{
		console.info("%cDOM elements: %c" + domElems,'color:blue;','color: black;');
	}

	//Links CSS
	if(countCss.length > 1){
	    console.warn('%cLinks CSS:%c ' + countCss.length, 'color:rgb(140, 0, 213);','color:black;');
	    console.groupCollapsed('\t%cThere should have only one CSS file', 'color:red;');
		for(var x = 0; x < countCss.length; x++){
			if(countCss[x] != undefined && countCss[x] != null){
				console.log("\t" + countCss[x].getAttribute('href'));
			}
		}
	    console.groupEnd();
	}else{
	    console.log('%cLinks CSS:%c ' + countCss.length, 'color:rgb(140, 0, 213);','color:black;');
	    console.log('\t%cWell Done, you have only one CSS file','color: green;');
	}

	// Links to Scripts
	if(countScript.length > 1){
	    console.warn('%cLinks to scripts:%c ' + countScript.length, 'color:rgb(140, 0, 213);','color:black;');
	    console.groupCollapsed('\t%cThere should have only one script', 'color:red;');
	    for(var x = 0; x < countScript.length; x++){
		if(countScript[x] != undefined && countScript[x] != null){
			console.log("\t%o", countScript[x]/*.getAttribute('src')*/);
		}
	    }
	    console.groupEnd();
	}else{
	    console.log('%cLinks to scripts:%c ' + countScript.length, 'color:rgb(140, 0, 213);','color:black;');
	    console.log('\t%cWell Done, you have only one script','color: green;');
	}

        //Embed code
        if(embedCSS.length + embedJS.length + inlineCSS.length + inlineJS.length > 0){
	    console.warn('%cEmbed Code', 'color:rgb(140, 0, 213);');
	    console.groupCollapsed('\t%cThere shouldn\'t have any embed code', 'color:red;');
	    if(embedCSS.length > 0){
		console.groupCollapsed('Embed CSS');
		for(var x = 0; embedCSS.length > x; x++){
		    console.log('\t%o', embedCSS[x]);
		}
		console.groupEnd();
	    }
	    if(embedJS.length > 0){
		console.groupCollapsed('Embed JS');
		for(var x = 0; embedJS.length > x; x++){
		    console.log('\t%o', embedJS[x]);
		}
		console.groupEnd();
	    }
	    if(inlineCSS.length > 0){
		console.groupCollapsed('Inline CSS');
		for(var x = 0; inlineCSS.length > x; x++){
		    console.log('\t%o', inlineCSS[x]);
		}
		console.groupEnd();
	    }
	    if(inlineJS.length > 0){
		console.groupCollapsed('Inline JS');
		for(var x = 0; inlineJS.length > x; x++){
		    console.log('\t%o', inlineJS[x]);
		}
		console.groupEnd();
	    }
	    console.groupEnd();
	}
    
	// Broken links
	console.group('%cBroken links:', 'color:rgb(140, 0, 213);font-weight:normal;');
	for(var i = 0; i < tags.length; i++){
		switch(i){
			case 0: attr = attrs[0]; break;
			case 1: attr = attrs[1]; break;
			case 2: attr = attrs[0]; break;
			case 3: attr = attrs[1]; break;
			case 4: attr = attrs[2]; break;
			case 5: attr = attrs[1]; break;
			case 6: attr = attrs[0]; break;
			case 7: attr = attrs[3]; break;
			case 8: attr = attrs[1]; break;
			case 9: attr = attrs[1]; break;
			case 10: attr = attrs[1]; break;
			case 11: attr = attrs[1]; break;}
		if(document.getElementsByTagName(tags[i]).length > 0){
			for(e = 0; e < tags[tags[i]].length; e++){
				if(blinks[tags[tags[i]][e]] != 200){
					console.log("\t%o", tags[tags[i]][e]/*.outerHTML*/);
					console.log("\t\tHTTP status: %c" + blinks[tags[tags[i]][e]], "color: #00B8FF;");
				}
			}
		}
	}
        console.groupEnd();
    console.groupEnd();
	console.log("\n%c<Speed-uper>\n", "color: rgb(236, 113, 0);");
}
