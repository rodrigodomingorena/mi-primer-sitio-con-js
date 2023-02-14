/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Search perteneciente al componente Controls del documento Menu */

export class Search {
  constructor(CONTROLS) {
    this.INDEX = CONTROLS.INDEX;
    this.MENU = CONTROLS.MENU;
    this.CONTROLS = CONTROLS;

    this.search = this.CONTROLS.controls + "__search";
    this.inputSearch = this.search + "__input";

    this.$inputSearch = document.querySelector("." + this.inputSearch);

    this.lastValue = this.defaultValue = "";
    this.params = this.CONTROLS.getParams(this.$inputSearch);

    this.start();
  }

  /* Método para manejar el evento "input" */

  input(event) {
    if (event.target !== this.$inputSearch) return;

    let inputValue = this.$inputSearch.value;

    const cursorPosition = this.$inputSearch.selectionStart;
    const rawLength = inputValue.length;

    /* Se prohíbe comenzar con espacios */
    inputValue = inputValue.replace(/^\s*/, "");

    /* Se prohíben todos los caracteres que no sean letras o espacios */
    inputValue = inputValue.replace(/[^\p{Alpha}\s]/gu, "");

    const finalLength = inputValue.length;

    this.$inputSearch.value = inputValue;

    /* Colocar el cursor justo después de los caracteres válidos introducidos */
    this.setCursorPosition(cursorPosition, rawLength, finalLength);
  }

  /* Método para manejar el evento "change" */

  change(event) {
    if (event.target !== this.$inputSearch) return;

    let inputValue = this.$inputSearch.value;

    /* Asegurarse de que no queden espacios a los extremos */
    inputValue = inputValue.trim();

    /* Reemplazar cualquier espacio de más por uno solo */
    inputValue = inputValue.replace(/\s{2,}/g, " ");

    this.$inputSearch.value = inputValue;

    /* Si el último valor de búsqueda almacenado es distinto del recién introducido,
       se lo actualiza y se fuerza un re-renderizado de las las Cards con el nuevo
       valor de búsqueda */

    if (inputValue !== this.lastValue) {
      this.lastValue = inputValue;

      this.setParams();
      this.MENU.sendCardsUpdateEvent();
    }
  }

  /* Método para manejar el evento "default-values" */

  defaultValues() {
    this.lastValue = this.$inputSearch.value = this.defaultValue;
    this.setParams();
  }

  /* Método para establecer los parámetros de búsqueda que se enviarán a la API */

  setParams() {
    this.CONTROLS.setParams(this.params, this.lastValue);
  }

  /* Método para restablecer la posición correcta del cursor */

  setCursorPosition(position, raw, final, diff = 0) {
    this.$inputSearch.selectionStart = this.$inputSearch.selectionEnd =
      position - (raw - final + diff);
  }

  /* Método principal de inicio */

  start() {
    this.setParams();

    const events = [
      { name: "input", attachedIn: document, handlers: [this.input] },
      { name: "change", attachedIn: document, handlers: [this.change] },
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
