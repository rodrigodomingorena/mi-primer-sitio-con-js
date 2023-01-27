/* Establecimiento de la funcionalidad que controla los enlaces dinámicos
   que dependen del plato/error a renderizar pertenecientes al documento Plate */

import { HeaderLink } from "./header/Header-Link.js";
import { FooterLink } from "./footer/Footer-Link.js";

export class Links {
  constructor(PLATE) {
    this.INDEX = PLATE.INDEX;
    this.PLATE = PLATE;

    this.links = {
      HEADER_LINK: new HeaderLink(this),
      FOOTER_LINK: new FooterLink(this),
    };

    this.defaultId = "start-plate";

    this.start();
  }

  /* Método para manejar el evento "plate-update" */

  update({ detail: plate }) {
    this.build(plate);
  }

  /* Método para manejar el evento "plate-error" */

  error() {
    this.build(null);
  }

  /* Método para manejar el evento "default-values" */

  defaultValues() {
    this.INDEX.$body.id = "";
    Object.values(this.links).forEach((link) => link.delete());
  }

  /* Método para construir los enlaces */

  build(plate) {
    // Carga exitosa: "start-plate-ID" - Carga fallida: "start-plate"
    const id = plate ? `${this.defaultId}-${plate.id}` : this.defaultId;
    this.INDEX.$body.id = id;

    Object.values(this.links).forEach((link) => link.set(plate));
  }

  /* Método principal de inicio */

  start() {
    const events = [
      {
        name: "plate-update",
        attachedIn: document,
        handlers: [this.update],
      },
      {
        name: "plate-error",
        attachedIn: document,
        handlers: [this.error],
      },
      {
        name: "default-values",
        attachedIn: document,
        handlers: [this.defaultValues],
      },
    ];

    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }
  }
}
