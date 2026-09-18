import { commands } from './index.js';

export async function apt(args, vfs, currentPath) {
  const action = args[0];
  const pkgName = action === 'install' ? args[1] : (action === 'get' && args[1] === 'install' ? args[2] : null);

  if (action === 'update') {
    return {
      output: [
        'Hit:1 https://cdn.jsdelivr.net main InRelease',
        'Reading package lists... Done'
      ].join('\r\n')
    };
  }

  if (pkgName) {
    if (commands[pkgName]) {
      return { output: `${pkgName} is already installed.` };
    }

    if (pkgName === 'cowsay') {
      try {
        const module = await import('https://cdn.jsdelivr.net/npm/cowsay-browser@1.1.8/+esm');
        
        commands['cowsay'] = (cmdArgs) => {
          const text = cmdArgs.join(' ') || 'Moo!';
          return { output: module.say({ text }) };
        };

        return {
          output: [
            `Get:1 https://cdn.jsdelivr.net/npm/cowsay-browser`,
            'Unpacking binaries...',
            `\x1b[1;32mSuccessfully installed ${pkgName}.\x1b[0m Type 'cowsay <text>' to run.`
          ].join('\r\n')
        };
      } catch (err) {
        return { output: `E: Failed to download package ${pkgName}: ${err.message}` };
      }
    }

    return { output: `E: Unable to locate package ${pkgName}` };
  }

  return {
    output: 'Usage: apt install <package> (Try: apt install cowsay)'
  };
}