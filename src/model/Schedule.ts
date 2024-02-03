import mongoose, { Document, Schema } from 'mongoose';

interface Class {
  beginningTime: string;
  endTime: string;
  subject: string;
  type: string;
}

interface DayDocument extends Document {
  id: number;
  dayName: string;
  classes: Class[];
}

const classSchema = new Schema<Class>({
  beginningTime: { type: String, required: true },
  endTime: { type: String, required: true },
  subject: { type: String, required: true },
  type: { type: String, required: true },
});

const daySchema = new Schema<DayDocument>({
  _id: {type: false},
  id: { type: Number, required: true },
  dayName: { type: String, required: true },
  classes: [classSchema],
});

const Day = mongoose.model<DayDocument>('Day', daySchema);

export default Day;
