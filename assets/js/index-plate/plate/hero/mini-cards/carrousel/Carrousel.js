/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Carrousel perteneciente al componente Mini Cards del Hero del documento Plate */

import { ErrorCarrousel } from "./error/Error-Carrousel.js";

export class Carrousel {
  constructor(MINI_CARDS) {
    this.INDEX = MINI_CARDS.INDEX;
    this.PLATE = MINI_CARDS.PLATE;
    this.HERO = MINI_CARDS.HERO;
    this.MINI_CARDS = MINI_CARDS;

    this.carrousel = this.MINI_CARDS.miniCards + "__carrousel";
    this.$carrousel = document.querySelector("." + this.carrousel);

    this.ERROR = new ErrorCarrousel(this);

    this.start();
  }

  /* Método para manejar el evento "default-values" y "plate-error" */

  defaultValues(event) {
    /* Si el restablecimiento a los valores por defecto proviene desde la recarga
       de un estado de error, no manejamos nada. Ya están establecidos por defecto */
    if (event?.detail === "from-error") return;

    this.$carrousel.innerHTML = "";
  }

  /* Método para manejar el evento "plate-error" */

  plateError() {
    this.defaultValues();
  }

  /* Método para manejar el evento "scroll" */

  scroll() {
    const sizes = this.getSizes();
    const positions = this.positions(sizes);

    this.MINI_CARDS.nextScroll({ ...sizes, ...positions });
    this.MINI_CARDS.ARROWS.checkDisabled(positions);
  }

  /* Método para obtener las principales medidas geométricas del Carrousel */

  getSizes() {
    return {
      scrollWidth: this.$carrousel.scrollWidth,
      scrollHeight: this.$carrousel.scrollHeight,
      clientWidth: this.$carrousel.clientWidth,
      clientHeight: this.$carrousel.clientHeight,
      scrollLeft: this.$carrousel.scrollLeft,
      scrollTop: this.$carrousel.scrollTop,
    };
  }

  /* Método para comprobar la ubicación de desplazamiento del Carrousel */

  positions(
    {
      scrollWidth,
      scrollHeight,
      clientWidth,
      clientHeight,
      scrollLeft,
      scrollTop,
    } = this.getSizes()
  ) {
    /* ¿Está al comienzo? */
    const atTheBeginning = scrollTop === 0 && scrollLeft === 0;

    /* ¿Está al final? */
    const atTheEnd =
      clientWidth + scrollLeft === scrollWidth &&
      clientHeight + scrollTop === scrollHeight;

    return {
      atTheBeginning,
      atTheEnd,
    };
  }

  /* Método principal de inicio */

  start() {
    const events = [
      {
        name: "scroll",
        attachedIn: this.$carrousel,
        handlers: [this.scroll],
      },
      {
        name: "plate-error",
        attachedIn: document,
        handlers: [this.plateError],
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
