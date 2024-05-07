import express, { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User, { UserInterface } from '../models/User'
import { authenticateUser } from '../middleware/authenticateService'

const router = express.Router()

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exist' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser: UserInterface = new User({
      username,
      email,
      password: hashedPassword
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

/////TO FIX GET ROUTE/////
// router.get('/user', authenticateToken, (req: CustomRequest, res: Response) => {
//   // Assuming req.user contains the authenticated user
//   res.status(200).json({ username: req.user?.username })
// })

export default router
