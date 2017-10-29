if (process.env.NODE_ENV === 'production') {
	module.exports = {mongoURI: 'mongodb://Admin:1234567890@ds241055.mlab.com:41055/vidjot-prod'}
} else {
	module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}