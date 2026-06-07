const fs = require('fs');
const path = require('path');

const files = [
  'APTITUDE-BRAIN.md',
  'INCIDENT-INTAKE-DEMO.md',
  'PROJECT-STATUS.md',
  'README.md'
];

const outDir = '_site';

try {
  fs.mkdirSync(path.join(outDir, 'brain'), { recursive: true });

  let copied = 0;
  files.forEach((f) => {
    if (fs.existsSync(f)) {
      fs.copyFileSync(f, path.join(outDir, 'brain', f));
      fs.copyFileSync(f, path.join(outDir, f));
      copied++;
    }
  });

  console.log(`[copy-brain] Copied ${copied} brain doc(s) into ${outDir}/ and ${outDir}/brain/`);
} catch (err) {
  console.error('[copy-brain] Error:', err.message);
  process.exit(1);
}
