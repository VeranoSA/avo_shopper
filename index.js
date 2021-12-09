const express = require('express');
const {engine}  = require('express-handlebars');
const helperFunction = require('./avo-shopper');

const app = express();
const PORT =  process.env.PORT || 3070;

const {
    Pool
} = require('pg');

let ssl = false
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:12345@localhost:5432/myavo';

if(process.env.DATABASE_URL){
    ssl = { rejectUnauthorized: false }
}
//Set up an configuration on were we want to connect the database
const pool = new Pool({
    connectionString,
    ssl
});

const avoFunction = helperFunction(pool);

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', engine({
    defaultLayout: 'main', layoutsDir: `${__dirname}/views/layouts`
}));

app.set('view engine', 'handlebars');

//List my top five deals 
app.get('/', async function(req, res) {
	const topFiveDeal = await avoFunction.topFiveDeals();
	res.render('index', {
		topDeal: topFiveDeal
	});
});

//List all shops selling avo
app.get('/shops', async function(req, res) {
	const listShops = await avoFunction.listShops();
	res.render('index', {
		listShops
	});
});

//Create/

/*app.post('/shop/add', function(req, res) {
	avoFunction.createShop();
	res.redirect('/');
});
*/
// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function() {
	console.log(`AvoApp started on port ${PORT}`)
});