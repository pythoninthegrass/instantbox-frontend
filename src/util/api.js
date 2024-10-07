const BASE_URL = import.meta.env.PUBLIC_API_URL || '/v2/superinspire';

async function fetchWithErrorHandling(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred');
  }
  return response.json();
}

export async function getOSList() {
  return fetchWithErrorHandling(`${BASE_URL}/getOSList`);
}

export async function getOSUrl(os, timeout, cpu = 1, mem = 512, port = 80) {
  const url = new URL(`${BASE_URL}/getOS`, window.location.origin);
  url.searchParams.append('os', os);
  url.searchParams.append('timeout', timeout);
  url.searchParams.append('cpu', cpu);
  url.searchParams.append('mem', mem);
  url.searchParams.append('port', port);

  return fetchWithErrorHandling(url.toString());
}

export async function removeContainerById(containerId, shareUrl, timestamp = Math.floor(Date.now() / 1000)) {
  const url = new URL(`${BASE_URL}/rmOS`, window.location.origin);
  url.searchParams.append('containerId', containerId);
  url.searchParams.append('shareUrl', shareUrl);
  url.searchParams.append('timestamp', timestamp);

  return fetchWithErrorHandling(url.toString());
}
