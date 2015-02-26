var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require('path');
var app = express();

var mongoose = require('mongoose'); // mongodb
mongoose.connect(process.env.MONGOLAB_URI); // connect to the mongolab database


app.configure(function(){
	// server port number
	app.set('port', process.env.PORT || 5000);

	//  templates directory to 'views'
	app.set('views', __dirname + '/views');

	// setup template engine - we're using Hogan-Express
	app.set('view engine', 'html');
	app.set('layout','layout'); // use layout.html as the default layout 
	app.engine('html', require('hogan-express')); // https://github.com/vol4ok/hogan-express


	app.use(express.favicon());
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use('/public', express.static('public'));

	// app.db = mongoose.connect(process.env.MONGOLAB_URI);

});


var Info = mongoose.model('Info', {
	Date: String,
	imageData: String
});


////////////////////// ROUTES //////////////////////
// if routes are "/" render the index file
app.get('/', function(req,res){
	res.render('index.html');
});


app.get('/gallery', function(req,res){
	Info.find({}, function(err, info){
		if(err){
			res.json(err);
		} else {
			// info data is the object that I defined in the gallery
			res.render('gallery.html', { infoData: info })
		}
	});
});


//http://stackoverflow.com/questions/5830513/how-do-i-limit-the-number-of-returned-items
app.get('/new', function(req,res){
	// only shows the most recent one
	Info.find({}).sort({'Date':'asc'}).limit(1).exec(function(err,info){
		if(err){
			res.json(err);
		} else {
			// info data is the object that I defined in the gallery
			res.render('newdrawing.html', { infoData: info })
		}
	});

});


app.post('/submitDrawing', function(req,res){
	var infoData = {
		Date: req.body.Date,
		imageData : req.body.imageData
	}

	var i = new Info(infoData);
	i.save(function (err, doc){
		if (err) {
			console.log(err);
		} else {
			console.log("SAVED INTO DATABASE!!!!!!!!!");
			res.redirect('/gallery');
		}
	});

});


////////////////////////////////////////////////////

var server = http.createServer(app);
server.listen(app.get('port'), function(){
	console.log('express server listening on port ' + app.get('port'));
})

