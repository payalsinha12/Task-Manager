const BASE_URL = "http://localhost:5000/api";

export const api = async (
  endpoint: string,
  method = "GET",
  body?: any,
  token?: string
) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // ✅ HANDLE ERROR PROPERLY
  const text = await res.text();

  try {
    const data = JSON.parse(text);

    if (!res.ok) {
      throw new Error(data.message || "API Error");
    }

    return data;
  } catch (err) {
    console.error("INVALID JSON RESPONSE:", text);
    throw new Error("Server error (not JSON)");
  }
};