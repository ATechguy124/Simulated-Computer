import { commands } from './commands/index.js';

function tokenize(input) {
  const regex = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|(\S+)/g;
  const args = [];
  let match;

  while ((match = regex.exec(input)) !== null) {
    args.push(match[1] ?? match[2] ?? match[3]);
  }
  return args;
}

export async function parseAndExecute(rawInput, vfs, currentPath) {
  const args = tokenize(rawInput.trim());
  if (args.length === 0) return { output: '' };

  const cmdName = args[0].toLowerCase();
  const cmdArgs = args.slice(1);

  const handler = commands[cmdName];
  if (!handler) {
    return { output: `command not found: ${cmdName}` };
  }

  return await handler(cmdArgs, vfs, currentPath);
}