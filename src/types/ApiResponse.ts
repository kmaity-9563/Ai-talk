import { Message} from '@/models/userModel'

export interface ApiResponse {
    success: boolean,
    message: string,
    isAccepted: boolean,
    messages? : Array<Message>
}