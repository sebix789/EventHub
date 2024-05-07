import mongoose, { Document, Schema } from 'mongoose'

export interface UserInterface extends Document {
  username: string
  email: string
  password: string
}

const userSchema = new Schema<UserInterface>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

const User = mongoose.model<UserInterface>('User', userSchema)

export default User
