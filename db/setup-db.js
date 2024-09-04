const fs = require('fs')
require('dotenv').config()
db = require('./connect')

db.query(fs.readFileSync('./db/setup.sql').toString()).then(data => console.log("db setup complete")).catch(err => console.log("The errors is :", err))