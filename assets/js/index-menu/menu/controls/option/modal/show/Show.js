/* Establecimiento de la funcionalidad que controla el estado de visualización del componente
   Modal perteneciente al componente Option del Controls del documento Menu */

export class Show {
  constructor(MODAL) {
    this.INDEX = MODAL.INDEX;
    this.MENU = MODAL.MENU;
    this.CONTROLS = MODAL.CONTROLS;
    this.OPTION = MODAL.OPTION;
    this.MODAL = MODAL;

    this.topLevel = this.OPTION.option + "__show";
    this.active = this.topLevel + "--" + this.OPTION.utilityClasses.active;
  }

  /* Método para manejar el evento "click" */

  click($show) {
    const $modal = this.MODAL.get($show);
    this.whatToDo($modal, $show);
  }

  /* Método para manejar el evento "keydown" */

  keydown($show, event) {
    if (event.key === "Enter") {
      const $modal = this.MODAL.get($show);
      this.whatToDo($modal, $show);
    }
  }

  /* Método para ejecutar una acción dependiendo de ciertas condiciones */

  whatToDo($modal, $show) {
    if (this.MODAL.$current === $modal) {
      /* Si el Modal actual visualizándose está vinculado al botón Show, hay que ocultarlo */

      this.MODAL.HIDE.manage({ $show });
    } else if (this.MODAL.$current) {
      /* Si el Modal actual visualizándose no está vinculado al botón Show, hay que ocultarlo
         y visualizar el Modal vinculado al botón Show */

      const successfulHide = this.MODAL.HIDE.manage({ $newCurrent: $modal });
      if (successfulHide) this.manage($modal, $show);
    } else {
      /* Si no hay ningún Modal actual visualizándose, hay que visualizar el Modal vinculado al botón Show */
      this.manage($modal, $show);
    }
  }

  /* Método para gestionar la visualización de un Modal */

  manage($modal, $show) {
    if (!this.toReady($modal, $show)) return false;

    this.show($modal);

    this.MODAL.forbidScrollIfNecessary($modal);
  }

  /* Método para preparar un Modal para su visualización */

  toReady($modal, $show) {
    /* Si aún se está terminando de visualizar u ocultar 
       (Se cancela la gestión de su visualización) */
    if (this.MODAL.inTransition($modal)) return false;

    this.activated($show);

    /* Si no hay un Modal actual visualizándose, actualizamos su valor a este nuevo $modal.
       Si hay uno, su valor se actualizará cuando termine de ocultarse en Hide */
    if (this.MODAL.$current === null) this.MODAL.$current = $modal;

    return true;
  }

  /* Método para visualizar un Modal */

  show($modal) {
    /* Se visualiza con un desvanecimiento mediante animación CSS */
    $modal.classList.add(this.MODAL.show);
    $modal.animationShowRun = true;

    $modal.addEventListener(
      "animationend",
      () => ($modal.animationShowRun = false),
      {
        once: true,
      }
    );
  }

  /* Método para obtener un botón Show a partir de un Modal */

  get($modal) {
    return $modal.previousElementSibling;
  }

  /* Método para activar un botón Show */

  activated($show) {
    $show.classList.add(this.active);
  }

  /* Método para desactivar un botón Show */

  disabled($show) {
    $show.classList.remove(this.active);
  }
}
