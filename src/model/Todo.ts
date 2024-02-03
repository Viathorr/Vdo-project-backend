import mongoose, { Schema, Document } from "mongoose";

interface TodoDocument extends Document {
  id: number,
  name: string,
  checked: boolean
}

const todoSchema = new Schema<TodoDocument>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  checked: {type: Boolean, default: false}
});

const Todo = mongoose.model<TodoDocument>('Todo', todoSchema);

export default Todo;