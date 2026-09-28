import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { venue } from "@/data/venue-config";

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

export function DossierDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dossier-dialog" data-lenis-prevent>
        <DialogTitle className="font-display">Brocante Terraza</DialogTitle>
        <DialogDescription>Ficha arquitectónica y gastronómica</DialogDescription>
        <div className="dossier-rule" />
        <p className="dossier-signature">L'Art de Recevoir</p>
        <div className="dossier-columns">
          <section><span>EL ESPACIO</span><h3>Interior y terraza</h3><p>Una transición continua entre arquitectura, vegetación y vistas hacia el poniente de la ciudad.</p></section>
          <section><span>CAPACIDAD</span><h3>{venue.capacity}</h3><p>Una escala íntima para bodas, cenas privadas, cócteles y encuentros corporativos.</p></section>
          <section><span>GASTRONOMÍA</span><h3>Propuesta de autor</h3><p>Banquete, barra y servicio se conciben alrededor del formato de cada celebración.</p></section>
          <section><span>UBICACIÓN</span><h3>Lomas–Virreyes</h3><p>{venue.address}</p></section>
        </div>
        <div className="dossier-contact"><span>{venue.phone}</span><span>{venue.instagram}</span></div>
        <Button variant="luxury" size="luxury" onClick={() => window.print()}><Printer /> Imprimir o guardar como PDF</Button>
      </DialogContent>
    </Dialog>
  );
}

export function DossierButton({ onClick }: { onClick: () => void }) {
  return <Button variant="glass" size="luxury" className="dossier-float" onClick={onClick}><Download /> Dossier</Button>;
}