"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import type { Book } from "@/lib/types"

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [showModal, setShowModal] = useState(false)
  const [currentBook, setCurrentBook] = useState<Book | null>(null)
  const [formData, setFormData] = useState({
    bookName: "",
    author: "",
    description: "",
    language: "",
    pageNo: 0,
    rating: 0,
    genre: [""],
    backgroundColor: "",
    navTintColor: "",
    isBookMark: false,
    isMyBook: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionStatus, setActionStatus] = useState({ type: "", message: "" })

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/books")

      if (!response.ok) {
        throw new Error("Failed to fetch books")
      }

      const data = await response.json()
      setBooks(data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching books:", err)
      setError("Failed to load books")
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        const response = await fetch(`/api/books/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to delete book")
        }

        // Update the books list
        setBooks(books.filter((book) => book._id !== id))
        setActionStatus({ type: "success", message: "Book deleted successfully" })

        // Clear the status message after 3 seconds
        setTimeout(() => {
          setActionStatus({ type: "", message: "" })
        }, 3000)
      } catch (err) {
        console.error("Error deleting book:", err)
        setActionStatus({ type: "error", message: "Failed to delete book" })
      }
    }
  }

  const handleEdit = (book: Book) => {
    setCurrentBook(book)
    setFormData({
      bookName: book.bookName,
      author: book.author,
      description: book.description,
      language: book.language,
      pageNo: book.pageNo,
      rating: book.rating,
      genre: book.genre,
      backgroundColor: book.backgroundColor,
      navTintColor: book.navTintColor,
      isBookMark: book.isBookMark,
      isMyBook: book.isMyBook,
    })
    setShowModal(true)
  }

  const handleAdd = () => {
    setCurrentBook(null)
    setFormData({
      bookName: "",
      author: "",
      description: "",
      language: "Eng",
      pageNo: 0,
      rating: 0,
      genre: [""],
      backgroundColor: "rgba(255,255,255,0.9)",
      navTintColor: "#000",
      isBookMark: false,
      isMyBook: false,
    })
    setShowModal(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      })
    } else if (name === "genre") {
      // For simplicity, we're just handling a single genre selection
      setFormData({
        ...formData,
        genre: [value],
      })
    } else if (name === "pageNo" || name === "rating") {
      setFormData({
        ...formData,
        [name]: Number.parseFloat(value),
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (currentBook) {
        // Update existing book
        const response = await fetch(`/api/books/${currentBook._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error("Failed to update book")
        }

        const updatedBook = await response.json()

        // Update the books list
        setBooks(books.map((book) => (book._id === currentBook._id ? updatedBook : book)))
        setActionStatus({ type: "success", message: "Book updated successfully" })
      } else {
        // Add new book
        const bookData = {
          ...formData,
          bookCover: "/placeholder.svg?height=120&width=80", // Default placeholder
          readed: "0",
          categories: [1],
        }

        const response = await fetch("/api/books", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookData),
        })

        if (!response.ok) {
          throw new Error("Failed to create book")
        }

        const newBook = await response.json()

        // Update the books list
        setBooks([...books, newBook])
        setActionStatus({ type: "success", message: "Book created successfully" })
      }

      // Clear the status message after 3 seconds
      setTimeout(() => {
        setActionStatus({ type: "", message: "" })
      }, 3000)

      setShowModal(false)
    } catch (err) {
      console.error("Error saving book:", err)
      setActionStatus({
        type: "error",
        message: currentBook ? "Failed to update book" : "Failed to create book",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4">
          <div className="container">
            <p className="text-center">Loading books...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4">
          <div className="container">
            <div className="alert alert-danger">{error}</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 p-4">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="text-2xl font-bold">Books Management</h1>
            <button className="btn btn-primary" onClick={handleAdd}>
              Add New Book
            </button>
          </div>

          {actionStatus.message && (
            <div className={`alert ${actionStatus.type === "success" ? "alert-success" : "alert-danger"} mb-3`}>
              {actionStatus.message}
            </div>
          )}

          <div className="card">
            <div className="card-body">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Cover</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Rating</th>
                      <th>Language</th>
                      <th>Genre</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book._id}>
                        <td>
                          <img
                            src={book.bookCover || "/placeholder.svg?height=120&width=80"}
                            alt={book.bookName}
                            className="book-cover"
                            style={{ backgroundColor: book.backgroundColor }}
                          />
                        </td>
                        <td>{book.bookName}</td>
                        <td>{book.author}</td>
                        <td>{book.rating}/5</td>
                        <td>{book.language}</td>
                        <td>
                          {book.genre &&
                            book.genre.map((g) => (
                              <span key={g} className="badge badge-primary mr-1">
                                {g}
                              </span>
                            ))}
                        </td>
                        <td>
                          <button className="btn btn-secondary btn-sm mr-1" onClick={() => handleEdit(book)}>
                            Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{currentBook ? "Edit Book" : "Add New Book"}</h2>
              <button className="close" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="bookName" className="form-label">
                    Book Title
                  </label>
                  <input
                    type="text"
                    id="bookName"
                    name="bookName"
                    className="form-control"
                    value={formData.bookName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="author" className="form-label">
                    Author
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    className="form-control"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    required
                  ></textarea>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="language" className="form-label">
                        Language
                      </label>
                      <input
                        type="text"
                        id="language"
                        name="language"
                        className="form-control"
                        value={formData.language}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="pageNo" className="form-label">
                        Page Count
                      </label>
                      <input
                        type="number"
                        id="pageNo"
                        name="pageNo"
                        className="form-control"
                        value={formData.pageNo}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="rating" className="form-label">
                        Rating (0-5)
                      </label>
                      <input
                        type="number"
                        id="rating"
                        name="rating"
                        className="form-control"
                        value={formData.rating}
                        onChange={handleChange}
                        min="0"
                        max="5"
                        step="0.1"
                        required
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="genre" className="form-label">
                        Primary Genre
                      </label>
                      <select
                        id="genre"
                        name="genre"
                        className="form-control"
                        value={formData.genre[0]}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Genre</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Drama">Drama</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Romance">Romance</option>
                        <option value="Sci-Fi">Sci-Fi</option>
                        <option value="Thriller">Thriller</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="backgroundColor" className="form-label">
                        Background Color
                      </label>
                      <input
                        type="text"
                        id="backgroundColor"
                        name="backgroundColor"
                        className="form-control"
                        value={formData.backgroundColor}
                        onChange={handleChange}
                        placeholder="rgba(255,255,255,0.9)"
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="navTintColor" className="form-label">
                        Navigation Tint Color
                      </label>
                      <input
                        type="text"
                        id="navTintColor"
                        name="navTintColor"
                        className="form-control"
                        value={formData.navTintColor}
                        onChange={handleChange}
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id="isBookMark"
                          name="isBookMark"
                          className="form-check-input"
                          checked={formData.isBookMark}
                          onChange={handleChange}
                        />
                        <label htmlFor="isBookMark" className="form-check-label">
                          Bookmarked
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id="isMyBook"
                          name="isMyBook"
                          className="form-check-input"
                          checked={formData.isMyBook}
                          onChange={handleChange}
                        />
                        <label htmlFor="isMyBook" className="form-check-label">
                          My Book
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary mr-2" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentBook ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="p-3 text-center bg-white border-t">
        <p>© 2025 BookStore Admin. All rights reserved.</p>
      </footer>
    </div>
  )
}
