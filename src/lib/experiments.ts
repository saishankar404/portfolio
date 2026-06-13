export interface Experiment {
  id: string;
  title: string;
  category: string;
  description: string;
  path: string;
  image?: string;
  video?: string;
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
    id: "02_canvas_waves",
    title: "interactive canvas waves",
    category: "canvas",
    description: "dynamic particle waves rendered on HTML5 canvas with magnetic attraction and distortion force based on mouse coordinates.",
    path: "/experiments/02_canvas_waves/index.html",
    image: "/placeholder.svg"
  }
];

export const experimentCategories = ["all", "GSAP", "canvas"];
