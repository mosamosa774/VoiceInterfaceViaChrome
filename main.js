const https = require('http');
var url = require('url');
var fs = require('fs');

var path = require('path');

const port = 3000;

var server = https.createServer({pfx: fs.readFileSync('mysslserver.pfx'),passphrase: 'example'});
var msg = "";

server.on('request', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Request-Method', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    var Response = {
	"main": function(){
         var url = req.url; 
	 var tmp = url.split('.');
	 var ext = tmp[tmp.length - 1];
	 var p = '.' + url;
	 if(ext === 'js'){
         fs.readFile(p,function(err,data){
         res.writeHead(200,{"Content-Type":"text/javascript"});
         res.end(data,'utf-8');
	 });
	} else {
	    var fp = path.join(__dirname, 'record.html'); 
	    fs.readFile(fp, 'utf-8', function (err, text) {
		res.writeHead(200, {'Content-Type': 'text/html'});	   
		res.write(text);
		res.end();	
	    });
	};	
	},
        "webhook_get": function () {
            res.writeHead(200, {
                'content-Type': 'text/plain;charset=utf-8'
            });
            res.write(msg);
            res.end();
            msg = "";
        },
        "webhook_post": function () {
            res.writeHead(200, {
                'content-Type': 'text/plain'
            });

            var data = "";
            req.on('readable', function(chunk) {
                data += req.read();
            });
            req.on('end', function() {
                data = data.replace("null","");
                msg = data;
                res.end('done!!!');
            });
        }
    };
    var uri = url.parse(req.url).pathname;

    if (uri === "/webhook") {
        if(req.method === 'GET'){
            Response["webhook_get"]();
            return;
        } else {
            Response["webhook_post"]();
            return;
        }
    } else {
	Response["main"]();
	return;
    }
});
	
server.listen(port, () => {
  console.log('Server running at http://localhost:'+port+'/');
});
