
export enum MessageAuthor {
  USER = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  author: MessageAuthor;
  text: string;
  isError?: boolean;
}

export interface UploadedFile {
    name: string;
    data: string; // base64 encoded string
    mimeType: string;
}
