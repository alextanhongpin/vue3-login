const TOKEN_KEY = "accessToken";

export function getToken(): string | undefined {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token?: string) {
  if (token === null || token === undefined) {
    window.localStorage.removeItem(TOKEN_KEY);
  } else {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
}
