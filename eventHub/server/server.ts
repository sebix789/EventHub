import express, { Application } from 'express'
import mongoose, { ConnectOptions } from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import authRoutes from './routes/authRoutes'
import eventRoutes from './routes/eventRoutes'
import path from 'path'
import fs from 'fs'
import Event, { EventInterface } from './models/Event'

const app: Application = express()

app.use(cors())
app.use(bodyParser.json())

// Connect to MongoDB
const mongoURI = 'mongodb://127.0.0.1:27017/eventHubDB'
const mongooseOptions: ConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as any

mongoose
  .connect(mongoURI, mongooseOptions)
  .then(async () => {
    console.log('MongoDB connected')

    // Wczytywanie danych z pliku JSON
    try {
      const rawData = fs.readFileSync('sampleData.json')
      const jsonData: EventInterface[] = JSON.parse(rawData.toString())

      // Przekonwertowanie wartości daty do formatu Date
      jsonData.forEach(event => {
        if (
          typeof event.date === 'object' &&
          event.date.hasOwnProperty('$date')
        ) {
          const dateObject: any = event.date
          event.date = new Date(dateObject.$date)
        }

        // Przekonwertowanie zdjęcia na dane typu Base64
        if (event.image) {
          const imagePath = path.join(__dirname, 'eventsImg', `${event.image}`)
          const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' })
          event.image = base64Image
        }
      })

      // Wprowadzanie danych do bazy
      await Event.insertMany(jsonData)
      console.log('Data seeded successfully.')
    } catch (error) {
      console.error('Error seeding data:', error)
    }
  })
  .catch(error => {
    console.error('MongoDB connection error:', error)
  })

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
