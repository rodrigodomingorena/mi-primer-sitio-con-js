/* Establecimiento de la funcionalidad que controla el renderizado del
   componente Nutritional Info perteneciente al documento Plate */

import { Main } from "./main/Main.js";
import { Details } from "./details/Details.js";

export class NutritionalInfo {
  constructor(PLATE) {
    this.INDEX = PLATE.INDEX;
    this.PLATE = PLATE;

    this.nutritionalInfo = "nutritional-info";
    this.$nutritionalInfo = document.querySelector("." + this.nutritionalInfo);

    this.nutritionalInfoLoaded = null;

    this.MAIN = new Main(this);
    this.DETAILS = new Details(this);

    this.start();
  }

  /* Método para manejar el evento "plate-update" */

  update({ detail: plate }) {
    this.nutritionalInfoLoaded = plate.nutritionalInfo[0];

    this.sendUpdateEvent();
  }

  /* Método para manejar el evento "default-values" */

  defaultValues({ detail }) {
    /* Si el restablecimiento a los valores por defecto proviene desde la recarga
       de un estado de error, no manejamos nada. Ya están establecidos por defecto */
    if (detail === "from-error") return;

    this.nutritionalInfoLoaded = null;
  }

  /* Método para lanzar el evento "nutritional-info-update" */

  sendUpdateEvent() {
    /* Recuperamos la opción actualmente seleccionada por el usuario */

    // Ej: OPTIONS.selectedValue = "kilograms";

    const optionSelectedValue = this.MAIN.OPTIONS.selectedValue;

    /* Construimos la clave para recuperar el último valor de peso
       introducido según la opción actualmente seleccionada por el usuario */

    // Ej: "kilograms" --> "lastKilograms"

    const lastOptionSelectedValue = this.parsedName("last", optionSelectedValue);

    /* Recuperamos el último valor de peso introducido según la opción
       actualmente seleccionada por el usuario */

    // Ej: OPTIONS.lastKilograms = 0.3;

    const weightValue = this.MAIN.OPTIONS[lastOptionSelectedValue];

    /* Dependiendo de la opción actualmente seleccionada por el usuario,
       el último valor de peso introducido necesita un tratamiento especial
       para que luego se puedan hacer los cálculos correctamente */

    const multiplier = this.setMultiplier(weightValue);

    /* Evento "nutritional-info-update" */

    // Para actualizar los componentes del Nutritional Info en base al valor
    // de peso introducido por el usuario.

    const nutritionalInfoUpdateEvent = new CustomEvent(
      "nutritional-info-update",
      {
        detail: {
          nutritionalInfo: this.nutritionalInfoLoaded,
          multiplier,
        },
      }
    );
    document.dispatchEvent(nutritionalInfoUpdateEvent);
  }

  /* Método para establecer correctamente el multiplicador que calculará la información nutricional */

  setMultiplier(weightValue) {
    /* 
       La información nutricional que obtenemos de la API posee valores por cada gramo
       de alimento que contiene el plato que el usuario está consultando.

       Si la opción seleccionada por el usario es distinta de "grams", hay que
       hacer una conversión del valor de peso ingresado a gramos para que los
       cálculos posteriores se realicen correctamente.
    */

    switch (this.MAIN.OPTIONS.selectedValue) {
      case "kilograms":
        weightValue = weightValue * 1000;
        break;

      case "plates":
        weightValue = weightValue * 300;
        break;
    }

    return weightValue;
  }

  /* Método de separación visual cada tres cifras */

  thousandSeparator(value) {
    // Ej: 10000 --> 10 000

    let reverseValue = value.split("").reverse().join("");

    /* Expresión regular con lookahead negativo y carácter especial de replace() */
    reverseValue = reverseValue.replace(
      /\d{3}(?![,.])(?!$)/g,
      "$&" + this.INDEX.separator
    );

    return reverseValue.split("").reverse().join("");
  }

  /* Método que convierte en "lowerCamelCase" los valores ingresados */

  parsedName(prefix, ...strings) {
    // Ej: "last", ["grams"] --> "lastGrams"
    // Ej: "last", ["kilograms"] --> "lastKilograms"
    // Ej: "last", ["plates"] --> "lastPlates"

    strings = strings.map((str) =>
      str.replace(/^./, (char) => char.toUpperCase())
    );

    let parsedName = prefix;

    for (const string of strings) {
      parsedName += string;
    }

    return parsedName;
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
