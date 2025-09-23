function isDesktop() {
  return window.matchMedia("(pointer: fine)").matches;
}

function zoomImage(overlay, img) {
  overlay.querySelector("img").src = img.currentSrc || img.src;
  overlay.classList.add("active");
}

function unzoomImage(overlay) {
  overlay.classList.remove("active");
}

document.addEventListener("click", (e) => {
  if (!isDesktop()) return;

  const overlay = document.querySelector(".zoom-overlay");
  const img = e.target.closest(".zoomable-img");

  if (img) {
    zoomImage(overlay, img);
    return;
  }

  if (overlay.classList.contains("active")) {
    unzoomImage(overlay);
  }
});

// create "<div class="zoom-overlay"><img alt="Zoom overlay" /></div>"
var divEle = document.createElement("div");
divEle.className = "zoom-overlay";
var imageEle = document.createElement("img");
imageEle.alt = "Zoom overlay";
divEle.appendChild(imageEle);
document.getElementsByTagName("body")[0].appendChild(divEle);
