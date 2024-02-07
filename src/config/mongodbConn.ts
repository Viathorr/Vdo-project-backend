import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(String(process.env.DATABASE_URI));
  } catch (err) {
    console.error(err);
  }
};
