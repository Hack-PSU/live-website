import { getEnvironment } from "./environment";
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const config = getEnvironment();

/*
 * initializeApp/getAuth run at module scope, so they also run during the
 * production prerender. With NEXT_PUBLIC_FIREBASE_API_KEY unset, getAuth throws
 * auth/invalid-api-key and the whole build dies on a static page. Fall back to
 * an obviously-bogus key so a misconfigured environment fails at sign-in time
 * with a clear message instead of breaking `next build`.
 */
const app =
	getApps()[0] ??
	initializeApp({ ...config, apiKey: config.apiKey || "missing-api-key" });
const auth = getAuth(app);

export { auth };
