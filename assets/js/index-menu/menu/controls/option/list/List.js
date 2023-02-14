/* Establecimiento de la funcionalidad que controla el renderizado del componente
   List perteneciente al componente Option del Controls del documento Menu */

import { Label } from "./label/Label.js";
import { Item } from "./item/Item.js";
import { InputList } from "./input/Input-List.js";

export class List {
  constructor(OPTION) {
    this.INDEX = OPTION.INDEX;
    this.MENU = OPTION.MENU;
    this.CONTROLS = OPTION.CONTROLS;
    this.OPTION = OPTION;

    this.list = this.OPTION.option + "__list";

    this.LABEL = new Label(this);
    this.ITEM = new Item(this);
    this.INPUT = new InputList(this);
  }

  /* Método para desactivar todos los Items activos de una List */

  reset($list, ...ignoreItems) {
    let activeItems = Array.from(this.ITEM.getActiveAll($list));

    if (ignoreItems.length > 0) {
      /* Si se han pasado Items para ser excluídos de esta desactivación */

      activeItems = this.ITEM.filter(activeItems, ignoreItems);
    }

    activeItems.forEach(($item) => $item.classList.remove(this.ITEM.active));
  }

  /* Método para obtener la List padre de un elemento */

  getParentList($elem) {
    return $elem.closest("." + this.list);
  }
}
