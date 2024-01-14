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

export interface Circle {
  name: string;
  description: string;
  topic: CircleTopic;
}

export type PostType = 'image' | 'text';

export interface Post {
  author: string;
  title: string;
  description: string;
  postDate: Timestamp;
  type: PostType;
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
