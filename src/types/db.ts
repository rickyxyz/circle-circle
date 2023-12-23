export interface User {
  username: string;
  uid: string;
}

export interface FirestoreCollection {
  user: User;
}
