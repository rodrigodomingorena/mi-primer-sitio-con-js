/* Establecimiento de la funcionalidad que controla todo lo relacionado a la carga de datos
   necesarios para el renderizado de los componentes pertenecientes al documento Plate */

import { Plate } from "./plate/Plate.js";

export class Index {
  constructor() {
    this.$title = document.querySelector("title");
    this.$main = document.querySelector("main");
    this.$body = document.body;

    this.utilityClasses = {
      error: "error",
      placeholder: "placeholder",
    };

    this.id = null;
    this.defaultId = "1";
    this.controller = null;
    this.separator = "\u202F";

    this.PLATE = new Plate(this);

    this.start();
  }

  /* Método para iniciar la carga de datos */

  load(params) {
    params = params ?? this.getId();

    this.id = params.id;
    this.controller = params.controller = new AbortController();

    this.PLATE.load(params);
    this.PLATE.HERO.MINI_CARDS.load(params);
  }

  /* Método para manejar el evento "plate-reload" */

  reload() {
    this.load();
  }

  /* Método para manejar el evento "hashchange" */

  hashchange() {
    const { id, changeHash } = this.getId();

    /* Si el "id" es nulo o el documento ya está renderizando un plato con ese "id" */
    if (!id || this.$body.id.endsWith(`-${id}`)) return;

    /* Evento "default-values" */

    // Para restablecer los componentes del documento a sus valores por defecto esperando una nueva carga

    const defaultValuesEvent = new CustomEvent("default-values");
    document.dispatchEvent(defaultValuesEvent);

    /* Iniciar una nueva carga de datos */
    this.load({ id, changeHash });
  }

  /* Método para manejar el evento "default-values" */

  defaultValues() {
    /* Abortamos cualquier carga que se esté llevando a cabo */
    this.controller?.abort();

    this.$title.innerHTML = "Cargando... | Sauce";
    this.$main.classList.remove(this.utilityClasses.error);
    this.$main.scrollIntoView();
  }

  /* Método para cambiar el "hash" de la URL */

  changeHash(changeHash = true, id) {
    /* Si hay que actualizar el "hash" */
    if (changeHash) location.hash = id;
  }

  /* Método para obtener el "id" proveniente del "hash" de la URL */

  getId() {
    const hash = location.hash.replace("#", "");

    /* Si es un número */
    if (this.isNum(hash)) {
      /* Si ese número es el que provocó el estado de error actual o no */

      return this.PLATE.ERROR.id === hash
        ? { id: null }
        : { id: hash, changeHash: false };
    }

    /* Si comienza con "start-plate" */
    if (hash.startsWith(this.PLATE.LINKS.defaultId)) {
      /* Obtenemos el valor siguiente a "start-plate-" */
      const lastChars = hash.slice(this.PLATE.LINKS.defaultId.length + 1);

      /* Si es un número */
      if (this.isNum(lastChars)) {
        /* Si ese número es el que provocó el estado de error actual o no */

        return this.PLATE.ERROR.id === lastChars
          ? { id: null }
          : { id: lastChars, changeHash: false };
      }

      /* Si no hay ningún valor después de "start-plate" */
      if (lastChars.length === 0) {
        /* Si hay un error activo o no */

        return this.PLATE.ERROR.id !== null
          ? { id: null }
          : { id: this.defaultId };
      }

      /* Si hay un valor después de "start-plate-" y no es un número */

      // Si ese valor es el que provocó el estado de error actual o no
      return this.PLATE.ERROR.id === decodeURIComponent(lastChars)
        ? { id: null }
        : { id: lastChars, changeHash: false };
    }

    /* Si no hay ningun "hash" */
    if (hash.length === 0) return { id: this.defaultId };

    /* Si hay un "hash" y no es un número ni comienza con "start-plate" */

    // Si ese "hash" es el que provocó el estado de error actual o no
    return this.PLATE.ERROR.id === decodeURIComponent(hash)
      ? { id: null }
      : { id: hash };

    /* 
      ¿Por qué se devuelve "{ id: null }" cuando el valor es el que provocó el estado de error actual?
  
      Porque de esa forma el documento ya está renderizando el estado de error ocasionado
      por ese valor y el código que llama a "getId()" sabrá que no tiene que recargar nada.
    */
  }

  /* Método para comprobar si un "string" está conformado por números */

  isNum(str) {
    return /^\d+$/g.test(str);
  }

  /* Método principal de inicio */

  start() {
    this.load();

    const events = [
      {
        name: "hashchange",
        attachedIn: window,
        handlers: [this.hashchange],
      },
      {
        name: "plate-reload",
        attachedIn: document,
        handlers: [this.reload],
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
