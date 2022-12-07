/* Establecimiento de la funcionalidad y estilos del "doble input" de tipo "range"
   perteneciente a la sección Controls del Menú. */

//  Basado en el siguiente artículo:
//    https://medium.com/@predragdavidovic10/native-dual-range-slider-html-css-javascript-91e778134816

import { API_URL_PLATES } from "../../../helpers/api.js";
import { fetchResource } from "../../../helpers/fetch.js";

import { parsedName } from "../../../helpers/parsed-name.js";

export class Range {
  constructor() {
    this.topLevel = "controls__option";

    this.$fromRange = document.getElementById("fromRange");
    this.$fromOutput = document.getElementById("fromOutput");
    this.$toRange = document.getElementById("toRange");
    this.$toOutput = document.getElementById("toOutput");

    this.range = "[data-option=range]";

    this.$optionParent = document
      .querySelector(this.range)
      .closest("." + this.topLevel);

    this.singleInput = false;

    this.min;
    this.max;
    this.rangeDistance;

    this.lastFromValue;
    this.lastToValue;
    this.partialFromValue;
    this.partialToValue;

    this.trackColor = getComputedStyle(this.$toRange).getPropertyValue(
      "--trackColor"
    );
    this.progressColor = getComputedStyle(this.$toRange).getPropertyValue(
      "--progressColor"
    );

    this.start();
  }

  /* Método principal que gestiona los eventos de los input "range" */

  handler(event) {
    if (!event.target.matches(this.range)) return;

    const $range = event.target;
    const prefix = $range.id;
    const type = event.type;

    const method = parsedName(prefix, type);

    this[method]($range);
  }

  /* Método de manejo del evento "input" en $fromRange */

  fromRangeInput($range) {
    const [fromValue, toValue] = this.getParsedValues();

    /* Se actualiza el "background" con los nuevos valores */
    this.fill();

    /* El valor del $fromRange nunca debe ser mayor que el del $toRange. */
    const isLarger = fromValue > toValue;

    this.$fromRange.value = isLarger ? toValue : fromValue;
    this.$fromOutput.innerHTML = `$&#8239;${isLarger ? toValue : fromValue}`;
    this.partialFromValue = isLarger ? toValue : fromValue;

    this.updateConfirm($range);
  }

  /* Método de manejo del evento 'input' en $toRange */

  toRangeInput($range) {
    const [fromValue, toValue] = this.getParsedValues();

    /* Se actualiza el 'background' con los nuevos valores */
    this.fill();

    /* Se mantiene accesible al usuario el 'thumb' del $toRange */
    this.setToggleAccessible();

    /* El valor del $toRange nunca debe ser menor que el del $fromRange. */
    const isMinor = toValue < fromValue;

    this.$toRange.value = isMinor ? fromValue : toValue;
    this.$toOutput.innerHTML = `$&#8239;${isMinor ? fromValue : toValue}`;
    this.partialToValue = isMinor ? fromValue : toValue;

    this.updateConfirm($range);
  }

  /* Método para construir dinámicamente los rangos cuando se carge el documento */

  async build() {
    const [lowerPrice, higherPrice] = await this.getMinMax();

    this.min = lowerPrice;
    this.max = higherPrice;
    this.rangeDistance = this.max - this.min;

    this.$fromOutput.innerHTML = `$&#8239;${this.min}`;
    this.$toOutput.innerHTML = `$&#8239;${this.max}`;

    this.$fromRange.min = this.$toRange.min = this.min;
    this.$fromRange.max = this.$toRange.max = this.max;

    this.$fromRange.value = this.min;
    this.$toRange.value = this.max;

    this.lastFromValue = this.partialFromValue = this.min;
    this.lastToValue = this.partialToValue = this.max;

    /* Se rellena el 'background' con los valores recién actualizados */
    this.fill();

    /* Se mantiene accesible al usuario el 'thumb' del $toRange */
    this.setToggleAccessible();

    /* Evento "built-range" */

    // Para que el código que renderiza las "cards" sepa que ya
    // puede consultar los valores de los rangos para poder cargarlas.

    const builtRangeEvent = new CustomEvent("built-range");
    document.dispatchEvent(builtRangeEvent);
  }

  /* Método para obtener el precio más alto y más bajo en los que se basarán los rangos */

