import { IReview } from "../faculty/ireview"

export interface IUser {
  id?: number
  photo?: string,
  level?: number
  firstName: string,
  lastName: string,
  email: string,
}

export interface IUser2{
  id?: number
  photo?: string,
  level?: number
  firstName: string,
  lastName: string,
  email: string,
  reviews: IReview[]
}

export interface IRegisteredFaculty {
  id: number
  firstName: string
  lastName: string
  submittedCapsules?: number
  assignedCapsules?: number
}

export interface IUserRegister {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  password_confirmation: string,
}

export interface IUserChangePassword {
  password_old: string,
  password: string,
  password_confirmation: string,
}
