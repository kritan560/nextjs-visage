import { auth } from "@/auth";
import {
  LinkEditProfile,
  LinkForgotPassword,
  LinkHomepage,
  LinkJoinPage,
  LinkLoginPage,
  LinkProfile,
  LinkVideoPage,
} from "./links/links";
import { NextResponse } from "next/server";

// WAC : add links to unauthorized routes and hitting a link that is in unauthorized routes should redirect you to login page.
// WAC : add links to authorized routes that can be accessed when you are logged out only.
export default auth((req) => {
  const currentRoute = req.nextUrl.pathname;

  const isUserLoggedIn = !!req.auth;

  const LoginURL = new URL(LinkLoginPage, req.nextUrl);
  const HomepageURL = new URL(LinkHomepage, req.nextUrl);

  const UNAUTHORIZED_ROUTES = [LinkProfile, LinkEditProfile];
  const UNAUTHORIZED = UNAUTHORIZED_ROUTES.includes(currentRoute);

  const AUTHORIZED_ROUTES = [LinkLoginPage, LinkJoinPage];
  const AUTHORIZED = AUTHORIZED_ROUTES.includes(currentRoute);

  if (UNAUTHORIZED && !isUserLoggedIn) {
    return NextResponse.redirect(LoginURL);
  }

  if (isUserLoggedIn && AUTHORIZED) {
    return NextResponse.redirect(HomepageURL);
  }
});