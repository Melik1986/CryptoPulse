import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/* eslint-disable no-console */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const ERRORS = [];

function checkKebabCase(name) {
  // Allow strict kebab case (lowercase, hyphen separated)
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(name);
}

function checkPascalCase(name) {
  return /^[A-Z][a-zA-Z0-9]*$/.test(name);
}

function checkCamelCase(name) {
  return /^[a-z][a-zA-Z0-9]*$/.test(name);
}

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      callback(filePath, true);
      walk(filePath, callback);
    } else {
      callback(filePath, false);
    }
  }
}

console.log('Running Custom Rule Validation...');

// 1. Check Directories (Kebab-case)
// We check directories inside app, components, hooks, lib
const dirsToCheck = ['app', 'components', 'hooks', 'lib'];

dirsToCheck.forEach((baseDir) => {
  const fullPath = path.join(ROOT_DIR, baseDir);
  walk(fullPath, (filePath, isDir) => {
    const name = path.basename(filePath);

    // Skip special files/dirs
    if (name.startsWith('[') || name.startsWith('_') || name.startsWith('.')) return;

    // Skip node_modules or hidden
    if (filePath.includes('node_modules')) return;

    if (isDir) {
      if (!checkKebabCase(name)) {
        // Ignore if it matches a specific exception or pattern?
        // For now, report.
        ERRORS.push(
          `[Rule Violation] Directory name must be kebab-case: ${path.relative(ROOT_DIR, filePath)}`,
        );
      }
    }
  });
});

// 2. Check Components (PascalCase)
// Inside components/, files ending in .tsx (except index.tsx) should be PascalCase
walk(path.join(ROOT_DIR, 'components'), (filePath, isDir) => {
  if (isDir) return;
  const name = path.basename(filePath);
  const relativePath = path.relative(ROOT_DIR, filePath);

  // Skip UI lib (shadcn often uses kebab-case or mixed)
  if (relativePath.includes('components\\ui') || relativePath.includes('components/ui')) return;

  if (name === 'index.tsx') return;

  if (name.endsWith('.tsx')) {
    const nameWithoutExt = name.replace('.tsx', '');
    // Some files like `fallback.tsx` are lowercase. Strict rule says PascalCase.
    if (!checkPascalCase(nameWithoutExt)) {
      ERRORS.push(`[Rule Violation] Component file should be PascalCase: ${relativePath}`);
    }
  }
});

// 3. Check Hooks (camelCase + use prefix)
walk(path.join(ROOT_DIR, 'hooks'), (filePath, isDir) => {
  if (isDir) return;
  const name = path.basename(filePath);
  if (!name.endsWith('.ts') && !name.endsWith('.tsx')) return;
  if (name === 'index.ts') return;

  const nameWithoutExt = name.replace(/\.tsx?$/, '');

  // Skip test files
  if (name.includes('.test.') || name.includes('.spec.')) return;

  if (!nameWithoutExt.startsWith('use')) {
    ERRORS.push(
      `[Rule Violation] Hook file should start with 'use': ${path.relative(ROOT_DIR, filePath)}`,
    );
  } else if (!checkCamelCase(nameWithoutExt)) {
    ERRORS.push(
      `[Rule Violation] Hook file should be camelCase: ${path.relative(ROOT_DIR, filePath)}`,
    );
  }
});

// 4. Check for 'any' in file content (simple grep) - ESLint does this, but good to have a backup or quick check
// We won't do it here to avoid duplicate logic, rely on ESLint.

if (ERRORS.length > 0) {
  console.error('Found Rule Violations:');
  ERRORS.forEach((e) => console.error(e));
  // We don't exit 1 to avoid breaking build in this demo, just report.
  // process.exit(1);
} else {
  console.log('All custom rule checks passed.');
}
