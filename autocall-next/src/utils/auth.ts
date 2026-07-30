import { isBrowser } from "./environment";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { CookieOptions, User } from "../types";

const DEFAULT_OPTIONS: CookieOptions = {
  path: "/",
  sameSite: "Strict",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {},
): void => {
  if (!isBrowser) return;

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  let expires: Date | number | undefined = mergedOptions.expires;
  if (mergedOptions.maxAge !== undefined && !expires) {
    expires = mergedOptions.maxAge / (24 * 60 * 60);
  }

  const cookieOptions: Cookies.CookieAttributes = {
    expires: expires,
    path: mergedOptions.path,
    domain: mergedOptions.domain,
    secure: mergedOptions.secure,
    sameSite: mergedOptions.sameSite,
  };

  Cookies.set(name, value, cookieOptions);
};

export const getCookie = (name: string): string | null => {
  if (!isBrowser) return null;
  return Cookies.get(name) || null;
};

export const removeCookie = (
  name: string,
  options: CookieOptions = {},
): void => {
  if (!isBrowser) return;

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  const cookieOptions: Cookies.CookieAttributes = {
    path: mergedOptions.path,
    domain: mergedOptions.domain,
  };

  Cookies.remove(name, cookieOptions);
};

export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};

/**
 * AUTH UTILS
 */

const TOKEN_KEY = "authToken";
const USER_KEY = "userData";

const getCookieOptions = () => ({
  path: "/",
  maxAge: 7 * 24 * 60 * 60,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict" as const,
});

export const authUtils = {
  setToken: (token: string): void => {
    if (isBrowser) {
      setCookie(TOKEN_KEY, token, getCookieOptions());
    }
  },

  getToken: (): string | null => {
    if (isBrowser) {
      const cookieToken = getCookie(TOKEN_KEY);
      if (
        cookieToken &&
        cookieToken !== "undefined" &&
        cookieToken !== "null"
      ) {
        return cookieToken;
      }
    }

    return null;
  },

  removeToken: (): void => {
    if (isBrowser) {
      removeCookie(TOKEN_KEY, getCookieOptions());
    }
  },

  setUser: (user: User): void => {
    if (isBrowser) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  getUser: (): User | null => {
    if (isBrowser) {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  removeUser: (): void => {
    if (isBrowser) {
      localStorage.removeItem(USER_KEY);
    }
  },

  clearAuth: (): void => {
    authUtils.removeToken();
    authUtils.removeUser();
  },

  isAuthenticated: (): boolean => {
    return !!authUtils.getToken();
  },
};

export const getMediaUrl = (
  path: string | null | undefined,
): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith("http") || path.startsWith("data:")) return path;

  const baseUrl = process.env.NEXT_PUBLIC_STORAGE_URL || "";

  const normalizedPath =
    path.startsWith("uploads") || path.startsWith("/uploads")
      ? path
      : `uploads/${path}`;

  return `${baseUrl}/${normalizedPath.startsWith("/") ? normalizedPath : `${normalizedPath}`}`;
};

export const formatDate = (
  date: string | number | Date | null | undefined,
): string => {
  if (!date) return "-";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";
    return format(d, "do MMM, yyyy");
  } catch {
    return "-";
  }
};
