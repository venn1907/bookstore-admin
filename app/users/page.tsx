"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import type { User } from "@/lib/types"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [showModal, setShowModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    roles: ["user"],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionStatus, setActionStatus] = useState({ type: "", message: "" })

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/users")

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Failed to load users")
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to delete user")
        }

        // Update the users list
        setUsers(users.filter((user) => user._id !== id))
        setActionStatus({ type: "success", message: "User deleted successfully" })

        // Clear the status message after 3 seconds
        setTimeout(() => {
          setActionStatus({ type: "", message: "" })
        }, 3000)
      } catch (err) {
        console.error("Error deleting user:", err)
        setActionStatus({ type: "error", message: "Failed to delete user" })
      }
    }
  }

  const handleEdit = (user: User) => {
    setCurrentUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: "", // Don't populate password for security
      roles: user.roles,
    })
    setShowModal(true)
  }

  const handleAdd = () => {
    setCurrentUser(null)
    setFormData({
      username: "",
      email: "",
      password: "",
      roles: ["user"],
    })
    setShowModal(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "roles") {
      setFormData({
        ...formData,
        roles: [value],
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
      if (currentUser) {
        // Update existing user
        const userData = { ...formData }

        // If password is empty, don't send it
        if (!userData.password) {
          delete userData.password
        }

        const response = await fetch(`/api/users/${currentUser._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })

        if (!response.ok) {
          throw new Error("Failed to update user")
        }

        const updatedUser = await response.json()

        // Update the users list
        setUsers(users.map((user) => (user._id === currentUser._id ? updatedUser : user)))
        setActionStatus({ type: "success", message: "User updated successfully" })
      } else {
        // Add new user
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error("Failed to create user")
        }

        const newUser = await response.json()

        // Update the users list
        setUsers([...users, newUser])
        setActionStatus({ type: "success", message: "User created successfully" })
      }

      // Clear the status message after 3 seconds
      setTimeout(() => {
        setActionStatus({ type: "", message: "" })
      }, 3000)

      setShowModal(false)
    } catch (err) {
      console.error("Error saving user:", err)
      setActionStatus({
        type: "error",
        message: currentUser ? "Failed to update user" : "Failed to create user",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4">
          <div className="container">
            <p className="text-center">Loading users...</p>
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
            <h1 className="text-2xl font-bold">Users Management</h1>
            <button className="btn btn-primary" onClick={handleAdd}>
              Add New User
            </button>
          </div>

          {actionStatus.message && (
            <div className={`alert ${actionStatus.type === "success" ? "alert-success" : "alert-danger"} mb-3`}>
              {actionStatus.message}
            </div>
          )}

          <div className="card">
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Roles</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        {user.roles.map((role) => (
                          <span key={role} className="badge badge-primary mr-1">
                            {role}
                          </span>
                        ))}
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-secondary btn-sm mr-1" onClick={() => handleEdit(user)}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)}>
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
      </main>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{currentUser ? "Edit User" : "Add New User"}</h2>
              <button className="close" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password {currentUser && "(Leave blank to keep current)"}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required={!currentUser}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="roles" className="form-label">
                    Role
                  </label>
                  <select
                    id="roles"
                    name="roles"
                    className="form-control"
                    value={formData.roles[0]}
                    onChange={handleChange}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary mr-2" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentUser ? "Update" : "Add"}
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
