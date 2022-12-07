//  Método utilizado para el restablecimiento de la posición del cursor
//  en varios elementos de entrada luego de filtrar ciertos valores introducidos.

export function setCursorPosition($input, position, raw, final, diff = 0) {
  $input.selectionStart = $input.selectionEnd =
    position - (raw - final + diff);
}
