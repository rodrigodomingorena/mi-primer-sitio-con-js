/* Establecimiento de la funcionalidad que controla el renderizado del componente
   ShowMore perteneciente al componente Cards del documento Menu */

export class ShowMore {
  constructor(CARDS) {
    this.INDEX = CARDS.INDEX;
    this.MENU = CARDS.MENU;
    this.CARDS = CARDS;

    this.showMore = "show-more";
    this.container = this.showMore + "__container";
    this.button = this.showMore + "__button";
    this.loader = this.CARDS.utilityClasses.loader + "--" + this.showMore;

    this.$container = document.querySelector("." + this.container);
    this.$button = this.getButton();
    this.$loader = this.getLoader();

    this.start();
  }

  /* Método para manejar el evento "click" */

  click(event) {
    if (event.target !== this.$button) return;

    event.preventDefault();

    this.$button.remove();
    this.$container.append(this.$loader);

    this.CARDS.load(new URL(this.$button.href));
  }

  /* Método para gestionar el estado del botón ShowMore */

  manage({ response } = {}) {
    this.$loader.remove();

    if (response) {
      this.manageResponse(response);
    } else {
      this.withoutResponse();
    }
  }

  /* Método para gestionar la respuesta de la API */

  manageResponse(response) {
    const nextLink = this.getNextLink(response);

    if (nextLink) {
      this.setNextLink(nextLink);
      this.appendButton();
    } else {
      this.withoutNextLink();
    }
  }

  /* Método para manejar una respuesta de la API vacía */

  withoutResponse() {
    this.withoutNextLink();
  }

  /* Método para manejar cuando no hay un "nextLink" */

  withoutNextLink() {
    this.$button.removeAttribute("href");
  }

  /* Método para insertar al documento el botón ShowMore */

  appendButton() {
    this.$container.append(this.$button);
  }

  /* Método para establecer el "nextLink" */

  setNextLink(nextLink) {
    this.$button.href = nextLink;
  }

  /* Método para obtener el "nextLink" */

  getNextLink(response) {
    /* La API entrega un "Header" llamado "Link" donde se encuentran
       los enlaces a <first>, <prev>, <next> y <last>.
       Se necesita <next> para obtener el enlace a la siguiente tanda de platos */

    const headerLink = response.headers.get("Link");

    /* Si no había ningún link <next> */
    if (!headerLink?.includes('rel="next"')) return null;

    const links = Array.from(headerLink.matchAll(/<(.*?)>/g));

    /* De haberlo, siempre estará en la anteúltima posición */
    const nextLink = links[links.length - 2][1];

    return nextLink;
  }

  /* Método para obtener un botón ShowMore */

  getButton() {
    const $button = document.createElement("a");
    $button.classList.add(this.button);
    $button.innerHTML = "VER MÁS";

    return $button;
  }

  /* Método para obtener un indicador de carga */

  getLoader() {
    const $loader = document.createElement("span");
    $loader.classList.add(this.CARDS.utilityClasses.loader, this.loader);

    return $loader;
  }

  /* Método principal de inicio */

  start() {
    const events = [
      { name: "click", attachedIn: document, handlers: [this.click] },
    ];

    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }
  }
}
