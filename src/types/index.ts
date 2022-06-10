export interface Conversation {
  id: number;
  userId: number;
  user: Friend;
  friendId: number;
  friend: Friend;
}

export interface Friend {
  id: number;
  username: string;
  email: string;
  profilePicture?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: number;
  createdAt: Date;
  conversationId: number;
  conversation: Conversation;
  content: string;
  senderId: number;
  sender: Friend;
}
