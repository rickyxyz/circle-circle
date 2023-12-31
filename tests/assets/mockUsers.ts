export interface MockUser {
  uid: string;
  email: string;
  password: string;
  username: string;
}

export const alice: MockUser = {
  uid: 'nKDWDQRFvz7JU5rFJRZ464AaTlXo',
  email: 'alice@email.com',
  password: 'password123',
  username: 'alice',
};

export const bob: MockUser = {
  uid: 'HU8Ucr3igLpVx1KuGrGo8Xe2yUni',
  email: 'bob@email.com',
  password: 'password123',
  username: 'bob',
};

export const tester: MockUser = {
  uid: 'PtzOotBvAI09NtW9urYkPNMVZuMr',
  email: 'tester@email.com',
  password: 'password123',
  username: 'tester',
};
