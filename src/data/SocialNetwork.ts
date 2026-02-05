import type { SocialNetwork } from "@/interfaces/SocialNetwork";

export const redesSociales: SocialNetwork[] = [
    {
        descripcion: "TikTok",
        imagen: "/social/tiktok.svg",
        link: "https://www.tiktok.com/@inttelgo?is_from_webapp=1&sender_device=pc",
        classname: "bg-primary",
        iconProps: "p-0 group-hover:brightness-0 group-hover:invert transition-all",
    },
    {
        descripcion: "Instagram",
        imagen: "/social/instagram.svg",
        link: "https://www.instagram.com/inttelgo/",
        classname: "bg-gradient-to-b from-pink-500 to-yellow-500",
        iconProps: "p-0 brightness-0 invert",
    },
];