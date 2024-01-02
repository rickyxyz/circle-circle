export interface User {
  username: string;
  uid: string;
  profilePicture?: string;
  circle: string[];
}

export interface Comment {
  author: string;
  text: string;
}

export interface Circle {
  name: string;
  description: string;
}

export interface Post {
  author: string;
  title: string;
  description: string;
}

export interface FirestoreCollection {
  user: User;
  circle: Circle;
  post: Post;
}
