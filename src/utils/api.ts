export async function postJson<TResponse>(url: string, body: unknown): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  const rawText = await response.text();
  const contentType = response.headers.get('content-type') || '';

  let parsed: (TResponse & { error?: string }) | null = null;
  if (rawText) {
    const trimmed = rawText.trim();
    const lowerTrimmed = trimmed.toLowerCase();
    const looksLikeHtml =
      lowerTrimmed.startsWith('<!doctype') ||
      lowerTrimmed.startsWith('<html') ||
      lowerTrimmed.startsWith('<!') ||
      trimmed.startsWith('<');
    if (looksLikeHtml) {
      throw new Error(
        `API returned an HTML page instead of JSON (HTTP ${response.status}). Please verify the backend server is running and try again.`
      );
    }

    if (contentType.includes('application/json') || trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        parsed = JSON.parse(trimmed) as TResponse & { error?: string };
      } catch {
        throw new Error(`Received malformed JSON from server (HTTP ${response.status}).`);
      }
    } else if (!response.ok) {
      throw new Error(`Server error (HTTP ${response.status}). Please try again.`);
    } else {
      throw new Error(`Unexpected response format from server (HTTP ${response.status}).`);
    }
  }

  if (!response.ok) {
    throw new Error(
      parsed?.error || `Request failed with status ${response.status}. Please try again.`
    );
  }

  if (!parsed) {
    throw new Error('Server returned an empty response.');
  }

  return parsed;
}
