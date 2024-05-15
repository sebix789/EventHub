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

    // Pobranie daty z parametru żądania
    const selectedDate = new Date(date)

    // Ustawienie godziny na 00:00:00 dla wybranej daty
    const fromDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      0,
      0,
      0
    )

    // Ustawienie godziny na 23:59:59 dla następnego dnia
    const nextDay = new Date(selectedDate)
    nextDay.setDate(nextDay.getDate() + 1)
    const toDate = new Date(
      nextDay.getFullYear(),
      nextDay.getMonth(),
      nextDay.getDate(),
      0,
      0,
      0
    )

    const events = await Event.find({
      date: { $gte: fromDate, $lt: toDate }
    }).sort({ date: 1 })
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

router.get('/getEventByTitle/:title', async (req: Request, res: Response) => {
  try {
    const event = await Event.findOne({ title: req.params.title })
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.status(200).json(event)
  } catch (error) {
    console.error('Error while fetching event:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/search', async (req: Request, res: Response) => {
  let search = req.query.searchQuery
  let find = await Event.find({
    title: { $regex: new RegExp('.*' + search + '.*', 'i') }
  })
    .limit(5)
    .exec()

  res.send(find)
})

router.put(
  '/updateEvent/:id',
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      const { date, location, description } = req.body
      const image = req.file?.buffer.toString('base64')
      const event = await Event.findOne({ _id: req.params.id })

      if (!event) {
        return res.status(404).json({ message: 'Event not found' })
      }

      const updateEventFields: Partial<EventInterface> = {}

      if (date) {
        updateEventFields.date = date
      }

      if (location) {
        updateEventFields.location = location
      }

      if (description) {
        updateEventFields.description = description
      }
      if (image) {
        updateEventFields.image = image
      }

      await Event.updateOne({ _id: req.params.id }, { $set: updateEventFields })

      const updatedEventFromDb = await Event.findOne({ _id: req.params.id })
      res.json(updatedEventFromDb)
    } catch (error) {
      res
        .status(500)
        .json({ message: 'An error occurred', error: (error as Error).message })
    }
  }
)

export default router
