if (process.env.NODE_ENV === 'production') {
	module.exports = {mongoURI: 'mongodb://root:12345678@ds241055.mlab.com:41055/vidjot-prod'}
} else {
	module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}