//  Función utilizada para escuchar el evento 'scroll' y controlar la fijación del
//  '.header' en la parte superior de la ventana.

export const headerFixed = () => {
  const $header = document.querySelector(".header");
  const height = $header.offsetHeight;

  if (pageYOffset > height) $header.classList.add("header--fixed");
  if (!pageYOffset) $header.classList.remove("header--fixed");
};