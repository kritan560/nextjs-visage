import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {
  LinkCollections,
  LinkEditProfile,
  LinkHomepage,
  LinkJoinPage,
  LinkLikePage,
  LinkLoginPage,
  LinkLogoutPage,
  LinkProfile,
  LinkUploadPage,
} from "./links/visage-links";

// WAC : add links to unauthorized routes and hitting a link that is in unauthorized routes should redirect you to login page.
// WAC : add links to authorized routes that can be accessed when you are logged out only.
export default auth((req) => {
  const currentRoute = req.nextUrl.pathname;

  const isUserLoggedIn = !!req.auth;

  const LoginURL = new URL(LinkLoginPage, req.nextUrl);
  const HomepageURL = new URL(LinkHomepage, req.nextUrl);

  // you need to be logged-In to access this links
  const UNAUTHORIZED_ROUTES = [
    LinkProfile,
    LinkEditProfile,
    LinkUploadPage,
    LinkLogoutPage,
    LinkCollections,
    LinkProfile,
    LinkLikePage,
    LinkEditProfile,
    "/collections",
  ];
  const UNAUTHORIZED = UNAUTHORIZED_ROUTES.includes(currentRoute);

  // you need to be loggedout to access this links
  const AUTHORIZED_ROUTES = [LinkLoginPage, LinkJoinPage];
  const AUTHORIZED = AUTHORIZED_ROUTES.includes(currentRoute);

  if (UNAUTHORIZED && !isUserLoggedIn) {
    return NextResponse.redirect(LoginURL);
  }

  if (isUserLoggedIn && AUTHORIZED) {
    return NextResponse.redirect(HomepageURL);
  }
});
