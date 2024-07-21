import {
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaWhatsapp,
} from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";
import { IconType } from "react-icons/lib";

/**
 * this is the public links i.e authorized and unauthorized user can access.
 * can increase the links count but be aware of frontend flex-col length.
 */
export const AvatarPublicLinks = [
  {
    title: "Image & Video API",
    href: "/docs/primitives/tooltip",
  },
  {
    title: "Apps & Plugins",
    href: "/docs/primitives/tooltip2",
  },
  {
    title: "FAQ report Content",
    href: "/docs/primitives/tooltip3",
  },
  {
    title: "Partnership",
    href: "/docs/primitives/tooltip4",
  },
  {
    title: "Imprint & terms",
    href: "/docs/primitives/tooltip5",
  },
];

/**
 * max number of socialLogos to be used is 5. coz of padding used in frontend.
 * you can change the name and logo here
 */
export const SocialLogosLinks: {
  socialLogoName: string;
  socialLogo: IconType;
  href: string;
}[] = [
  {
    socialLogoName: "Facebook",
    socialLogo: FaFacebookF,
    href: "#",
  },
  {
    socialLogoName: "Instagram",
    socialLogo: FaInstagram,
    href: "#1",
  },
  {
    socialLogoName: "Linkedin",
    socialLogo: FaLinkedin,
    href: "#2",
  },
  {
    socialLogoName: "Pinterest",
    socialLogo: FaPinterest,
    href: "#3",
  },
  {
    socialLogoName: "Whatsapp",
    socialLogo: FaWhatsapp,
    href: "#4",
  },
];
