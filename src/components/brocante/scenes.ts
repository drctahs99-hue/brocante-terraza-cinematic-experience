export type Corner = "top-left" | "bottom-right" | "bottom-left" | "top-right";

export type Scene = {
  start: number;
  end: number;
  tag: string;
  title: string;
  text: string;
  corner: Corner;
  stat: string;
  statLabel: string;
  note: string;
  bigCta?: boolean;
};

// Progress windows are fractions (0–1) of the whole cinematic scroll.
// Small notes appear in the corners in this order:
// top-left → bottom-right → bottom-left → top-right.
export const scenes: Scene[] = [
  {
    start: 0, end: 0.33, corner: "top-left",
    tag: "LOMAS–VIRREYES · CDMX", title: "L'Art de Recevoir.",
    text: "Una terraza privada concebida para bodas íntimas y celebraciones que trascienden el tiempo.",
    stat: "120", statLabel: "invitados · máximo", note: "Una escala íntima, con espacio para respirar.",
  },
  {
    start: 0.33, end: 0.66, corner: "bottom-right",
    tag: "DISEÑO Y MATERIA", title: "La Belleza en el Detalle.",
    text: "Texturas orgánicas, cantera y luz natural en un entorno exclusivo de hasta 120 invitados.",
    stat: "02", statLabel: "ambientes · un recorrido", note: "Un recorrido continuo entre salón y terraza.",
  },
  {
    start: 0.66, end: 0.9, corner: "bottom-left",
    tag: "ESPACIOS VERSÁTILES", title: "Entre Cielo y Arquitectura.",
    text: "Salón interior climatizado, asador de autor, horno de leña y vistas panorámicas del poniente.",
    stat: "Poniente", statLabel: "la hora dorada", note: "Vistas abiertas hacia el atardecer sobre Lomas de Chapultepec.",
  },
  {
    start: 0.9, end: 1.01, corner: "top-right", bigCta: true,
    tag: "TU FECHA EN BROCANTE", title: "Vivan la Experiencia.", text: "",
    stat: "Privado", statLabel: "solo para ustedes", note: "Una celebración privada, concebida alrededor de ustedes.",
  },
];

export function sceneIndexAt(progress: number) {
  const index = scenes.findIndex((scene) => progress >= scene.start && progress < scene.end);
  return index === -1 ? scenes.length - 1 : index;
}
