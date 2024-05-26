const express = require('express')
const cors = require('cors');
const app = express()

const userRoute = require('./routes/userRoute')
const factoryRoute = require('./routes/factoryRoute')
//const chocolateRoute = require('./routes/chocolateRoute')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/api/user', userRoute)
app.use('/api/factory', factoryRoute)
//app.use('/api/chocolate', chocolateRoute)

const PORT = 5000
app.listen(PORT, () => {
	console.log('Server listening on PORT:', PORT);
  });