export const venue = {
  name: "Brocante Terraza",
  descriptor: "Terraza Privada & Bodas Íntimas",
  address: "Pedregal 55, Lomas - Virreyes, Lomas de Chapultepec, 11000 Ciudad de México, CDMX",
  phone: "+52 55 7671 7042",
  phoneDigits: "525576717042",
  instagram: "@somosbrocante",
  instagramUrl: "https://www.instagram.com/somosbrocante/",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pedregal+55+Lomas+Virreyes+CDMX",
  capacity: "100–120 personas",
  nav: [
    ["La Terraza", "#terraza"],
    ["Bodas", "#eventos"],
    ["Experiencias", "#eventos"],
    ["Galería", "#galeria"],
    ["Contacto", "#contacto"],
  ],
  events: ["Bodas íntimas", "Cenas privadas", "Lanzamientos de marca", "Cócteles"],
  faqs: [
    {
      question: "¿Cómo se confirma una fecha?",
      answer: "Las condiciones de apartado se comparten de forma personalizada después de confirmar disponibilidad y conocer el formato del evento.",
    },
    {
      question: "¿Podemos trabajar con proveedores externos?",
      answer: "Cada propuesta se revisa con el equipo de Brocante para cuidar la operación, la arquitectura y la experiencia de todos los invitados.",
    },
    {
      question: "¿Qué horarios maneja la terraza?",
      answer: "Los horarios dependen del tipo de celebración y su producción. El equipo confirmará las ventanas de montaje, evento y desmontaje en la cotización.",
    },
    {
      question: "¿Hay estacionamiento en Lomas–Virreyes?",
      answer: "La logística de llegada y estacionamiento se define para cada evento. Consúltanos para recibir la recomendación adecuada según el número de invitados.",
    },
  ],
} as const;

export const defaultWhatsApp = `https://wa.me/${venue.phoneDigits}?text=${encodeURIComponent(
  "Hola, me interesa conocer disponibilidad para un evento en Brocante Terraza",
)}`;
