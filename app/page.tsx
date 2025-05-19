import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="navbar">
        <div className="container">
          <h1 className="navbar-brand">BookStore Admin</h1>
          <nav>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link href="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/users" className="nav-link">
                  Users
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/books" className="nav-link">
                  Books
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="container">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Welcome to BookStore Admin</h2>
            </div>
            <div className="card-body">
              <p className="mb-3">This is the admin dashboard for managing your BookStore application.</p>
              <div className="d-flex mt-3">
                <Link href="/users" className="btn btn-primary mr-2">
                  Manage Users
                </Link>
                <Link href="/books" className="btn btn-primary">
                  Manage Books
                </Link>
              </div>
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
