export interface Message {
    text: string;
    timestamp: Date;
    recipientID: number | null;
    senderID: number;
}
