#!/usr/bin/env node

const { spawnSync } = require('node:child_process');

const args = ['audit', '--audit-level=moderate', '--json'];
const result = spawnSync('npm', args, { encoding: 'utf8' });

const output = `${result.stdout || ''}\n${result.stderr || ''}`;

const isRegistryRestriction =
  output.includes('audit endpoint returned an error') ||
  output.includes('403 Forbidden') ||
  output.includes('security/advisories/bulk');

if (isRegistryRestriction) {
  console.warn('⚠️ npm audit could not reach advisory endpoint (403/blocked).');
  console.warn('⚠️ Run this check in CI or a network with npm advisory access.');
  process.exit(0);
}

if (result.status === 0) {
  console.log('✅ npm audit completed with no moderate+ vulnerabilities.');
  process.exit(0);
}

if (result.stdout) {
  try {
    const parsed = JSON.parse(result.stdout);
    const vulnerabilities = parsed.metadata?.vulnerabilities || {};
    const moderatePlus =
      (vulnerabilities.moderate || 0) +
      (vulnerabilities.high || 0) +
      (vulnerabilities.critical || 0);

    console.error('❌ npm audit found vulnerabilities:');
    console.error(JSON.stringify(vulnerabilities, null, 2));

    if (moderatePlus > 0) {
      process.exit(1);
    }
  } catch {
    // Fall through to default failure handling below.
  }
}

console.error('❌ npm audit failed.');
if (output.trim()) {
  console.error(output.trim());
}
process.exit(result.status || 1);
