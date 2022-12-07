/* Clase abstracta que sirve para extender sus funcionalidades
   hacia los input data-option = "filter/sort" */

export class OptionInput {
  constructor() {
    this.topLevel = "controls__option";
    this.list = this.topLevel + "__list";
    this.activeItem = this.topLevel + "__li--active";
  }

  /* Método principal que gestiona los eventos */

  handler(event, match) {
    if (!event.target.matches(match)) return null;

    const $input = event.target;
    const $parentItem = $input.closest("li");
    const $list = $input.closest("." + this.list);

    const method = event.type;

    return { $input, $parentItem, $list, method };
  }

  /* Método principal de inicio */

  start(...events) {
    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }
  }
}
