/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Main perteneciente al componente Nutritional Info del documento Plate */

import { Options } from "./options/Options.js";
import { Amount } from "./amount/Amount.js";

export class Main {
  constructor(NUTRITIONAL_INFO) {
    this.INDEX = NUTRITIONAL_INFO.INDEX;
    this.PLATE = NUTRITIONAL_INFO.PLATE;
    this.NUTRITIONAL_INFO = NUTRITIONAL_INFO;

    this.main = this.NUTRITIONAL_INFO.nutritionalInfo + "__main";
    this.title = this.main + "__title";
    this.kcal = this.main + "__kcal";

    this.$main = document.querySelector("." + this.main);
    this.$title = document.querySelector("." + this.title);
    this.$kcal = document.querySelector("." + this.kcal);

    this.backgroundBreakpoints = [null, "sm", "md", "lg"];

    this.OPTIONS = new Options(this);
    this.AMOUNT = new Amount(this);

    this.start();
  }

  /* Método para manejar el evento "plate-update" */

  update({ detail: plate }) {
    this.build(plate);
  }

  /* Método para manejar el evento "nutritional-info-update" */

  nutritionalInfoUpdate({ detail: { multiplier, nutritionalInfo } }) {
    if (!nutritionalInfo) return;

    this.setKcal(multiplier, nutritionalInfo);
  }

  /* Método para manejar el evento "default-values" */

  defaultValues({ detail }) {
    /* Si el restablecimiento a los valores por defecto proviene desde la recarga
       de un estado de error, no manejamos nada. Ya están establecidos por defecto */
    if (detail === "from-error") return;

    this.$title.innerHTML = this.$kcal.innerHTML = "";
    this.deleteBackground();
  }

  /* Método para construir el Main */

  build(plate) {
    this.$title.innerHTML = `Información nutricional de «${plate.name}»`;
    this.setBackground(plate);
  }

  /* Método para establecer las calorías */

  setKcal(multiplier, nutritionalInfo) {
    let value = (multiplier * nutritionalInfo.kcals).toFixed();
    value = this.NUTRITIONAL_INFO.thousandSeparator(value);

    this.$kcal.innerHTML = value + this.INDEX.separator + "kcal";
  }

  /* Método para establecer el fondo */

  setBackground(plate) {
    /* Mediante propiedades personalizadas de CSS se establece el fondo.
       Dependiendo de cada plato a renderizar, JavaScript les dará un valor
       específico a esas propiedades que están en las hojas de estilo */

    this.backgroundBreakpoints.forEach((breakpoint) => {
      // "--background-url-sm/md/lg" o "--background-url"
      const property = `--background-url${breakpoint ? "-" + breakpoint : ""}`;

      // "sm/", "md/", "lg/" o ""
      const breakpointPath = breakpoint ? breakpoint + "/" : "";

      const value = `url("../../media/plate-${plate.imageId}/${breakpointPath}nutritional-info.png")`;

      this.$main.style.setProperty(property, value);
    });
  }

  /* Método para eliminar el fondo */

  deleteBackground() {
    this.backgroundBreakpoints.forEach((breakpoint) => {
      // "--background-url-sm/md/lg" o "--background-url"
      const property = `--background-url${breakpoint ? "-" + breakpoint : ""}`;

      this.$main.style.removeProperty(property);
    });
  }

  /* Método principal de inicio */

  start() {
    const events = [
      {
        name: "plate-update",
        attachedIn: document,
        handlers: [this.update],
      },
      {
        name: "nutritional-info-update",
        attachedIn: document,
        handlers: [this.nutritionalInfoUpdate],
      },
      {
        name: "default-values",
        attachedIn: document,
        handlers: [this.defaultValues],
      },
    ];

    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }
  }
}
