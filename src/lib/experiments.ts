export interface Experiment {
  id: string;
  title: string;
  category: string;
  description: string;
  path: string;
  image?: string;
  video?: string;
  newTab?: boolean;
}

export const experimentsList: Experiment[] = [
  {
    id: "01_inertia_gallery",
    title: "inertia physics gallery",
    category: "GSAP",
    description: "an interactive grid gallery using GSAP InertiaPlugin to calculate drag momentum and rotational physics on mouse cursor drag.",
    path: "/experiments/01_inertia_gallery/index.html",
    image: "/experiments/01_inertia_gallery/assets/medias/01.png"
  },
  {
    id: "02_interactive_pricing_slider",
    title: "interactive pricing slider",
    category: "interactions",
    description: "a beautiful pricing calculator slider featuring custom physics, numeric rolling tick animations, sound feedback, and a responsive layout.",
    path: "/experiments/02_interactive_pricing_slider/index.html",
    image: "/placeholder.svg"
  },
  {
    id: "03_card_slider",
    title: "choose your artist card deck",
    category: "GSAP & WebGL",
    description: "an immersive 3d perspective artist selection card deck featuring Three.js WebGL particle backgrounds, custom GSAP card drag momentum, and audio playback feedback.",
    path: "/experiments/03_card_slider/index.html",
    image: "/placeholder.svg",
    newTab: true
  }
];

export const experimentCategories = ["all", "GSAP", "canvas", "interactions", "WebGL"];
