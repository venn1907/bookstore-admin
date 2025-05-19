import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Book from "@/models/Book"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const book = await Book.findById(params.id)

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error("Error fetching book:", error)
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    await connectToDatabase()

    // Update book
    const updatedBook = await Book.findByIdAndUpdate(
      params.id,
      {
        ...body,
        updatedAt: new Date(),
      },
      { new: true },
    )

    if (!updatedBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json(updatedBook)
  } catch (error) {
    console.error("Error updating book:", error)
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const deletedBook = await Book.findByIdAndDelete(params.id)

    if (!deletedBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Book deleted successfully" })
  } catch (error) {
    console.error("Error deleting book:", error)
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 })
  }
}
