/* Establecimiento de la funcionalidad que controla la carga de datos y renderizado
   del componente Cards perteneciente al documento Menu */

import { API_URL_PLATES } from "../../../helpers/api.js";
import { fetchResource } from "../../../helpers/fetch.js";

import { Card } from "./card/Card.js";
import { ShowMore } from "./show-more/Show-More.js";
import { ErrorCards } from "./error/Error-Cards.js";

export class Cards {
  constructor(MENU) {
    this.INDEX = MENU.INDEX;
    this.MENU = MENU;

    this.utilityClasses = {
      loader: "loader",
    };

    this.cards = "cards";
    this.container = this.cards + "__container";
    this.loader = this.utilityClasses.loader + "--" + this.cards;

    this.$container = document.querySelector("." + this.container);
    this.$loader = document.querySelector("." + this.loader);

    this.limitPerPage = 6;

    this.CARD = new Card(this);
    this.SHOW_MORE = new ShowMore(this);
    this.ERROR = new ErrorCards(this);

    this.start();
  }

  /* Método para cargar los datos de los platos */

  async load(url = this.getURL()) {
    let params;

    try {
      params = await fetchResource(url);
      this.successfulLoading(params);
    } catch (error) {
      this.unsuccessfulLoading(error);
    } finally {
      this.$loader.remove();
      this.SHOW_MORE.manage(params);
    }
  }

  /* Método para manejar el evento "cards-update" */

  update() {
    this.$container.classList.remove(this.ERROR.container);
    this.$container.innerHTML = "";
    this.$container.append(this.$loader);

    this.SHOW_MORE.$button.remove();

    this.load();
  }

  /* Método para una carga exitosa de los datos de los platos */

  successfulLoading({ json: plates }) {
    this.CARD.build(plates);
  }

  /* Método para una carga fallida de los datos de los platos */

  unsuccessfulLoading(error) {
    this.$container.classList.add(this.ERROR.container);
    this.$container.innerHTML = "";

    this.ERROR.build(error);
  }

  /* Método para obtener una URL */

  getURL() {
    const url = new URL(API_URL_PLATES);
    url.searchParams.set("_page", 1);
    url.searchParams.set("_limit", this.limitPerPage);

    this.MENU.CONTROLS.setURLParams(url);

    return url;
  }

  /* Método principal de inicio */

  start() {
    const events = [
      {
        name: "cards-update",
        attachedIn: document,
        handlers: [this.update],
      },
    ];

    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }
  }
}
