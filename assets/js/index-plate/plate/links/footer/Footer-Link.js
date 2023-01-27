/* Establecimiento de la funcionalidad que controla el enlace dinámico que depende
   del plato/error a renderizar perteneciente al Footer del documento Plate */

export class FooterLink {
  constructor(LINKS) {
    this.INDEX = LINKS.INDEX;
    this.PLATE = LINKS.PLATE;
    this.LINKS = LINKS;

    this.footer = "footer";

    this.link = this.footer + "__link";
    this.$link = document.getElementById(this.link);
  }

  /* Método para establecer un enlace */

  set() {
    this.$link.href = `#${this.INDEX.$body.id}`;
  }

  /* Método para eliminar un enlace */

  delete() {
    this.$link.href = "";
  }
}
