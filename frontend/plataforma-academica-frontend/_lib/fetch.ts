import { cookies } from "next/headers";

const getBody = <T>(c: Response | Request): Promise<T> => {
  return c.json() as Promise<T>;
};

const getUrl = (contextUrl: string): string => {
  const newUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}${contextUrl}`);
  const requestUrl = new URL(`${newUrl}`);
  return requestUrl.toString();
};

const getHeaders = async (headers?: HeadersInit): Promise<HeadersInit> => {
  const _cookies = await cookies();
  return {
    ...headers,
    cookie: _cookies.toString(),
  };
};

export const customFetch = async <T>(
  url: string,
  options: RequestInit,
): Promise<T> => {
  const requestUrl = getUrl(url);

  console.log("URL:", requestUrl);
  console.log("OPTIONS:", options);

  const requestHeaders = await getHeaders(options.headers);

  const requestInit: RequestInit = {
    ...options,
    headers: requestHeaders,
    credentials: "include",
  };

  const response = await fetch(requestUrl, requestInit);

  console.log("STATUS:", response.status);

  const data = await getBody<T>(response);
  console.log("BODY:", data);

  return { status: response.status, data, headers: response.headers } as T;
};
