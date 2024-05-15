import express, { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import multer from 'multer'
import User, { UserInterface } from '../models/User'
import { authenticateUser } from '../middleware/authenticateService'

const router = express.Router()
const upload = multer()

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstname, surname } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exist' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser: UserInterface = new User({
      username,
      email,
      password: hashedPassword,
      firstname,
      surname
    })

    await newUser.save()

    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    const user = await authenticateUser(username, password)
    res.status(200).json(user)
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === 'User does not exist' ||
        error.message === 'Invalid credentials'
      ) {
        res.status(401).json({ message: error.message })
      } else {
        res.status(500).json({ message: 'An error occurred' })
      }
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
})

router.put(
  '/update/:username',
  upload.single('userImage'),
  async (req: Request, res: Response) => {
    try {
      const { username, firstname, surname, email, password } = req.body
      const userImage = req.file?.buffer.toString('base64')
      const user = await User.findOne({ username })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const updateFields: Partial<UserInterface> = {}

      if (firstname) {
        updateFields.firstname = firstname
      }

      if (surname) {
        updateFields.surname = surname
      }

      if (email) {
        updateFields.email = email
      }

      if (password) {
        updateFields.password = await bcrypt.hash(password, 10)
      }

      if (userImage) {
        updateFields.userImage = userImage
      }

      await User.updateOne({ username }, { $set: updateFields })

      const updatedUserFromDb = await User.findOne({
        username: updateFields.username || username
      })

      res
        .status(200)
        .json({ message: 'Profile updated', user: updatedUserFromDb })
    } catch (error) {
      console.error('Failed to update profile:', error)
      res
        .status(500)
        .json({ message: 'An error occurred', error: (error as Error).message })
    }
  }
)

router.get('/users/:username', async (req: Request, res: Response) => {
  try {
    const username = req.params.username

    const actualUserData = await User.find({ username })

    res.status(200).json(actualUserData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.put(
  '/updateFavorites/:username',
  async (req: Request, res: Response) => {
    try {
      const username = req.params.username
      const favorites = req.body.favorites

      const user = await User.findOne({ username })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      user.favorites = favorites
      await user.save()

      res.status(200).json({ message: 'Favorites updated successfully' })
    } catch (error) {
      console.error('Failed to update favorites:', error)
      res
        .status(500)
        .json({ message: 'An error occurred', error: (error as Error).message })
    }
  }
)

router.get('/getFavorites/:username', async (req: Request, res: Response) => {
  try {
    const username = req.params.username

    const user = await User.findOne({ username })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json(user.favorites)
  } catch (error) {
    console.error('Failed to get favorites:', error)
    res
      .status(500)
      .json({ message: 'An error occurred', error: (error as Error).message })
  }
})

export default router
