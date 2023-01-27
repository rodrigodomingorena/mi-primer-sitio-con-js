/* Establecimiento de la funcionalidad que controla el renderizado del componente
   Picture perteneciente al componente Hero del documento Plate */

export class Picture {
  constructor(HERO) {
    this.INDEX = HERO.INDEX;
    this.PLATE = HERO.PLATE;
    this.HERO = HERO;

    this.picture = "picture-plate";

    this.source = this.picture + "__source";
    this.image = this.picture + "__image";

    this.$picture = document.querySelector("." + this.picture);
    this.$placeholder = document.querySelector("." + this.image);
    this.$contentTemplate = document.querySelector(
      "." + this.picture + "__template"
    );

    this.sourceBreakpointSelectors = {
      md: "[media='(min-width: 768px)']",
      xl: "[media='(min-width: 1200px)']",
    };

    this.mimeTypeExtension = {
      "image/webp": ".webp",
      "image/png": ".png",
    };

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

    this.$picture.innerHTML = "";
    this.$picture.append(this.$placeholder);
  }

  /* Método para construir el Picture */

  build(plate) {
    const $contentTemplate = this.$contentTemplate.content.cloneNode(true);

    /* Establecimiento del <source> e <img> por defecto (hasta 768 px) */

    const path = `../assets/media/plate-${plate.imageId}/hero-image`;

    const $source = $contentTemplate.querySelector("." + this.source);
    $source.srcset = path + this.HERO.extension.source;

    const $image = $contentTemplate.querySelector("." + this.image);
    $image.src = path + this.HERO.extension.img;
    $image.alt = `Plato de ${plate.name}`;

    /* Establecimiento de los <source> a partir de 768 px */

    Object.entries(this.sourceBreakpointSelectors).forEach(
      ([breakpoint, selector]) => {
        /* Obtengo todos los <source> que coincidan con el selector actual */
        const sources = $contentTemplate.querySelectorAll(selector);

        const path = `../assets/media/plate-${plate.imageId}/${breakpoint}/hero-image`;

        for (const $source of sources) {
          const extension = this.mimeTypeExtension[$source.type];

          $source.srcset = path + extension;
        }
      }
    );

    this.$placeholder.remove();
    this.$picture.append($contentTemplate);
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
