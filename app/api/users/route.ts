import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"

export async function GET() {
  try {
    await connectToDatabase()
    const users = await User.find({}).select("-password")
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await connectToDatabase()

    // Create new user
    const newUser = new User({
      username: body.username,
      email: body.email,
      password: body.password, // In a real app, you should hash this password
      roles: body.roles || ["user"],
    })

    await newUser.save()

    // Don't return the password
    const user = newUser.toObject()
    delete user.password

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
