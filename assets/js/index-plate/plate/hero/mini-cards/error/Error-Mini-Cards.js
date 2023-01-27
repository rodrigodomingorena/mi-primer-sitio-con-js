/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Mini Cards perteneciente al componente Hero en su estado de Error */

export class ErrorMiniCards {
  constructor(MINI_CARDS) {
    this.INDEX = MINI_CARDS.INDEX;
    this.PLATE = MINI_CARDS.PLATE;
    this.HERO = MINI_CARDS.HERO;
    this.MINI_CARDS = MINI_CARDS;

    this.error =
      this.MINI_CARDS.miniCards + "__" + this.INDEX.utilityClasses.error;
    this.reload = this.MINI_CARDS.miniCards + "__reload";

    this.$template = document.querySelector("." + this.error + "__template");

    this.start();
  }

  /* Método para manejar el evento "click" */

  click(event) {
    if (!event.target.matches("." + this.reload)) return;

    this.reloadMiniCards();
  }

  /* Método para manejar el evento "keydown" */

  keydown(event) {
    if (!event.target.matches("." + this.reload)) return;

    /* Solo nos interesa manejar cuando el usuario presiona la tecla "Enter" */

    if (event.key === "Enter") this.reloadMiniCards();
  }

  /* Método para construir la notificación del estado de Error */

  build() {
    const $template = this.$template.content.cloneNode(true);

    this.MINI_CARDS.CARROUSEL.$carrousel.append($template);
    this.MINI_CARDS.CARROUSEL.ERROR.build();
  }

  /* Método para desencadenar una nueva carga de datos */

  reloadMiniCards() {
    [
      this.MINI_CARDS,
      this.MINI_CARDS.CARROUSEL,
      this.MINI_CARDS.CARROUSEL.ERROR,
    ].forEach((COMPONENT) => COMPONENT.defaultValues());

    this.MINI_CARDS.load();
  }

  /* Método principal de inicio */

  start() {
    const events = [
      {
        name: "click",
        attachedIn: document,
        handlers: [this.click],
      },
      { name: "keydown", attachedIn: document, handlers: [this.keydown] },
    ];

    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }
  }
}
