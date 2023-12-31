export interface User {
  username: string;
  uid: string;
  profilePicture?: string;
  circle: string[];
}

export interface Circle {
  name: string;
  description: string;
}

export interface FirestoreCollection {
  user: User;
  circle: Circle;
}
