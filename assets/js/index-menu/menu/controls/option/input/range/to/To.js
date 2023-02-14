/* Establecimiento de la funcionalidad que controla el renderizado del componente
   To perteneciente al componente Range del Input del documento Menu */

import { RangeAbstract } from "../abstract/Range-Abstract.js";

export class To extends RangeAbstract {
  constructor(RANGE) {
    super(RANGE);
  }

  /* Método para manejar el evento "input" */

  input(values) {
    super.input(values);
    this.setToggleAccessible(values);
  }

  /* Método para manejar el evento "default-values" */

  defaultValues({ toValue }) {
    super.defaultValues(toValue);
  }

  /* Método para construir el To */

  build({ max }) {
    super.build(max);
    this.setToggleAccessible();
  }

  /* Método para mantener accesible el "thumb" del To */

  setToggleAccessible({ fromValue, toValue } = this.RANGE.getParsedValues()) {
    this.$input.style.zIndex = toValue <= fromValue ? 2 : 0;
  }

  /* Método para obtener un valor válido de To */

  getValidValue({ fromValue, toValue }) {
    /* To nunca debe ser menor a From */
    return toValue < fromValue ? fromValue : toValue;
  }

  /* Método para obtener el valor por defecto de To */

  getDefault() {
    return this.RANGE.max;
  }
}
