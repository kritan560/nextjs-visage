import { signIn } from "@/auth";
import AdjustPadding from "@/components/shared/adjust-padding";
import { LoginForm } from "@/components/login/login-form";
import { MasonryClient } from "@/components/masonry/masonry-client";
import { NavbarButton } from "@/components/navbar/components/button";
import NavbarLogoVisage from "@/components/navbar/components/logo-visage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LinkJoinPage } from "@/links/links";
import { getPexelCuratedPhotosByPage_PerPage } from "@/servers/pexel/pexel-server";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default async function LoginPage() {
  const randomPagePicker = Math.ceil(Math.random() * 10);
  const images = await getPexelCuratedPhotosByPage_PerPage(
    randomPagePicker,
    19
  );

  return (
    <>
      <AdjustPadding>
        <AdjustPadding className="py-4 flex justify-between items-center fixed top-0 z-10 left-0 right-0 bg-white dark:bg-black">
          <NavbarLogoVisage />
          <NavbarButton
            buttonName="Join"
            href={LinkJoinPage}
          />
        </AdjustPadding>
      </AdjustPadding>

      {/* background mansonry images. */}
      <div>
        <MasonryClient
          breakPoint900={6}
          gutter="8px"
          className="fixed left-0 right-0 scale-[1.29] bg-stone-900">
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
        <Card className="absolute mt-11 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 min-w-fit rounded-[2rem] p-6">
          <CardHeader className="p-0">
            <CardTitle className="text-center font-semibold text-4xl text-stone-800 dark:text-stone-400">
              Welcome Back
            </CardTitle>
          </CardHeader>
          <CardContent className="min-w-[500px] mt-10 space-y-11 p-0">
            <div className="flex gap-x-4 items-center">
              <form
                className="w-full"
                action={async () => {
                  "use server";
                  await signIn("google");
                }}>
                <Button
                  type="submit"
                  className={
                    "w-full border hover:bg-stone-100 h-12 hover:border-stone-500 active:bg-stone-200 text-base dark:hover:text-stone-800 flex gap-x-2 items-center"
                  }
                  variant={"ghost"}>
                  <FcGoogle size={30} />
                  <p>Join With Google</p>
                </Button>
              </form>
              <form
                className=""
                action={async () => {
                  "use server";
                  await signIn("github");
                }}>
                <Button
                  type="submit"
                  className={
                    "border p-3 active:bg-stone-700 h-12 hover:text-stone-50 hover:bg-stone-800"
                  }
                  variant={"ghost"}>
                  <FaGithub size={22} />
                </Button>
              </form>
            </div>

            {/* separator */}
            <Separator className="w-full whitespace-pre h-[2px] relative">
              <p className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white px-2 text-sm text-stone-500 font-medium dark:bg-inherit rounded-md">
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
