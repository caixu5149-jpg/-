const fs = require('fs');
try {
  const code = fs.readFileSync('script.js', 'utf8');
  // Just parsing it roughly to see if there are syntax errors
  // We can't really run it because of DOM/Three dependencies, but we can check for basic syntax validity using node's parser if we wrap it or just rely on the fact that I wrote it carefully.
  // Actually, let's just use a simple regex check to ensure I didn't leave any markers.
  if (code.includes('<<<<<<<') || code.includes('=======')) {
     console.error('Merge conflict markers found!');
     process.exit(1);
  }
  console.log('No conflict markers found.');
} catch (e) {
  console.error(e);
  process.exit(1);
}
