// Guards for design-system rules that are easy to break silently.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SRC_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Built from its code point so this file does not contain the character itself.
const EM_DASH = String.fromCharCode(0x2014);
const GLOBAL_KEYFRAMES = ['fade-in', 'rise-in', 'scale-in', 'slide-in-right', 'slide-in-up', 'shimmer', 'spin', 'pulse-ring'];

function listFiles(dir, predicate) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return listFiles(full, predicate);
    return predicate(full) ? [full] : [];
  });
}

describe('design system guards', () => {
  it('CSS modules reference shared keyframes through global()', () => {
    // CSS modules rename bare keyframe names to local hashes, which silently
    // disables animations defined in styles/animations.css.
    const offenders = [];
    for (const file of listFiles(SRC_DIR, (f) => f.endsWith('.module.css'))) {
      const css = readFileSync(file, 'utf8');
      for (const name of GLOBAL_KEYFRAMES) {
        const bare = new RegExp(`animation(-name)?:\\s*${name}\\b`);
        if (bare.test(css)) offenders.push(`${path.relative(SRC_DIR, file)}: ${name}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('component styles use tokens instead of raw hex colors', () => {
    const offenders = listFiles(SRC_DIR, (f) => f.endsWith('.module.css')).filter((file) =>
      /#[0-9a-fA-F]{3,8}\b/.test(readFileSync(file, 'utf8')),
    );
    expect(offenders.map((file) => path.relative(SRC_DIR, file))).toEqual([]);
  });

  it('source files contain no em dashes', () => {
    const offenders = listFiles(SRC_DIR, (f) => /\.(jsx?|css)$/.test(f)).filter((file) =>
      readFileSync(file, 'utf8').includes(EM_DASH),
    );
    expect(offenders).toEqual([]);
  });
});
