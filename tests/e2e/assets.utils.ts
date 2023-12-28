import path from 'path';

const BASE_PATH = process.cwd();
const TEST_ASSETS_PATH = path.join(BASE_PATH, 'tests', 'e2e', 'assets');

export const getTestAssetPath = (filename: string) =>
  path.join(TEST_ASSETS_PATH, filename);
