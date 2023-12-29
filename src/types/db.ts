export interface User {
  username: string;
  uid: string;
  profilePicture?: string;
}

interface CircleMember {
  role: 'admin' | 'member';
}

export interface Circle {
  name: string;
  description: string;
  members: Record<string, CircleMember>;
}

export interface FirestoreCollection {
  user: User;
  circle: Circle;
}
