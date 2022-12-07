//  Clase que escucha el evento 'scroll' y controla la fijación del
//  'header' en la parte superior de la ventana.

export class Header {
  constructor() {
    this.header = "header";
    this.headerFixed = this.header + "--fixed";

    this.$header = document.querySelector("." + this.header);

    this.start();
  }

  /* Método que comprueba el desplazamiento de la página y controla la fijación del 'header' */

  fixed() {
    const height = this.$header.offsetHeight;

    if (pageYOffset > height) this.$header.classList.add(this.headerFixed);
    if (!pageYOffset) this.$header.classList.remove(this.headerFixed);
  }

  /* Método principal de inicio */

  start() {
    this.fixed();

    const events = [
      { name: "scroll", attachedIn: window, handlers: [this.fixed] },
    ];

    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }
  }
}
