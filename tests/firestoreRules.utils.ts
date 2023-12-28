/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { expect } from 'vitest';

export async function expectPermissionDenied(promise: Promise<any>) {
  const errorResult = await assertFails(promise);
  expect([
    'permission-denied',
    'PERMISSION_DENIED',
    'storage/unauthorized',
  ]).toContain(errorResult.code);
}

export async function expectPermissionSucceeds(promise: Promise<any>) {
  const successResult = await assertSucceeds(promise);
  expect(successResult).toBeUndefined();
}

export async function expectGetSucceeds(promise: Promise<any>) {
  await expect(assertSucceeds(promise)).resolves.toBeDefined();
}
