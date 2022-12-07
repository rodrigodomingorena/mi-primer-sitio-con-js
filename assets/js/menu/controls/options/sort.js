/* Establecimiento de la funcionalidad de los input data-option = "sort"
   pertenecientes a la sección Controls del Menú. */

import { OptionInput } from "./option-input.js";

export class Sort extends OptionInput {
  constructor() {
    super();
    this.sort = "[data-option=sort]";
    this.checked = this.sort + ":checked";
    this.singleInput = true;

    this.$optionParent = document
      .querySelector(this.sort)
      .closest("." + this.topLevel);

    this.lastValue;
    this.partialValue;

    this.start();
  }

  /* Método principal que gestiona los eventos de los input data-option = "sort" */

  handler(event) {
    const match = this.sort;

    const { method, $input, $parentItem, $list } =
      super.handler(event, match) || {};

    if (method) this[method]($input, $parentItem, $list);
  }

  /* Método de manejo del evento "input" en los input data-option = "sort" */

  input($sort, $parentItem, $list) {
    /* Se elimina la clase de item activo al que la tuviese */
    $list
      .querySelector("." + this.activeItem)
      ?.classList.remove(this.activeItem);

    $parentItem.classList.add(this.activeItem);

    this.partialValue = $sort.value;

    this.updateConfirm($sort);
  }

  /* Método para actualizar el estado del botón "confirm" */

  updateConfirm($sort) {
    /* Se comprueba si el valor parcial difiere del de la última confirmación */
    const hasChanged = this.hasChanged();

    /* Evento "confirm-update" */

    const confirmUpdateEvent = new CustomEvent("confirm-update", {
      detail: { $input: $sort, hasChanged, singleInput: this.singleInput },
    });

    document.dispatchEvent(confirmUpdateEvent);
  }

  /* Método para actualizar el valor desde la última confirmación */

  updateLastValue(event) {
    if (event.target !== this.$optionParent) return;

    this.lastValue = this.partialValue;
  }

  /* Método para restablecer el valor al de la última confirmación */

  resetLastValue(event) {
    if (event.target !== this.$optionParent) return;

    /* Si no hubo cambios */
    if (!this.hasChanged()) return;

    const $sort = document.querySelector(
      this.sort + `[value=${this.lastValue}]`
    );

    $sort.checked = true;

    /* Evento "input" */

    const inputEvent = new Event("input", { bubbles: true });
    $sort.dispatchEvent(inputEvent);
  }

  /* Método para (r)establecer el valor de ordenamiento al valor por defecto 
     (input[value=default].checked = true) */

  defaultValue() {
    const $defaultSort = document.querySelector(this.sort + "[value=default]");
    $defaultSort.checked = true;

    this.lastValue = $defaultSort.value;

    /* Evento "input" */

    const inputEvent = new Event("input", { bubbles: true });
    $defaultSort.dispatchEvent(inputEvent);
  }

  /* Método para verificar si hubo cambios desde la última confirmación */

  hasChanged() {
    return this.partialValue !== this.lastValue;
  }

  /* Método principal de inicio */

  start() {
    const events = [
      { name: "input", attachedIn: document, handlers: [this.handler] },
      {
        name: "update-last-values",
        attachedIn: document,
        handlers: [this.updateLastValue],
      },
      {
        name: "reset-last-values",
        attachedIn: document,
        handlers: [this.resetLastValue],
      },
      {
        name: "default-values",
        attachedIn: document,
        handlers: [this.defaultValue],
      },
    ];

    super.start(...events);

    this.defaultValue();
  }
}
