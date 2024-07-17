import { signIn } from "@/auth";
import AdjustPadding from "@/components/adjust-padding";
import { JoinForm } from "@/components/join/join-form";
import { JoinRandomImages } from "@/components/join/join-random-image";
import { NavbarButton } from "@/components/navbar/components/button";
import NavbarLogoVisage from "@/components/navbar/components/logo-visage";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LinkLoginPage } from "@/links/links";
import { getPexelCuratedPhotosByPage_PerPage } from "@/servers/pexel-server";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default async function JoinPage() {
  const randomPagePicker = Math.ceil(Math.random() * 10);

  const images = await getPexelCuratedPhotosByPage_PerPage(
    randomPagePicker,
    16
  );

  return (
    <AdjustPadding>
      <AdjustPadding className="py-4 flex justify-between items-center fixed top-0 z-10 left-0 right-0 bg-white">
        <NavbarLogoVisage />
        <NavbarButton
          buttonName="Login"
          href={LinkLoginPage}
        />
      </AdjustPadding>
      <div className="h-20"></div>

      {/* left and right section */}
      <div className="flex w-full gap-x-6">
        {/* left section */}
        <div className="w-1/2">
          <JoinRandomImages images={images} />
        </div>

        {/* right section */}
        <div className=" flex flex-col gap-y-5 w-1/2">
          <h2 className="font-semibold text-3xl text-stone-800 leading-normal">
            Where your photography is seen, used and loved by the world
          </h2>

          <h4 className="text-xl font-semibold text-stone-700">
            Share your photos and videos in one of the largest free libraries of
            visual content on the Internet.
          </h4>

          <ul className="list-none space-y-3 text-stone-700 font-semibold">
            <li>✅ Reach a global audience of more than 30 million</li>
            <li>
              ✅ Help creative people all over the world bring their ideas to
              life
            </li>
            <li>✅ Join more than 320K incredibly talented photographers</li>
          </ul>

          {/* login buttons */}
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
                  "w-full border hover:bg-stone-100 h-12 hover:border-stone-500 active:bg-stone-200 text-base flex gap-x-2 items-center"
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
            </form>{" "}
          </div>

          {/* seperator */}
          <Separator className="w-full h-[2px] relative my-4">
            <p className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white px-2">
              Or, sign up with your email
            </p>
          </Separator>

          <div>
            {/* login form */}
            <JoinForm />
          </div>
        </div>
      </div>
      <div className="h-12"></div>
    </AdjustPadding>
  );
}
