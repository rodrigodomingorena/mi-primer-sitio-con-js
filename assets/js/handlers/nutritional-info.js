//  Establecimiento de la funcionalidad de entrada de valores (nutritional-info__main__amount)
//  y cambio de opción (nutritional-info__main__option) para la sección Nutritional Info de Plate.

export class HandlerNutritionalInfo {
  constructor() {
    this.topLevel = "nutritional-info";
    this.main = this.topLevel + "__main";

    this.option = this.main + "__option";
    this.optionSelected = this.option + "--selected";
    this.$optionSelected = document.querySelector("." + this.optionSelected);
    this.optionSelectedValue =
      this.$optionSelected.querySelector("input").value;

    this.amount = this.main + "__amount";
    this.$amount = document.querySelector("." + this.amount);

    this.lastGrams = 300;
    this.lastKilograms = 0.3;
    this.lastPlates = 1;

    this.excessWidth = 2;
    this.separator = "\u202F";
  }

  /* Método principal que gestiona los eventos del input $amount */

  handlerAmount(event) {
    if (!event.target.matches("." + this.amount)) return;

    const $amount = event.target;
    const amountValue = $amount.value;
    const type = event.type;
    const optionSelectedValue = this.optionSelectedValue;
    let prefix = "amount";

    const method = this.parsedName(prefix, type);

    this[method]($amount, amountValue, optionSelectedValue, event);
  }

  /* Método principal que gestiona los eventos de los inputs 'option' */

  handlerOption(event) {
    const $option = event.target.closest("." + this.option);

    if (!$option) return;

    const type = event.type;
    const prefix = "option";

    const method = this.parsedName(prefix, type);

    this[method]($option);
  }

  /* Método de manejo del evento 'input' en $amount con optionSelectedValue = "kilograms" */

  amountKilogramsInput($amount, amountValue) {
    const cursorPosition = $amount.selectionStart;
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
      const decimalSignArr = decimalSigns
        .filter((arr) => arr.index < cursorPosition - (rawLength - finalLength))
        .pop();

      if (decimalSignArr) {
        // Si efectivamente había al menos un signo del lado izquierdo del cursor
        // (Si no, el signo del lado derecho queda como está y no hay que manejar nada)

        const decimalSign = decimalSignArr[0];
        const decimalSignIndex = decimalSignArr.index;

        const rawIntegerPart = amountValue.slice(0, decimalSignIndex);
        const rawFractionalPart = amountValue.slice(decimalSignIndex + 1);
        const rawFractionalLength = rawFractionalPart.length;

        const filteredIntegerPart = rawIntegerPart.replace(/[,.]/g, "");
        const filteredFractionalPart = rawFractionalPart.replace(/[,.]/g, "");

        // Esto sirve para establecer la posición correcta del cursor
        diffFractionalLength =
          filteredFractionalPart.length - rawFractionalLength;

        amountValue =
          filteredIntegerPart + decimalSign + filteredFractionalPart;

        finalLength = amountValue.length;
      }
    }

    $amount.value = amountValue;

