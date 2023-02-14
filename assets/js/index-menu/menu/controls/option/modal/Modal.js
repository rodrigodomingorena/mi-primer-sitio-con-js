/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Modal perteneciente al componente Option del Controls del documento Menu */

import { Show } from "./show/Show.js";
import { Hide } from "./hide/Hide.js";

export class Modal {
  constructor(OPTION) {
    this.INDEX = OPTION.INDEX;
    this.MENU = OPTION.MENU;
    this.CONTROLS = OPTION.CONTROLS;
    this.OPTION = OPTION;

    this.topLevel = this.OPTION.option + "__modal";

    this.utilityClasses = {
      show: "show",
    };

    this.show = this.topLevel + "--" + this.utilityClasses.show;

    this.$current = null;

    this.SHOW = new Show(this);
    this.HIDE = new Hide(this);

    this.targets = {
      MODAL: this,
      SHOW: this.SHOW,
      HIDE: this.HIDE,
    };

    this.start();
  }

  /* Método general para delegar los eventos "click" y "keydown" */

  handler(event) {
    const alreadyHandled = this.escape(event);

    /* Si ya fue manejado por el método "escape" no hay más nada que hacer */
    if (alreadyHandled) return;

    const $target = event.target;
    const type = event.type;

    const activatedTarget = Object.values(this.targets).find((TARGET) =>
      $target.matches("." + TARGET.topLevel)
    );

    if (activatedTarget) {
      /* Si el evento fue desencadenado por un "target" que nos interesa manejar */

      // Ej: SHOW[click]($target, event)

      activatedTarget[type]?.($target, event);
    } else if (!this.$current || $target.closest("." + this.topLevel)) {
      /* Si no existe un Modal actual visualizándose o el evento se dio dentro del
         componente Modal (el usuario está interactuando con su contenido) */

      return;
    } else {
      /* Si el evento se dio en cualquier parte fuera del componente Modal */

      this.HIDE.manage();
    }
  }

  /* Método para manejar el evento "click" */

  click() {
    this.HIDE.manage();
  }

  /* Método para manejar el evento "resize" */

  resize() {
    if (this.$current) this.forbidScrollIfNecessary();
  }

  /* Método para cerrar un Modal al apretar la tecla "Escape" */

  escape(event) {
    if (this.$current && event.type === "keydown" && event.key === "Escape") {
      this.HIDE.manage();
      return true;
    }
    return false;
  }

  /* Método para obtener un Modal a partir de un botón Show */

  get($show) {
    return $show.nextElementSibling;
  }

  /* Método para prohibir el desplazamiento en caso de un Modal fijo */

  forbidScrollIfNecessary($modal = this.$current) {
    const position = getComputedStyle($modal).position;
    this.INDEX.$html.style.overflowY = position === "fixed" ? "hidden" : "";
  }

  /* Método para permitir el desplazamiento */

  allowScroll() {
    this.INDEX.$html.style.overflowY = "";
  }

  /* Método para comprobar el estado de transición de un Modal */

  inTransition($modal) {
    return $modal.animationShowRun || $modal.transitionHideRun;
  }

  /* Método principal de inicio */

  start() {
    const events = [
      { name: "click", attachedIn: document, handlers: [this.handler] },
      {
        name: "keydown",
        attachedIn: document,
        handlers: [this.handler],
      },
      {
        name: "resize",
        attachedIn: window,
        handlers: [this.resize],
      },
    ];

    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }
  }
}
