/* Establecimiento de la funcionalidad que controla todo lo relacionado a la carga de datos
   y posterior renderizado del plato/error perteneciente al documento Plate */

import { API_URL_PLATES } from "../../helpers/api.js";
import { fetchResource } from "../../helpers/fetch.js";

import { Links } from "./links/Links.js";
import { Hero } from "./hero/Hero.js";
import { NutritionalInfo } from "./nutritional-info/Nutritional-Info.js";
import { ErrorPlate } from "./error/Error-Plate.js";

export class Plate {
  constructor(INDEX) {
    this.INDEX = INDEX;

    this.utilityClasses = {
      loading: "loading-plate",
    };

    this.LINKS = new Links(this);
    this.HERO = new Hero(this);
    this.NUTRITIONAL_INFO = new NutritionalInfo(this);
    this.ERROR = new ErrorPlate(this);

    this.start();
  }

  /* Método para cargar el plato */

  async load({ id, changeHash, controller }) {
    /* Configuración de la URL */
    const url = new URL(API_URL_PLATES + "/" + id);
    url.searchParams.set("_embed", "nutritionalInfo"); // Cargar con la información nutricional asociada

    try {
      const { json: plate } = await fetchResource(url, {
        signal: controller.signal,
      });

      this.successfulLoading(plate, changeHash);
    } catch (error) {
      /* Si se abortó la carga no hay que manejar nada */
      if (controller.signal.aborted) return;

      error.id = id;
      this.unsuccessfulLoading(error, controller);
    }
  }

  /* Método para una carga exitosa del plato */

  successfulLoading(plate, changeHash) {
    this.INDEX.$title.innerHTML = `${plate.name} | Sauce`;
    this.INDEX.$main.classList.remove(this.utilityClasses.loading);

    /* Evento "plate-update" */

    // Para actualizar los componentes del documento con los datos del nuevo plato

    const plateUpdateEvent = new CustomEvent("plate-update", {
      detail: plate,
    });
    document.dispatchEvent(plateUpdateEvent);

    /* Modificar el "hash" de la URL de ser necesario */
    this.INDEX.changeHash(changeHash, plate.id);
  }

  /* Método para una carga fallida del plato */

  unsuccessfulLoading(error, controller) {
    /* Abortar el controlador asociado. Si se hace a tiempo, cancela la carga
       de las Mini Cards del Hero que se está llevando a cabo en paralelo */
    controller.abort();

    this.INDEX.$title.innerHTML = "Sauce";
    this.INDEX.$main.classList.add(this.INDEX.utilityClasses.error);
    this.INDEX.$main.classList.remove(this.utilityClasses.loading);

    /* Evento "plate-error" */

    // Para actualizar los componentes del documento en base al nuevo error

    const plateErrorEvent = new CustomEvent("plate-error", {
      detail: error,
    });
    document.dispatchEvent(plateErrorEvent);
  }

  /* Método para manejar el evento "default-values" */

  defaultValues() {
    this.INDEX.$main.classList.add(this.utilityClasses.loading);
  }

  /* Método principal de inicio */

  start() {
    const events = [
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
