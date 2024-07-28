import { signIn } from "@/auth";
import { JoinForm } from "@/components/join/join-form";
import { JoinRandomImages } from "@/components/join/join-random-image";
import { NavbarButton } from "@/components/navbar/components/button";
import NavbarLogoVisage from "@/components/navbar/components/logo-visage";
import AdjustPadding from "@/components/shared/adjust-padding";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LinkLoginPage } from "@/links/visage-links";
import { getPexelCuratedPhotosByPage_PerPage } from "@/servers/pexel/pexelPhoto.server";
import { Metadata } from "next";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export const metadata: Metadata = {
  title: "Join Page",
};

export default async function JoinPage() {
  const randomPagePicker = Math.ceil(Math.random() * 10);

  const images = await getPexelCuratedPhotosByPage_PerPage(
    randomPagePicker,
    16,
  );

  return (
    <AdjustPadding>
      <AdjustPadding className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between bg-white py-4 dark:bg-black">
        <NavbarLogoVisage />
        <NavbarButton buttonName="Login" href={LinkLoginPage} />
      </AdjustPadding>
      <div className="h-20"></div>

      {/* left and right section */}
      <div className="flex h-screen w-full gap-x-6">
        {/* left section */}
        <div className="w-1/2">
          <JoinRandomImages images={images} />
        </div>

        {/* right section */}
        <div className="w-1/2">
          <div className="flex flex-col gap-y-5">
            <h2 className="text-3xl font-semibold leading-normal text-stone-800 dark:text-stone-400">
              Where your photography is seen, used and loved by the world
            </h2>

            <h4 className="text-xl font-semibold text-stone-700 dark:text-stone-300">
              Share your photos and videos in one of the largest free libraries
              of visual content on the Internet.
            </h4>

            <ul className="list-none space-y-3 font-semibold text-stone-700 dark:text-stone-300">
              <li>✅ Reach a global audience of more than 30 million</li>
              <li>
                ✅ Help creative people all over the world bring their ideas to
                life
              </li>
              <li>✅ Join more than 320K incredibly talented photographers</li>
            </ul>

            {/* login buttons */}
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
              </form>{" "}
            </div>

            {/* seperator */}
            <Separator className="relative my-4 h-[2px] w-full">
              <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white px-2 dark:bg-inherit">
                Or, sign up with your email
              </p>
            </Separator>

            <div>
              {/* login form */}
              <JoinForm />
            </div>
          </div>
        </div>
      </div>
      <div className="h-12"></div>
    </AdjustPadding>
  );
}
