//  Establecimiento de forma dinámica de los estilos de la barra de progreso
//  del doble 'input' de tipo 'range' presente en la sección Controls del Menú.
//  Basado en el siguiente artículo:
//    https://medium.com/@predragdavidovic10/native-dual-range-slider-html-css-javascript-91e778134816

/* Utilidad para leer los valores de los rangos */

function getParsed(currentFrom, currentTo) {
  const from = parseInt(currentFrom.value, 10);
  const to = parseInt(currentTo.value, 10);
  return [from, to];
}

/* Handler para el primer rango */

function controlFromRange(
  fromRange,
  toRange,
  fromOutput,
  trackColor,
  progressColor
) {
  const [from, to] = getParsed(fromRange, toRange);

  fillRange(fromRange, toRange, trackColor, progressColor);

  // El valor del primer rango nunca debe ser mayor que el del segundo.
  if (from > to) {
    fromRange.value = to;
    fromOutput.innerHTML = `$&#8239;${to}`;
  } else {
    fromOutput.innerHTML = `$&#8239;${from}`;
  }
}

/* Handler para el segundo rango */

function controlToRange(
  fromRange,
  toRange,
  toOutput,
  trackColor,
  progressColor
) {
  const [from, to] = getParsed(fromRange, toRange);

  fillRange(fromRange, toRange, trackColor, progressColor);
  setToggleAccessible(toRange);

  // El valor del segundo rango nunca debe ser menor que el del primero.
  if (to < from) {
    toRange.value = from;
    toOutput.innerHTML = `$&#8239;${from}`;
  } else {
    toOutput.innerHTML = `$&#8239;${to}`;
  }
}

/* Pintado del 'background' del range */

function fillRange(from, to, trackColor, progressColor) {
  const rangeDistance = to.max - to.min;
  const fromPosition = from.value - to.min;
  const toPosition = to.value - to.min;

  to.style.background = `linear-gradient(
    to right,
    ${trackColor} 0%,
    ${trackColor} ${(fromPosition / rangeDistance) * 100}%,
    ${progressColor} ${(fromPosition / rangeDistance) * 100}%,
    ${progressColor} ${(toPosition / rangeDistance) * 100}%, 
    ${trackColor} ${(toPosition / rangeDistance) * 100}%, 
    ${trackColor} 100%)`;
}

/* Accesibilidad del 'thumb' del segundo rango */

function setToggleAccessible(currentTarget) {
  const toRange = document.getElementById("toRange");

  if (Number(currentTarget.value) <= Number(toRange.min)) {
    toRange.style.zIndex = 2;
  } else {
    toRange.style.zIndex = 0;
  }
}

/* Implementación */

export function rangeProgress() {
  const fromRange = document.getElementById("fromRange");
  const toRange = document.getElementById("toRange");
  const fromOutput = document.getElementById("fromOutput");
  const toOutput = document.getElementById("toOutput");
  const trackColor = getComputedStyle(toRange).getPropertyValue("--trackColor");
  const progressColor =
    getComputedStyle(toRange).getPropertyValue("--progressColor");

  fillRange(fromRange, toRange, trackColor, progressColor);
  setToggleAccessible(toRange);

  fromRange.addEventListener("input", () =>
    controlFromRange(fromRange, toRange, fromOutput, trackColor, progressColor)
  );

  toRange.addEventListener("input", () =>
    controlToRange(fromRange, toRange, toOutput, trackColor, progressColor)
  );

  controlFromRange(fromRange, toRange, fromOutput, trackColor, progressColor);
  controlToRange(fromRange, toRange, toOutput, trackColor, progressColor);
}
