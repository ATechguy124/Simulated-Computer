export function rm(args, vfs, currentPath) {
  if (args.length === 0) return { output: 'rm: missing operand' };
  const target = args.filter(a => !a.startsWith('-'))[0];
  if (!target) return { output: 'rm: missing operand' };

  const res = vfs.deleteNode(target, currentPath);
  if (res.error) return { output: `rm: ${res.error}` };
  return { output: '' };
}