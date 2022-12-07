/* Establecimiento de la funcionalidad de los botones "confirm" que sirven para
   actualizar parámetros de ordenamiento y filtro en la sección Controls del Menú. */

export class Confirm {
  constructor() {
    this.topLevel = "controls__option";
    this.button = this.topLevel + "__confirm";
    this.changeControlSuffix = "HasChange";

    this.buttons = {};
    const options = document.querySelectorAll("." + this.topLevel);

    options.forEach(($option) => {
      const $button = $option.querySelector("." + this.button);
      const optionId = $option.id;

      this.buttons[optionId] = $button;
    });

    this.start();
  }

  /* Método principal que gestiona los eventos de los botones "confirm" */

  handler(event) {
    if (!event.target.matches("." + this.button)) return;

    const $button = event.target;
    const method = event.type;

    this[method]($button);
  }

  /* Método de manejo del evento "click" en los botones "confirm" */

  click($button) {
    /* Se resetean a "false" todas las claves terminadas en "HasChange" registradas en el botón */
    this.resetChangeControl($button);

    /* EVENTOS */

    /* "update-last-values" */

    // Para que cada $input de la $option a la que pertenece el botón,
    // actualice sus últimos valores a los presentes en esta última confirmación.

    const $option = $button.closest("." + this.topLevel);

    const updateLastValuesEvent = new CustomEvent("update-last-values", {
      bubbles: true,
    });

    $option.dispatchEvent(updateLastValuesEvent);

    /* "cards-update" */

    // Para re-renderizar las "cards" en base a los nuevos parámetros de búsqueda.

    const cardsUpdateEvent = new CustomEvent("cards-update");
    document.dispatchEvent(cardsUpdateEvent);

    /* "keydown" */

    // Con key = "Escape" para cerrar el modal al que pertenece el botón luego de medio segundo

    const keydownEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      key: "Escape",
    });

    setTimeout(() => $option.dispatchEvent(keydownEvent), 500);

    /* FIN EVENTOS */

    /* Se vuelve a deshabilitar el botón hasta la próxima modificación */
    $button.disabled = true;
  }

  /* Método para actualizar el estado del botón "confirm" */

  update({ detail: { $input, hasChanged, singleInput = false } }) {
    const $option = $input.closest("." + this.topLevel);
    const $button = this.buttons[$option.id];

    /* Si el $input es el único parámetro a tener en cuenta dentro de su $option */
    if (singleInput) {
      $button.disabled = !hasChanged;
      return;
    }

    /* Si el $input no es el único parámetro a tener en cuenta dentro de su $option */

    /* Se registra en el botón si hay un cambio o no dependiendo
       del tipo de $input. Ej: "filterHasChange = true" */
    const inputChangeControl = $input.dataset.option + this.changeControlSuffix;

    $button[inputChangeControl] = hasChanged;

    /* Se comprueba si algún otro $input dentro del mismo $option ya ha tenido un cambio */
    const buttonKeys = Object.keys($button);

    const changeControlKeys = buttonKeys.filter((changeControlKey) => {
      if (changeControlKey === inputChangeControl) return false;

      return changeControlKey.endsWith(this.changeControlSuffix);
    });

    const alredyChanged = changeControlKeys.some(
      (changeControlKey) => $button[changeControlKey] === true
    );

    /* De ser así, el estado del botón ya a sido manejado en su debido momento */
    if (alredyChanged) return;

    /* De no ser así, se maneja el estado en este momento */
    $button.disabled = !hasChanged;
  }

  /* Método para restablecer los valores de las "changeControlKeys" */

  resetChangeControl($button) {
    const buttonKeys = Object.keys($button);

    const changeControlKeys = buttonKeys.filter((buttonKey) =>
      buttonKey.endsWith(this.changeControlSuffix)
    );

    for (const changeControlKey of changeControlKeys) {
      $button[changeControlKey] = false;
    }
  }

  /* Método principal de inicio */

  start() {
    const events = [
      { name: "click", attachedIn: document, handlers: [this.handler] },
      { name: "confirm-update", attachedIn: document, handlers: [this.update] },
    ];
    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }
  }
}
