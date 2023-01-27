/* Establecimiento de la funcionalidad que controla el renderizado del
   componente Error perteneciente al documento Plate */

export class ErrorPlate {
  constructor(PLATE) {
    this.INDEX = PLATE.INDEX;
    this.PLATE = PLATE;

    this.error = "error-plate";

    this.container = this.error + "__container";
    this.title = this.error + "__title";
    this.reload = this.error + "__reload";

    this.$container = document.querySelector("." + this.container);
    this.$title = document.querySelector("." + this.title);
    this.$reload = document.querySelector("." + this.reload);

    this.id = null;

    this.types = {
      notFound: "not-found",
      http: "http",
      connection: "connection",
    };

    this.start();
  }

  /* Método para manejar el evento "plate-error" */

  plateError({ detail: error }) {
    this.build(error);
  }

  /* Método para manejar el evento "click" */

  click(event) {
    if (event.target !== this.$reload) return;

    this.reloadPlate();
  }

  /* Método para manejar el evento "keydown" */

  keydown(event) {
    if (event.target !== this.$reload) return;

    /* Solo nos interesa manejar cuando el usuario presiona la tecla "Enter" */

    if (event.key === "Enter") this.reloadPlate();
  }

  /* Método para manejar el evento "default-values" */

  defaultValues() {
    this.id = null;
  }

  /* Método para construir el Error */

  build(error) {
    this.id = decodeURIComponent(error.id);

    /* Se muestra un mensaje al usuario dependiendo del tipo de error que haya ocurrido */
    switch (error.name) {
      case "HttpError":
        this.$title.innerHTML = `Ha ocurrido un error de comunicación con el servidor. Por favor,
                                 tocá el botón de recarga para volver a solicitar el plato que necesitás.`;

        this.$reload.classList.add(this.types.http);
        break;

      case "NotFoundError":
        this.$title.innerHTML = `No se ha encontrado ningún plato relacionado al identificador «${this.id}»
                                 proporcionado en la URL. Por favor, tocá el botón de recarga para redirigirte
                                 hacia otro plato disponible en nuestro menú.`;

        this.$reload.classList.add(this.types.notFound);
        break;

      case "ConnectionError":
        this.$title.innerHTML = `Al parecer hay un error de conexión. Por favor, verificá que
                                 el dispositivo esté conectado a la red. Si ya lo está, tocá el
                                 botón de recarga para volver a solicitar el plato que necesitás.
                                 De lo contrario, asegurate de poder restablecerla antes de iniciar
                                 la recarga.`;

        this.$reload.classList.add(this.types.connection);
        break;

      default:
        this.$title.innerHTML = `Se ha producido un error. Por favor, tocá el botón de
                                 recarga para volver a solicitar el plato que necesitás.`;
        break;
    }

    this.$container.scrollIntoView();
  }

  /* Método para desencadenar una nueva carga de datos */

  reloadPlate() {
    /* Si el error que desea recargar el usuario se debió a un "Not Found" */
    if (this.$reload.classList.contains(this.types.notFound)) {
      /* Cambiamos el "hash" de la URL para desencadenar la carga de un plato que sí se encontrará */

      location.hash = this.INDEX.defaultId;
    } else {
      /* Evento "default-values" */

      // Para restablecer los componentes del documento a sus valores por defecto esperando una nueva carga

      const defaultValuesEvent = new CustomEvent("default-values", {
        detail: "from-error",
      });
      document.dispatchEvent(defaultValuesEvent);

      /* Evento "plate-reload" */

      // Para desencadenar una nueva carga con el mismo "hash" esperando que la conexión sea exitosa

      const plateReloadEvent = new CustomEvent("plate-reload");
      document.dispatchEvent(plateReloadEvent);
    }

    this.$reload.classList.remove(...Object.values(this.types));
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
        name: "click",
        attachedIn: document,
        handlers: [this.click],
      },
      { name: "keydown", attachedIn: document, handlers: [this.keydown] },
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
