const { execSync } = require('child_process');

const branchPrefix = 'release/';
const branches = ['main'];

try {
  const output = execSync('git branch -r --format="%(refname:short)"', { encoding: 'utf8' });
  const releaseBranches = output
    .split('\n')
    .filter(b => b.startsWith(`origin/${branchPrefix}`))
    .map(b => b.replace('origin/', ''))
    .map(b => {
      const version = b.replace(branchPrefix, '');
      return { name: b, range: `${version}.x`, prerelease: false };
    });

  branches.push(...releaseBranches);
} catch (err) {
  console.warn('Could not list branches:', err.message);
}

module.exports = {
  branches,
  tagFormat: '${version}',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/github'
  ]
};
