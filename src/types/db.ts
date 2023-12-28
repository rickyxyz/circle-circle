export interface User {
  username: string;
  uid: string;
  profilePicture?: string;
}

export interface FirestoreCollection {
  user: User;
}
