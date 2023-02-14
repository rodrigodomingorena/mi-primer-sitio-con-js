/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Sort perteneciente al componente Input del List del documento Menu */

import { InputListAbstract } from "../abstract/Input-List-Abstract.js";

export class Sort extends InputListAbstract {
  constructor(INPUT) {
    super("sort", "value", INPUT);

    this.defaultValue = "default";
  }

  /* Método para manejar el evento "input" */

  input(event) {
    const { $input: $sort, $list, $listItem } = super.input(event) || {};

    if (!$sort) return;

    this.OPTION.LIST.reset($list, $listItem);

    /* Manejar el estado del botón Confirm */
    this.OPTION.CONFIRM.manage({
      $input: $sort,
      $option: this.$parentOption,
      hasChangedMethod: this.hasChanged.bind(this),
    });
  }

  /* Método para manejar el evento "default-values" */

  defaultValues() {
    /* El valor por defecto debe ser el Sort cuyo valor es "default" "chequeado" */

    /* Si el Sort cuyo valor es "default" no está "chequeado" */
    if (!this.lastValuesConfirmed[this.defaultValue]) {
      const $sort = this.get(this.defaultValue);
      $sort.checked = true;

      /* Evento "input" */

      const inputEvent = new Event("input", { bubbles: true });
      $sort.dispatchEvent(inputEvent);

      this.lastValuesConfirmed = { ...this.partialValues };
      this.setParams();
    }
  }

  /* Método para actualizar los valores parciales */

  updatePartialValues($sort) {
    const sortNameUpdated = super.updatePartialValues($sort);

    /* Como los Inputs Sort son de tipo "radio", solo puede haber uno
       almacenado como "chequeado" ("true"). Encontramos el que anteriormente
       lo estaba para luego actualizar su valor parcial a "false" */

    const sortOutdated = Object.entries(this.partialValues).find(
      ([sortName, checked]) => sortName !== sortNameUpdated && checked === true
    );

    if (sortOutdated) {
      const [sortNameOutdated] = sortOutdated;
      this.partialValues[sortNameOutdated] = false;
    }
  }

  /* Método para establecer los parámetros de búsqueda que se enviarán a la API */

  setParams() {
    const $sort = this.getCheckedAll()[0];

    this.CONTROLS.setParams(
      this.params,
      $sort.dataset.sort,
      $sort.dataset.order
    );
  }
}
