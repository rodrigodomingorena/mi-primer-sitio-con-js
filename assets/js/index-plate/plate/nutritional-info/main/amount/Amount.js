/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Amount perteneciente al componente Main del Nutritional Info del documento Plate */

export class Amount {
  constructor(MAIN) {
    this.INDEX = MAIN.INDEX;
    this.PLATE = MAIN.PLATE;
    this.NUTRITIONAL_INFO = MAIN.NUTRITIONAL_INFO;
    this.MAIN = MAIN;

    this.amount = this.MAIN.main + "__amount";
    this.$amount = document.querySelector("." + this.amount);

    this.utilityClasses = { calculating: "calculating" };

    this.excessWidth = 2;

    this.start();
  }

  /* Método para manejar el evento "input" */

  input(event) {
    if (event.target !== this.$amount) return;

    let amountValue = this.$amount.value;

    /* El manejo del evento con MAIN.OPTIONS.selectedValue = "kilograms" tiene su propio método */
    if (this.MAIN.OPTIONS.selectedValue === "kilograms")
      return this.inputKilograms(amountValue);

    const cursorPosition = this.$amount.selectionStart;
    const rawLength = amountValue.length;

    /* Se prohíben todos los caracteres no numéricos */
    amountValue = amountValue.replace(/\D/g, "");

    /* Se prohíben ceros de más a la izquierda */
    // Expresión regular con lookahead negativo
    amountValue = amountValue.replace(/^0+(?!$)/, "");

    const finalLength = amountValue.length;

    this.$amount.value = amountValue;

    /* Colocar el cursor justo después de los caracteres válidos introducidos */
    this.setCursorPosition(cursorPosition, rawLength, finalLength);
  }

  /* Método para manejar el evento "input" con MAIN.OPTIONS.selectedValue = "kilograms" */

  inputKilograms(amountValue) {
    const cursorPosition = this.$amount.selectionStart;
    const rawLength = amountValue.length;

    /* Se prohíbe comenzar con cualquier carácter no numérico */
    amountValue = amountValue.replace(/^\D*/, "");

    /* Se prohíben todos los caracteres no numéricos excepto el punto o la coma */
    amountValue = amountValue.replace(/[^\d.,]/g, "");

    /* Se prohíben ceros de más a la izquierda */
    // Expresión regular con lookahead negativo
    amountValue = amountValue.replace(/^0+(?![,.])(?!$)/, "");

    let finalLength = amountValue.length;

    /* Se permite el uso de un solo punto o una sola coma, con la posibilidad
       de actualizar su ubicación a lo largo de la entrada */
    let diffFractionalLength = 0;
    const decimalSigns = Array.from(amountValue.matchAll(/[.,]/g));

    if (decimalSigns.length > 0) {
      // Si efectivamente había al menos un punto o una coma

      // El signo que se mantendrá será el más cercano a la posición del cursor del lado izquierdo
      const decimalSignClosestArr = decimalSigns
        .filter((arr) => arr.index < cursorPosition - (rawLength - finalLength))
        .pop();

      if (decimalSignClosestArr) {
        // Si efectivamente había al menos un signo del lado izquierdo del cursor
        // (Si no, el signo del lado derecho queda como está y no hay que manejar nada)

        const decimalSign = decimalSignClosestArr[0];
        const decimalSignIndex = decimalSignClosestArr.index;

        const rawIntegerPart = amountValue.slice(0, decimalSignIndex);
        const rawFractionalPart = amountValue.slice(decimalSignIndex + 1);
        const rawFractionalLength = rawFractionalPart.length;

        const filteredIntegerPart = rawIntegerPart.replace(/[,.]/g, "");
        const filteredFractionalPart = rawFractionalPart.replace(/[,.]/g, "");

        // Esto sirve para restablecer la posición correcta del cursor
        diffFractionalLength =
          filteredFractionalPart.length - rawFractionalLength;

        amountValue =
          filteredIntegerPart + decimalSign + filteredFractionalPart;

        finalLength = amountValue.length;
      }
    }

    this.$amount.value = amountValue;

    /* Colocar el cursor justo después de los caracteres válidos introducidos */
    this.setCursorPosition(
      cursorPosition,
      rawLength,
      finalLength,
      diffFractionalLength
    );
  }

  /* Método para manejar el evento "change" */

