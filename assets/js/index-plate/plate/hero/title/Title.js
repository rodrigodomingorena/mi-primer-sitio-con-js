/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Title perteneciente al componente Hero del documento Plate */

export class Title {
  constructor(HERO) {
    this.INDEX = HERO.INDEX;
    this.PLATE = HERO.PLATE;
    this.HERO = HERO;

    this.topLevel = "title-plate";

    this.title = this.topLevel + "__title";
    this.price = this.topLevel + "__price";
    this.paragraph = this.topLevel + "__paragraph";

    this.$title = document.querySelector("." + this.title);
    this.$price = document.querySelector("." + this.price);
    this.$paragraph = document.querySelector("." + this.paragraph);

    this.start();
  }

  /* Método para manejar el evento "plate-update" */

  update({ detail: plate }) {
    this.build(plate);
  }

  /* Método para manejar el evento "default-values" */

  defaultValues({ detail }) {
    /* Si el restablecimiento a los valores por defecto proviene desde la recarga
       de un estado de error, no manejamos nada. Ya están establecidos por defecto */
    if (detail === "from-error") return;

    this.$title.innerHTML =
      this.$price.innerHTML =
      this.$paragraph.innerHTML =
        "";
  }

  /* Método para construir el Title */

  build(plate) {
    this.$title.innerHTML = plate.name;
    this.$price.innerHTML = "$" + this.INDEX.separator + plate.price;
    this.$paragraph.innerHTML = plate.description;
  }

  /* Método principal de inicio */

  start() {
    const events = [
      {
        name: "plate-update",
        attachedIn: document,
        handlers: [this.update],
      },
      {
        name: "default-values",
        attachedIn: document,
        handlers: [this.defaultValues],
      },
    ];

    for (const event of events) {
      for (const handler of event.handlers) {
        event.attachedIn.addEventListener(event.name, handler.bind(this));
      }
    }
  }
}
