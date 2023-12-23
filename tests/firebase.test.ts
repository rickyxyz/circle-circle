/**
 * @vitest-environment node
 */

import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { register } from '@/lib/firebase/auth';
import { setLogLevel } from 'firebase/firestore';
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { auth } from '@/lib/firebase/config';

const testUser = {
  username: 'username',
  password: 'password123',
  email: `email${Math.random() * 100}@email.com`,
};

let testEnv: RulesTestEnvironment;
const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const FIRESTORE_RULES = resolve(__dirname, '../firestore.rules');

beforeAll(async () => {
  setLogLevel('error');
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      host: '127.0.0.1',
      port: 8080,
      rules: readFileSync(FIRESTORE_RULES, 'utf8'),
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe('Firebase', () => {
  describe('Auth', () => {
    it('register will write user document to Firestore', async () => {
      const user = await register(
        testUser.username,
        testUser.email,
        testUser.password
      );

      expect(user).toStrictEqual({
        username: testUser.username,
        uid: auth.currentUser?.uid,
      });
    });
  });
});
