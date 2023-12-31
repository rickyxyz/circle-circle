import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
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
  RulesTestContext,
  RulesTestEnvironment,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  expectGetSucceeds,
  expectPermissionDenied,
  expectPermissionSucceeds,
} from './firebaseRules.utils';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

let testEnv: RulesTestEnvironment;
let aliceContext: RulesTestContext;
let bobContext: RulesTestContext;
let unauthedContext: RulesTestContext;
let aliceDb: FirebaseFirestore;
let bobDb: FirebaseFirestore;
let unauthedDb: FirebaseFirestore;

const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const FIRESTORE_RULES = resolve(__dirname, '../../firestore.rules');

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      host: '127.0.0.1',
      port: 8080,
      rules: readFileSync(FIRESTORE_RULES, 'utf8'),
    },
  });

  setLogLevel('error');
}, 2000);

beforeEach(() => {
  aliceContext = testEnv.authenticatedContext('a');
  bobContext = testEnv.authenticatedContext('b');
  unauthedContext = testEnv.unauthenticatedContext();
  aliceDb = aliceContext.firestore();
  bobDb = bobContext.firestore();
  unauthedDb = unauthedContext.firestore();
});

describe('user collection', () => {
  it('can only be written by authenticated user', async () => {
    await expectPermissionSucceeds(
      setDoc(doc(aliceDb, 'user', 'a'), { field: 'val' })
    );
    expect(true).toBe(true);
  });

  it('can only be written by unauthenticated user', async () => {
    await expectPermissionDenied(
      setDoc(doc(unauthedDb, 'user', 'u'), { field: 'val' })
    );
    expect(true).toBe(true);
  });

  it('user document can be updated by the same user', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'user/a'), {
        uid: 'a',
      });
    });
    await expectPermissionSucceeds(
      updateDoc(doc(aliceDb, 'user', 'a'), { field: 'val' })
    );
    expect(true).toBe(true);
  });

  it('user document cannot be updated by the other user', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'user/a'), {
        uid: 'a',
      });
    });
    await expectPermissionDenied(
      updateDoc(doc(bobDb, 'user', 'a'), { field: 'val' })
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
    await expectPermissionDenied(getDoc(doc(bobDb, 'user/a/private/privacy')));
    await expectPermissionDenied(
      getDoc(doc(unauthedDb, 'user/a/private/privacy'))
    );

    expect(true).toBe(true);
  });
});

describe('circle collection', () => {
  it('cannot be created by unauthenticated user', async () => {
    await expectPermissionDenied(
      setDoc(doc(unauthedDb, 'circle/a'), { name: 'a' })
    );
    expect(true).toBe(true);
  });

  it('can be created by authenticated user', async () => {
    const newCircle = `circle/thing-${Math.random()}`;
    await expectPermissionSucceeds(
      setDoc(doc(testEnv.authenticatedContext('xyz').firestore(), newCircle), {
        name: 'new',
      })
    );
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await deleteDoc(doc(context.firestore(), newCircle));
    });
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
});

describe('member subcollection', () => {
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
