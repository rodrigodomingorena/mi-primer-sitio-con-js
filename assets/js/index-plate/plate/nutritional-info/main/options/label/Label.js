/* Establecimiento de la funcionalidad para controlar los elementos Label dentro del componente
   Option perteneciente al componente Main del Nutritional Info del documento Plate */

export class Label {
  constructor(OPTIONS) {
    this.INDEX = OPTIONS.INDEX;
    this.PLATE = OPTIONS.PLATE;
    this.NUTRITIONAL_INFO = OPTIONS.NUTRITIONAL_INFO;
    this.MAIN = OPTIONS.MAIN;
    this.OPTIONS = OPTIONS;

    this.label = this.OPTIONS.option + " label";

    this.start();
  }

  /* Método para manejar el evento "keydown" */

  keydown(event) {
    if (!event.target.matches("." + this.label)) return;

    /* Solo nos interesa manejar cuando el usuario presiona la tecla "Enter" */
    if (event.key !== "Enter") return;

    const $input = event.target.querySelector("input");

    /* Si el <input radio> que está en su interior ya está chequeado */
    if ($input.checked) return;

    /* Si no, hacemos que cambie su estado a chequeado */
    $input.checked = true;

    const changeEvent = new Event("change", { bubbles: true });
    $input.dispatchEvent(changeEvent);
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
