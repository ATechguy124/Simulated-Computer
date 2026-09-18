export function uname(args) {
  if (args.includes('-a')) {
    return { output: 'Linux web-vfs 5.15.0-js x86_64 GNU/Linux' };
  }
  return { output: 'Linux' };
}