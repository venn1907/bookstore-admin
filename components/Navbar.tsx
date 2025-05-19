"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="navbar">
      <div className="container">
        <Link href="/" className="navbar-brand">
          BookStore Admin
        </Link>
        <nav>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link href="/dashboard" className={`nav-link ${pathname === "/dashboard" ? "active" : ""}`}>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/users" className={`nav-link ${pathname.startsWith("/users") ? "active" : ""}`}>
                Users
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/books" className={`nav-link ${pathname.startsWith("/books") ? "active" : ""}`}>
                Books
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
