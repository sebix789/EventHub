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

    // Query the database for all events with the given username
    const events = await Event.find({ username })

    res.status(200).json(events)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

export default router
