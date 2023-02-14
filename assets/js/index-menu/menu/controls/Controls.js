/* Establecimiento de la funcionalidad que controla la carga de datos y renderizado
   del componente Controls perteneciente al documento Menu */

import { Search } from "./search/Search.js";
import { OptionControl } from "./option/Option.js";

export class Controls {
  constructor(MENU) {
    this.INDEX = MENU.INDEX;
    this.MENU = MENU;

    this.controls = "controls";
    this.params = {};

    this.SEARCH = new Search(this);
    this.OPTION = new OptionControl(this);
  }

  /* Método para establecer los parámetros de búsqueda que se enviarán a la API */

  setParams(params, ...values) {
    params.forEach((param, i) => (this.params[param] = values[i] || ""));
  }

  /* Método para establecer los parámetros de búsqueda a una URL */

  setURLParams(url) {
    Object.entries(this.params).forEach(([param, value]) =>
      url.searchParams.set(param, value)
    );
  }

  /* Método para obtener los parámetros de búsqueda que un Input representará */

  getParams($input) {
    // Ej: ["_like"]
    const params = $input.dataset.params.split(";");
    // Ej: ["categories"]
    const prefixes = this.getParamPrefixes($input);

    if (prefixes) {
      // Ej: ["categories_like"]
      return params.map((param, i) => prefixes[i] + param);
    }

    return params;
  }

  /* Método para obtener los prefijos de los parámetros de búsqueda */

  getParamPrefixes($input) {
    return $input.dataset.paramPrefixes?.split(";");
  }
}
