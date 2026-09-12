const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

const api = async <T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  const requestUrl = `${API_URL}${endpoint}`;

  console.log("API_URL:", API_URL);
  console.log("REQUEST_URL:", requestUrl);

  const response = await fetch(requestUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export default api;