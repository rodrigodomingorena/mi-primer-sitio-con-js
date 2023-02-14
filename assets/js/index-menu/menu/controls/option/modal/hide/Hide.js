/* Establecimiento de la funcionalidad que controla el estado de ocultamiento del componente
   Modal perteneciente al componente Option del Controls del documento Menu */

export class Hide {
  constructor(MODAL) {
    this.INDEX = MODAL.INDEX;
    this.MENU = MODAL.MENU;
    this.CONTROLS = MODAL.CONTROLS;
    this.OPTION = MODAL.OPTION;
    this.MODAL = MODAL;

    this.topLevel = this.OPTION.option + "__hide";
  }

  /* Método para manejar el evento "click" */

  click() {
    this.manage();
  }

  /* Método para gestionar el ocultamiento de un Modal */

  manage({
    $modal = this.MODAL.$current,
    $show = this.MODAL.SHOW.get($modal),
    $newCurrent = null,
  } = {}) {
    if (!this.toReady($modal, $show)) return false;

    this.hide($modal, $newCurrent);

    this.sendResetEvent($modal);

    return true;
  }

  /* Método para preparar un Modal para su ocultamiento */

  toReady($modal, $show) {
    /* Si aún se está terminando de visualizar u ocultar 
       (Se cancela la gestión de su ocultamiento) */
    if (this.MODAL.inTransition($modal)) return false;

    this.MODAL.SHOW.disabled($show);

    this.MODAL.allowScroll();

    return true;
  }

  /* Método para ocultar un Modal */

  hide($modal, $newCurrent) {
    /* Se oculta con un desvanecimiento mediante transición CSS */
    $modal.style.opacity = 0;
    $modal.transitionHideRun = true;

    $modal.addEventListener(
      "transitionend",
      () => {
        // Se hace efectivo el ocultamiento real
        $modal.classList.remove(this.MODAL.show);
        $modal.style.opacity = 1;
        $modal.transitionHideRun = false;
        this.MODAL.$current = $newCurrent;
      },
      { once: true }
    );
  }

  /* Método para lanzar el evento "reset-last-values-confirmed" */

  sendResetEvent($modal) {
    // Para que cada Input de la Option a la que pertenece el Modal,
    // restablezca sus valores a los presentes en la última confirmación.

    const $option = this.OPTION.getParentOption($modal);

    const resetLastValuesConfirmedEvent = new CustomEvent(
      "reset-last-values-confirmed",
      {
        bubbles: true,
      }
    );

    $option.dispatchEvent(resetLastValuesConfirmedEvent);
  }
}
