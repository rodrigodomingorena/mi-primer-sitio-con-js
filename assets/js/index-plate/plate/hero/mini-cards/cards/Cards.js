/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Cards perteneciente al componente Mini Cards del Hero del documento Plate */

export class Cards {
  constructor(MINI_CARDS) {
    this.INDEX = MINI_CARDS.INDEX;
    this.PLATE = MINI_CARDS.PLATE;
    this.HERO = MINI_CARDS.HERO;
    this.MINI_CARDS = MINI_CARDS;

    this.card = this.MINI_CARDS.miniCards + "__card";
    this.anchor = this.MINI_CARDS.miniCards + "__anchor";
    this.source = this.MINI_CARDS.miniCards + "__source";
    this.image = this.MINI_CARDS.miniCards + "__image";
    this.title = this.MINI_CARDS.miniCards + "__title";

    this.placeholder = this.card + "--" + this.INDEX.utilityClasses.placeholder;
    this.$placeholder = this.getPlaceholder();

    this.$template = document.querySelector("." + this.card + "__template");
  }

  /* Método para construir las Cards */

  build(plates) {
    const cards = [];

    /* Construcción de una Card por cada plato */
    for (const plate of plates) {
      const $template = this.$template.content.cloneNode(true);

      /* Establecimiento del <source> e <img>  */

      const path = `../assets/media/mini-cards/image-${plate.imageId}`;

      const $source = $template.querySelector("." + this.source);
      $source.srcset = path + this.HERO.extension.source;

      const $image = $template.querySelector("." + this.image);
      $image.src = path + this.HERO.extension.img;
      $image.alt = `Plato de ${plate.name}`;

      /* Establecimiento del $anchor y $title */

      const $anchor = $template.querySelector("." + this.anchor);
      $anchor.setAttribute("href", `#${plate.id}`);

      const $title = $template.querySelector("." + this.title);
      $title.innerHTML = plate.name;

      cards.push($template);
    }

    this.MINI_CARDS.CARROUSEL.$carrousel.append(...cards, this.$placeholder);
  }

  /* Método para construir y obtener un $placeholder */

  getPlaceholder() {
    const $anchorPlaceholder = document.createElement("a");

    const $placeholderTemplate = document
      .querySelector("." + this.card + "__placeholder__template")
      .content.cloneNode("true");

    $anchorPlaceholder.append($placeholderTemplate);

    return $anchorPlaceholder;
  }
}
