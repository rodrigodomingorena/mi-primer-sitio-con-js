/* Establecimiento de la funcionalidad que controla el renderizado del
   componente Hero perteneciente al documento Plate */

import { Title } from "./title/Title.js";
import { Picture } from "./picture/Picture.js";
import { MiniCards } from "./mini-cards/Mini-Cards.js";

export class Hero {
  constructor(PLATE) {
    this.INDEX = PLATE.INDEX;
    this.PLATE = PLATE;

    this.extension = {
      source: ".webp",
      img: ".png",
    };

    this.TITLE = new Title(this);
    this.PICTURE = new Picture(this);
    this.MINI_CARDS = new MiniCards(this);
  }
}
