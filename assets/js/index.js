import { Header } from "./global/header.js";
import { HandlerNutritionalInfo } from "./handlers/nutritional-info.js";

document.addEventListener("DOMContentLoaded", () => {
  const header = new Header();
});

document.addEventListener("DOMContentLoaded", (event) => {
  try {
    const handlerNutritionalInfo = new HandlerNutritionalInfo();
    handlerNutritionalInfo.start();
  } catch (e) {}
});
