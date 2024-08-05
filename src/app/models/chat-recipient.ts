import { Message } from "./message";

export interface ChatRecipient {
    id: number | undefined;
    name: string | undefined;
    surname: string | undefined;
    profilePicture_name: string | undefined;
    // messages: Message[];
}
