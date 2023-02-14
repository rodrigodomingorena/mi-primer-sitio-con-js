/* Establecimiento de la funcionalidad que controla todo lo relacionado a la carga de datos
   e interactividad de los componentes pertenecientes al documento Menu */

import { Controls } from "./controls/Controls.js";
import { Cards } from "./cards/Cards.js";

export class Menu {
  constructor(INDEX) {
    this.INDEX = INDEX;

    this.CONTROLS = new Controls(this);
    this.CARDS = new Cards(this);
  }

  /* Método para lanzar el evento "cards-update" */

  sendCardsUpdateEvent() {
    // Para re-renderizar las Cards en base a nuevos parámetros de búsqueda

    const cardsUpdateEvent = new CustomEvent("cards-update");
    document.dispatchEvent(cardsUpdateEvent);
  }
}
