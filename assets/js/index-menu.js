import { Header } from "./global/header.js";
import { ModalNotification } from "./global/modal-notification.js";

import { Index } from "./index-menu/Index.js";

document.addEventListener("DOMContentLoaded", () => {
  const HEADER = new Header();
  const INDEX = new Index();

  // Manejo temporal de notificación
  const notification = new ModalNotification();
});
