/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Input perteneciente al componente List del Option del documento Menu */

import { Filter } from "./filter/Filter.js";
import { Sort } from "./sort/Sort.js";

export class InputList {
  constructor(LIST) {
    this.INDEX = LIST.INDEX;
    this.MENU = LIST.MENU;
    this.CONTROLS = LIST.CONTROLS;
    this.OPTION = LIST.OPTION;
    this.LIST = LIST;

    this.FILTER = new Filter(this);
    this.SORT = new Sort(this);
  }

  /* Método para "chequear" un Input */

  check($input) {
    /* La forma de "chequeo" varía con el tipo de Input */

    switch ($input.type) {
      case "checkbox":
        $input.checked = !$input.checked;
        break;

      case "radio":
        $input.checked = true;
        break;
    }

    /* Evento "input" */

    const inputEvent = new Event("input", { bubbles: true });
    $input.dispatchEvent(inputEvent);
  }
}
