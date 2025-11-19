type Collaborator = {
  name: string;
  tagline: string;
  logo: string;
};

export const collaborators: Collaborator[] = [
  {
    name: "WEB MASTER COLOMBIA",
    tagline: "Internet, networking, sofware, etc.",
    logo: "/collaborators/WEB_MASTER_COLOMBIA.svg",
  },
  {
    name: "ESPN",
    tagline: "Deportes en vivo",
    logo: "/channels/CANAL_ESPN.svg",
  },
  {
    name: "Warner",
    tagline: "Películas y series",
    logo: "/channels/CANAL_warner.svg",
  },
  {
    name: "TNT",
    tagline: "Cine internacional",
    logo: "/channels/CANAL_tnt.svg",
  },
  {
    name: "National Geographic",
    tagline: "Documentales",
    logo: "/channels/CANAL_national_geographic.svg",
  },
  {
    name: "Paramount",
    tagline: "Historias icónicas",
    logo: "/channels/CANAL_paramount.svg",
  },
  {
    name: "FX",
    tagline: "Series de culto",
    logo: "/channels/CANAL_fx.svg",
  },
  {
    name: "Star Channel",
    tagline: "Entretenimiento general",
    logo: "/channels/CANAL_star.svg",
  },
];

export type { Collaborator };
