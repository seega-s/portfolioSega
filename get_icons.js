const https = require('https');
const fs = require('fs');

const icons = {
  java: 'java',
  spring: 'springboot',
  cpp: 'cplusplus',
  react: 'react',
  html: 'html5',
  next: 'nextdotjs',
  aws: 'amazonaws',
  azure: 'microsoftazure',
  sql: 'postgresql'
};

let output = '';

async function fetchIcon(slug) {
  return new Promise((resolve, reject) => {
    https.get(`https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/${slug}.svg`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/<path\s+d="([^"]+)"/);
        resolve(match ? match[1] : null);
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const [key, slug] of Object.entries(icons)) {
    const path = await fetchIcon(slug);
    if (path) {
      output += `  ${key}: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="${path}"/></svg>,\n`;
    } else {
      console.log('Failed', slug);
    }
  }
  fs.writeFileSync('fetched_icons.txt', output);
  console.log('Done');
}

run();
