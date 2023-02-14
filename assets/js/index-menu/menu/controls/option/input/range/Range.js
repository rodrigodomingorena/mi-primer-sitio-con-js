/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Range perteneciente al componente Input del Option del documento Menu */

//  Componente basado en el siguiente artículo:
//  https://medium.com/@predragdavidovic10/native-dual-range-slider-html-css-javascript-91e778134816

import { API_URL_PLATES } from "../../../../../../helpers/api.js";
import { fetchResource } from "../../../../../../helpers/fetch.js";

import { InputAbstract } from "../abstract/Input-Abstract.js";
import { From } from "./from/From.js";
import { To } from "./to/To.js";

export class Range extends InputAbstract {
  constructor(INPUT) {
    super("range", INPUT);

    this.INPUT = INPUT;

    this.min = null;
    this.max = null;
    this.distance = null;

    this.FROM = new From(this);
    this.TO = new To(this);

    this.colors = this.getColors();

    this.targets = {
      FROM: this.FROM,
      TO: this.TO,
    };
  }

  /* Método para manejar el evento "input" */

  input(event) {
    const { $input: $range } = super.input(event) || {};

    if (!$range) return;

    this.fill();

    const RANGE = $range.id.toUpperCase();

    // Ej: this.FROM.input(...)
    this[RANGE].input(this.getParsedValues());

    /* Manejar el estado del botón Confirm */
    this.OPTION.CONFIRM.manage({
      $input: $range,
      $option: this.$parentOption,
      hasChangedMethod: this.hasChanged.bind(this),
    });
  }

  /* Método para manejar el evento "update-last-values-confirmed" */

  updateLastValuesConfirmed(event) {
    if (event.target !== this.$parentOption) return;

    this.executeTargets("updateLastValuesConfirmed");
  }

  /* Método para manejar el evento "reset-last-values-confirmed" */

  resetLastValuesConfirmed(event) {
    if (event.target !== this.$parentOption) return;

    /* Si no hubo cambios */
    if (!this.hasChanged()) return;

    this.executeTargets("resetLastValuesConfirmed");
  }

  /* Método para manejar el evento "default-values" */

  defaultValues() {
    const values = this.getParsedValues();
    this.executeTargets("defaultValues", values);
  }

  /* Método para ejecutar métodos en los "targets" registrados */

  executeTargets(methodName, ...params) {
    Object.values(this.targets).forEach((TARGET) => TARGET[methodName](...params));
  }

  /* Método para inicializar el Range */

  async init() {
    const { min, max } = await this.getMinMax();

    this.build(min, max);
    this.executeTargets("setParams");

    /* Una vez establecido el límite mínimo y máximo de precio,
       se inicia la carga de los datos de los platos */
    this.MENU.CARDS.load();
  }

  /* Método para obtener el precio más alto y más bajo del Range */

  async getMinMax() {
    const { min, response } = await this.getMin();
    const { max } = await this.getMax(response);

    return { min, max };
  }

  /* Método para obtener el precio más bajo del Range */

  async getMin() {
    const url = new URL(API_URL_PLATES);

    /* Se ordena la solicitud por "price", lo cual dispone a cada plato
       en la respuesta de manera ascendente en cuanto a su precio */

    url.searchParams.set("_sort", "price");
    url.searchParams.set("_page", 1);
    url.searchParams.set("_limit", 1);

    /* Se envía una solicitud a la API donde están los datos
       de los platos para obtener el valor del precio más bajo */

    try {
      const { response, json } = await fetchResource(url);

      return { min: json[0].price, response };
    } catch (e) {
      // En caso de error simplemente se establecerá
      // "min" al valor por defecto de 0 (cero)

      return { min: 0, response: null };
    }
  }

  /* Método para obtener el precio más alto del Range */

  async getMax(response) {
    const lastLink = this.getLastLink(response);

    /* Si efectivamente había un enlace <last> */
    if (lastLink) {
      /* Se envía una solicitud a la API donde están los datos
       de los platos para obtener el valor del precio más alto */

      try {
        const { json } = await fetchResource(lastLink);

        return { max: json[0].price };
      } catch (e) {
        // En caso de error, no se manejará. Simplemente se
        // establecerá "max" al valor por defecto de 5000 (cinco mil)
      }
    }

    return { max: 5_000 };
  }

  /* Método para obtener el "lastLink" */

  getLastLink(response) {
    if (!response) return;

    /* La API entrega un "Header" llamado "Link" donde se encuentran
       los enlaces a <first>, <prev>, <next> y <last>.
       Se necesita <last> para obtener el plato con el precio más alto */

    const linkHeader = response.headers.get("Link");

    /* Si no había ningún link <last> */
    if (!linkHeader?.includes('rel="last"')) return null;

    const links = Array.from(linkHeader.matchAll(/<(.*?)>/g));

    /* De haberlo, siempre estará en la última posición */
    const lastLink = links.pop()[1];

    return lastLink;
  }

  /* Método para construir el Range */

  build(min, max) {
    this.min = min;
    this.max = max;
    this.distance = this.max - this.min;

    this.executeTargets("build", { min, max });
    this.fill();
  }

  /* Método para pintar el Range */

  fill() {
    const fromPosition = this.FROM.getPosition();
    const toPosition = this.TO.getPosition();

    this.TO.$input.style.background = `linear-gradient(
        to right,
        ${this.colors.track} 0%,
        ${this.colors.track} ${(fromPosition / this.distance) * 100}%,
        ${this.colors.progress} ${(fromPosition / this.distance) * 100}%,
        ${this.colors.progress} ${(toPosition / this.distance) * 100}%, 
        ${this.colors.track} ${(toPosition / this.distance) * 100}%, 
        ${this.colors.track} 100%
      )`;
  }

  /* Método para verificar si hubo cambios desde la última confirmación */

  hasChanged() {
    const hasChanged =
      this.FROM.partialValues !== this.FROM.lastValuesConfirmed ||
      this.TO.partialValues !== this.TO.lastValuesConfirmed;

    return hasChanged;
  }

  /* Método para leer los valores del Range */

  getParsedValues() {
    const fromValue = parseInt(this.FROM.getValue(), 10);
    const toValue = parseInt(this.TO.getValue(), 10);

    return { fromValue, toValue };
  }

  /* Método para obtener los colores necesarios para pintar el Range */

  getColors() {
    return {
      track: getComputedStyle(this.FROM.$input).getPropertyValue(
        "--trackColor"
      ),
      progress: getComputedStyle(this.FROM.$input).getPropertyValue(
        "--progressColor"
      ),
    };
  }

  /* Método principal de inicio */

  start() {
    this.init();
    super.start();
  }
}
