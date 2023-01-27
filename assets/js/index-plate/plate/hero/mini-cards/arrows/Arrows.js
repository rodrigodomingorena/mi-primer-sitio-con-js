/* Establecimiento de la funcionalidad que controla el componente Arrows
   perteneciente al componente Mini Cards del Hero del documento Plate */

export class Arrows {
  constructor(MINI_CARDS) {
    this.INDEX = MINI_CARDS.INDEX;
    this.PLATE = MINI_CARDS.PLATE;
    this.HERO = MINI_CARDS.HERO;
    this.MINI_CARDS = MINI_CARDS;

    this.arrow = "arrow";
    this.arrowPrev = this.arrow + "--prev";
    this.arrowNext = this.arrow + "--next";
    this.arrowDisabled = this.arrow + "--disabled";

    this.$arrowPrev = document.querySelector("." + this.arrowPrev);
    this.$arrowNext = document.querySelector("." + this.arrowNext);

    this.start();
  }

  /* Método para manejar el evento "click" */

  click(event) {
    const $arrow = event.target.closest("." + this.arrow);

    /* Si no se cliqueó sobre una Arrow o está deshabilitada */
    if (!$arrow || $arrow.classList.contains(this.arrowDisabled)) return;

    // Si se cliquea "arrowNext", el offset es positivo (se debe avanzar)
    // Si se cliquea "arrowPrev", el offset es negativo (se debe retroceder)

    const top =
      $arrow === this.$arrowNext
        ? this.MINI_CARDS.offsetTop
        : -this.MINI_CARDS.offsetTop;

    const left =
      $arrow === this.$arrowNext
        ? this.MINI_CARDS.offsetLeft
        : -this.MINI_CARDS.offsetLeft;

    /* Desplazar el Carrousel */
    this.MINI_CARDS.CARROUSEL.$carrousel.scrollBy({
      top,
      left,
      behavior: "smooth",
    });
  }

  /* Método para deshabilitar una Arrow */

  checkDisabled({ atTheBeginning, atTheEnd }) {
    /* Si estamos al comienzo, deshabilitar (no hay más retroceso) */
    this.$arrowPrev.classList[atTheBeginning ? "add" : "remove"](
      this.arrowDisabled
    );

    /* Si estamos al final, deshabilitar (no hay más avance) */
    this.$arrowNext.classList[atTheEnd ? "add" : "remove"](this.arrowDisabled);
  }

  /* Método principal de inicio */

  start() {
    const events = [
      {
        name: "click",
        attachedIn: document,
        handlers: [this.click],
      },
    ];

    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }
  }
}
