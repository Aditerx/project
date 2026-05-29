export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, init);
  const text = await response.text();

  if (!response.ok) {
    let message = text || response.statusText;
    try {
      const parsed = JSON.parse(text) as { error?: string; message?: string };
      message = parsed.message ?? parsed.error ?? message;
    } catch {
      // We intentionally fall back to the raw payload when the server does not
      // return JSON. That keeps error handling predictable across middleware and
      // route handlers without forcing a shared transport wrapper.
    }

    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return (text ? JSON.parse(text) : null) as T;
}

