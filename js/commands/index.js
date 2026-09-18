import { ls } from './ls.js';
import { cd } from './cd.js';
import { cat } from './cat.js';
import { rm } from './rm.js';
import { tree } from './tree.js';
import { uname } from './uname.js';
import { date } from './date.js';
import { apt } from './apt.js';
import { curl } from './curl.js';

export const commands = {
  ls,
  cd,
  cat,
  rm,
  tree,
  uname,
  date,
  apt,
  'apt-get': apt,
  curl,
  pwd: (_, __, currentPath) => ({ output: currentPath }),
  whoami: () => ({ output: 'user' }),
  echo: (args) => ({ output: args.join(' ') }),
  clear: () => ({ output: '\x1bc' }),
  mkdir: (args, vfs, currentPath) => {
    if (!args[0]) return { output: 'mkdir: missing operand' };
    const res = vfs.mkdir(args[0], currentPath);
    return { output: res.error ? `mkdir: ${res.error}` : '' };
  },
  touch: (args, vfs, currentPath) => {
    if (!args[0]) return { output: 'touch: missing file operand' };
    const res = vfs.writeFile(args[0], '', currentPath);
    return { output: res.error ? `touch: ${res.error}` : '' };
  },
  help: () => ({
    output: [
      'Available commands:',
      '  ls [path]         List directory contents',
      '  cd [path]         Change current directory',
      '  pwd               Print working directory',
      '  cat <file>        Display file contents',
      '  mkdir <dir>       Create a directory',
      '  touch <file>      Create an empty file',
      '  rm <path>         Remove a file or directory',
      '  tree [path]       Display visual directory tree',
      '  apt install <pkg> Package manager',
      '  curl <url>        Fetch remote HTTP data',
      '  uname [-a]        Print system information',
      '  date              Display system date and time',
      '  clear             Clear screen output'
    ].join('\r\n')
  })
};