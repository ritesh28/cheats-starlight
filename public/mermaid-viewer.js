(() => {
  const MIN_SCALE = 0.25;
  const MAX_SCALE = 5;
  const ZOOM_STEP = 0.1;

  let overlay = null;
  let stage = null;
  let closeBtn = null;
  let scale = 1;
  let tx = 0;
  let ty = 0;
  let dragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let originTx = 0;
  let originTy = 0;
  let lastFocus = null;

  function ensureOverlay() {
    if (overlay) return;

    overlay = document.createElement("div");
    overlay.className = "mermaid-expand-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Expanded Mermaid diagram");
    overlay.hidden = true;

    const toolbar = document.createElement("div");
    toolbar.className = "mermaid-expand-toolbar";

    closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "mermaid-expand-close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z"/></svg>';
    closeBtn.addEventListener("click", closeExpand);

    toolbar.appendChild(closeBtn);

    stage = document.createElement("div");
    stage.className = "mermaid-expand-stage";

    overlay.appendChild(toolbar);
    overlay.appendChild(stage);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target === stage) closeExpand();
    });

    stage.addEventListener(
      "wheel",
      (e) => {
        if (overlay.hidden) return;
        e.preventDefault();
        const direction = e.deltaY > 0 ? -1 : 1;
        zoomAt(e.clientX, e.clientY, direction * ZOOM_STEP);
      },
      { passive: false },
    );

    stage.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      if (e.target === stage) return;
      dragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      originTx = tx;
      originTy = ty;
      stage.classList.add("is-dragging");
      stage.setPointerCapture(e.pointerId);
    });

    stage.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      tx = originTx + (e.clientX - dragStartX);
      ty = originTy + (e.clientY - dragStartY);
      applyTransform();
    });

    stage.addEventListener("pointerup", (e) => {
      dragging = false;
      stage.classList.remove("is-dragging");
      if (stage.hasPointerCapture(e.pointerId)) {
        stage.releasePointerCapture(e.pointerId);
      }
    });

    stage.addEventListener("pointercancel", () => {
      dragging = false;
      stage.classList.remove("is-dragging");
    });

    document.addEventListener("keydown", (e) => {
      if (overlay.hidden) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeExpand();
      }
    });
  }

  function diagramSvg() {
    return stage?.querySelector(":scope > svg") || null;
  }

  function applyTransform() {
    const svg = diagramSvg();
    if (!svg) return;
    svg.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  }

  function zoomAt(clientX, clientY, delta) {
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + delta));
    if (next === scale) return;

    const rect = stage.getBoundingClientRect();
    const cx = clientX - rect.left - rect.width / 2;
    const cy = clientY - rect.top - rect.height / 2;
    const ratio = next / scale;
    tx = cx - (cx - tx) * ratio;
    ty = cy - (cy - ty) * ratio;
    scale = next;
    applyTransform();
  }

  function cloneDiagram(svg) {
    const clone = svg.cloneNode(true);
    const oldId = clone.getAttribute("id") || "";
    const newId = "mermaid-expand-" + Math.random().toString(36).slice(2, 11);
    clone.setAttribute("id", newId);

    // Mermaid scopes theme CSS to the root svg id. Rewrite so fills/text keep theme colors.
    if (oldId) {
      clone.querySelectorAll("style").forEach((styleEl) => {
        styleEl.textContent = styleEl.textContent.split(oldId).join(newId);
      });
    }

    // Prefer natural diagram size over width="100%" stretching across the viewport.
    clone.removeAttribute("width");
    clone.removeAttribute("height");
    clone.style.width = "auto";
    clone.style.height = "auto";
    clone.style.maxWidth = "min(96vw, 1200px)";
    clone.style.maxHeight = "90vh";
    clone.style.transformOrigin = "center center";

    return clone;
  }

  function openExpand(svg) {
    ensureOverlay();
    lastFocus = document.activeElement;

    stage.replaceChildren();
    stage.appendChild(cloneDiagram(svg));

    scale = 1;
    tx = 0;
    ty = 0;
    applyTransform();

    overlay.hidden = false;
    document.body.classList.add("mermaid-expand-open");
    closeBtn.focus();
  }

  function closeExpand() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    stage.replaceChildren();
    document.body.classList.remove("mermaid-expand-open");
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
    lastFocus = null;
  }

  function enhanceDiagram(pre) {
    if (!pre.hasAttribute("data-processed")) return;
    if (!pre.querySelector(":scope > svg")) return;
    if (pre.querySelector(":scope > .mermaid-expand-btn")) return;

    pre.classList.add("mermaid-viewer");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mermaid-expand-btn";
    btn.setAttribute("aria-label", "Expand diagram");
    btn.title = "Expand";
    btn.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M2 2h4v1.5H3.5V6H2V2zm8 0h4v4h-1.5V3.5H10V2zM2 10h1.5v2.5H6V14H2v-4zm8 2.5V14h4v-4h-1.5v2.5H10z"/></svg>';

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const current = pre.querySelector(":scope > svg");
      if (current) openExpand(current);
    });

    pre.appendChild(btn);
  }

  function scan() {
    document.querySelectorAll("pre.mermaid").forEach(enhanceDiagram);
  }

  function init() {
    scan();
    const observer = new MutationObserver(() => scan());
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-processed"],
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
