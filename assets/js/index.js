import { handlerControlOption } from "./handlers/control-option.js";
import { headerFixed } from "./handlers/header-fixed.js";
import { rangeProgress } from "./range-progress/range-progress.js";

window.addEventListener("scroll", headerFixed);

window.addEventListener("resize", (event) => {
  handlerControlOption.updateFixedScroll();
})

document.addEventListener("DOMContentLoaded", (event) => {
  headerFixed();
  rangeProgress();
});

document.addEventListener("click", (event) => {
  handlerControlOption.click(event);
});
