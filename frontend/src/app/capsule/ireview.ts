import { IUser } from "../user/iuser"
export interface Review {
    user_id?: number
    capsule_id: number
    grade?: number
    comment?: string
    user?: IUser
    isReviewed?: boolean
}
