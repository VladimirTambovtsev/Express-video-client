const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser  = require('body-parser');
const mongoose  = require('mongoose');

const app = express();

const port = 3000;


//map global promise 
mongoose.Promise = global.Promise;

//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
	useMongoClient: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

//Handlebars middleware
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars'); 

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
	const title = 'Welcome';
	res.render('index', {title});
});

app.get('/about', (req, res) => {
	res.render('about');
});

// Add Idea Form
app.get('/ideas/add', (req, res) => {
	res.render('ideas/add');
});

// Process Form
app.post('/ideas', (req, res) => {
	let errors = [];

	if (!req.body.title) {
		errors.push({text: "Please add a title"});
	}
	if (!req.body.details) {
		errors.push({text: "Please add some details"});
	}

	if (errors.length > 0) {
		res.render('ideas/add', {
			errors,
			title: req.body.title,
			details: req.body.details
		});
	} else {
		res.send('passed'); 
	}
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
}); 