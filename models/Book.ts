import mongoose from "mongoose"

const BookSchema = new mongoose.Schema({
  bookName: {
    type: String,
    required: true,
  },
  bookCover: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0,
  },
  language: {
    type: String,
  },
  pageNo: {
    type: Number,
  },
  author: {
    type: String,
  },
  genre: {
    type: [String],
  },
  readed: {
    type: String,
    default: "0",
  },
  description: {
    type: String,
  },
  backgroundColor: {
    type: String,
    default: "rgba(255,255,255,0.9)",
  },
  navTintColor: {
    type: String,
    default: "#000",
  },
  isBookMark: {
    type: Boolean,
    default: false,
  },
  categories: {
    type: [Number],
  },
  isMyBook: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Check if the model is already defined to prevent overwriting during hot reloads
export default mongoose.models.Book || mongoose.model("Book", BookSchema)
