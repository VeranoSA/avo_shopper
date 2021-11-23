const express = require('express');
const exphbs  = require('express-handlebars');
const helperFunction = require('./avo-shopper');

const app = express();
const PORT =  process.env.PORT || 3023;

const avoFunction = helperFunction(pool);

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');


app.get('/', function(req, res) {
	const shops = await avoFunction.listShops();
	res.render('index', {
		shops
	});
});

app.get('/shop/add', function(req, res) {

	res.render('/shop/add');
});

app.get('/shop/edit', function(req, res) {
	res.render('/shop/edit');
});

app.post('/shop/add', function(req, res) {
	avoFunction.createShop();
	res.redirect('/');
});



// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function() {
	console.log(`AvoApp started on port ${PORT}`)
});