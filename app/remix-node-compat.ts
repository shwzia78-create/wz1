// Compatibility bridge for @remix-run/node in Vite / Client environment
export const json = <T = any>(data: T, init?: ResponseInit | number) => {
  const initObj = typeof init === 'number' ? { status: init } : init;
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      ...(initObj?.headers || {}),
    },
    status: initObj?.status || 200,
    statusText: initObj?.statusText || undefined,
  });
};

export const redirect = (url: string, init?: number | ResponseInit) => {
  const status = typeof init === 'number' ? init : (typeof init === 'object' && init?.status) ? init.status : 302;
  return new Response(null, {
    status,
    headers: {
      Location: url,
      ...(typeof init === 'object' ? init.headers : {}),
    },
  });
};
