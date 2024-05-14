import mongoose, { Document, Schema } from 'mongoose'

export interface UserInterface extends Document {
  username: string
  email: string
  password: string
  firstname: string
  surname: string
  userImage: string
  favorites: string[]
}

const userSchema = new Schema<UserInterface>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstname: { type: String },
  surname: { type: String },
  userImage: { type: String },
  favorites: { type: [String] }
})

const User = mongoose.model<UserInterface>('User', userSchema)

export default User
