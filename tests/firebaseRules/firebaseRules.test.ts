import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  addDoc,
  collection,
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
  expectDatabaseSucceeds,
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

  it('cannot be written by unauthenticated user', async () => {
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

    await expectDatabaseSucceeds(getDoc(doc(unauthedDb, 'user', 'a')));
    expect(true).toBe(true);
  });

  it('user private info can only be accessed by that user', async () => {
    await expectDatabaseSucceeds(
      getDoc(doc(aliceDb, 'user/a/private/privacy'))
    );
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
    await expectDatabaseSucceeds(
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

describe('post subcollection', () => {
  it('can be accessed publicaly', async () => {
    await expectDatabaseSucceeds(
      getDoc(doc(unauthedDb, 'circle/testCircle1/post/a'))
    );
    expect(true).toBe(true);
  });

  it('can be created by circle member', async () => {
    await expectDatabaseSucceeds(
      addDoc(collection(aliceDb, 'circle/testCircle1/post'), {
        title: 'new post',
        content: 'this is a new post',
      })
    );
    expect(true).toBe(true);
  });

  it('cannot be created by non circle member', async () => {
    await expectPermissionDenied(
      addDoc(
        collection(
          testEnv.authenticatedContext('x').firestore(),
          'circle/testCircle1/post'
        ),
        {
          title: 'new post',
          content: 'this is a new post',
        }
      )
    );
    expect(true).toBe(true);
  });

  it('can be edited by its creator', async () => {
    await expectPermissionSucceeds(
      updateDoc(doc(aliceDb, 'circle/testCircle1/post/a'), {
        title: 'edited post',
        content: 'this is an edited post',
      })
    );
    expect(true).toBe(true);
  });

  it('cannot be edited by other user', async () => {
    await expectPermissionDenied(
      updateDoc(
        doc(
          testEnv.authenticatedContext('x').firestore(),
          'circle/testCircle1/post/a'
        ),
        {
          title: 'edited post',
          content: 'this is an edited post',
        }
      )
    );
    expect(true).toBe(true);
  });

  it('can be deleted by its creator', async () => {
    await expectPermissionSucceeds(
      deleteDoc(
        doc(
          testEnv.authenticatedContext('a').firestore(),
          'circle/testCircle1/post/aa'
        )
      )
    );
    expect(true).toBe(true);
  });

  it('can be deleted by admin', async () => {
    await expectPermissionSucceeds(
      deleteDoc(
        doc(
          testEnv.authenticatedContext('a').firestore(),
          'circle/testCircle1/post/b'
        )
      )
    );
    expect(true).toBe(true);
  });

  it('cannot be deleted by other user', async () => {
    await expectPermissionDenied(
      deleteDoc(
        doc(
          testEnv.authenticatedContext('x').firestore(),
          'circle/testCircle1/post/c'
        )
      )
    );
    expect(true).toBe(true);
  });
});

describe('comment subcollection', () => {
  it('can be accessed publicaly', async () => {
    await expectDatabaseSucceeds(
      getDoc(doc(unauthedDb, 'circle/testCircle1/post/a/comment/a'))
    );
    expect(true).toBe(true);
  });

  it('can be created by circle member', async () => {
    await expectDatabaseSucceeds(
      addDoc(collection(aliceDb, 'circle/testCircle1/post/a/comment'), {
        author: 'a',
        title: 'new comment',
        content: 'this is a new comment',
      })
    );
    expect(true).toBe(true);
  });

  it('can be created by non circle member', async () => {
    await expectDatabaseSucceeds(
      addDoc(
        collection(
          testEnv.authenticatedContext('x').firestore(),
          'circle/testCircle1/post/a/comment'
        ),
        {
          author: 'x',
          title: 'new comment',
          content: 'this is a new comment',
        }
      )
    );
    expect(true).toBe(true);
  });

  it('can be edited by its creator', async () => {
    await expectPermissionSucceeds(
      updateDoc(doc(aliceDb, 'circle/testCircle1/post/a/comment/a'), {
        content: 'this is an edited comment',
      })
    );
    expect(true).toBe(true);
  });

  it('cannot be edited by other user', async () => {
    await expectPermissionDenied(
      updateDoc(
        doc(
          testEnv.authenticatedContext('x').firestore(),
          'circle/testCircle1/post/a/comment/a'
        ),
        {
          content: 'this is an edited comment',
        }
      )
    );
    expect(true).toBe(true);
  });

  it('can be deleted by its creator', async () => {
    await expectPermissionSucceeds(
      deleteDoc(
        doc(
          testEnv.authenticatedContext('a').firestore(),
          'circle/testCircle1/post/a/comment/b'
        )
      )
    );
    expect(true).toBe(true);
  });

  it('can be deleted by admin', async () => {
    await expectPermissionSucceeds(
      deleteDoc(
        doc(
          testEnv.authenticatedContext('a').firestore(),
          'circle/testCircle1/post/a/comment/c'
        )
      )
    );
    expect(true).toBe(true);
  });

  it('cannot be deleted by other user', async () => {
    await expectPermissionDenied(
      deleteDoc(
        doc(
          testEnv.authenticatedContext('x').firestore(),
          'circle/testCircle1/post/a/comment/a'
        )
      )
    );
    expect(true).toBe(true);
  });
});

describe('comment recursive subcollection', () => {
  it('can be accessed publicaly', async () => {
    await expectDatabaseSucceeds(
      getDoc(doc(unauthedDb, 'circle/testCircle1/post/a/comment/a/comment/aa'))
    );
    expect(true).toBe(true);
  });

  it('can be created by circle member', async () => {
    await expectDatabaseSucceeds(
      addDoc(
        collection(aliceDb, 'circle/testCircle1/post/a/comment/a/comment'),
        {
          author: 'a',
          title: 'new comment',
          content: 'this is a new comment',
        }
      )
    );
    expect(true).toBe(true);
  });

  it('can be created by non circle member', async () => {
    await expectDatabaseSucceeds(
      addDoc(
        collection(
          testEnv.authenticatedContext('x').firestore(),
          'circle/testCircle1/post/a/comment/a/comment'
        ),
        {
          author: 'x',
          title: 'new comment',
          content: 'this is a new comment',
        }
      )
    );
    expect(true).toBe(true);
  });

  it('can be edited by its creator', async () => {
    await expectPermissionSucceeds(
      updateDoc(
        doc(aliceDb, 'circle/testCircle1/post/a/comment/a/comment/aa'),
        {
          content: 'this is an edited comment',
        }
      )
    );
    expect(true).toBe(true);
  });

  it('cannot be edited by other user', async () => {
    await expectPermissionDenied(
      updateDoc(
        doc(
          testEnv.authenticatedContext('x').firestore(),
          'circle/testCircle1/post/a/comment/a/comment/aa'
        ),
        {
          content: 'this is an edited comment',
        }
      )
    );
    expect(true).toBe(true);
  });

  it('can be deleted by its creator', async () => {
    await expectPermissionSucceeds(
      deleteDoc(
        doc(
          testEnv.authenticatedContext('a').firestore(),
          'circle/testCircle1/post/a/comment/a/comment/aa'
        )
      )
    );
    expect(true).toBe(true);
  });

  it('can be deleted by admin', async () => {
    await expectPermissionSucceeds(
      deleteDoc(
        doc(
          testEnv.authenticatedContext('a').firestore(),
          'circle/testCircle1/post/a/comment/a/comment/cc'
        )
      )
    );
    expect(true).toBe(true);
  });

  it('cannot be deleted by other user', async () => {
    await expectPermissionDenied(
      deleteDoc(
        doc(
          testEnv.authenticatedContext('x').firestore(),
          'circle/testCircle1/post/a/comment/a/comment/bb'
        )
      )
    );
    expect(true).toBe(true);
  });
});

describe('feed collection', () => {
  it('can only be written by authenticated user', async () => {
    await expectPermissionSucceeds(
      setDoc(doc(aliceDb, 'feed', 'a'), { field: 'val' })
    );
    expect(true).toBe(true);
  });

  it('cannot be written by unauthenticated user', async () => {
    await expectPermissionDenied(
      setDoc(doc(unauthedDb, 'feed', 'u'), { field: 'val' })
    );
    expect(true).toBe(true);
  });
});
