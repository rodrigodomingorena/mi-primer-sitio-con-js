/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Mini Cards perteneciente al componente Hero del documento Plate */

import { API_URL_PLATES } from "../../../../helpers/api.js";
import { fetchResource } from "../../../../helpers/fetch.js";

import { Cards } from "./cards/Cards.js";
import { Carrousel } from "./carrousel/Carrousel.js";
import { Arrows } from "./arrows/Arrows.js";
import { ErrorMiniCards } from "./error/Error-Mini-Cards.js";

export class MiniCards {
  constructor(HERO) {
    this.INDEX = HERO.INDEX;
    this.PLATE = HERO.PLATE;
    this.HERO = HERO;

    this.miniCards = "mini-cards";

    this.utilityClasses = {
      loading: "loading-cards",
    };

    this.limitPerPage = 4;
    this.controller = null;
    this.nextController = null;
    this.nextLink = null;
    this.loadingNext = false;

    this.offsetLeft = 200; // Card width (160) + Carrousel gap (40)
    this.offsetTop = 220; // Card height (180) + Carrousel gap (40)

    this.CARDS = new Cards(this);
    this.CARROUSEL = new Carrousel(this);
    this.ARROWS = new Arrows(this);
    this.ERROR = new ErrorMiniCards(this);

    this.start();
  }

  /* Método para cargar los datos de los platos */

  async load(
    { id, controller } = {
      id: this.INDEX.id,
      controller: new AbortController(),
    }
  ) {
    this.controller = controller;

    /* Configuración de la URL */
    const url = new URL(API_URL_PLATES);
    url.searchParams.set("_page", 1);
    url.searchParams.set("_limit", this.limitPerPage);
    url.searchParams.set("id_ne", id); // Excluir el plato principal

    try {
      const params = await fetchResource(url, { signal: controller.signal });
      this.successfulLoading(params);
    } catch (error) {
      /* Si se abortó la carga no hay que manejar nada */
      if (controller.signal.aborted) return;

      this.unsuccessfulLoading();
    }
  }

  /* Método para cargar los datos de los platos basado en el "nextLink" */

  async loadNext() {
    this.loadingNext = true;
    this.nextController = new AbortController();

    const url = new URL(this.nextLink);

    try {
      const params = await fetchResource(url, {
        signal: this.nextController.signal,
      });

      this.loadingNext = false;
      this.successfulLoading(params);
    } catch (error) {
      /* Si se abortó la carga no hay que manejar nada */
      if (this.nextController.signal.aborted) return;

      /* Se vuelve a intentar una recarga pasados 5 segundos */
      setTimeout(this.loadNext.bind(this), 5000);
    }
  }

  /* Método para cargar más datos al desplazarse hasta el final del Carrousel */

  async nextScroll({ atTheEnd, scrollLeft, scrollTop }) {
    /* Si ya no hay un enlace por el cual acceder a más platos
       o actualmente se están cargando */
    if (!this.nextLink || this.loadingNext) return;

    /* Si nos desplazamos hasta el final */
    if (atTheEnd) {
      await this.loadNext();

      this.CARROUSEL.$carrousel.scrollLeft = scrollLeft;
      this.CARROUSEL.$carrousel.scrollTop = scrollTop;
    }
  }

  /* Método para una carga exitosa de los datos de los platos */

  successfulLoading({ response, json: plates }) {
    this.INDEX.$main.classList.remove(this.utilityClasses.loading);

    this.CARDS.build(plates);
    this.setNextLink(response);
    this.ARROWS.checkDisabled(this.CARROUSEL.positions());
  }

  /* Método para una carga fallida de los datos de los platos */

  unsuccessfulLoading() {
    this.INDEX.$main.classList.remove(this.utilityClasses.loading);
    this.ERROR.build();
  }

  /* Método para manejar el evento "default-values" y "plate-error" */

  defaultValues(event) {
    /* Si el restablecimiento a los valores por defecto proviene desde la recarga
       de un estado de error, no manejamos nada. Ya están establecidos por defecto */
    if (event?.detail === "from-error") return;

    /* Abortamos cualquier carga que se esté llevando a cabo */
    this.controller?.abort();
    this.nextController?.abort();
    this.nextLink = null;

    this.INDEX.$main.classList.add(this.utilityClasses.loading);
    this.ARROWS.checkDisabled(this.CARROUSEL.positions());
  }

  /* Método para manejar el evento "plate-error" */

  plateError() {
    this.defaultValues();
  }

  /* Método para establecer el "nextLink" */

  setNextLink(response) {
    this.nextLink = this.getNextLink(response);

    /* Si ya no hay un enlace por el cual acceder a más platos */
    if (!this.nextLink) this.CARDS.$placeholder.remove();
  }

  /* Método para obtener el "nextLink" */

  getNextLink(response) {
    /* La API entrega un "Header" llamado "Link" donde se encuentran
       los enlaces a <first>, <prev>, <next> y <last>.
       Se necesita <next> para obtener el enlace a la siguiente tanda de platos */

    const headerLink = response.headers.get("Link");

    /* Si no había ningun link <next> */
    if (!headerLink?.includes('rel="next"')) return null;

    const links = Array.from(headerLink.matchAll(/<(.*?)>/g));

    /* De haberlo, siempre estará en la anteúltima posición */
    const nextLink = links[links.length - 2][1];

    return nextLink;
  }

  /* Método principal de inicio */

  start() {
    const events = [
      {
        name: "plate-error",
        attachedIn: document,
        handlers: [this.plateError],
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
