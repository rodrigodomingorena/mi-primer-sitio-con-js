/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Details perteneciente al componente Nutritional Info del documento Plate */

import { Fats } from "./fats/Fats.js";
import { Carbohydrates } from "./carbohydrates/Carbohydrates.js";
import { Proteins } from "./proteins/Proteins.js";

export class Details {
  constructor(NUTRITIONAL_INFO) {
    this.INDEX = NUTRITIONAL_INFO.INDEX;
    this.PLATE = NUTRITIONAL_INFO.PLATE;
    this.NUTRITIONAL_INFO = NUTRITIONAL_INFO;

    this.details = this.NUTRITIONAL_INFO.nutritionalInfo + "__details";

    this.FATS = new Fats(this);
    this.CARBOHYDRATES = new Carbohydrates(this);
    this.PROTEINS = new Proteins(this);
  }
}