  change(event) {
    if (event.target !== this.$amount) return;

    let amountValue = this.$amount.value;

    // Específicos de MAIN.OPTIONS.selectedValue = "kilograms" //

    /* Se permite el uso de tres números decimales como máximo */
    const decimalSignIndex = amountValue.search(/[,.]/);

    if (decimalSignIndex != -1) {
      amountValue = amountValue.slice(0, decimalSignIndex + 4);

      /* Se prohíben ceros de más a la derecha en la parte decimal */
      amountValue = amountValue.replace(/0+$/, "");

      /* Se prohíbe terminar con un punto o una coma */
      amountValue = amountValue.replace(/[,.]$/, "");
    }

    // Fin de específicos MAIN.OPTIONS.selectedValue = "kilograms" //

    /* La entrada no debe quedar vacía */
    amountValue = amountValue.length === 0 ? "0" : amountValue;

    /* Actualizamos el último valor de peso introducido según la opción
       actualmente seleccionada por el usuario */
    this.MAIN.OPTIONS.updateLastOptionSelectedValue(amountValue);

    /* Generar una separación visual cada tres cifras */
    amountValue = this.NUTRITIONAL_INFO.thousandSeparator(amountValue);

    /* Agregar la unidad que representa la opción seleccionada por
       el usuario luego de la cifra introducida */
    amountValue = this.endsWithUnit(amountValue);

    this.$amount.value = amountValue;

    this.resize();
    this.NUTRITIONAL_INFO.sendUpdateEvent();
  }

  /* Método para manejar el evento "focus" */

  focus(event) {
    if (event.target !== this.$amount) return;

    let amountValue = this.$amount.value;

    /* Deben quedar solo los caracteres numéricos y el punto o la coma */
    amountValue = amountValue.replace(/[^\d.,]/g, "");

    this.$amount.value = amountValue;

    this.NUTRITIONAL_INFO.$nutritionalInfo.classList.add(
      this.utilityClasses.calculating
    );
  }

  /* Método para manejar el evento "blur" */

  blur(event) {
    if (event.target !== this.$amount) return;

    /* Estas situaciones se pueden dar cuando se hace foco y luego se
       pierde sin realizar ningún cambio ('input', 'change') */

    let amountValue = this.$amount.value;

    /* Asegurarse que al perder el foco exista una separación visual cada tres cifras */
    const hasSeparator = /\s/.test(amountValue);

    if (!hasSeparator)
      amountValue = this.NUTRITIONAL_INFO.thousandSeparator(amountValue);

    /* Asegurarse que al perder el foco la entrada vuelva a tener la unidad
       que representa la opción seleccionada por el usuario */
    const endsWithNumber = /\d$/.test(amountValue);

    if (endsWithNumber) amountValue = this.endsWithUnit(amountValue);

    this.$amount.value = amountValue;

    this.NUTRITIONAL_INFO.$nutritionalInfo.classList.remove(
      this.utilityClasses.calculating
    );
  }

  /* Método para manejar el evento "keydown" */

  keydown(event) {
    if (event.target !== this.$amount) return;

    if (event.key === "Enter" || event.key === "Escape") this.$amount.blur();
  }

  /* Método para llenar el Amount */

  fill() {
    /* Recuperamos la opción actualmente seleccionada por el usuario */
    const optionSelectedValue = this.MAIN.OPTIONS.selectedValue;

    /* Construimos la clave para recuperar el último valor de peso
       introducido según la opción actualmente seleccionada por el usuario */

    const lastOptionSelectedValue = this.NUTRITIONAL_INFO.parsedName(
      "last",
      optionSelectedValue
    );

    /* Recuperamos el último valor de peso introducido según la opción
       actualmente seleccionada por el usuario y lo asignamos al valor del Amount */

    this.$amount.value = this.MAIN.OPTIONS[lastOptionSelectedValue];

    const changeEvent = new Event("change", { bubbles: true });
    this.$amount.dispatchEvent(changeEvent);
  }

  /* Método para redimensionar el Amount */

  resize() {
    const amountLength = this.$amount.value.length;
    const charWidth = amountLength + this.excessWidth;

    this.$amount.style.width = charWidth + "ch";
  }

  /* Método para restablecer la posición correcta del cursor */

  setCursorPosition(position, raw, final, diff = 0) {
    this.$amount.selectionStart = this.$amount.selectionEnd =
      position - (raw - final + diff);
  }

  /* Método para agregar la unidad apropiada */

  endsWithUnit(amountValue) {
    let unit;

    switch (this.MAIN.OPTIONS.selectedValue) {
      case "grams":
        unit = "g";
        break;

      case "kilograms":
        unit = "kg";
        break;

      case "plates":
        unit = amountValue === "1" ? "plato" : "platos";
        break;
    }

    return amountValue + this.INDEX.separator + unit;
  }

  /* Método principal de inicio */

  start() {
    const events = [
      { name: "input", attachedIn: document, handlers: [this.input] },
      {
        name: "change",
        attachedIn: document,
        handlers: [this.change],
      },
      {
        name: "focus",
        attachedIn: this.$amount,
        handlers: [this.focus],
      },
      {
        name: "blur",
        attachedIn: this.$amount,
        handlers: [this.blur],
      },
      { name: "keydown", attachedIn: document, handlers: [this.keydown] },
    ];

    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }

    /* Se debe ejecutar en una próxima macrotarea para que estén inicializadas
       las funcionalidades y propiedades de los demás componentes */
    setTimeout(this.fill.bind(this));
  }
}
