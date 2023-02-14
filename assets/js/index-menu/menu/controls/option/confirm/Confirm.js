/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Confirm perteneciente al componente Option del Controls del documento Menu */

export class Confirm {
  constructor(OPTION) {
    this.INDEX = OPTION.INDEX;
    this.MENU = OPTION.MENU;
    this.CONTROLS = OPTION.CONTROLS;
    this.OPTION = OPTION;

    this.confirm = this.OPTION.option + "__confirm";

    this.buttons = this.getAllBind();
    this.changeControlSuffix = "HasChange";

    this.start();
  }

  /* Método para manejar el evento "click" */

  click(event) {
    if (!event.target.matches("." + this.confirm)) return;

    const $button = event.target;

    this.resetChangeControl($button);
    this.sendEvents($button);

    /* Se deshabilita el botón Confirm hasta la próxima modificación */
    $button.disabled = true;

    /* Se cierra el Modal del Option para poder visualizar los cambios en el Menu,
       producto de esta nueva confirmación de parámetros, luego de medio segundo */
    setTimeout(() => this.OPTION.MODAL.HIDE.manage(), 500);
  }

  /* Método para gestionar el estado del botón Confirm */

  manage({ $input, $option, hasChangedMethod }) {
    const $button = this.buttons[$option.id];
    const inputChangeControl = $input.dataset.option + this.changeControlSuffix;
    const hasChanged = hasChangedMethod();

    this.setChangeControl($button, inputChangeControl, hasChanged);

    /* Si ya ha ocurrido un cambio en algún otro Input del Option al que pertenece el botón
       Confirm, no hacemos nada, el estado ya ha sido manejado en aquella ocasión */

    if (this.alredyChanged($button, inputChangeControl)) return;

    /* De no ser así, se actualiza el estado en este momento */

    this.update($button, hasChanged);
  }

  /* Método para actualizar el estado del botón Confirm */

  update($button, hasChanged) {
    $button.disabled = !hasChanged;
  }

  /* Método para establecer un valor del control de cambios en el botón Confirm */

  setChangeControl($button, inputChangeControl, hasChanged) {
    /* Se registra directamente en el botón Confirm si el Input
       en cuestión ha sufrido un cambio desde la última confirmación */

    // Ej: $button["filterHasChange"] = true;

    $button[inputChangeControl] = hasChanged;
  }

  /* Método para restablecer los valores del control de cambios del botón Confirm */

  resetChangeControl($button) {
    const changeControlKeys = this.getChangeControlKeys($button);

    changeControlKeys.forEach(
      (changeControlKey) => ($button[changeControlKey] = false)
    );
  }

  /* Métodos para lanzar los eventos de confirmación */

  sendEvents($button) {
    const $option = this.OPTION.getParentOption($button);

    this.sendUpdateLastValuesEvent($option);
    this.MENU.sendCardsUpdateEvent();
  }

  /* Método para lanzar el evento "update-last-values-confirmed" */

  sendUpdateLastValuesEvent($option) {
    // Para que cada Input de la Option a la que pertenece el botón Confirm,
    // actualice el almacenamiento de sus últimos valores confirmados a los
    // presentes en esta última confirmación.

    const updateLastValuesEvent = new CustomEvent(
      "update-last-values-confirmed",
      {
        bubbles: true,
      }
    );

    $option.dispatchEvent(updateLastValuesEvent);
  }

  /* Método para comprobar si ya ha ocurrido un cambio */

  alredyChanged($button, ignoreChangeControl) {
    /* Se comprueba si alguna clave del control de cambios del botón Confirm, excepto
       la recién actualizada (ignoreChangeControl), arroja como resultado que el
       Input al que representa ya ha sido modificado (true) */

    const changeControlKeys = this.getChangeControlKeysFiltered(
      $button,
      ignoreChangeControl
    );

    const alredyChanged = changeControlKeys.some(
      (changeControlKey) => $button[changeControlKey]
    );

    return alredyChanged;
  }

  /* Método para obtener las claves del control de cambios del botón Confirm */

  getChangeControlKeys($button) {
    return Object.keys($button).filter((key) =>
      key.endsWith(this.changeControlSuffix)
    );
  }

  /* Método para obtener las claves del control de cambios del botón Confirm filtradas */

  getChangeControlKeysFiltered($button, ignoreChangeControl) {
    const changeControlKeys = this.getChangeControlKeys($button);

    return this.filterChangeControlKey(changeControlKeys, ignoreChangeControl);
  }

  /* Método para filtrar una clave del control de cambios del botón Confirm */

  filterChangeControlKey(changeControlKeys, ignoreChangeControl) {
    return changeControlKeys.filter(
      (changeControlKey) => changeControlKey !== ignoreChangeControl
    );
  }

  /* Método para obtener todos los botones Confirm del documento vinculados a su Option */

  getAllBind() {
    const buttons = {};
    const options = this.OPTION.getAll();

    options.forEach(($option) => {
      const $button = $option.querySelector("." + this.confirm);
      const optionId = $option.id;

      buttons[optionId] = $button;
    });

    return buttons;
  }

  /* Método principal de inicio */

  start() {
    const events = [
      { name: "click", attachedIn: document, handlers: [this.click] },
    ];

    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }
  }
}
