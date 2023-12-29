/**
 * @vitest-environment node
 */

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { doc, getDoc, setDoc, setLogLevel } from 'firebase/firestore';
import { FirebaseFirestore } from '@firebase/firestore-types';
import {
  initializeTestEnvironment,
  RulesTestContext,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  expectGetSucceeds,
  expectPermissionDenied,
  expectPermissionSucceeds,
} from './firebaseRules.utils';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

let testEnv: RulesTestEnvironment;
let aliceContext: RulesTestContext;
let bobContext: RulesTestContext;
let unauthedContext: RulesTestContext;
let aliceDb: FirebaseFirestore;
let bobDb: FirebaseFirestore;
let unauthedDb: FirebaseFirestore;

const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const FIRESTORE_RULES = resolve(__dirname, '../firestore.rules');
const STORAGE_RULES = resolve(__dirname, '../storage.rules');

beforeAll(async () => {
  setLogLevel('error');
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      host: '127.0.0.1',
      port: 8080,
      rules: readFileSync(FIRESTORE_RULES, 'utf8'),
    },
    storage: {
      host: '127.0.0.1',
      port: 9199,
      rules: readFileSync(STORAGE_RULES, 'utf8'),
    },
  });
  aliceContext = testEnv.authenticatedContext('a');
  bobContext = testEnv.authenticatedContext('b');
  unauthedContext = testEnv.unauthenticatedContext();
  aliceDb = aliceContext.firestore();
  bobDb = bobContext.firestore();
  unauthedDb = unauthedContext.firestore();
}, 2000);

beforeEach(async () => {
  await testEnv.clearFirestore();
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe('Firebase Storage Rules', () => {
  const mockImage = new Blob([new Uint8Array([0x00])], { type: 'image/png' });

  it('only authenticated user can upload profile picture', async () => {
    const aliceRef = ref(aliceContext.storage(), 'user/a');
    const unauthedRef = ref(unauthedContext.storage(), 'user/a');

    await expectPermissionDenied(uploadBytes(unauthedRef, mockImage));
    await expectGetSucceeds(uploadBytes(aliceRef, mockImage));

    expect(true).toBe(true);
  });

  it('authenticated user can only upload their own profile picture', async () => {
    const aliceRef = ref(aliceContext.storage(), 'user/a');
    const bobRef = ref(bobContext.storage(), 'user/a');

    await expectGetSucceeds(uploadBytes(aliceRef, mockImage));
    await expectPermissionDenied(uploadBytes(bobRef, mockImage));

    expect(true).toBe(true);
  });

  it('profile picture is publicaly available', async () => {
    const aliceRef = ref(aliceContext.storage(), 'user/a');
    const unauthedRef = ref(unauthedContext.storage(), 'user/a');

    await expectGetSucceeds(getDownloadURL(aliceRef));
    await expectGetSucceeds(getDownloadURL(unauthedRef));

    expect(true).toBe(true);
  });
});

describe('Firestore Rules', () => {
  describe('user collection', () => {
    it('can only be written by authenticated user', async () => {
      await expectPermissionSucceeds(
        setDoc(doc(aliceDb, 'user', 'a'), { field: 'val' })
      );
      await expectPermissionDenied(
        setDoc(doc(unauthedDb, 'user', 'u'), { field: 'val' })
      );
      expect(true).toBe(true);
    });

    it('can only be updated by the same user', async () => {
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

    it('user private info can only be accessed by that user', async () => {
      await expectGetSucceeds(getDoc(doc(aliceDb, 'user/a/private/privacy')));
      await expectPermissionDenied(
        getDoc(doc(bobDb, 'user/a/private/privacy'))
      );
      await expectPermissionDenied(
        getDoc(doc(unauthedDb, 'user/a/private/privacy'))
      );

      expect(true).toBe(true);
    });
  });
});
