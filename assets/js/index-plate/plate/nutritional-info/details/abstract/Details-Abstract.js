/* Clase abstracta que se extiende sobre las clases de los componentes Fats, Carbohydrates y Proteins
   para dotarlos de funcionalidad y así poder manejar correctamente sus estados de renderizado */

export class DetailsAbstract {
  constructor() {
    this.grams = "[data-grams]";
    this.ratio = "[data-ratio]";

    this.defaultValue = 0;
  }

  /* Método para manejar el evento "nutritional-info-update" */

  nutritionalInfoUpdate({ detail: { multiplier, nutritionalInfo } }) {
    if (!nutritionalInfo) return;

    this.build(multiplier, nutritionalInfo);
  }

  /* Método para manejar el evento "default-values" */

  defaultValues({ detail }) {
    /* Si el restablecimiento a los valores por defecto proviene desde la recarga
       de un estado de error, no manejamos nada. Ya están establecidos por defecto */
    if (detail === "from-error") return;

    this.$grams.innerHTML = this.gramsValueFormat(this.defaultValue);

    /* Si el componente no tiene ratios que mostrar */
    if (!this.ratios) return;

    this.ratios.forEach(
      ($ratio) => ($ratio.innerHTML = this.ratioValueFormat(this.defaultValue))
    );
  }

  /* Método para construir el componente que hereda de DetailsAbstract */

  build(multiplier, nutritionalInfo) {
    // Ej: Fats.constructor.name.toLoweCase() --> "fats"
    const componentClassName = this.constructor.name.toLowerCase();

    // Ej: nutritionalInfo.fats = { fatsInfo }
    const componentInfo = nutritionalInfo[componentClassName];

    /* Se establecen los gramos */

    const gramsValue = this.gramsValueFormat(componentInfo.total * multiplier);
    this.$grams.innerHTML = gramsValue;

    /* Si el componente no tiene ratios que mostrar */
    if (!this.ratios) return;

    /* Se establecen los ratios */

    this.ratios.forEach(($ratio) => {
      // Ej: $ratio = <div data-ratio="saturated"></div> --> fatsInfo.saturated = 0.0134
      const ratioInfo = componentInfo[$ratio.dataset.ratio];

      const ratioValue = this.ratioValueFormat(ratioInfo * multiplier);

      $ratio.innerHTML = ratioValue;
    });
  }

  /* Método para dar formato general */

  generalValueFormat(value) {
    value = value.toString().replace(/\./, ",");

    value = this.NUTRITIONAL_INFO.thousandSeparator(value);

    return value + this.INDEX.separator + "g";
  }

  /* Método para dar formato a los gramos */

  gramsValueFormat(gramsValue) {
    gramsValue = Math.round(gramsValue * 100) / 100;

    return this.generalValueFormat(gramsValue);
  }

  /* Método para dar formato a los ratios */

  ratioValueFormat(ratioValue) {
    ratioValue = Math.round(ratioValue * 1000) / 1000;

    return this.generalValueFormat(ratioValue);
  }

  /* Método principal de inicio */

  start(events) {
    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }
  }
}
