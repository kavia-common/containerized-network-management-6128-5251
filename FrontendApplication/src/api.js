// PUBLIC_INTERFACE
export const getApiBaseUrl = () => {
  /** Returns API base URL from environment, defaults to http://localhost:3001/api/v1 */
  const url = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api/v1";
  return url.replace(/\/+$/, "");
};

const headers = {
  "Content-Type": "application/json",
};

// PUBLIC_INTERFACE
export async function apiGet(path) {
  /** GET helper with standardized error payload handling */
  const res = await fetch(`${getApiBaseUrl()}${path}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Request failed: ${res.status}`);
  }
  return data;
}

// PUBLIC_INTERFACE
export async function apiPost(path, payload) {
  /** POST helper with standardized error payload handling */
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Request failed: ${res.status}`);
  }
  return data;
}

// PUBLIC_INTERFACE
export async function apiPut(path, payload) {
  /** PUT helper with standardized error payload handling */
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Request failed: ${res.status}`);
  }
  return data;
}

// PUBLIC_INTERFACE
export async function apiDelete(path) {
  /** DELETE helper with standardized error payload handling */
  const res = await fetch(`${getApiBaseUrl()}${path}`, { method: "DELETE" });
  if (res.status === 204) return { success: true };
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Request failed: ${res.status}`);
  }
  return data;
}
