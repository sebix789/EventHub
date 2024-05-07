import express, { Application } from 'express'
import mongoose, { ConnectOptions } from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import authRoutes from './routes/authRoutes'

const app: Application = express()

app.use(cors())
app.use(bodyParser.json())

// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/eventHubDB'
const mongooseOptions: ConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as any

mongoose
  .connect(mongoURI, mongooseOptions)
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch(error => {
    console.error('MongoDB connection error:', error)
  })

// Routes
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
