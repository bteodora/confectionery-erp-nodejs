const express = require('express')
const cors = require('cors');
const app = express()

const userRoutes = require('./routes/userRoutes')

app.use(express.json())
app.use(cors())

app.use('/api/user', userRoutes)

const PORT = 5000
app.listen(PORT, () => {
	console.log('Server listening on PORT:', PORT);
  });