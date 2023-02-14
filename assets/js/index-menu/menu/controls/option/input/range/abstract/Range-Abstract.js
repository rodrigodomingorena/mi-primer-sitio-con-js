/* Clase abstracta que se extiende sobre la clases de los componentes From y To para dotarlos de
   funcionalidad y así poder manejar correctamente los estados de renderizado */

export class RangeAbstract {
  constructor(RANGE) {
    this.INDEX = RANGE.INDEX;
    this.MENU = RANGE.MENU;
    this.CONTROLS = RANGE.CONTROLS;
    this.OPTION = RANGE.OPTION;
    this.INPUT = RANGE.INPUT;
    this.RANGE = RANGE;

    this.id = this.constructor.name.toLowerCase();

    this.$input = document.getElementById(this.id);
    this.$output = document.getElementById(this.id + "Output");

    this.lastValuesConfirmed = null;
    this.partialValues = null;

    this.params = this.CONTROLS.getParams(this.$input);
  }

  /* Método para manejar el evento "input" */

  input(values) {
    this.setValue(this.getValidValue(values));
  }

  /* Método para manejar el evento "update-last-values-confirmed" */

  updateLastValuesConfirmed() {
    this.lastValuesConfirmed = this.partialValues;
    this.setParams();
  }

  /* Método para manejar el evento "reset-last-values-confirmed" */

  resetLastValuesConfirmed() {
    const hasChanged = this.partialValues !== this.lastValuesConfirmed;

    if (hasChanged) {
      /* Si el valor ha cambiado desde la última confirmación, lo restablecemos */

      this.$input.value = this.lastValuesConfirmed;

      /* Evento "input" */

      const inputEvent = new Event("input", { bubbles: true });
      this.$input.dispatchEvent(inputEvent);
    }
  }

  /* Método para manejar el evento "default-values" */

  defaultValues(value) {
    const isDefault = this.isDefault(value);

    if (!isDefault) {
      /* Si el valor no es el valor por defecto, lo restablecemos */

      this.lastValuesConfirmed = this.$input.value = this.getDefault();
      this.setParams();

      /* Evento "input" */

      const inputEvent = new Event("input", { bubbles: true });
      this.$input.dispatchEvent(inputEvent);
    }
  }

  /* Método para establecer los parámetros de búsqueda que se enviarán a la API */

  setParams() {
    this.CONTROLS.setParams(this.params, this.lastValuesConfirmed);
  }

  /* Método para construir el componente que hereda de RangeAbstract */

  build(value) {
    this.$input.min = this.RANGE.min;
    this.$input.max = this.RANGE.max;
    this.$input.value = value;

    this.$output.innerHTML = "$" + this.INDEX.separator + value;

    this.lastValuesConfirmed = this.partialValues = value;
  }

  /* Método para establecer el valor del componente que hereda de RangeAbstract */

  setValue(value) {
    this.$input.value = value;
    this.$output.innerHTML = "$" + this.INDEX.separator + value;
    this.partialValues = value;
  }

  /* Método para comprobar si un valor es el valor por defecto */

  isDefault(value) {
    return value === this.getDefault();
  }

  /* Método para obtener la posición del componente que hereda de RangeAbstract */

  getPosition() {
    return this.$input.value - this.RANGE.min;
  }

  /* Método para obtener el valor del componente que hereda de RangeAbstract */

  getValue() {
    return this.$input.value;
  }
}
