import { IUser } from "../user/iuser"
export interface IReview {
    id: number
    user_id: number
    capsule_id: number
    grade?: number
    comment?: string
    isReviewed: boolean
    user?: IUser
}