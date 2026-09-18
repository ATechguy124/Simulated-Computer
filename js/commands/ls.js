export function ls(args, vfs, currentPath) {
  const targetPath = args[0] || '.';
  const res = vfs.readDir(targetPath, currentPath);
  if (res.error) return { output: `ls: ${res.error}` };

  const formatted = res.entries.map((e) =>
    e.isDir ? `\x1b[1;34m${e.name}/\x1b[0m` : e.name
  );
  return { output: formatted.join('  ') };
}