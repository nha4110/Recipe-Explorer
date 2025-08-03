import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import signupRoute from './routes/signup.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json())

app.use('/api/signup', signupRoute)

app.get('/', (req, res) => {
  res.send('API is running')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
