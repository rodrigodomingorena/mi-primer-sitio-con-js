import { handlerControlOption } from "./handlers/control-option.js";
import { headerFixed } from "./handlers/header-fixed.js";
import { HandlerNutritionalInfo } from "./handlers/nutritional-info.js";
import { rangeProgress } from "./range-progress/range-progress.js";

window.addEventListener("scroll", headerFixed);

window.addEventListener("resize", (event) => {
  handlerControlOption.updateFixedScroll();
});

document.addEventListener("click", (event) => {
  try {
    handlerControlOption.click(event);
  } catch (e) {}
});

document.addEventListener("DOMContentLoaded", (event) => {
  headerFixed();

  try {
    const handlerNutritionalInfo = new HandlerNutritionalInfo();
    handlerNutritionalInfo.start();
  } catch (e) {}

  try {
    rangeProgress();
  } catch (e) {}
});
