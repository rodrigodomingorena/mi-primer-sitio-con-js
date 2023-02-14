/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Item perteneciente al componente List del Option del documento Menu */

export class Item {
  constructor(LIST) {
    this.INDEX = LIST.INDEX;
    this.MENU = LIST.MENU;
    this.CONTROLS = LIST.CONTROLS;
    this.OPTION = LIST.OPTION;
    this.LIST = LIST;

    this.item = this.LIST.list + "__li";
    this.active = this.item + "--" + this.OPTION.utilityClasses.active;
  }

  /* Método para actualizar el estado de un Item */

  update($input, $item) {
    $item.classList[$input.checked ? "add" : "remove"](this.active);
  }

  /* Método para filtrar Items */

  filter(items, ignoreItems) {
    /* Dado un Array fuente (items), se excluyen de él los Items que también estén
       presentes en el Array que lista los Items a ignorar (ignoreItems) */

    return items.filter(
      ($item) => !ignoreItems.find(($ignoreItem) => $ignoreItem === $item)
    );
  }

  /* Método para obtener todos los Items activos */

  getActiveAll($list) {
    return $list.querySelectorAll("." + this.active);
  }

  /* Método para obtener el Item padre de un elemento */

  getParentItem($elem) {
    return $elem.closest("." + this.item) || $elem.closest("li");
  }
}
