/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Card perteneciente al componente Cards del documento Menu */

export class Card {
  constructor(CARDS) {
    this.INDEX = CARDS.INDEX;
    this.MENU = CARDS.MENU;
    this.CARDS = CARDS;

    this.card = this.CARDS.cards + "__card";
    this.source = this.card + "__source";
    this.image = this.card + "__image";
    this.title = this.card + "__title";
    this.price = this.card + "__price";

    this.links = {
      plate: "[data-link='plate']",
      cart: "[data-link='cart']",
    };

    this.$template = document.querySelector("." + this.card + "__template");

    this.extension = {
      source: ".webp",
      img: ".png",
    };
  }

  /* Método para construir cada Card */

  build(plates) {
    const cards = [];

    /* Construcción de una Card por cada plato */
    for (const plate of plates) {
      const $template = this.$template.content.cloneNode(true);

      /* Establecimiento del <source> e <img>  */

      const path = `../assets/media/menu/card-plate-image-${plate.imageId}`;

      const $source = $template.querySelector("." + this.source);
      $source.srcset = path + this.extension.source;

      const $image = $template.querySelector("." + this.image);
      $image.src = path + this.extension.img;
      $image.alt = `Plato de ${plate.name}`;

      /* Establecimiento del $title, $price y $plateLink */

      const $title = $template.querySelector("." + this.title);
      $title.innerHTML = plate.name;

      const $price = $template.querySelector("." + this.price);
      $price.innerHTML = "$" + this.INDEX.separator + plate.price;

      const $plateLink = $template.querySelector(this.links.plate);
      $plateLink.setAttribute("href", `./plate.html#${plate.id}`);

      cards.push($template);
    }

    this.CARDS.$container.append(...cards);
  }
}
