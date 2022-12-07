/* Establecimiento de la funcionalidad que controla todo lo relacionado al renderizado
   de las "cards" pertenecientes a la sección Cards del Menú */

import { API_URL_PLATES } from "../../helpers/api.js";
import { fetchResource } from "../../helpers/fetch.js";

import { Controls } from "../controls/Controls.js";
import { ShowMore } from "./show-more.js";

export class Card {
  constructor() {
    this.CONTROLS = new Controls();
    this.SHOW_MORE = new ShowMore();

    this.$search = this.CONTROLS.SEARCH.$search;
    this.$fromRange = this.CONTROLS.OPTIONS.RANGE.$fromRange;
    this.$toRange = this.CONTROLS.OPTIONS.RANGE.$toRange;

    this.topLevel = "card";

    this.card = this.topLevel + "__plate";
    this.source = this.card + "__source";
    this.image = this.card + "__image";
    this.title = this.card + "__title";
    this.price = this.card + "__price";

    this.error = "error";
    this.cardError = this.topLevel + "__" + this.error;
    this.titleError = this.cardError + "__title";
    this.reloadError = this.cardError + "__reload";
    this.notFound = "not-found";
    this.http = "http";
    this.connection = "connection";

    this.limitPerPage = 6;
    
    this.loader = "loader--" + this.topLevel;
    this.$loader = document.querySelector("." + this.loader);

    this.container = this.topLevel + "__container";
    this.$container = document.querySelector("." + this.container);

    this.$cardTemplate = document.querySelector(
      "." + this.topLevel + "__template"
    );
    this.$cardErrorTemplate = document.querySelector(
      "." + this.cardError + "__template"
    );

    this.start();
  }

  /* Método para cargar por primera vez las "cards" */

  load() {
    const url = new URL(API_URL_PLATES);

    url.searchParams.set("_page", 1);
    url.searchParams.set("_limit", this.limitPerPage);

    this.build(url);
  }

  /* Método para actualizar las "cards" luego de algún cambio de parámetro de búsqueda/filtro/ordenamiento */

  update() {
    this.$container.classList.remove(`${this.container}--${this.error}`);
    this.$container.innerHTML = "";
    this.$container.append(this.$loader);

    this.SHOW_MORE.$button?.remove();
    this.SHOW_MORE.$button = null;

    this.load();
  }

  /* Método para manejar el evento "show-more" al presionar el botón "$showMore" */

  showMore(showMoreEvent) {
    this.build(showMoreEvent.detail.url, true);
  }

  /* Método para manejar el evento "click" al presionar el botón "$reloadError" */

  reload(event) {
    if (!event.target.matches("." + this.reloadError)) return;

    /* En caso de que la recarga se deba a un recurso no encontrado */
    if (event.target.classList.contains(this.notFound)) {
      /* Evento "default-values" */

      // Para restablecer los valores de todas las entradas involucradas en los
      // parámetros de búsqueda usados a los valores por defecto.

      const defaultValuesEvent = new CustomEvent("default-values");
      document.dispatchEvent(defaultValuesEvent);
    }

    /* Evento "cards-update" */

    // Para re-renderizar las "cards".

    const cardsUpdateEvent = new CustomEvent("cards-update");
    document.dispatchEvent(cardsUpdateEvent);
  }

  /* Método para construir e insertar en el documento las "cards" */

  async build(url, isNextLink = false) {
    /* Obtención de los datos de los platos y del link <next> */
    let plates, nextLink;

    try {
      ({ plates, nextLink } = await this.getPlates(url, isNextLink));
    } catch (error) {
      return this.buildError(error.name);
    } finally {
      /* De estar presente, se remueve el $loader */
      this.$loader.remove();

      /* Manejo del botón "$showMore" */
      this.SHOW_MORE.manage(nextLink);
    }

    /* Construcción e inserción al documento de una "card" por cada plato */
    for (const plate of plates) {
      const $card = this.$cardTemplate.content.cloneNode(true);

      const $source = $card.querySelector("." + this.source);
      const $image = $card.querySelector("." + this.image);
      const $title = $card.querySelector("." + this.title);
      const $price = $card.querySelector("." + this.price);

      const imageSrc = `../assets/media/menu/card-plate-image-${plate.imageId}`;

      $source.srcset = imageSrc + ".webp";
      $image.src = imageSrc + ".png";
      $image.alt = `Plato de ${plate.name}`;
      $title.innerHTML = plate.name;
      $price.innerHTML = `$&#8239;${plate.price}`;

      this.$container.append($card);
    }
  }

  /* Método para construir el aviso de error */

