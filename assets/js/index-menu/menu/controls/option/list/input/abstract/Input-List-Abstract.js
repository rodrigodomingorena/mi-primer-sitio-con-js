/* Clase abstracta que se extiende sobre la clases de los componentes Filter y Sort para dotarlos de
   funcionalidad y así poder manejar correctamente los estados de renderizado */

import { InputAbstract } from "../../../input/abstract/Input-Abstract.js";

export class InputListAbstract extends InputAbstract {
  constructor(optionType, propertyToCheck, INPUT) {
    super(optionType, INPUT);

    this.LIST = INPUT.LIST;
    this.INPUT = INPUT;

    this.propertyToCheck = propertyToCheck;

    this.params = this.CONTROLS.getParams(this.get());

    this.lastValuesConfirmed = this.setLastValuesConfirmed();
    this.partialValues = { ...this.lastValuesConfirmed };
  }

  /* Método para manejar el evento "input" */

  input(event) {
    const { $input } = super.input(event) || {};

    if (!$input) return;

    const $list = this.LIST.getParentList($input);
    const $listItem = this.LIST.ITEM.getParentItem($input);

    this.updatePartialValues($input);

    this.LIST.ITEM.update($input, $listItem);

    return {
      $input,
      $list,
      $listItem,
    };
  }

  /* Método para manejar el evento "update-last-values-confirmed" */

  updateLastValuesConfirmed(event) {
    if (event.target !== this.$parentOption) return;

    this.lastValuesConfirmed = { ...this.partialValues };
    this.setParams();
  }

  /* Método para manejar el evento "reset-last-values-confirmed" */

  resetLastValuesConfirmed(event) {
    if (event.target !== this.$parentOption) return;

    Object.entries(this.lastValuesConfirmed).forEach(([key, checked]) => {
      const hasChanged = this.partialValues[key] !== checked;

      if (hasChanged) {
        /* Si el valor ha cambiado desde la última confirmación, lo restablecemos */

        const $input = this.get(key);
        $input.checked = checked;

        /* Evento "input" */

        const inputEvent = new Event("input", { bubbles: true });
        $input.dispatchEvent(inputEvent);
      }
    });
  }

  /* Método para actualizar los valores parciales */

  updatePartialValues($input) {
    const property = $input[this.propertyToCheck];
    this.partialValues[property] = $input.checked;

    return property;
  }

  /* Método para verificar si hubo cambios desde la última confirmación */

  hasChanged() {
    const hasChanged = Object.entries(this.lastValuesConfirmed).some(
      ([key, checked]) => this.partialValues[key] !== checked
    );

    return hasChanged;
  }

  /* Método para establecer los últimos valores confirmados */

  setLastValuesConfirmed() {
    const inputs = document.querySelectorAll(this.selector);

    const lastValuesConfirmed = {};

    inputs.forEach(($input) => {
      const property = $input[this.propertyToCheck];
      lastValuesConfirmed[property] = $input.checked;
    });

    return lastValuesConfirmed;
  }

  /* Método para obtener un Input */

  get(key) {
    // Ej: "[name=vegetables]"
    const attrSelector = key ? `[${this.propertyToCheck}=${key}]` : "";

    return document.querySelector(this.selector + attrSelector);
  }

  /* Método para obtener todos los Inputs "chequeados" */

  getCheckedAll() {
    return document.querySelectorAll(this.selector + ":checked");
  }

  /* Método para obtener los valores de todos los Inputs "chequeados" */

  getCheckedValues() {
    const inputsChecked = this.getCheckedAll();

    return Array.from(
      inputsChecked,
      ($inputChecked) => $inputChecked[this.propertyToCheck]
    );
  }

  /* Método principal de inicio */

  start() {
    super.start();
    setTimeout(this.setParams.bind(this));
  }
}
