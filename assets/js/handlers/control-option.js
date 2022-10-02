//  Establecimiento de la funcionalidad de visualización y ocultamiento de los modales (controls__option__modal)
//  y tarjetas (controls__option__card) pertenecientes a la sección Controls del Menú.

class HandlerControlOption {
  constructor() {
    this.$currentModal = null;
    this.topLevel = "controls__option";
    this.modal = this.topLevel + "__modal";
    this.showButton = this.topLevel + "__show-button";
    this.cancelButton = this.topLevel + "__cancel-button";
    this.eventTriggers = [this.showButton, this.cancelButton, this.modal];
  }

  /* Método principal */

  click(event) {
    const $target = event.target;

    const trigger = this.eventTriggers.find((trigger) =>
      $target.matches("." + trigger)
    );

    if (trigger) {
      // Si el evento lo desencadenó algún 'trigger' registrado
      const method = this.parsedMethodName(trigger);

      this[method]($target);
    } else {
      if (!this.$currentModal) return;

      if ($target.closest("." + this.topLevel)) return;

      // En caso de que se haga "click" en cualquier parte fuera de una tarjeta visible.
      this.closeModal(this.$currentModal);
    }
  }

  /* Método de visualización */

  showModal($modal, $button, current = false) {
    // Terminando de visualizar u ocultar
    if ($modal.animationRun || $modal.transitionRun) return;

    $button.classList.add(this.showButton + "--active");

    // Si hay un modal actual (current = true), se actualiza en closeModal()
    if (!current) this.$currentModal = $modal;

    // Se visualiza con un desvanecimiento mediante animación CSS
    $modal.classList.add(this.modal + "--show");
    $modal.animationRun = true;
    $modal.addEventListener(
      "animationend",
      () => ($modal.animationRun = false),
      {
        once: true,
      }
    );

    // Si el '$modal' tiene "position: fixed", se prohibe el desplazamiento
    if (getComputedStyle($modal).position === "fixed") {
      document.documentElement.style.overflowY = "hidden";
    }
  }

  /* Método de ocultamiento */

  closeModal($modal, $newCurrent = null) {
    // Terminando de visualizar u ocultar
    if ($modal.animationRun || $modal.transitionRun) return false;

    const $showButton = $modal.previousElementSibling;
    $showButton.classList.remove(this.showButton + "--active");

    // Se retoma el desplazamiento (en caso de haber sido prohibido)
    document.documentElement.style.overflowY = "";

    // Se oculta a la vista con un desvanecimiento
    $modal.style.opacity = 0;
    $modal.transitionRun = true;
    $modal.addEventListener(
      "transitionend",
      () => {
        // Se hace efectivo el ocultamiento real
        $modal.classList.remove(this.modal + "--show");
        $modal.style.opacity = 1;
        $modal.transitionRun = false;
        this.$currentModal = $newCurrent;
      },
      { once: true }
    );

    return true;
  }

  /* Handler de "controls__option__show-button" */

  showButtonClick($showButton) {
    const $modal = $showButton.nextElementSibling;

    if (this.$currentModal === $modal) {
      // Si el modal actual está vinculado al '$showButton' hay que cerrarlo

      this.closeModal($modal);
    } else if (this.$currentModal) {
      // Si el modal actual no está vinculado al '$showButton' hay que cerrarlo y abrir el nuevo

      const successfulClose = this.closeModal(this.$currentModal, $modal);
      if (successfulClose) this.showModal($modal, $showButton, true);
    } else {
      // Si aún no hay un modal actual

      this.showModal($modal, $showButton);
    }
  }

  /* Handler de "controls__option__cancel-button" */

  cancelButtonClick($cancelButton) {
    const $modal = $cancelButton.closest("." + this.modal);

    this.closeModal($modal);
  }

  /* Handler de "controls__option__modal" */

  modalClick($modal) {
    this.closeModal($modal);
  }

  /* Handler para el evento "resize" */

  updateFixedScroll() {
    if (!this.$currentModal) return;

    const position = getComputedStyle(this.$currentModal).position;

    // Si el modal actual tiene "position: fixed", se prohibe el desplazamiento
    document.documentElement.style.overflowY =
      position === "fixed" ? "hidden" : "";
  }

  /* Método utilitario */

  parsedMethodName(trigger) {
    // Ej: "controls__option__show-button" --> "showButtonClick"
    // Ej: "algun__otro__nombre-en-particular" --> "nombreEnParticularClick"

    const rawMethodName = trigger.split("__").pop();
    const regex = /-(.)/g;

    const parsedMethodName = rawMethodName.replace(regex, (str, letter) =>
      letter.toUpperCase()
    );

    return parsedMethodName + "Click";
  }
}

export const handlerControlOption = new HandlerControlOption();
