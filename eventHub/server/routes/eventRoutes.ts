import express, { Request, Response } from 'express'
import multer from 'multer'
import Event, { EventInterface } from '../models/Event'

const router = express.Router()
const upload = multer()

router.post(
  '/createEvent',
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      const { username, title, date, location, description } = req.body
      const image = req.file?.buffer.toString('base64')

      // Check if an event with the given title already exists
      const existingEvent = await Event.findOne({ title })
      if (existingEvent) {
        return res
          .status(400)
          .json({ message: 'An event with this title already exists' })
      }
      const newEvent: EventInterface = new Event({
        username,
        title,
        date,
        location,
        description,
        image
      })

      await newEvent.save()

      res.status(201).json({ message: 'Event created successfully' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
)

router.get('/getEvents/:username', async (req: Request, res: Response) => {
  try {
    const username = req.params.username

    // Wypytanie bazy danych o wszystkie wydarzenia przypisane do użytkownika
    const events = await Event.find({ username })

    res.status(200).json(events)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/getAllEvents', async (req: Request, res: Response) => {
  try {
    const today: Date = new Date()
    today.setHours(0, 0, 0, 0)

    const events = await Event.find({ date: { $gte: today } }).sort({ date: 1 })
    res.status(200).json(events)
  } catch (error) {
    console.error('Error while fetching events:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/getEventsByDate/:date', async (req: Request, res: Response) => {
  try {
    const date = req.params.date

    const events = await Event.find({ date: { $eq: new Date(date) } }).sort({
      date: 1
    })
    res.status(200).json(events)
  } catch (error) {
    console.error('Error while fetching events:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/getEventsThisWeek', async (req: Request, res: Response) => {
  try {
    // Pobranie dzisiejszej daty
    const today = new Date()

    // Obliczenie daty początkowej bieżącego tygodnia (poniedziałek)
    const startOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() + 1
    )

    // Obliczenie daty końcowej bieżącego tygodnia (niedziela)
    const endOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      startOfWeek.getDate() + 6
    )

    // Znalezienie wydarzeń w zakresie od startOfWeek do endOfWeek
    const events = await Event.find({
      date: { $gte: startOfWeek, $lte: endOfWeek }
    }).sort({ date: 1 })

    // Wysłanie znalezionych wydarzeń w odpowiedzi
    res.status(200).json(events)
  } catch (error) {
    console.error('Error while fetching events:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

export default router
