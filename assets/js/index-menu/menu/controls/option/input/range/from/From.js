/* Establecimiento de la funcionalidad que controla el renderizado del componente
   From perteneciente al componente Range del Input del documento Menu */

import { RangeAbstract } from "../abstract/Range-Abstract.js";

export class From extends RangeAbstract {
  constructor(RANGE) {
    super(RANGE);
  }

  /* Método para manejar el evento "default-values" */

  defaultValues({ fromValue }) {
    super.defaultValues(fromValue);
  }

  /* Método para construir el From */

  build({ min }) {
    super.build(min);
  }

  /* Método para obtener un valor válido de From */

  getValidValue({ fromValue, toValue }) {
    /* From nunca debe ser mayor a To */
    return fromValue > toValue ? toValue : fromValue;
  }

  /* Método para obtener el valor por defecto de From */

  getDefault() {
    return this.RANGE.min;
  }
}
