const express = require('express');
const { engine } = require('express-handlebars');
const helperFunction = require('./avo-shopper');

const app = express();
const PORT = process.env.PORT || 3950;

const {
	Pool
} = require('pg');


const connectionString = 'postgres://iioxprfdwwlqeb:79c4e1fcbda4b467547787ea5e1efa788c384aeac9ec0d2bef4a32d9b7c07484@ec2-34-202-66-20.compute-1.amazonaws.com:5432/dbe2rq0k8lig6m';

//Set up an configuration on were we want to connect the database
const pool = new Pool({
	connectionString,
	ssl: {
		rejectUnauthorized: false,
	}
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
app.get('/', async function (req, res) {
	res.render('index', { topDeal: await avoFunction.topFiveDeals() });
});

//Add New Avo Deals
app.get('/newDeal', async function (req, res) {
	const shops = await avoFunction.listShops();
	res.render('addDeal', { shops });
})

app.post('/newDeal', async function (req, res) {
	await avoFunction.createDeal(req.body.shops, req.body.dealQty, req.body.dealPrice);
	res.redirect('/');
})

//Avo Deals For a given shop 
app.get('/show/:name/:shop', async function (req, res) {
	req.params.shop++;
	const avoDeals = await avoFunction.dealsForShop(req.params.shop);
	res.render('index', { avoDeals, name: req.params.name });
})

//Add a new shop with first letter upercase
app.post('/shops', async function (req, res) {
	let input = req.body.addshopInfo;
	let shopName = input[0].toUpperCase() + input.slice(1).toLowerCase();
	await avoFunction.createShop(shopName)
	res.redirect('/shops');
})

//List all shops
app.get('/shops', async function (req, res) {
	const shopList = await avoFunction.listShops();
	res.render('viewShops', { shopList });
})

app.get('/addShops', async function (req, res) {
	res.render('addShop');
})

// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function () {
	console.log(`AvoApp started on port ${PORT}`)
});