  buildError(errorName) {
    const $cardError = this.$cardErrorTemplate.content.cloneNode(true);
    const $titleError = $cardError.querySelector("." + this.titleError);
    const $reloadError = $cardError.querySelector("." + this.reloadError);

    /* Se muestra un mensaje al usuario dependiendo del tipo de error que haya ocurrido */
    switch (errorName) {
      case "NotFoundError":
        $titleError.textContent = `No se ha encontrado ningún plato relacionado a los
                                   parámetros de búsqueda introducidos. Por favor, iniciá
                                   una nueva búsqueda o tocá el botón de recarga para ver
                                   los platos por defecto.`;

        $reloadError.classList.add(this.notFound);
        break;

      case "HttpError":
        $titleError.textContent = `Ha ocurrido un error de comunicación con el servidor. Por
                                   favor, tocá el botón de recarga para volver a solicitar la
                                   búsqueda que necesitás.`;

        $reloadError.classList.add(this.http);
        break;

      case "ConnectionError":
        $titleError.textContent = `Al parecer hay un error de conexión. Por favor, verificá que
                                   el dispositivo esté conectado a la red. Si ya lo está, tocá el
                                   botón de recarga para volver a solicitar la búsqueda que necesitás.
                                   De lo contrario, asegurate de poder restablecerla antes de iniciar
                                   la recarga.`;

        $reloadError.classList.add(this.connection);
        break;

      default:
        $titleError.textContent = `Se ha producido un error. Por favor, tocá el botón de
                                   recarga para volver a solicitar la búsqueda que necesitás.`;
        break;
    }

    this.$container.classList.add(`${this.container}--${this.error}`);
    this.$container.innerHTML = "";
    this.$container.append($cardError);
    this.$container.scrollIntoView(false);
  }

  /* Método para solicitar a la API los datos de los platos */

  async getPlates(url, isNextLink) {
    /* Si no es un link <next> alojado en el botón "$showMore" */
    if (!isNextLink) {
      const { search, from, to, filter, sort, order } = this.getParams();

      url.searchParams.set("q", search); // Búsqueda general
      url.searchParams.set("price_gte", from); // Precio desde..
      url.searchParams.set("price_lte", to); // Precio hasta...
      url.searchParams.set("categories_like", filter); // Filtro por categorías
      url.searchParams.set("_sort", sort); // Orden basado en...
      url.searchParams.set("_order", order); // Dirección del orden
    }

    const { response, json: plates } = await fetchResource(url);

    /* Obtención del link <next> para "VER MÁS" */
    const nextLink = this.getNextLink(response);

    return { plates, nextLink };
  }

  /* Método para obtener los parámetros necesarios al realizar una solicitud */

  getParams() {
    const filterRegexValue = this.getFilters().join("|");
    const [sort, order] = this.getSort();

    const params = {
      search: this.$search.value,
      from: this.$fromRange.value,
      to: this.$toRange.value,
      filter: filterRegexValue,
      sort,
      order,
    };

    return params;
  }

  /* Método para obtener los nombres de los $filter que estén chequeados por el usuario */

  getFilters() {
    const filtersChecked = document.querySelectorAll(
      this.CONTROLS.OPTIONS.FILTER.checked
    );

    const filterNamesChecked = Array.from(
      filtersChecked,
      (filterChecked) => filterChecked.name
    );

    return filterNamesChecked;
  }

  /* Método para obtener los parámetros de ordenamiento */

  getSort() {
    const sortChecked = document.querySelector(
      this.CONTROLS.OPTIONS.SORT.checked
    );

    const sortValueChecked = sortChecked.value;

    let sort, order;

    /* Parámetro "sort" */
    switch (sortValueChecked) {
      // Basado en los precios
      case "minor-to-mayor":
      case "mayor-to-minor":
        sort = "price,name";
        break;

      // Basado en los nombres
      case "a-to-z":
      case "z-to-a":
        sort = "name,price";
        break;

      // Por defecto desde la API
      default:
        sort = "";
        break;
    }

    /* Parámetro "order" */
    switch (sortValueChecked) {
      // Ordenamiento ascendente
      case "minor-to-mayor":
      case "a-to-z":
        order = "asc,asc";
        break;

      // Ordenamiento descendiente
      case "mayor-to-minor":
      case "z-to-a":
        order = "desc,asc";
        break;

      // Por defecto desde la API
      default:
        order = "";
        break;
    }

    return [sort, order];
  }

  /* Método para obtener el link <next> luego de una solicitud */

  getNextLink(response) {
    /* La API entrega un 'Header' llamado 'Link' donde se encuentran
       los enlaces a <first>, <prev>, <next> y <last>.
       Se necesita <next> para obtener el enlace a la siguiente página de platos */

    const linkHeader = response.headers.get("Link");

    /* Si no había ningun link <next> */
    if (!linkHeader?.includes('rel="next"')) return null;

    const links = Array.from(linkHeader.matchAll(/<(.*?)>/g));

    /* De haberlo, siempre estará en la anteúltima posición */
    const nextLink = links[links.length - 2][1];

    return nextLink;
  }

  /* Método principal de inicio */

  start() {
    const events = [
      {
        name: "built-range",
        attachedIn: document,
        handlers: [this.load],
      },
      {
        name: "show-more",
        attachedIn: document,
        handlers: [this.showMore],
      },
      {
        name: "cards-update",
        attachedIn: document,
        handlers: [this.update],
      },
      {
        name: "click",
        attachedIn: document,
        handlers: [this.reload],
      },
    ];

    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }
  }
}
