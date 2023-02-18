/* Dado que en esta versión desarrollada con Vanilla JavaScript no se implementó la funcionalidad
   del carrito de compras, al presionar su enlace se le mostrará al usuario un aviso notificándole
   la situación para poder así mejorar su experiencia y darle una estimación de cuándo va a poder
   estar construido (en la próxima versión con una librería o "framework") */

export class ModalNotification {
  constructor() {
    this.$modal = this.getModal();

    this.start();
  }

  /* Método para manejar el evento "click" */

  click(event) {
    const $cartLink = event.target.closest("[data-link='cart']");

    if ($cartLink) this.show();
  }

  /* Método para mostrar el Modal */

  show() {
    document.body.append(this.$modal);
    document.documentElement.style.overflowY = "hidden";

    this.hide();
  }

  /* Método para ocultar el Modal */

  hide() {
    setTimeout(() => {
      /* Se oculta con un desvanecimiento mediante transición CSS */
      this.$modal.style.opacity = 0;
      document.documentElement.style.overflowY = "";

      this.$modal.addEventListener(
        "transitionend",
        () => {
          // Se hace efectivo el ocultamiento real
          this.$modal.remove();
          this.$modal.style.opacity = 1;
        },
        { once: true }
      );
    }, 10000);
  }

  /* Método para obtener el Modal */

  getModal() {
    const $modal = document.createElement("div");
    $modal.classList.add("modal-notification");

    $modal.innerHTML = `
      <div class="modal-notification__message">
        En la próxima versión del sitio, desarrollada con una librería o con un
        <i lang="en">framework</i> (¿quizás con <i lang="en">React</i>? ¿o con
        <i lang="en">Vue</i>? ¿<i lang="en">Angular</i>?...), se implementará la
        funcionalidad del carrito de compras. ¡Gracias por comprender!
      </div>
    `;

    return $modal;
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
