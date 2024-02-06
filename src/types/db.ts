import { Timestamp } from 'firebase/firestore';

export interface User {
  username: string;
  uid: string;
  profilePicture?: string;
  circle: string[];
}

export type CircleTopic =
  | 'sports'
  | 'entertainment'
  | 'travel'
  | 'gaming'
  | 'social'
  | 'culinary';

export interface Comment {
  author: string;
  text: string;
  postDate: Timestamp;
}

export interface CommentWithId extends Comment {
  commentId: string;
}

export interface Circle {
  name: string;
  description: string;
  topic: CircleTopic;
  thumbnailUrl?: string;
}

export interface Post {
  author: string;
  title: string;
  description: string;
  postDate: Timestamp;
  hasImage: boolean;
}

export interface Feed {
  postId: string;
  postDate: Timestamp;
  circleId: string;
}

export interface PostFeed extends Post {
  postId: string;
  circleId: string;
}

export interface FirestoreCollection {
  user: User;
  circle: Circle;
  post: Post;
  feed: Feed;
}
