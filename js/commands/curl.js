export async function curl(args, vfs, currentPath) {
  if (args.length === 0) return { output: 'curl: try \'curl --help\' or \'curl --manual\' for more information' };

  let url = args[0];
  let outputFile = null;

  if (args[0] === '-o' && args[1] && args[2]) {
    outputFile = args[1];
    url = args[2];
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { output: `curl: (22) HTTP response code said error: ${response.status}` };
    }

    const text = await response.text();

    if (outputFile) {
      vfs.writeFile(outputFile, text, currentPath);
      return { output: `  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\r\n 100  ${text.length}  100  ${text.length}    0     0   1024      0 --:--:-- --:--:-- --:--:--  1024` };
    }

    return { output: text };
  } catch (err) {
    return { output: `curl: (6) Could not resolve host: ${url}` };
  }
}