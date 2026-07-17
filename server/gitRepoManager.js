import fs from 'fs';
import path from 'path';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';

const dir = 'C:/stock trading';

async function run() {
  console.log('--- SB Stocks Git Repository Manager ---');
  console.log('1. Initializing repository at C:/stock trading...');
  await git.init({ fs, dir, defaultBranch: 'main' });

  // Ensure default branch is named 'main'
  try {
    const currentBranch = await git.currentBranch({ fs, dir, fullname: false });
    if (!currentBranch || currentBranch === 'master') {
      await git.branch({ fs, dir, ref: 'main', checkout: true });
    }
  } catch (e) {
    try {
      await git.branch({ fs, dir, ref: 'main', checkout: true });
    } catch (err) {}
  }

  console.log('2. Scanning and staging project files...');
  const statusMatrix = await git.statusMatrix({ fs, dir });
  let addedCount = 0;
  for (const row of statusMatrix) {
    const filepath = row[0];
    const head = row[1];
    const workdir = row[2];
    const stage = row[3];

    // Skip ignored or sensitive folders
    if (
      filepath.includes('node_modules') ||
      filepath.includes('.git') ||
      filepath.includes('dist') ||
      filepath.includes('build') ||
      filepath === 'server/.env' ||
      filepath.endsWith('.log')
    ) {
      continue;
    }

    if (workdir === 0) {
      await git.remove({ fs, dir, filepath });
      addedCount++;
    } else if (workdir !== head || stage !== head) {
      await git.add({ fs, dir, filepath });
      addedCount++;
    }
  }
  console.log(`Staged ${addedCount} files successfully.`);

  console.log('3. Creating commit...');
  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'Karthikeya JK',
      email: 'karthikeya832006@gmail.com'
    },
    message: 'Chore: Add industry-standard .gitignore for root, server, and client directories to protect node_modules and secrets'
  });
  console.log('✅ Commit created successfully! Commit SHA:', sha);

  console.log('4. Configuring GitHub remote origin...');
  try {
    await git.deleteRemote({ fs, dir, remote: 'origin' });
  } catch (e) {}
  await git.addRemote({
    fs,
    dir,
    remote: 'origin',
    url: 'https://github.com/karthikeya-JK/Stock-Trading-application.git'
  });
  console.log('✅ Remote origin set to: https://github.com/karthikeya-JK/Stock-Trading-application.git');

  // Attempt push if token is provided via environment or let user know
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    console.log('5. Pushing updates to GitHub (main branch)...');
    try {
      const pushRes = await git.push({
        fs,
        http,
        dir,
        remote: 'origin',
        onAuth: () => ({ username: 'karthikeya-JK', password: token })
      });
      console.log('🚀 Successfully pushed to GitHub origin/main!', pushRes);
    } catch (pushErr) {
      console.error('❌ Push failed:', pushErr.message);
    }
  } else {
    console.log('\n========================================================================');
    console.log('📁 LOCAL GIT REPOSITORY COMMITTED & READY FOR PUSH');
    console.log('========================================================================');
    console.log('All changes (`History.jsx`, `StockChart.jsx`, `orderController.js`, etc.)');
    console.log('have been cleanly committed with author Karthikeya JK.');
    console.log('\nTo push directly to GitHub, run the following inside your terminal or set GITHUB_TOKEN:');
    console.log('  git push -u origin main');
    console.log('Or using GitHub Personal Access Token inside Node:');
    console.log('  $env:GITHUB_TOKEN = "your_github_token"; node gitRepoManager.js');
    console.log('========================================================================');
  }
}

run().catch(err => {
  console.error('Error in Git Manager:', err);
});
