import arrival from "@/assets/brocante-arrival.jpg";
import matiere from "@/assets/brocante-matiere.jpg";
import espace from "@/assets/brocante-espace.jpg";
import celebration from "@/assets/brocante-celebration.jpg";

const atmospheres = [
  { src: arrival, label: "Terraza al atardecer" },
  { src: matiere, label: "Texturas de lino y piedra" },
  { src: espace, label: "Salón interior" },
  { src: matiere, label: "Coctelería de autor" },
  { src: celebration, label: "Banquete a la luz de las velas" },
  { src: arrival, label: "Vista poniente de Lomas" },
];

export function AtmosphereMarquee() {
  return (
    <section className="atmosphere-marquee" aria-label="Atmósferas de Brocante Terraza">
      <div className="marquee-heading"><span>ATMÓSFERAS</span><p>Seis momentos. Un mismo lugar.</p></div>
      <div className="marquee-track">
        {[...atmospheres, ...atmospheres].map((item, index) => (
          <figure key={`${item.label}-${index}`} aria-hidden={index >= atmospheres.length}>
            <img src={item.src} alt={index < atmospheres.length ? item.label : ""} />
            <figcaption>{item.label}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}