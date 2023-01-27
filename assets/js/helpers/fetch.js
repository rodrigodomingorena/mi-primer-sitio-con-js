//  Método para ayudar a realizar solicitudes de red y manejar sus posibles errores a través del sitio.

import { ConnectionError } from "../error/ConnectionError.js";
import { HttpError } from "../error/HttpError.js";
import { NotFoundError } from "../error/NotFoundError.js";

export async function fetchResource(url, options) {
  let response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    /* Solicitud rechazada si no se pudo establecer la conexión */
    throw new ConnectionError(error);
  }

  /* Si el servidor responde con un estado del 200 al 299 */
  if (response.ok) {
    const json = await response.json();

    const notFound = json.length === 0;

    if (notFound) {
      /* Si la solicitud no pudo traer el recurso necesario */
      throw new NotFoundError();
    }

    return { response, json };
  } else {
    if (response.status === 404) {
      /* Si el servidor responde con un estado de error 404 */
      throw new NotFoundError();
    }

    /* Si el servidor responde con un estado de error */
    throw new HttpError(response.status);
  }
}
