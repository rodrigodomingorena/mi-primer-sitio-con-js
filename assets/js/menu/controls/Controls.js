import { Modal } from "./modal.js";
import { Search } from "./search.js";
import { Options} from "./options/Options.js";

export class Controls {
  constructor() {
    this.MODAL = new Modal();
    this.SEARCH = new Search();
    this.OPTIONS = new Options();
  }
}