    /* Colocar el cursor justo después de los caracteres válidos introducidos */
    this.setCursorPosition(
      $amount,
      cursorPosition,
      rawLength,
      finalLength,
      diffFractionalLength
    );
  }

  /* Método de manejo del evento 'input' en $amount con optionSelectedValue = "plates"/"grams" */

  amountInput($amount, amountValue, optionSelected) {
    /* El manejo del evento en $amount con optionSelectedValue = "kilograms"
       tiene su propio método */
    if (optionSelected === "kilograms") {
      this.amountKilogramsInput($amount, amountValue);
      return;
    }

    const cursorPosition = $amount.selectionStart;
    const rawLength = amountValue.length;

    /* Se prohíben todos los caracteres no numéricos */
    amountValue = amountValue.replace(/\D/g, "");

    /* Se prohíben ceros de más a la izquierda */
    // Expresión regular con lookahead negativo
    amountValue = amountValue.replace(/^0+(?!$)/, "");

    const finalLength = amountValue.length;

    $amount.value = amountValue;

    /* Colocar el cursor justo después de los caracteres válidos introducidos */
    this.setCursorPosition($amount, cursorPosition, rawLength, finalLength);
  }

  /* Método de manejo del evento 'change' en $amount */

  amountChange($amount, amountValue, optionSelected) {
    // Específicos optionSelected = "kilograms" //

    /* Se permite el uso de tres números decimales como máximo */
    const decimalSignIndex = amountValue.search(/[,.]/);

    if (decimalSignIndex != -1) {
      amountValue = amountValue.slice(0, decimalSignIndex + 4);

      /* Se prohíben ceros de más a la derecha en la parte decimal */
      amountValue = amountValue.replace(/0+$/, "");

      /* Se prohíbe terminar con un punto o una coma */
      amountValue = amountValue.replace(/[,.]$/, "");
    }

    // Fin de específicos optionSelected = "kilograms" //

    /* La entrada no debe quedar vacía */
    amountValue = amountValue.length === 0 ? "0" : amountValue;

    /* Guarda el último valor introducido dependiendo de la opción seleccionada por el usuario */
    const lastOptionValue = this.parsedName("last", optionSelected);
    this[lastOptionValue] = amountValue;

    /* Generar una separación visual cada tres cifras */
    amountValue = this.thousandSeparator(amountValue);

    /* Agregar la unidad que representa la opción seleccionada por
       el usuario luego de la cifra introducida */
    amountValue = this.endsWithUnit(amountValue, optionSelected);

    $amount.value = amountValue;

    this.resizeAmount($amount);
  }

  /* Método de manejo del evento 'focus' en $amount */

  amountFocus($amount, amountValue) {
    /* Deben quedar solo los caracteres numéricos y el punto o la coma */
    amountValue = amountValue.replace(/[^\d.,]/g, "");

    $amount.value = amountValue;
  }

  /* Método de manejo del evento 'blur' en $amount */

  amountBlur($amount, amountValue, optionSelected) {
    /* Estas situaciones se pueden dar cuando se hace foco en el input y luego se
       pierde sin realizar ningún cambio ('input', 'change') */

    /* Asegurarse que al perder el foco exista una separación visual cada tres cifras */
    const hasSeparator = /\s/.test(amountValue);

    if (!hasSeparator) {
      amountValue = this.thousandSeparator(amountValue);
    }

    /* Asegurarse que al perder el foco la entrada vuelva a tener la unidad
       que representa la opción seleccionada por el usuario */
    const endsWithNumber = /\d$/.test(amountValue);

    if (endsWithNumber) {
      amountValue = this.endsWithUnit(amountValue, optionSelected);
    }

    $amount.value = amountValue;
  }

  /* Método de manejo del evento 'keydown' en $amount */

  amountKeydown(...args) {
    const event = args.pop();
    const $amount = args.shift();

    if (event.key === "Enter" || event.key === "Escape") {
      $amount.blur();
    }
  }

  /* Método de manejo del evento 'change' en los inputs 'option' */

  optionChange($option) {
    $option.classList.add(this.optionSelected);

    /* Reemplazo del 'option' seleccionado anteriormente por el nuevo */
    this.$optionSelected.classList.remove(this.optionSelected);
    this.$optionSelected = $option;
    this.optionSelectedValue = $option.querySelector("input").value;

    /* Actualización del valor del $amount acorde al nuevo 'option' seleccionado */
    const lastOptionValue = this.parsedName("last", this.optionSelectedValue);
    this.$amount.value = this[lastOptionValue];

    const changeEvent = new Event("change", { bubbles: true });
    this.$amount.dispatchEvent(changeEvent);
  }

  /* Método de manejo del evento 'DOMContentLoaded' */

  documentLoaded() {
    this.resizeAmount(this.$amount);
  }

  /* Método de redimensionamiento */

  resizeAmount($amount) {
    const amountLength = $amount.value.length;
    const charWidth = amountLength + this.excessWidth;

    $amount.style.width = charWidth + "ch";
  }

  /* Método de establecimiento de la posición del cursor */

  setCursorPosition($amount, position, raw, final, diff = 0) {
    $amount.selectionStart = $amount.selectionEnd =
      position - (raw - final + diff);
  }

  /* Método de separación visual cada tres cifras */

  thousandSeparator(value) {
    let reverseValue = value.split("").reverse().join("");

    /* Expresión regular con lookahead negativo y carácter especial de replace() */
    reverseValue = reverseValue.replace(
      /\d{3}(?![,.])(?!$)/g,
      "$&" + this.separator
    );

    value = reverseValue.split("").reverse().join("");

    return value;
  }

  /* Método de adición de la unidad apropiada */

  endsWithUnit(amountValue, optionSelected) {
    let unit;

    switch (optionSelected) {
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

    amountValue = amountValue + this.separator + unit;

    return amountValue;
  }

  /* Método utilitario */

  parsedName(prefix, ...strings) {
    // Ej: "amount", ["kilograms", "input"] --> "amountKilogramsInput"
    // Ej: "option", ["change"] --> "optionChange"

    strings = strings.map((str) =>
      str.replace(/^./, (char) => char.toUpperCase())
    );

    let parsedName = prefix;

    for (const string of strings) {
      parsedName += string;
    }

    return parsedName;
  }

  /* Método principal de inicio */

  start() {
    this.documentLoaded();

    const events = [
      { name: "input", attachedIn: document, handlers: [this.handlerAmount] },
      {
        name: "change",
        attachedIn: document,
        handlers: [this.handlerAmount, this.handlerOption],
      },
      { name: "keydown", attachedIn: document, handlers: [this.handlerAmount] },
      {
        name: "focus",
        attachedIn: this.$amount,
        handlers: [this.handlerAmount],
      },
      {
        name: "blur",
        attachedIn: this.$amount,
        handlers: [this.handlerAmount],
      },
    ];

    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }
  }
}
