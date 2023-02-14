/* Establecimiento de la funcionalidad que controla al componente Label
   perteneciente al componente List del Option del documento Menu */

export class Label {
  constructor(LIST) {
    this.INDEX = LIST.INDEX;
    this.MENU = LIST.MENU;
    this.CONTROLS = LIST.CONTROLS;
    this.OPTION = LIST.OPTION;
    this.LIST = LIST;

    this.label = this.LIST.list + " label";

    this.start();
  }

  /* Método para manejar el evento "keydown" */

  keydown(event) {
    if (!event.target.matches("." + this.label)) return;

    /* Solo manejamos cuando el usuario presiona la tecla "Enter" */
    if (event.key !== "Enter") return;

    const $input = event.target.querySelector("input");

    this.LIST.INPUT.check($input);
  }

  /* Método principal de inicio */

  start() {
    const events = [
      { name: "keydown", attachedIn: document, handlers: [this.keydown] },
    ];

    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }
  }
}
