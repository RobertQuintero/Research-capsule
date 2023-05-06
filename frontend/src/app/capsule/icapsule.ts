import { IUser } from "../user/iuser"
import { Review } from "./ireview"

export interface ICapsule {
    id?: number
    title: string
    research_file: string
    description: string
    status: string
    user?: IUser
    reviews: Review[]
}
