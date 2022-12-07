/* Establecimiento de la funcionalidad de los input data-option = "filter"
   pertenecientes a la sección Controls del Menú. */

import { OptionInput } from "./option-input.js";

export class Filter extends OptionInput {
  constructor() {
    super();
    this.filter = "[data-option=filter]";
    this.checked = this.filter + ":checked";
    this.singleInput = false;

    this.$optionParent = document
      .querySelector(this.filter)
      .closest("." + this.topLevel);

    this.lastValues = {};

    const filters = document.querySelectorAll(this.filter);
    filters.forEach(($filter) => {
      this.lastValues[$filter.name] = $filter.checked;
    });

    this.partialValues = { ...this.lastValues };

    this.start();
  }

  /* Método principal que gestiona los eventos de los input data-option = "filter" */

  handler(event) {
    const match = this.filter;

    const { method, $input, $parentItem } = super.handler(event, match) || {};

    if (method) this[method]($input, $parentItem);
  }

  /* Método de manejo del evento "input" en los input data-option = "filter" */

  input($filter, $parentItem) {
    const action = $filter.checked ? "add" : "remove";

    $parentItem.classList[action](this.activeItem);

    this.partialValues[$filter.name] = $filter.checked;

    this.updateConfirm($filter);
  }

  /* Método para actualizar el estado del botón "confirm" */

  updateConfirm($filter) {
    /* Se comprueba si los valores parciales difieren de los de la última confirmación */
    const hasChanged = this.hasChanged();

    /* Evento "confirm-update" */

    const confirmUpdateEvent = new CustomEvent("confirm-update", {
      detail: { $input: $filter, hasChanged, singleInput: this.singleInput },
    });

    document.dispatchEvent(confirmUpdateEvent);
  }

  /* Método para actualizar los valores desde la última confirmación */

  updateLastValues(event) {
    if (event.target !== this.$optionParent) return;

    this.lastValues = { ...this.partialValues };
  }

  /* Método para restablecer los valores a los de la última confirmación */

  resetLastValues(event) {
    if (event.target !== this.$optionParent) return;

    /* Si no hubo cambios */
    if (!this.hasChanged()) return;

    const lastValuesEntries = Object.entries(this.lastValues);

    for (const lastValueEntry of lastValuesEntries) {
      const [filterName, isChecked] = lastValueEntry;

      const hasChanged = this.partialValues[filterName] !== isChecked;

      /* Los $filters que han cambiado retornan al último valor confirmado */
      if (hasChanged) {
        const $filter = document.querySelector(
          this.filter + `[name=${filterName}]`
        );

        $filter.checked = isChecked;

        /* Evento "input" */

        const inputEvent = new Event("input", { bubbles: true });
        $filter.dispatchEvent(inputEvent);
      }
    }
  }

  /* Método para restablecer los valores a los valores por defecto
     (filter.checked = false) */

  defaultValues() {
    const lastValuesEntries = Object.entries(this.lastValues);

    const lastValuesEntriesChecked = lastValuesEntries.filter(
      (lastValuesEntry) => {
        const isChecked = lastValuesEntry[1];
        return isChecked;
      }
    );

    /* Se restablece a "false" el valor "checked" de los $filter que estén en "true" */

    for (const lastValuesEntryChecked of lastValuesEntriesChecked) {
      const filterName = lastValuesEntryChecked[0];

      const $filter = document.querySelector(
        this.filter + `[name=${filterName}]`
      );

      this.lastValues[filterName] = $filter.checked = false;

      /* Evento "input" */

      const inputEvent = new Event("input", { bubbles: true });

      $filter.dispatchEvent(inputEvent);
    }
  }

  /* Método para verificar si hubo cambios desde la última confirmación */

  hasChanged() {
    const lastValuesEntries = Object.entries(this.lastValues);

    const hasChanged = lastValuesEntries.some((lastValuesEntry) => {
      const [filterName, isChecked] = lastValuesEntry;

      return this.partialValues[filterName] !== isChecked;
    });

    return hasChanged;
  }

  /* Método principal de inicio */

  start() {
    const events = [
      { name: "input", attachedIn: document, handlers: [this.handler] },
      {
        name: "update-last-values",
        attachedIn: document,
        handlers: [this.updateLastValues],
      },
      {
        name: "reset-last-values",
        attachedIn: document,
        handlers: [this.resetLastValues],
      },
      {
        name: "default-values",
        attachedIn: document,
        handlers: [this.defaultValues],
      },
    ];

    super.start(...events);
  }
}
