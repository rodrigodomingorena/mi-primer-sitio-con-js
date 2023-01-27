/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Option perteneciente al componente Main del Nutritional Info del documento Plate */

import { Label } from "./label/Label.js";

export class Options {
  constructor(MAIN) {
    this.INDEX = MAIN.INDEX;
    this.PLATE = MAIN.PLATE;
    this.NUTRITIONAL_INFO = MAIN.NUTRITIONAL_INFO;
    this.MAIN = MAIN;

    this.option = this.MAIN.main + "__option";
    this.selected = this.option + "--selected";

    this.$selected = document.querySelector("." + this.selected);
    this.$inputSelectedDefault = this.$selected.querySelector("input");

    this.selectedValue = this.$inputSelectedDefault.value;

    /* Options disponibles: "grams", "kilograms", "plates" */

    this.defaultGrams = this.lastGrams = 300;
    this.defaultKilograms = this.lastKilograms = 0.3;
    this.defaultPlates = this.lastPlates = 1;

    this.LABEL = new Label(this);

    this.start();
  }

  /* Método para manejar el evento "change" */

  change(event) {
    const $option = event.target.closest("." + this.option);

    if (!$option) return;

    const $input = event.target;

    /* $option es un <li>, el evento en sí ocurre en el <input radio> que se está en su interior */

    $option.classList.add(this.selected);

    /* Reemplazo del $option seleccionado anteriormente por el nuevo */
    this.$selected.classList.remove(this.selected);
    this.$selected = $option;
    this.selectedValue = $input.value;

    /* Actualización del valor de peso del Amount acorde al nuevo $option seleccionado */
    this.MAIN.AMOUNT.fill();
  }

  /* Método para manejar el evento "default-values" */

  defaultValues({ detail }) {
    /* Si el restablecimiento a los valores por defecto proviene desde la recarga
       de un estado de error, no manejamos nada. Ya están establecidos por defecto */
    if (detail === "from-error") return;

    this.lastGrams = this.defaultGrams;
    this.lastKilograms = this.defaultKilograms;
    this.lastPlates = this.defaultPlates;

    /* Si el <input> que debe estar seleccionado por defecto ya lo está */
    if (this.$inputSelectedDefault.checked) {
      /* Actualización del valor de peso del Amount asegurándonos de que
         muestre el valor de peso por defecto para el $option seleccionado */
      this.MAIN.AMOUNT.fill();
    } else {
      /* Si no lo está, forzamos la selección */
      this.$inputSelectedDefault.checked = true;

      const changeEvent = new Event("change", { bubbles: true });
      this.$inputSelectedDefault.dispatchEvent(changeEvent);
    }
  }

  /* Método para actualizar el último valor de peso introducido */

  updateLastOptionSelectedValue(amountValue) {
    /* Recuperamos la opción actualmente seleccionada por el usuario */

    // Ej: this.selectedValue = "kilograms";

    const optionSelectedValue = this.selectedValue;

    /* Construimos la clave para actualizar el último valor de peso
       introducido según la opción actualmente seleccionada por el usuario */

    // Ej: "kilograms" --> "lastKilograms"

    const lastOptionSelectedValue = this.NUTRITIONAL_INFO.parsedName(
      "last",
      optionSelectedValue
    );

    /* El método integrado para convertir la cadena a número solo reconoce puntos */

    amountValue = amountValue.replace(/,/, ".");

    /* Actualizamos el último valor de peso introducido según la opción
       actualmente seleccionada por el usuario */

    // Ej: this.lastKilograms = 2.4;

    this[lastOptionSelectedValue] = parseFloat(amountValue, 10);
  }

  /* Método principal de inicio */

  start() {
    const events = [
      {
        name: "change",
        attachedIn: document,
        handlers: [this.change],
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
