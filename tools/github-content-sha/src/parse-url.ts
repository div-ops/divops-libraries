export function parseUrl(url: string) {
  const parsedUrl = new URL(url);

  if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
    throw new Error('Only https and http protocols are supported');
  }

  const [owner = '', repo = '', ...target] = parsedUrl.pathname.slice(1).split('/');

  if (owner === '') {
    throw new Error(`Invalid owner: "${owner}"`);
  }

  if (repo === '') {
    throw new Error(`Invalid repo: "${repo}"`);
  }

  if (target.length === 0) {
    throw new Error(`Invalid target: "${target.join('/')}"`);
  }

  return {
    owner,
    repo,
    target,
    hostname: parsedUrl.hostname,
    protocol: parsedUrl.protocol,
    port: parsedUrl.port,
  } as const;
}
