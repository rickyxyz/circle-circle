/**
 * @vitest-environment node
 */

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  setLogLevel,
  updateDoc,
} from 'firebase/firestore';
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

  describe('profile picture', () => {
    it('authenticated user can upload profile picture', async () => {
      const aliceRef = ref(aliceContext.storage(), 'user/a');
      await expectGetSucceeds(uploadBytes(aliceRef, mockImage));
      expect(true).toBe(true);
    });

    it('unauthenticated user cannot upload profile picture', async () => {
      const unauthedRef = ref(unauthedContext.storage(), 'user/a');
      await expectPermissionDenied(uploadBytes(unauthedRef, mockImage));
      expect(true).toBe(true);
    });

    it('user cannot change other user profile picture', async () => {
      const bobRef = ref(bobContext.storage(), 'user/a');
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

  describe('circle picture', () => {
    beforeEach(async () => {
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
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'circle/testCircle1/member/b'), {
          role: 'member',
        });
      });
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'circle/testCircle1/member/c'), {
          role: 'member',
        });
      });
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'circle/testCircle1/member/d'), {
          role: 'member',
        });
      });
    });

    it('admin can upload circle picture', async () => {
      const imageRef = ref(aliceContext.storage(), 'circle/testCircle1/banner');
      await expectGetSucceeds(uploadBytes(imageRef, mockImage));
      expect(true).toBe(true);
    });

    it('member upload circle picture', async () => {
      const imageRef = ref(bobContext.storage(), 'circle/testCircle1/banner');
      await expectGetSucceeds(uploadBytes(imageRef, mockImage));
      expect(true).toBe(true);
    });

    it('non member cannot upload circle picture', async () => {
      const imageRef = ref(
        unauthedContext.storage(),
        'circle/testCircle1/banner'
      );
      await expectPermissionDenied(uploadBytes(imageRef, mockImage));
      expect(true).toBe(true);
    });
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

  describe('circle collection', () => {
    beforeEach(async () => {
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
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'circle/testCircle1/member/b'), {
          role: 'member',
        });
      });
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'circle/testCircle1/member/c'), {
          role: 'member',
        });
      });
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'circle/testCircle1/member/d'), {
          role: 'member',
        });
      });
    });

    it('can only be created by authenticated user', async () => {
      await expectPermissionDenied(
        setDoc(doc(unauthedDb, 'circle/a'), { name: 'a' })
      );
      await expectPermissionSucceeds(
        setDoc(doc(aliceDb, 'circle/a'), { name: 'a' })
      );
      expect(true).toBe(true);
    });

    it('can only be updated by admin', async () => {
      await expectPermissionSucceeds(
        updateDoc(doc(aliceDb, 'circle/testCircle1'), {
          change: 'changed',
        })
      );

      await expectPermissionDenied(
        updateDoc(doc(bobDb, 'circle/testCircle1'), {
          change: 'changed',
        })
      );

      await expectPermissionDenied(
        updateDoc(doc(unauthedDb, 'circle/testCircle1'), {
          change: 'changed',
        })
      );

      expect(true).toBe(true);
    });

    describe('member subcollection', () => {
      beforeEach(async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await setDoc(doc(context.firestore(), 'circle/testCircle1'), {
            name: 'testCircle1',
          });
        });
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await setDoc(
            doc(context.firestore(), 'circle/testCircle1/member/a'),
            {
              role: 'admin',
            }
          );
        });
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await setDoc(
            doc(context.firestore(), 'circle/testCircle1/member/b'),
            {
              role: 'member',
            }
          );
        });
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await setDoc(
            doc(context.firestore(), 'circle/testCircle1/member/c'),
            {
              role: 'member',
            }
          );
        });
        await testEnv.withSecurityRulesDisabled(async (context) => {
          await setDoc(
            doc(context.firestore(), 'circle/testCircle1/member/d'),
            {
              role: 'member',
            }
          );
        });
      });

      it('can be accessed publicaly', async () => {
        await expectGetSucceeds(
          getDoc(doc(unauthedDb, 'circle/testCircle1/member/a'))
        );
        expect(true).toBe(true);
      });

      it('can be created by authenticated user', async () => {
        await expectPermissionSucceeds(
          setDoc(doc(aliceDb, 'circle/testCircle1/member/a'), {
            role: 'admin',
          })
        );
        expect(true).toBe(true);
      });

      it('member cannot delete other member', async () => {
        await expectPermissionDenied(
          deleteDoc(
            doc(
              testEnv.authenticatedContext('d').firestore(),
              'circle/testCircle1/member/c'
            )
          )
        );
        expect(true).toBe(true);
      });

      it('member can delete themself', async () => {
        await expectPermissionSucceeds(
          deleteDoc(
            doc(
              testEnv.authenticatedContext('d').firestore(),
              'circle/testCircle1/member/d'
            )
          )
        );
        expect(true).toBe(true);
      });

      it('admin can delete other member', async () => {
        await expectPermissionSucceeds(
          deleteDoc(
            doc(
              testEnv.authenticatedContext('a').firestore(),
              'circle/testCircle1/member/d'
            )
          )
        );
        expect(true).toBe(true);
      });

      it('role can be updated by admin', async () => {
        await expectPermissionSucceeds(
          updateDoc(doc(aliceDb, 'circle/testCircle1/member/c'), {
            role: 'admin',
          })
        );
        expect(true).toBe(true);
      });

      it('role cannot be updated by member', async () => {
        await expectPermissionDenied(
          updateDoc(doc(bobDb, 'circle/testCircle1/member/c'), {
            role: 'member',
          })
        );
        expect(true).toBe(true);
      });

      it('role cannot be updated by non member', async () => {
        await expectPermissionDenied(
          updateDoc(doc(unauthedDb, 'circle/testCircle1/member/c'), {
            role: 'member',
          })
        );
        expect(true).toBe(true);
      });
    });
  });
});
