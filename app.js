const express = require('express');
const exphbs  = require('express-handlebars');
const methodOverrride  = require('method-override'); // to change "put" to "post"
const flash = require('connect-flash');  // just for nice perfomance messaging
const session = require('express-session'); // creating sessions for auth
const bodyParser  = require('body-parser');
const mongoose  = require('mongoose');

const app = express();
 


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

// Method override middleware
app.use(methodOverrride('_method'));

// Express session middleware
app.use(session({
	secret: 'secret',
	resave: true,
	saveUnitialized: true
}));
// Nice messaging middleware
app.use(flash());

//Global variables
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});


app.get('/', (req, res) => {
	const title = 'Welcome';
	res.render('index', {title});
});

app.get('/about', (req, res) => {
	res.render('about');
});

app.get('/ideas', (req, res) => {
	Idea.find({})	// list from mongo
		.sort({date: 'desc'})
		.then(ideas => {
			res.render('ideas/index', {
				ideas
			});
		});  
});


// Add Idea Form
app.get('/ideas/add', (req, res) => {
	res.render('ideas/add');
});

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
	Idea.findOne({
		_id: req.params.id
	})
	.then(idea => {
		res.render('ideas/edit', {
			idea
		})
	});
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
		const newUser = {
			title: req.body.title,
			details: req.body.details
		}
		new Idea(newUser)
			.save()
			.then(idea => {
				req.flash('success_msg', 'Video idea added');
				res.redirect('/ideas');
			});
	}
});

//Edit Form process (updating)
app.put('/ideas/:id', (req, res) => {
	Idea.findOne({
		_id: req.params.id
	})
	.then(idea => {
		// new values 
		idea.title = req.body.title;
		idea.details = req.body.details;

		idea.save()
			.then(idea => {
				res.redirect('/ideas');
			});
	});
});


//Delete Idea
app.delete('/ideas/:id', (req, res) => {
	Idea.remove({_id: req.params.id})
		.then(() => {
			req.flash('success_msg', 'Video idea removed');
			res.redirect('/ideas');
		});
});


// User Login Route
app.get('/users/login', (req, res) => {
	res.send('login');
});

// User Register Route
app.get('/users/register', (req, res) => {
	res.send('register');
});

const port = 3000;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
}); 