/* Establecimiento de la funcionalidad de los "labels" que envuelven
   distintos tipos de inputs pertenecientes a la sección Controls del Menú. */

export class OptionLabel {
  constructor() {
    this.topLevel = "controls__option";
    this.list = this.topLevel + "__list";
    this.label = this.list + " label";

    this.start();
  }

  /* Método principal que gestiona los eventos de los "labels" */

  handler(event) {
    if (!event.target.matches("." + this.label)) return;

    const $label = event.target;
    const method = event.type;

    this[method]($label, event);
  }

  /* Método de manejo del evento "keydown" en "$label" */

  keydown($label, event) {
    /* Solo se quiere manejar cuando el usuario presiona la tecla "Enter" */
    if (event.key !== "Enter") return;

    const $input = $label.querySelector("input");

    /* Dependiendo del "$input" que envuelve, la forma de 'chequearlo' variará */
    switch ($input.type) {
      case "checkbox":
        $input.checked = !$input.checked;
        break;
      case "radio":
        $input.checked = true;
        break;
    }

    /* Se lanza el evento "input" sobre ese "$input" */
    const inputEvent = new Event("input", { bubbles: true });
    $input.dispatchEvent(inputEvent);
  }

  /* Método principal de inicio */

  start() {
    const events = [
      { name: "keydown", attachedIn: document, handlers: [this.handler] },
    ];

    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }
  }
}
