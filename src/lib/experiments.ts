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
    image: "/assets/experiment_covers/02-cover.png"
  },
  {
    id: "03_card_slider",
    title: "choose your artist card deck",
    category: "GSAP & WebGL",
    description: "an immersive 3d perspective artist selection card deck featuring Three.js WebGL particle backgrounds, custom GSAP card drag momentum, and audio playback feedback.",
    path: "/experiments/03_card_slider/index.html",
    image: "/assets/experiment_covers/03-cover.png",
    newTab: true
  },
  {
    id: "04_payment_flow_upi",
    title: "upi payment flow",
    category: "interactions",
    description: "an interactive upi payment flow experiment exploring clean transaction steps, status feedback, and mobile-first payment interactions.",
    path: "/experiments/04_payment_flow_upi/index.html",
    image: "/assets/experiment_covers/04-cover.png",
    newTab: true
  },
  {
    id: "05_command_pallete",
    title: "acme command palette",
    category: "interactions",
    description: "a keyboard-first command palette featuring geometric styling, mono-flecked aesthetics, and alert-red focus. press ⌘k to open.",
    path: "/experiments/05_command_pallete/index.html",
    image: "/assets/experiment_covers/05-cover.png",
    newTab: true
  },
  {
    id: "06_nothing_onboarding",
    title: "nothing onboarding",
    category: "interactions",
    description: "an interactive multi-step onboarding simulation inspired by the nothing design system, featuring dot-matrix typography, sound effects, and clean monochrome interactions.",
    path: "/experiments/06_nothing_onboarding/index.html",
    image: "/assets/experiment_covers/06-cover.png",
    newTab: true
  }
];

export const experimentCategories = ["all", "GSAP", "canvas", "interactions", "WebGL"];
