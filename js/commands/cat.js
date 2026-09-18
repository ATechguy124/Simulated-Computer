export function cat(args, vfs, currentPath) {
  if (args.length === 0) return { output: 'cat: missing file operand' };
  const res = vfs.readFile(args[0], currentPath);
  if (res.error) return { output: `cat: ${res.error}` };
  return { output: res.content };
}