const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

async function start(){
    try {
        await mongoose.connect(config.get('mongoUri'), {
            
        })
    } catch (e) {
        console.log('Server error', e.message)
        process.exit(1)
    }
}

start()

const app = express();

const PORT = config.get('port') || 5000
app.listen(PORT, () => console.log(`App started at port ${PORT}`))