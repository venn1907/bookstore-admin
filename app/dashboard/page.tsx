"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import type { User } from "@/lib/types"
import type { Book } from "@/lib/types"

export default function Dashboard() {
  const [userCount, setUserCount] = useState(0)
  const [bookCount, setBookCount] = useState(0)
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch users count
        const usersResponse = await fetch("/api/users")
        const users = await usersResponse.json()

        // Fetch books count
        const booksResponse = await fetch("/api/books")
        const books = await booksResponse.json()

        setUserCount(users.length)
        setBookCount(books.length)

        // Create recent activities from the most recent users and books
        const activities = [
          ...users.slice(0, 3).map((user: User) => ({
            type: "user",
            message: `New user registered: ${user.username}`,
            date: user.createdAt,
          })),
          ...books.slice(0, 3).map((book: Book) => ({
            type: "book",
            message: `New book added: ${book.bookName}`,
            date: book.createdAt,
          })),
        ]

        // Sort by date, most recent first
        activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        setRecentActivities(activities.slice(0, 5))
        setLoading(false)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data")
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4">
          <div className="container">
            <p className="text-center">Loading dashboard data...</p>
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
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Users</h2>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="text-3xl font-bold">{userCount}</p>
                    <Link href="/users" className="btn btn-primary">
                      View All
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Books</h2>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="text-3xl font-bold">{bookCount}</p>
                    <Link href="/books" className="btn btn-primary">
                      View All
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h2 className="card-title">Recent Activities</h2>
            </div>
            <div className="card-body">
              {recentActivities.length > 0 ? (
                <ul>
                  {recentActivities.map((activity, index) => (
                    <li key={index} className="mb-2 p-2 border-b">
                      <p>{activity.message}</p>
                      <small>{new Date(activity.date).toLocaleString()}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No recent activities</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="p-3 text-center bg-white border-t">
        <p>© 2025 BookStore Admin. All rights reserved.</p>
      </footer>
    </div>
  )
}
