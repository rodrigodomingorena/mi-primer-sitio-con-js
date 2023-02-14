import { Menu } from "./menu/Menu.js";

export class Index {
  constructor() {
    this.$html = document.documentElement;

    this.utilityClasses = {
      error: "error",
    };

    this.separator = "\u202F";

    this.MENU = new Menu(this);
  }
}
