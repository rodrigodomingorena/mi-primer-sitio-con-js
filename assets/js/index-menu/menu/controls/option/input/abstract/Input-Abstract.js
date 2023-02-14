/* Clase abstracta que se extiende sobre la clase del componente Range y la clase InputListAbstract
   para dotarlos de funcionalidad y así poder manejar correctamente los estados de renderizado */

export class InputAbstract {
  constructor(optionType, INPUT) {
    this.INDEX = INPUT.INDEX;
    this.MENU = INPUT.MENU;
    this.CONTROLS = INPUT.CONTROLS;
    this.OPTION = INPUT.OPTION;

    this.selector = `[data-option=${optionType}]`;

    this.$parentOption = this.OPTION.getParentOption(
      document.querySelector(this.selector)
    );

    this.start();
  }

  /* Método para manejar el evento "input" */

  input(event) {
    if (event.target.matches(this.selector)) return { $input: event.target };
  }

  /* Método principal de inicio */

  start() {
    const events = [
      { name: "input", attachedIn: document, handlers: [this.input] },
      {
        name: "update-last-values-confirmed",
        attachedIn: document,
        handlers: [this.updateLastValuesConfirmed],
      },
      {
        name: "reset-last-values-confirmed",
        attachedIn: document,
        handlers: [this.resetLastValuesConfirmed],
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
