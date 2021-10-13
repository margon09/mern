const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()

// routes ('prefix to the future path')
app.use('/api/auth', require('./routes/auth.routes'))

//connecting to mongo db
const PORT = config.get('port') || 5000

async function start() {
	try {
		await mongoose.connect(config.get('mongoUri'), {
			useNewUrlParser: true,
			useUnifiedTopology: true
			// useCreateIndex: true
		})
		app.listen(PORT, () => console.log(`App started at port ${PORT}`))
	} catch (e) {
		console.log('Server error', e.message)
		process.exit(1)
	}
}

start()
