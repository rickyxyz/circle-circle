/**
 * @vitest-environment node
 */

import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { doc, getDoc, setDoc, setLogLevel } from 'firebase/firestore';
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  expectGetSucceeds,
  expectPermissionDenied,
  expectPermissionSucceeds,
} from './firestoreRules.utils';

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
}, 2000);

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe('Firestore Rules', () => {
  describe('user collection', () => {
    it('can only be written by authenticated user', async () => {
      const aliceDb = testEnv.authenticatedContext('a').firestore();
      const unauthedDb = testEnv.unauthenticatedContext().firestore();

      await expectPermissionSucceeds(
        setDoc(doc(aliceDb, 'user', 'a'), { field: 'val' })
      );
      await expectPermissionDenied(
        setDoc(doc(unauthedDb, 'user', 'u'), { field: 'val' })
      );
      expect(true).toBe(true);
    });

    it('can only be updated by the same user', async () => {
      const aliceDb = testEnv.authenticatedContext('a').firestore();
      const bobDb = testEnv.authenticatedContext('b').firestore();

      await expectPermissionSucceeds(
        setDoc(doc(aliceDb, 'user', 'a'), { field: 'val' })
      );
      await expectPermissionDenied(
        setDoc(doc(bobDb, 'user', 'a'), { field: 'val' })
      );
      expect(true).toBe(true);
    });

    it('can be read by anyone', async () => {
      const unauthedDb = testEnv.unauthenticatedContext().firestore();

      await expectGetSucceeds(getDoc(doc(unauthedDb, 'user', 'a')));
      expect(true).toBe(true);
    });
  });
});
