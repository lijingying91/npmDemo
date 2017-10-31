var http 	= require('http'),
	dns 	= require('dns'),
	fs 		= require('fs'),
	url 	= require('url'),
	querystring = require('querystring');

// http.createServer(function(req, res){
// 	res.writeHead(200, {'Content-Type': 'text/html'});
// 	var readPath = __dirname + '/' + url.parse('index.html').pathname;
// 	console.log(req);
// 	console.log(res);
// 	var indexPage = fs.readFileSync(readPath);
// 	res.end(indexPage);
// }).listen(3000, '127.0.0.1');

http.createServer(function(req, res){
	var pathname = url.parse(req.url).pathname;
	req.setEncoding('utf8');
	res.writeHead(200, {'Content-Type': 'text/html'});
	router(res, req, pathname);
}).listen(3000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');

function router(res, req, pathname){
	switch (pathname){
		case '/parse':
			parseDns(res, req);
			break;
		default:
			goIndex(res, req);
	}
}

function goIndex(res, req){
	var readPath = __dirname + '/' + url.parse('index.html').pathname;
	var indexPage = fs.readFileSync(readPath);
	res.end(indexPage);
}

function parseDns(res, req){
	var postData = "";
	req.addListener('data', function(postDataChunk){
		postData += postDataChunk;
	});
	req.addListener('end', function(){
		var retData = getDns(postData, function(domain, addresses){
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end("<html><head></head><div style='text-align: center;'>Domain:<span style='color:red'>" + domain + "</span>IP:<span style='color:red'>" + addresses.join(',') + "</span></div></html>");
		});
		return;
	});
}

function getDns(postData, callback){
	var domain = querystring.parse(postData).search_dns;
	// console.log(querystring.parse(postData));
	dns.resolve(domain, function(err, addresses){
		if(!addresses){
			addresses = ['不存在域名']
		}
		callback(domain, addresses);
	})
}