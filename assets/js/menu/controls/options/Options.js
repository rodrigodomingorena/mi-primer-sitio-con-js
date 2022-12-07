import { Confirm } from "./confirm.js";
import { OptionLabel } from "./option-label.js";
import { Range } from "./range.js";
import { Filter } from "./filter.js";
import { Sort } from "./sort.js";

export class Options {
  constructor() {
    this.CONFIRM = new Confirm();
    this.OPTION_LABEL = new OptionLabel();
    this.RANGE = new Range();
    this.FILTER = new Filter();
    this.SORT = new Sort();
  }
}
