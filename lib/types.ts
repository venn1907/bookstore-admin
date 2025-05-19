export interface User {
  _id: string
  username: string
  email: string
  password?: string
  roles: string[]
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface Book {
  _id: string
  bookName: string
  bookCover: string
  rating: number
  language: string
  pageNo: number
  author: string
  genre: string[]
  readed: string
  description: string
  backgroundColor: string
  navTintColor: string
  createdAt: string
  updatedAt: string
  __v?: number
  isBookMark: boolean
  categories: number[]
  isMyBook: boolean
}
