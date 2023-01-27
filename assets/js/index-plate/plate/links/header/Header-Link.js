/* Establecimiento de la funcionalidad que controla el enlace dinámico que depende
   del plato/error a renderizar perteneciente al Header del documento Plate */

export class HeaderLink {
  constructor(LINKS) {
    this.INDEX = LINKS.INDEX;
    this.PLATE = LINKS.PLATE;
    this.LINKS = LINKS;

    this.header = "header";

    this.nav = this.header + "__navbar-nav";
    this.item = this.header + "__item";
    this.link = this.header + "__link";
    this.linkActive = this.link + "--active";

    this.$nav = document.querySelector("." + this.nav);
    this.$itemTemplate = document.querySelector("." + this.item + "__template");
  }

  /* Método para establecer un enlace */

  set(plate) {
    /* Si es un plato nulo no hay nada que establecer */
    if (!plate) return;

    const $itemTemplate = this.$itemTemplate.content.cloneNode(true);
    const $link = $itemTemplate.querySelector("." + this.link);

    $link.innerHTML = plate.name;
    $link.href = `#${this.INDEX.$body.id}`;

    this.$nav.prepend($itemTemplate);
  }

  /* Método para eliminar un enlace */

  delete() {
    if (this.$nav.querySelector("." + this.linkActive))
      this.$nav.firstElementChild.remove();
  }
}
