//  Método utilizado por muchas clases del proyecto que dado unos valores,
//  los parsea en formato de método para su posterior llamado.

export function parsedName(prefix, ...strings) {
  // Ej: "filter", ["input"] --> "filterInput"
  // Ej: "search", ["change"] --> "searchChange"
  // Ej: "fromRange", ["input"] --> "fromRangeInput"

  strings = strings.map((str) =>
    str.replace(/^./, (char) => char.toUpperCase())
  );

  let parsedName = prefix;

  for (const string of strings) {
    parsedName += string;
  }

  return parsedName;
}
