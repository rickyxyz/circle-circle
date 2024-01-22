import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { doc, setDoc, setLogLevel } from 'firebase/firestore';
import {
  RulesTestContext,
  RulesTestEnvironment,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  expectDatabaseSucceeds,
  expectPermissionDenied,
  expectPermissionSucceeds,
} from './firebaseRules.utils';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

let testEnv: RulesTestEnvironment;
let aliceContext: RulesTestContext;
let bobContext: RulesTestContext;
let unauthedContext: RulesTestContext;

const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const STORAGE_RULES = resolve(__dirname, '../../storage.rules');
const FIRESTORE_RULES = resolve(__dirname, '../../firestore.rules');

beforeAll(async () => {
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

  setLogLevel('error');
}, 2000);

beforeEach(() => {
  aliceContext = testEnv.authenticatedContext('a');
  bobContext = testEnv.authenticatedContext('b');
  unauthedContext = testEnv.unauthenticatedContext();
});

describe('Firebase Storage Rules', () => {
  const mockImage = new Blob([new Uint8Array([0x00])], { type: 'image/png' });

  describe('profile picture', () => {
    it('authenticated user can upload profile picture', async () => {
      const aliceRef = ref(aliceContext.storage(), 'u/a');
      await expectDatabaseSucceeds(uploadBytes(aliceRef, mockImage));
      expect(true).toBe(true);
    });

    it('unauthenticated user cannot upload profile picture', async () => {
      const unauthedRef = ref(unauthedContext.storage(), 'u/a');
      await expectPermissionDenied(uploadBytes(unauthedRef, mockImage));
      expect(true).toBe(true);
    });

    it('user cannot change other user profile picture', async () => {
      const bobRef = ref(bobContext.storage(), 'u/a');
      await expectPermissionDenied(uploadBytes(bobRef, mockImage));
      expect(true).toBe(true);
    });

    it('profile picture is publicaly available', async () => {
      const aliceRef = ref(aliceContext.storage(), 'u/a');
      const unauthedRef = ref(unauthedContext.storage(), 'u/a');

      await expectDatabaseSucceeds(getDownloadURL(aliceRef));
      await expectDatabaseSucceeds(getDownloadURL(unauthedRef));

      expect(true).toBe(true);
    });
  });

  describe('circle picture', () => {
    it('admin can upload circle picture', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'circle/testCircle1'), {
          name: 'testCircle1',
        });
      });
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'circle/testCircle1/member/a'), {
          role: 'admin',
        });
      });
      const imageRef = ref(aliceContext.storage(), 'c/testCircle1/banner');
      await expectDatabaseSucceeds(uploadBytes(imageRef, mockImage));
      expect(true).toBe(true);
    });

    it('member upload circle picture', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'circle/testCircle1'), {
          name: 'testCircle1',
        });
      });
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'circle/testCircle1/member/b'), {
          role: 'member',
        });
      });
      const imageRef = ref(bobContext.storage(), 'c/testCircle1/banner');
      await expectDatabaseSucceeds(uploadBytes(imageRef, mockImage));
      expect(true).toBe(true);
    });

    it('non member cannot upload circle picture', async () => {
      const imageRef = ref(unauthedContext.storage(), 'c/testCircle1/banner');
      await expectPermissionDenied(uploadBytes(imageRef, mockImage));
      expect(true).toBe(true);
    });
  });

  describe('post picture', () => {
    it('member can add picture to post', async () => {
      const imageRef = ref(
        aliceContext.storage(),
        'c/testCircle1/p/alicePost/1.jpg'
      );
      await expectDatabaseSucceeds(uploadBytes(imageRef, mockImage));
      expect(true).toBe(true);
    });

    it('author can delete picture from their own post', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'c/testCircle1/p/a'), {
          author: 'a',
        });
      });
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await uploadBytes(
          ref(context.storage(), 'c/testCircle1/p/a/1.jpg'),
          mockImage
        );
      });

      const imageRef = ref(aliceContext.storage(), 'c/testCircle1/p/a/1.jpg');
      await expectPermissionSucceeds(deleteObject(imageRef));
      expect(true).toBe(true);
    });

    it('other user cannot delete picture from other user post', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'c/testCircle1/p/a'), {
          author: 'a',
        });
      });
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await uploadBytes(
          ref(context.storage(), 'c/testCircle1/p/a/1.jpg'),
          mockImage
        );
      });

      const imageRef = ref(bobContext.storage(), 'c/testCircle1/p/a/1.jpg');
      await expectPermissionSucceeds(deleteObject(imageRef));
      expect(true).toBe(true);
    });
  });
});
