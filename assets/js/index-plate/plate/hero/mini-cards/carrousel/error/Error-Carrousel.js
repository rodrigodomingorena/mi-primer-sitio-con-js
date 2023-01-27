/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Carrousel perteneciente al componente Mini Cards en su estado de Error */

export class ErrorCarrousel {
  constructor(CARROUSEL) {
    this.INDEX = CARROUSEL.INDEX;
    this.PLATE = CARROUSEL.PLATE;
    this.HERO = CARROUSEL.HERO;
    this.MINI_CARDS = CARROUSEL.MINI_CARDS;
    this.CARROUSEL = CARROUSEL;

    this.error =
      this.CARROUSEL.carrousel + "--" + this.INDEX.utilityClasses.error;

    this.start();
  }

  /* Método para manejar el evento "default-values" y "plate-error" */

  defaultValues(event) {
    /* Si el restablecimiento a los valores por defecto proviene desde la recarga
       de un estado de error, no manejamos nada. Ya están establecidos por defecto */
    if (event?.detail === "from-error") return;

    this.CARROUSEL.$carrousel.classList.remove(this.error);
  }

  /* Método para manejar el evento "plate-error" */

  plateError() {
    this.defaultValues();
  }

  /* Método para construir la notificación del estado de Error */

  build() {
    this.CARROUSEL.$carrousel.classList.add(this.error);
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
