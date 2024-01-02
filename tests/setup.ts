import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { setDoc, doc } from 'firebase/firestore';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const STORAGE_RULES = resolve(__dirname, '../storage.rules');
const FIRESTORE_RULES = resolve(__dirname, '../firestore.rules');

const testEnv = await initializeTestEnvironment({
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

export async function setup() {
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
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'circle/testCircle1/post/a'), {
      author: 'a',
      title: 'post a',
      content: 'this is a post',
    });
  });
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'circle/testCircle1/post/aa'), {
      author: 'a',
      title: 'post b',
      content: 'this is a post',
    });
  });
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'circle/testCircle1/post/b'), {
      author: 'b',
      title: 'post c',
      content: 'this is a post',
    });
  });
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'circle/testCircle1/post/c'), {
      author: 'c',
      title: 'post c',
      content: 'this is a post',
    });
  });
}

export async function teardown() {
  await testEnv.cleanup();
}
