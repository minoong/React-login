import mongoose from "mongoose";

const { Schema } = mongoose;

const AuthorSchema = new Schema({
  name: String,
  email: String,
});

const BookSchema = new Schema({
  title: String,
  authors: [AuthorSchema],
  publishedDate: Date,
  price: Number,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Book = mongoose.model("Book", BookSchema);
export default Book;
