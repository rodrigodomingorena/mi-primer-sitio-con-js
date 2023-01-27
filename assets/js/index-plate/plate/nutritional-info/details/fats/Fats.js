/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Fats perteneciente al componente Details del Nutritional Info del documento Plate */

import { DetailsAbstract } from "../abstract/Details-Abstract.js";

export class Fats extends DetailsAbstract {
  constructor(DETAILS) {
    super();

    this.INDEX = DETAILS.INDEX;
    this.PLATE = DETAILS.PLATE;
    this.NUTRITIONAL_INFO = DETAILS.NUTRITIONAL_INFO;
    this.DETAILS = DETAILS;

    this.fats = "#content-fats";
    this.$grams = document.querySelector(`${this.fats} ${this.grams}`);
    this.ratios = document.querySelectorAll(`${this.fats} ${this.ratio}`);

    this.start();
  }

  /* Método principal de inicio */

  start() {
    const events = [
      {
        name: "nutritional-info-update",
        attachedIn: document,
        handlers: [this.nutritionalInfoUpdate],
      },
      {
        name: "default-values",
        attachedIn: document,
        handlers: [this.defaultValues],
      },
    ];

    super.start(events);
  }
}
