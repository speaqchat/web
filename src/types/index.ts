export interface Conversation {
  id: number;
  user_id: number;
  friend_id: number;
  friend: Friend;
}

export interface Friend {
  id: number;
  username: string;
  email: string;
  // password: string;
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
