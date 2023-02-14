/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Filter perteneciente al componente Input del List del documento Menu */

import { InputListAbstract } from "../abstract/Input-List-Abstract.js";

export class Filter extends InputListAbstract {
  constructor(INPUT) {
    super("filter", "name", INPUT);

    this.defaultValue = true;
  }

  /* Método para manejar el evento "input" */

  input(event) {
    const { $input: $filter } = super.input(event) || {};

    if (!$filter) return;

    /* Manejar el estado del botón Confirm */
    this.OPTION.CONFIRM.manage({
      $input: $filter,
      $option: this.$parentOption,
      hasChangedMethod: this.hasChanged.bind(this),
    });
  }

  /* Método para manejar el evento "default-values" */

  defaultValues() {
    /* El valor por defecto debe ser el Filter "chequeado" */

    /* Obtenemos las entradas de los Filter que no estén "chequeados" */

    const lastValuesConfirmedUnchecked = Object.entries(
      this.lastValuesConfirmed
    ).filter(([filterName, checked]) => checked !== this.defaultValue);

    /* Se restablecen los Filter a "chequeados" */

    lastValuesConfirmedUnchecked.forEach(([filterName]) => {
      const $filter = this.get(filterName);

      this.lastValuesConfirmed[filterName] = $filter.checked =
        this.defaultValue;

      /* Evento "input" */

      const inputEvent = new Event("input", { bubbles: true });
      $filter.dispatchEvent(inputEvent);
    });

    this.setParams();
  }

  /* Método para establecer los parámetros de búsqueda que se enviarán a la API */

  setParams() {
    this.CONTROLS.setParams(this.params, this.getCheckedValuesToParams());
  }

  /* Método para obtener los valores de todos los Inputs "chequeados" en formato valor de parámetros */

  getCheckedValuesToParams() {
    return this.getCheckedValues().join("|");
  }
}
