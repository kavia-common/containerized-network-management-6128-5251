/** API client wrapper for consistency (used by new components if needed) */
// PUBLIC_INTERFACE
export const getApiBaseUrl = () => {
  const url = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api/v1";
  return url.replace(/\/+$/, "");
};

const jsonHeaders = { "Content-Type": "application/json" };

// PUBLIC_INTERFACE
export async function httpGet(path) {
  const res = await fetch(`${getApiBaseUrl()}${path}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `GET ${path} failed: ${res.status}`);
  return data;
}

// PUBLIC_INTERFACE
export async function httpPost(path, payload) {
  const res = await fetch(`${getApiBaseUrl()}${path}`, { method: "POST", headers: jsonHeaders, body: JSON.stringify(payload) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `POST ${path} failed: ${res.status}`);
  return data;
}
