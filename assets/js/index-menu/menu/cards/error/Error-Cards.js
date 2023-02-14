/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Cards perteneciente al documento Menu en su estado de Error */

export class ErrorCards {
  constructor(CARDS) {
    this.INDEX = CARDS.INDEX;
    this.MENU = CARDS.MENU;
    this.CARDS = CARDS;

    this.error = this.CARDS.cards + "__" + this.INDEX.utilityClasses.error;
    this.container =
      this.CARDS.container + "--" + this.INDEX.utilityClasses.error;
    this.title = this.error + "__title";
    this.reload = this.error + "__reload";

    this.$template = document.querySelector("." + this.error + "__template");

    this.types = {
      notFound: "not-found",
      http: "http",
      connection: "connection",
    };

    this.start();
  }

  /* Método para manejar el evento "click" */

  click(event) {
    if (!event.target.matches("." + this.reload)) return;

    this.reloadCards(event.target);
  }

  /* Método para manejar el evento "keydown" */

  keydown(event) {
    if (!event.target.matches("." + this.reload)) return;

    /* Solo nos interesa manejar cuando el usuario presiona la tecla "Enter" */

    if (event.key === "Enter") this.reloadCards(event.target);
  }

  /* Método para desencadenar una nueva carga de datos */

  reloadCards($reload) {
    /* En caso de que la recarga se deba a un recurso no encontrado */
    if ($reload.classList.contains(this.types.notFound)) {
      /* Evento "default-values" */

      // Para restablecer los valores de todas las entradas involucradas en los
      // parámetros de búsqueda a los valores por defecto.

      const defaultValuesEvent = new CustomEvent("default-values");
      document.dispatchEvent(defaultValuesEvent);
    }

    this.MENU.sendCardsUpdateEvent();
  }

  /* Método para construir la notificación del estado de Error */

  build(error) {
    const $template = this.$template.content.cloneNode(true);
    const $title = $template.querySelector("." + this.title);
    const $reload = $template.querySelector("." + this.reload);

    /* Se muestra un mensaje al usuario dependiendo del tipo de error que haya ocurrido */
    switch (error.name) {
      case "HttpError":
        $title.innerHTML = `Ha ocurrido un error de comunicación con el servidor. Por
                            favor, tocá el botón de recarga para volver a solicitar la
                            búsqueda que necesitás.`;

        $reload.classList.add(this.types.http);
        break;

      case "NotFoundError":
        $title.innerHTML = `No se ha encontrado ningún plato relacionado a los
                            parámetros de búsqueda introducidos. Por favor, iniciá
                            una nueva búsqueda o tocá el botón de recarga para ver
                            los platos por defecto.`;

        $reload.classList.add(this.types.notFound);
        break;

      case "ConnectionError":
        $title.innerHTML = `Al parecer hay un error de conexión. Por favor, verificá que
                            el dispositivo esté conectado a la red. Si ya lo está, tocá el
                            botón de recarga para volver a solicitar la búsqueda que necesitás.
                            De lo contrario, asegurate de poder restablecerla antes de iniciar
                            la recarga.`;

        $reload.classList.add(this.types.connection);
        break;

      default:
        $title.innerHTML = `Se ha producido un error. Por favor, tocá el botón de
                            recarga para volver a solicitar la búsqueda que necesitás.`;
        break;
    }

    this.CARDS.$container.append($template);
    this.CARDS.$container.scrollIntoView(false);
  }

  /* Método principal de inicio */

  start() {
    const events = [
      {
        name: "click",
        attachedIn: document,
        handlers: [this.click],
      },
      {
        name: "keydown",
        attachedIn: document,
        handlers: [this.keydown],
      },
    ];

    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }
  }
}
