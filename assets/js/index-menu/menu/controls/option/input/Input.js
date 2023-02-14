/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Input perteneciente al componente Option del Controls del documento Menu */

import { Range } from "./range/Range.js";

export class Input {
  constructor(OPTION) {
    this.INDEX = OPTION.INDEX;
    this.MENU = OPTION.MENU;
    this.CONTROLS = OPTION.CONTROLS;
    this.OPTION = OPTION;

    this.RANGE = new Range(this);
  }
}
