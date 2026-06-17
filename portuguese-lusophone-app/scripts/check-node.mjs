const [major, minor] = process.version.slice(1).split('.').map(Number);
if (major < 20 || (major === 20 && minor < 9)) {
  console.error(
    `\nNode ${process.version} is too old. Next.js 16 needs Node >= 20.9.\n` +
      `In this folder run:  nvm use\n` +
      `Then:                npm run dev\n`,
  );
  process.exit(1);
}
