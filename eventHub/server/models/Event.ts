import mongoose, { Document, Schema } from 'mongoose';

export interface EventInterface extends Document {
  username: string;
  title: string;
  date: Date;
  location: string;
  description: string;
  image: string;
}

const eventSchema = new Schema<EventInterface>({
  username: { type: String, required: true },
  title: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
});

const Event = mongoose.model<EventInterface>('Event', eventSchema);

export default Event;
