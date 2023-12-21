export interface User {
  username: string;
  uuid: string;
}

export interface FirestoreCollection {
  user: User;
}
