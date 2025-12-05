import { SignJWT, jwtVerify } from "jose";
import type { AuthData } from "@/types";
import Cookies from "universal-cookie";

export class SessionManager {
  private static secretKey = import.meta.env.VITE_SECRET_KEY;
  private static cookieInstance = new Cookies();

  private static getEncodedKey() {
    if (!SessionManager.secretKey) {
      console.error("VITE_SECRET_KEY is not set. Session cookies are disabled.");
      return null;
    }

    return new TextEncoder().encode(SessionManager.secretKey);
  }

  static async encrypt(payload: AuthData) {
    const encodedKey = SessionManager.getEncodedKey();
    if (!encodedKey) return null;

    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(encodedKey);
  }

  static async decrypt(session: string | undefined = "") {
    const encodedKey = SessionManager.getEncodedKey();
    if (!encodedKey) return null;

    try {
      const { payload } = await jwtVerify(session, encodedKey, {
        algorithms: ["HS256"],
      });
      return payload as AuthData;
    } catch {
      return;
    }
  }

  static async logoutCookie() {
    this.clearSessionCookies();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  static async loginCookie(data: AuthData) {
    const session = await this.encrypt(data);
    if (session) {
      this.setCookie("auth", session, data.refresh_token_expires_at);
      this.setCookie("refresh_token", data.refresh_token, data.refresh_token_expires_at);
      this.setCookie("token", data.access_token, data.access_token_expires_at);
    }
  }

  static async getUser() {
    const session = this.getCookie("auth");
    if (session) {
      const user = await this.decrypt(session);
      if (user) return user;

      this.clearSessionCookies();
    }
    return null;
  }

  static setCookie(
    key: "auth" | "refresh_token" | "token",
    value: string,
    expiresAt?: string
  ) {
    const isSecure =
      typeof window !== "undefined" && window.location.protocol === "https:";
    this.cookieInstance.set(key, value, {
      path: "/",
      sameSite: "strict",
      secure: isSecure,
      expires: expiresAt ? new Date(expiresAt) : undefined,
    });
  }

  // static async updateUserCookie(
  //   updates: Partial<
  //     Pick<AuthData, "hasBusinessDetails" | "accountType" | "isAccountComplete">
  //   >
  // ) {
  //   const user = await this.getUser();
  //   if (!user) return false;

  //   await this.loginCookie({ ...user, ...updates });
  //   return true;
  // }

  static deleteCookie(name: "auth" | "refresh_token" | "token") {
    this.cookieInstance.remove(name, { path: "/" });
  }

  static getCookie(name: "auth" | "refresh_token" | "token") {
    return this.cookieInstance.get(name);
  }

  private static clearSessionCookies() {
    this.deleteCookie("auth");
    this.deleteCookie("refresh_token");
    this.deleteCookie("token");
  }
}
