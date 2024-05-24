const express = require('express')
const cors = require('cors');
const app = express()

const userRoute = require('./routes/userRoute')
const factoryRoute = require('./routes/factoryRoute')

app.use(express.json())
app.use(cors())

app.use('/api/user', userRoute)
app.use('/api/factory', factoryRoute)

const PORT = 5000
app.listen(PORT, () => {
	console.log('Server listening on PORT:', PORT);
  });