  async getMinMax() {
    const url = new URL(API_URL_PLATES);

    /* Se ordena la solicitud por "price", lo cual dispone a cada plato
       en la respuesta de manera ascendente en cuanto a su precio */

    url.searchParams.set("_sort", "price");
    url.searchParams.set("_page", 1);
    url.searchParams.set("_limit", 1);

    /* Se envía una solicitud a la API donde están los datos
       de los platos para obtener el valor del precio más bajo */
    let firstResponse, firstJSON, firstPlate;

    try {
      ({ response: firstResponse, json: firstJSON } = await fetchResource(url));

      firstPlate = firstJSON[0];
    } catch (e) {
      // En caso de cualquier error, no se manejará. Simplemente se
      // establecerá "lowerPrice" al valor por defecto de 0 (cero)
    }

    const lowerPrice = firstPlate?.price || 0;

    /* La API entrega un 'Header' llamado 'Link' donde se encuentran
       los enlaces a <first>, <prev>, <next> y <last>.
       Se necesita <last> para obtener el plato con el precio más alto */

    const links = firstResponse?.headers.get("Link").matchAll(/<(.*?)>/g);
    const linksArr = Array.from(links || []);
    const lastLink = linksArr.pop()?.[1];

    let lastPlate;

    /* Si efectivamente había un enlace <last> */
    if (lastLink) {
      try {
        const { json: lastJSON } = await fetchResource(lastLink);

        lastPlate = lastJSON[0];
      } catch (e) {
        // En caso de cualquier error, no se manejará. Simplemente se
        // establecerá "higerPrice" al valor por defecto de 5000 (cinco mil)
      }
    }

    const higherPrice = lastPlate?.price || 5_000;

    return [lowerPrice, higherPrice];
  }

  /* Método para pintar el "background" del rango */

  fill() {
    const fromPosition = this.$fromRange.value - this.min;
    const toPosition = this.$toRange.value - this.min;

    this.$toRange.style.background = `linear-gradient(
      to right,
      ${this.trackColor} 0%,
      ${this.trackColor} ${(fromPosition / this.rangeDistance) * 100}%,
      ${this.progressColor} ${(fromPosition / this.rangeDistance) * 100}%,
      ${this.progressColor} ${(toPosition / this.rangeDistance) * 100}%, 
      ${this.trackColor} ${(toPosition / this.rangeDistance) * 100}%, 
      ${this.trackColor} 100%
    )`;
  }

  /* Método de accesibilidad del 'thumb' del $toRange */

  setToggleAccessible() {
    if (+this.$toRange.value <= +this.$fromRange.value) {
      this.$toRange.style.zIndex = 2;
    } else {
      this.$toRange.style.zIndex = 0;
    }
  }

  /* Método para actualizar el estado del botón "confirm" */

  updateConfirm($range) {
    /* Se comprueba si los valores parciales difieren de los de la última confirmación */
    const hasChanged = this.hasChanged();

    /* Evento "confirm-update" */

    const confirmUpdateEvent = new CustomEvent("confirm-update", {
      detail: { $input: $range, hasChanged, singleInput: this.singleInput },
    });

    document.dispatchEvent(confirmUpdateEvent);
  }

  /* Método para actualizar los valores desde la última confirmación */

  updateLastValues(event) {
    if (event.target !== this.$optionParent) return;

    this.lastFromValue = this.partialFromValue;
    this.lastToValue = this.partialToValue;
  }

  /* Método para restablecer los valores a los de la última confirmación */

  resetLastValues(event) {
    if (event.target !== this.$optionParent) return;

    /* Si no hubo cambios */
    if (!this.hasChanged()) return;

    /* Se comprueba por separado qué valores difieren a los de la última confirmación */

    const fromHasChanged = this.partialFromValue !== this.lastFromValue;
    const toHasChanged = this.partialToValue !== this.lastToValue;

    if (fromHasChanged) this.$fromRange.value = this.lastFromValue;

    if (toHasChanged) this.$toRange.value = this.lastToValue;

    /* Evento "input" */

    const inputEvent = new Event("input", { bubbles: true });

    if (fromHasChanged) this.$fromRange.dispatchEvent(inputEvent);

    if (toHasChanged) this.$toRange.dispatchEvent(inputEvent);
  }

  /* Método para restablecer los valores a los valores por defecto 
     (fromValue = min / toValue = max) */

  defaultValues() {
    const [fromValue, toValue] = this.getParsedValues();

    /* Se comprueba por separado qué valores difieren de los valores por defecto */

    const fromIsNotDefault = fromValue !== this.min;
    const toIsNotDefault = toValue !== this.max;

    if (fromIsNotDefault) {
      this.lastFromValue = this.$fromRange.value = this.min;
    }

    if (toIsNotDefault) {
      this.lastToValue = this.$toRange.value = this.max;
    }

    /* Evento "input" */

    const inputEvent = new Event("input", { bubbles: true });

    if (fromIsNotDefault) this.$fromRange.dispatchEvent(inputEvent);

    if (toIsNotDefault) this.$toRange.dispatchEvent(inputEvent);
  }

  /* Método para leer los valores de los rangos */

  getParsedValues() {
    const fromValue = parseInt(this.$fromRange.value, 10);
    const toValue = parseInt(this.$toRange.value, 10);

    return [fromValue, toValue];
  }

  /* Método para verificar si hubo cambios desde la última confirmación */

  hasChanged() {
    const hasChanged =
      this.partialFromValue !== this.lastFromValue ||
      this.partialToValue !== this.lastToValue;

    return hasChanged;
  }

  /* Método principal de inicio */

  start() {
    this.build();

    const events = [
      { name: "input", attachedIn: document, handlers: [this.handler] },
      {
        name: "update-last-values",
        attachedIn: document,
        handlers: [this.updateLastValues],
      },
      {
        name: "reset-last-values",
        attachedIn: document,
        handlers: [this.resetLastValues],
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
