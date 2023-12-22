/**
 * @vitest-environment node
 */

import { beforeAll, describe, expect, it } from 'vitest';
import { register } from '@/lib/firebase/auth';
import { doc, getDoc, setLogLevel } from 'firebase/firestore';
import {
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const testUser = {
  username: 'username',
  password: 'password123',
  email: `email${Math.random() * 100}@email.com`,
};

let testEnv: RulesTestEnvironment;
let userId: string;
const PROJECT_ID = 'circle-circle-d453c';
const FIRESTORE_RULES = resolve(__dirname, '../firestore.rules');

beforeAll(async () => {
  setLogLevel('error');
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync(FIRESTORE_RULES, 'utf8'),
    },
  });
});

describe('Firebase', () => {
  describe('Auth', () => {
    it('register will write user document to Firestore', async () => {
      userId = await register(
        testUser.username,
        testUser.email,
        testUser.password
      );
      expect(userId).toBeTypeOf('string');

      const unauthedDb = testEnv.unauthenticatedContext().firestore();

      const successResult = await assertSucceeds(
        getDoc(doc(unauthedDb, `user/${userId}`))
      );

      expect(successResult.data()).toEqual({
        username: 'username',
        uid: userId,
      });
    });
  });
});
