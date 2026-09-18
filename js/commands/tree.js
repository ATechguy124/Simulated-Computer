export function tree(args, vfs, currentPath) {
  const targetPath = args[0] || '.';
  const startNode = vfs.getNode(targetPath, currentPath);

  if (!startNode) return { output: 'tree: no such file or directory' };
  if (startNode.type !== 'dir') return { output: targetPath };

  const lines = [targetPath];

  function renderBranch(node, prefix = '') {
    const keys = Object.keys(node.children || {});
    keys.forEach((key, index) => {
      const isLast = index === keys.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      const child = node.children[key];

      if (child.type === 'dir') {
        lines.push(`${prefix}${connector}\x1b[1;34m${key}\x1b[0m`);
        renderBranch(child, prefix + (isLast ? '    ' : '│   '));
      } else {
        lines.push(`${prefix}${connector}${key}`);
      }
    });
  }

  renderBranch(startNode);
  return { output: lines.join('\r\n') };
}