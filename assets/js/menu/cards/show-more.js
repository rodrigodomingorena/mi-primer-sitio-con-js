/* Establecimiento de la funcionalidad que controla el botón $showMore que
   permite renderizar más "cards" perteneciente a la sección Cards del Menú */

export class ShowMore {
  constructor() {
    this.topLevel = "show-more";
    this.button = this.topLevel + "__button";
    this.$button;

    this.loader = "loader--" + this.topLevel;
    this.$loader = this.buildLoader();

    this.$container = document.querySelector(
      "." + this.topLevel + "__container"
    );

    this.start();
  }

  /* Método principal que gestiona los eventos del botón "$showMore" */

  handler(event) {
    if (event.target !== this.$button) return;

    const method = event.type;

    this[method](event, this.$button);
  }

  /* Método que gestiona el evento "click" del botón "$showMore" */

  click(event, $button) {
    event.preventDefault();

    this.$container.append(this.$loader);

    const url = new URL($button.href);

    /* Se lanza el evento "show-more" */
    const showMoreEvent = new CustomEvent("show-more", {
      bubbles: true,
      detail: { url },
    });
    $button.dispatchEvent(showMoreEvent);

    $button.remove();
  }

  /* Método que gestiona el renderizado del botón "$showMore" */

  manage(nextLink) {
    /* De existir, se remueve el $loader del documento */
    this.$loader.remove();

    /* Si hay un próximo link al que acceder en búsqueda de más platos */
    if (nextLink) {
      let $button;

      if (this.$button) {
        /* Si ya hay un botón construido */
        this.$button.href = nextLink;
        $button = this.$button;
      } else {
        /* Si no, se crea y se registran sus propiedades */
        $button = this.build();
        $button.href = nextLink;
        this.$button = $button;
      }

      /* Se introduce en el documento */
      this.$container.append($button);
    } else {
      /* Si no hay un próximo link */
      this.$button = null;
    }
  }

  /* Método para contruir el botón "$showMore" */

  build() {
    const $button = document.createElement("a");
    $button.classList.add(this.button);
    $button.textContent = "VER MÁS";

    return $button;
  }

  /* Método para construir el "$loader" */

  buildLoader() {
    const $loader = document.createElement("span");
    $loader.classList.add("loader", this.loader);

    return $loader;
  }

  /* Método principal de inicio */

  start() {
    const events = [
      { name: "click", attachedIn: document, handlers: [this.handler] },
    ];
    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }
  }
}
