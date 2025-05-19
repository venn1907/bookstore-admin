import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Book from "@/models/Book"

export async function GET() {
  try {
    await connectToDatabase()
    const books = await Book.find({})
    return NextResponse.json(books)
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await connectToDatabase()

    // Create new book
    const newBook = new Book({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await newBook.save()
    return NextResponse.json(newBook, { status: 201 })
  } catch (error) {
    console.error("Error creating book:", error)
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 })
  }
}
