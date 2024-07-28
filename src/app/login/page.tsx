import { signIn } from "@/auth";
import { LoginForm } from "@/components/login/login-form";
import { MasonryClient } from "@/components/masonry/masonry-client";
import { NavbarButton } from "@/components/navbar/components/button";
import NavbarLogoVisage from "@/components/navbar/components/logo-visage";
import AdjustPadding from "@/components/shared/adjust-padding";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LinkJoinPage } from "@/links/visage-links";
import { getPexelCuratedPhotosByPage_PerPage } from "@/servers/pexel/pexelPhoto.server";
import { Metadata } from "next";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export const metadata: Metadata = {
  title: "Login Page",
};

export default async function LoginPage() {
  const randomPagePicker = Math.ceil(Math.random() * 10);

  const images = await getPexelCuratedPhotosByPage_PerPage(
    randomPagePicker,
    19,
  );

  return (
    <>
      <AdjustPadding>
        <AdjustPadding className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between bg-white py-4 dark:bg-black">
          <NavbarLogoVisage />
          <NavbarButton buttonName="Join" href={LinkJoinPage} />
        </AdjustPadding>
      </AdjustPadding>

      {/* background mansonry images. */}
      <div>
        <MasonryClient
          breakPoint900={6}
          gutter="8px"
          className="fixed left-0 right-0 scale-[1.29] bg-stone-900"
        >
          {images?.map((image) => (
            <div key={image.id}>
              <Image
                className="rounded-md"
                src={image.src.medium}
                alt={image.alt ?? ""}
                height={image.height}
                width={image.width}
              />
            </div>
          ))}
        </MasonryClient>

        {/* overlay dark */}
        <div className="fixed left-0 right-0 h-[800px] bg-black/40"></div>

        {/* card */}
        <Card className="absolute left-1/2 top-1/2 z-10 mt-11 min-w-fit -translate-x-1/2 -translate-y-1/2 rounded-[2rem] p-6">
          <CardHeader className="p-0">
            <CardTitle className="text-center text-4xl font-semibold text-stone-800 dark:text-stone-400">
              Welcome Back
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-10 min-w-[500px] space-y-11 p-0">
            <div className="flex items-center gap-x-4">
              <form
                className="w-full"
                action={async () => {
                  "use server";
                  await signIn("google");
                }}
              >
                <Button
                  type="submit"
                  className={
                    "flex h-12 w-full items-center gap-x-2 border text-base hover:border-stone-500 hover:bg-stone-100 active:bg-stone-200 dark:hover:text-stone-800"
                  }
                  variant={"ghost"}
                >
                  <FcGoogle size={30} />
                  <p>Join With Google</p>
                </Button>
              </form>
              <form
                className=""
                action={async () => {
                  "use server";
                  await signIn("github");
                }}
              >
                <Button
                  type="submit"
                  className={
                    "h-12 border p-3 hover:bg-stone-800 hover:text-stone-50 active:bg-stone-700"
                  }
                  variant={"ghost"}
                >
                  <FaGithub size={22} />
                </Button>
              </form>
            </div>

            {/* separator */}
            <Separator className="relative h-[2px] w-full whitespace-pre">
              <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white px-2 text-sm font-medium text-stone-500 dark:bg-inherit">
                <span>Or, sign in with your email</span>
              </p>
            </Separator>

            {/* login form */}
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
