const fs = require('fs');

const file = fs.readFileSync('components/tech-stack.tsx', 'utf8');
const fetched = fs.readFileSync('fetched_icons.txt', 'utf8');

// The fetched string contains the lines like:
//   java: <svg ...
// Let's replace the icons object.

const newIconsStr = `
import { Bot, TerminalSquare, Network, Activity, Share2, Hexagon, Boxes } from "lucide-react"

/* ─── SVG icons sourced from SimpleIcons & Lucide ─── */
const icons = {
${fetched.split('\n').filter(l => l.trim().length > 0).join('\n')}
  // For Java, it failed to fetch. I'll use the one from SVGRepo that is correct or a simplified path.
  // Actually, I can use the current java svg. Let's extract the current java svg.
  java: ${file.match(/java:\s*(<svg[^>]+><path[^>]+><\/svg>),/)[1]},
  python: ${file.match(/python:\s*(<svg[^>]+><path[^>]+><\/svg>),/)[1]},
  docker: ${file.match(/docker:\s*(<svg[^>]+><path[^>]+><\/svg>),/)[1]},
  git: ${file.match(/git:\s*(<svg[^>]+><path[^>]+><\/svg>),/)[1]},
  js: ${file.match(/js:\s*(<svg[^>]+><path[^>]+><\/svg>),/)[1]},
  
  // Abstract concepts using Lucide
  ai: <Bot size={18} strokeWidth={1.5} />,
  prompt: <TerminalSquare size={18} strokeWidth={1.5} />,
  llm: <Network size={18} strokeWidth={1.5} />,
  tcp: <Activity size={18} strokeWidth={1.5} />,
  p2p: <Share2 size={18} strokeWidth={1.5} />,
  hex: <Hexagon size={18} strokeWidth={1.5} />,
  ddd: <Boxes size={18} strokeWidth={1.5} />,
}
`;

// wait, we need to make sure the imports are at the top, and the `icons` object is updated.
// Let's do it properly using replace.

let updatedFile = file.replace(/import { motion } from "framer-motion"/, 'import { motion } from "framer-motion"\nimport { Bot, TerminalSquare, Network, Activity, Share2, Hexagon, Boxes } from "lucide-react"');

updatedFile = updatedFile.replace(/\/\* ─── SVG icons sourced from svgrepo\.com.*?\nconst icons = \{[\s\S]*?\n\}/m, `/* ─── SVG icons sourced from SimpleIcons & Lucide ─── */
const icons = {
${fetched.split('\n').filter(l => l.trim().length > 0 && !l.includes('js:')).join('\n')}
  java: ${file.match(/java:\s*(<svg.*?<\/svg>),/)[1]},
  python: ${file.match(/python:\s*(<svg.*?<\/svg>),/)[1]},
  docker: ${file.match(/docker:\s*(<svg.*?<\/svg>),/)[1]},
  git: ${file.match(/git:\s*(<svg.*?<\/svg>),/)[1]},
  js: ${file.match(/js:\s*(<svg.*?<\/svg>),/)[1]},
  ai: <Bot size={18} strokeWidth={1.5} />,
  prompt: <TerminalSquare size={18} strokeWidth={1.5} />,
  llm: <Network size={18} strokeWidth={1.5} />,
  tcp: <Activity size={18} strokeWidth={1.5} />,
  p2p: <Share2 size={18} strokeWidth={1.5} />,
  hex: <Hexagon size={18} strokeWidth={1.5} />,
  ddd: <Boxes size={18} strokeWidth={1.5} />,
}`);

fs.writeFileSync('components/tech-stack.tsx', updatedFile);
console.log('updated');
