export class VFS {
  constructor() {
    this.root = {
      type: 'dir',
      children: {
        home: {
          type: 'dir',
          children: {
            user: {
              type: 'dir',
              children: {
                'readme.txt': {
                  type: 'file',
                  content: 'Welcome to the Linux CLI emulator!\nType "help" to see available commands.'
                },
                'notes.txt': {
                  type: 'file',
                  content: 'GitHub Pages Web CLI implementation.'
                }
              }
            }
          }
        },
        bin: { type: 'dir', children: {} },
        etc: {
          type: 'dir',
          children: {
            hostname: { type: 'file', content: 'github-vfs' }
          }
        }
      }
    };
  }

  resolvePathParts(targetPath, currentPath = '/') {
    const fullPath = targetPath.startsWith('/') ? targetPath : `${currentPath}/${targetPath}`;
    const parts = fullPath.split('/').filter(Boolean);
    const resolved = [];

    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        resolved.pop();
      } else {
        resolved.push(part);
      }
    }
    return resolved;
  }

  getAbsolutePath(targetPath, currentPath = '/') {
    const parts = this.resolvePathParts(targetPath, currentPath);
    return '/' + parts.join('/');
  }

  getNode(targetPath, currentPath = '/') {
    const parts = this.resolvePathParts(targetPath, currentPath);
    let curr = this.root;

    for (const part of parts) {
      if (curr.type !== 'dir' || !curr.children[part]) {
        return null;
      }
      curr = curr.children[part];
    }
    return curr;
  }

  readDir(targetPath, currentPath = '/') {
    const node = this.getNode(targetPath, currentPath);
    if (!node) return { error: 'No such file or directory' };
    if (node.type !== 'dir') return { error: 'Not a directory' };

    const entries = Object.keys(node.children).map((name) => ({
      name,
      isDir: node.children[name].type === 'dir'
    }));

    return { entries };
  }

  readFile(targetPath, currentPath = '/') {
    const node = this.getNode(targetPath, currentPath);
    if (!node) return { error: 'No such file or directory' };
    if (node.type === 'dir') return { error: 'Is a directory' };

    return { content: node.content };
  }

  mkdir(targetPath, currentPath = '/') {
    const parts = this.resolvePathParts(targetPath, currentPath);
    if (parts.length === 0) return { error: 'Cannot create root directory' };

    const dirName = parts.pop();
    let curr = this.root;

    for (const part of parts) {
      if (curr.type !== 'dir' || !curr.children[part]) {
        return { error: 'No such file or directory' };
      }
      curr = curr.children[part];
    }

    if (curr.children[dirName]) {
      return { error: 'File or directory already exists' };
    }

    curr.children[dirName] = { type: 'dir', children: {} };
    return { success: true };
  }

  writeFile(targetPath, content, currentPath = '/') {
    const parts = this.resolvePathParts(targetPath, currentPath);
    if (parts.length === 0) return { error: 'Invalid file path' };

    const fileName = parts.pop();
    let curr = this.root;

    for (const part of parts) {
      if (curr.type !== 'dir' || !curr.children[part]) {
        return { error: 'No such file or directory' };
      }
      curr = curr.children[part];
    }

    if (curr.children[fileName] && curr.children[fileName].type === 'dir') {
      return { error: 'Is a directory' };
    }

    curr.children[fileName] = { type: 'file', content };
    return { success: true };
  }

  deleteNode(targetPath, currentPath = '/') {
    const parts = this.resolvePathParts(targetPath, currentPath);
    if (parts.length === 0) return { error: 'Cannot remove root directory' };

    const name = parts.pop();
    let curr = this.root;

    for (const part of parts) {
      if (curr.type !== 'dir' || !curr.children[part]) {
        return { error: 'No such file or directory' };
      }
      curr = curr.children[part];
    }

    if (!curr.children[name]) {
      return { error: 'No such file or directory' };
    }

    delete curr.children[name];
    return { success: true };
  }

  isDir(targetPath, currentPath = '/') {
    const node = this.getNode(targetPath, currentPath);
    return node ? node.type === 'dir' : false;
  }
}