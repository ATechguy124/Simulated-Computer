import { VFS } from './vfs.js';
import { parseAndExecute } from './parser.js';

const Terminal = window.Terminal;
const FitAddon = window.FitAddon.FitAddon;

const vfs = new VFS();

const term = new Terminal({
  cursorBlink: true,
  cursorStyle: 'block',
  fontFamily: 'Fira Code, monospace',
  fontSize: 14,
  theme: {
    background: '#0d1117',
    foreground: '#c9d1d9',
    cursor: '#58a6ff',
    black: '#484f58',
    red: '#ff7b72',
    green: '#3fb950',
    yellow: '#d29922',
    blue: '#58a6ff',
    magenta: '#bc8cff',
    cyan: '#39c5cf',
    white: '#b1bac4',
  }
});

const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

const container = document.getElementById('terminal-container');
term.open(container);
fitAddon.fit();

window.addEventListener('resize', () => fitAddon.fit());

let currentInput = '';
let currentPath = '/home/user';

function getPrompt() {
  return `\x1b[1;32muser@github\x1b[0m:\x1b[1;34m${currentPath}\x1b[0m$ `;
}

term.writeln('Linux CLI Emulator [Version 1.0.0]');
term.writeln('Type \x1b[1;33mhelp\x1b[0m for available commands.\r\n');
term.write(getPrompt());

term.onData((data) => {
  switch (data) {
    case '\r':
      term.write('\r\n');
      if (currentInput.trim().length > 0) {
        parseAndExecute(currentInput, vfs, currentPath).then((result) => {
          if (result.output) {
            term.writeln(result.output);
          }
          if (result.newPath) {
            currentPath = result.newPath;
          }
          currentInput = '';
          term.write(getPrompt());
        });
      } else {
        currentInput = '';
        term.write(getPrompt());
      }
      break;

    case '\u007F':
      if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        term.write('\b \b');
      }
      break;

    case '\u0003':
      term.write('^C');
      currentInput = '';
      term.write(`\r\n${getPrompt()}`);
      break;

    default:
      if (data >= ' ') {
        currentInput += data;
        term.write(data);
      }
      break;
  }
});