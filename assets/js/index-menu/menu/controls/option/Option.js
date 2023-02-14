/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Option perteneciente al componente Controls del documento Menu */

import { Modal } from "./modal/Modal.js";
import { Input } from "./input/Input.js";
import { List } from "./list/List.js";
import { Confirm } from "./confirm/Confirm.js";

export class OptionControl {
  constructor(CONTROLS) {
    this.INDEX = CONTROLS.INDEX;
    this.MENU = CONTROLS.MENU;
    this.CONTROLS = CONTROLS;

    this.option = this.CONTROLS.controls + "__option";

    this.utilityClasses = {
      active: "active",
    };

    this.MODAL = new Modal(this);
    this.INPUT = new Input(this);
    this.LIST = new List(this);
    this.CONFIRM = new Confirm(this);
  }

  /* Método para obtener todos los Options del documento */

  getAll() {
    return document.querySelectorAll("." + this.option);
  }

  /* Método para obtener el Option padre de un elemento */

  getParentOption($elem) {
    return $elem.closest("." + this.option);
  }
}
