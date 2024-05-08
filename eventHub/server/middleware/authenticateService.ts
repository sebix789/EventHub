import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User'
import { CustomRequest } from '../types/customRequest'

////TO FIX LATER////
// let tokenBlacklist: string[] = []

// export const invalidateToken = (token: string) => {
//   // Add the token to the blacklist
//   tokenBlacklist.push(token)
// }

// export const authenticateToken = (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]

//   if (token == null) return res.sendStatus(401)

//   if (tokenBlacklist.includes(token)) return res.sendStatus(403)

//   jwt.verify(token, 'secretkey', (err: any, user: any) => {
//     if (err) {
//       res.status(403).send('Forbidden')
//       ;(req as CustomRequest).user = user
//     }
//     next()
//   })
// }

export const authenticateUser = async (username: string, password: string) => {
  const user = await User.findOne({ username })
  if (!user) {
    throw new Error('User does not exist')
  }

  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword) {
    throw new Error('Invalid credentials')
  }

  const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' })
  return { token, username: user.username }
}
