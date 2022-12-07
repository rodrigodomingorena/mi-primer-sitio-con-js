/* Establecimiento de la funcionalidad de entrada de valores y cambio en el
   input "search" perteneciente a la sección Controls del Menú. */

import { setCursorPosition } from "../../helpers/set-cursor-position.js";

export class Search {
  constructor() {
    this.topLevel = "controls__search";
    this.search = this.topLevel + "__input";
    this.$search = document.querySelector("." + this.search);

    this.lastValue;

    this.start();
  }

  /* Método principal que gestiona los eventos del input "$search" */

  handler(event) {
    if (event.target !== this.$search) return;

    const searchValue = this.$search.value;
    const method = event.type;

    this[method](this.$search, searchValue);
  }

  /* Método que gestiona el evento "input" del input "$search" */

  input($search, searchValue) {
    const cursorPosition = $search.selectionStart;
    const rawLength = searchValue.length;

    /* Se prohíbe comenzar con espacios */
    searchValue = searchValue.replace(/^\s*/, "");

    /* Se prohíben todos los caracteres que no sean letras o espacios */
    searchValue = searchValue.replace(/[^\p{Alpha}\s]/gu, "");

    const finalLength = searchValue.length;

    $search.value = searchValue;

    /* Colocar el cursor justo después de los caracteres válidos introducidos */
    setCursorPosition($search, cursorPosition, rawLength, finalLength);
  }

  /* Método que gestiona el evento "change" del input "search" */

  change($search, searchValue) {
    /* Asegurarse de que no queden espacios a los extremos */
    searchValue = searchValue.trim();

    /* Reemplazar cualquier espacio de más por uno solo */
    searchValue = searchValue.replace(/\s{2,}/g, " ");

    $search.value = searchValue;

    /* Si el último valor registrado es distinto del recién establecido, se lo
       actualiza y se lanza el evento "cards-update" para re-renderizar las "cards" */
    if (searchValue !== this.lastValue) {
      this.lastValue = searchValue;

      const cardsUpdateEvent = new CustomEvent("cards-update");
      document.dispatchEvent(cardsUpdateEvent);
    }
  }

  /* Método para restablecer el valor al valor por defecto
     (search.value = "") */

  defaultValue() {
    this.lastValue = this.$search.value = "";
  }

  /* Método principal de inicio */

  start() {
    const events = [
      { name: "input", attachedIn: document, handlers: [this.handler] },
      { name: "change", attachedIn: document, handlers: [this.handler] },
      {
        name: "default-values",
        attachedIn: document,
        handlers: [this.defaultValue],
      },
    ];

    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }
  }
}
