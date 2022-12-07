/* Establecimiento de la funcionalidad de visualización y ocultamiento de los modales
   y tarjetas pertenecientes a la sección Controls del Menú. */

import { parsedName } from "../../helpers/parsed-name.js";

export class Modal {
  constructor() {
    this.topLevel = "controls__option";
    this.modal = this.topLevel + "__modal";
    this.show = this.topLevel + "__show";
    this.cancel = this.topLevel + "__cancel";

    this.$currentModal = null;

    this.eventTriggers = [this.show, this.cancel, this.modal];

    this.start();
  }

  /* Método principal que gestiona los eventos de los modales y tarjetas */

  handler(event) {
    const $target = event.target;
    const type = event.type;

    const eventTrigger = this.eventTriggers.find((eventTrigger) =>
      $target.matches("." + eventTrigger)
    );

    /* Si el evento lo desencadenó algún "trigger" registrado */
    if (eventTrigger) {
      const method = this.parsedMethodName(eventTrigger, type);

      this[method]?.($target, event);
    } else {
      if (!this.$currentModal) return;

      if ($target.closest("." + this.topLevel)) return;

      /* Si el evento se da (por ej. "click") en cualquier parte fuera de una tarjeta visible */
      this.closeModal(this.$currentModal);
    }
  }

  /* Método general de manejo de eventos en el botón "$show" */

  showHandler($show) {
    const $modal = $show.nextElementSibling;

    if (this.$currentModal === $modal) {
      // Si el modal actual está vinculado al botón '$show' hay que cerrarlo

      this.closeModal($modal);
    } else if (this.$currentModal) {
      // Si el modal actual no está vinculado al botón '$show' hay que cerrarlo y abrir el nuevo

      const successfulClose = this.closeModal(this.$currentModal, $modal);
      if (successfulClose) this.showModal($modal, $show, true);
    } else {
      // Si aún no hay un modal actual

      this.showModal($modal, $show);
    }
  }

  /* Método de manejo del evento "click" en el botón "$show" */

  showClick($show) {
    this.showHandler($show);
  }

  /* Método de manejo del evento "keydown" en el botón "$show" */

  showKeydown($show, event) {
    if (event.key === "Enter") {
      this.showHandler($show);
    }
  }

  /* Método de manejo del evento "click" en el botón "$cancel" */

  cancelClick($cancel) {
    const $modal = $cancel.closest("." + this.modal);

    this.closeModal($modal);
  }

  /* Método de manejo del evento "click" en "$modal" */

  modalClick($modal) {
    this.closeModal($modal);
  }

  /* Método de manejo del evento "resize" en el objeto "window" */

  updateFixedScroll() {
    if (!this.$currentModal) return;

    const position = getComputedStyle(this.$currentModal).position;

    /* Si el modal actual tiene "position: fixed", se prohibe el desplazamiento */
    document.documentElement.style.overflowY =
      position === "fixed" ? "hidden" : "";
  }

  /* Método de manejo del evento "keydown" con key = "Escape" en todo el documento */

  escapeKeydown(event) {
    if (!this.$currentModal) return;

    if (event.key === "Escape") {
      this.closeModal(this.$currentModal);
    }
  }

  /* Método de visualización del "$modal" */

  showModal($modal, $show, currentModal = false) {
    /* Terminando de visualizar u ocultar */
    if ($modal.animationRun || $modal.transitionRun) return;

    $show.classList.add(this.show + "--active");

    /* Si hay un modal actual (currentModal = true), se actualizará su valor en closeModal() */
    if (!currentModal) this.$currentModal = $modal;

    /* Se visualiza con un desvanecimiento mediante animación CSS */
    $modal.classList.add(this.modal + "--show");
    $modal.animationRun = true;
    $modal.addEventListener(
      "animationend",
      () => ($modal.animationRun = false),
      {
        once: true,
      }
    );

    /* Si el '$modal' tiene "position: fixed", se prohibe el desplazamiento */
    if (getComputedStyle($modal).position === "fixed") {
      document.documentElement.style.overflowY = "hidden";
    }
  }

  /* Método de ocultamiento del "$modal" */

  closeModal($modal, $newCurrentModal = null) {
    /* Terminando de visualizar u ocultar */
    if ($modal.animationRun || $modal.transitionRun) return false;

    const $show = $modal.previousElementSibling;
    $show.classList.remove(this.show + "--active");

    /* Se retoma el desplazamiento (en caso de haber sido prohibido) */
    document.documentElement.style.overflowY = "";

    /* Se oculta a la vista con un desvanecimiento */
    $modal.style.opacity = 0;
    $modal.transitionRun = true;
    $modal.addEventListener(
      "transitionend",
      () => {
        // Se hace efectivo el ocultamiento real
        $modal.classList.remove(this.modal + "--show");
        $modal.style.opacity = 1;
        $modal.transitionRun = false;
        this.$currentModal = $newCurrentModal;
      },
      { once: true }
    );

    /* Evento "reset-last-values" */

    // Para que cada $input de la $option a la que pertenece el $modal,
    // restablezca sus últimos valores a los presentes en la última confirmación.

    const $option = $modal.closest("." + this.topLevel);

    const resetLastValuesEvent = new CustomEvent("reset-last-values", {
      bubbles: true,
    });

    $option.dispatchEvent(resetLastValuesEvent);

    return true;
  }

  /* Método utilitario */

  parsedMethodName(eventTrigger, ...strings) {
    // Ej: "controls__option__show", ["click"] --> "showClick"
    // Ej: "algun__otro__nombre-en-particular", ["keydown"] --> "nombreEnParticularKeydown"

    const rawPrefix = eventTrigger.split("__").pop();
    const regex = /-(.)/g;

    const parsedPrefix = rawPrefix.replace(regex, (str, letter) =>
      letter.toUpperCase()
    );

    const parsedMethodName = parsedName(parsedPrefix, ...strings);

    return parsedMethodName;
  }

  /* Método principal de inicio */

  start() {
    const events = [
      { name: "click", attachedIn: document, handlers: [this.handler] },
      {
        name: "keydown",
        attachedIn: document,
        handlers: [this.handler, this.escapeKeydown],
      },
      {
        name: "resize",
        attachedIn: window,
        handlers: [this.updateFixedScroll],
      },
    ];

    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }
  }
}
