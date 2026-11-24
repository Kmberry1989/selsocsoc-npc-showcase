(() => {
  "use strict";
  const MANIFEST_URL = "https://raw.githubusercontent.com/Kmberry1989/selsocsoc/main/assets/npc/manifest.json";

  const $ = (id) => document.getElementById(id);
  const statusEl = $("manifestStatus");
  const card = {
    name: $("npcName"), role: $("npcRole"),
    faceImg: $("faceImg"), outfitImg: $("outfitImg"),
    faceZoom: $("faceZoom"), outfitZoom: $("outfitZoom"),
    notes: $("npcNotes"), accessory: $("npcAccessory"),
  };
  const strip = $("thumbStrip");
  const counter = $("counter");
  const lightbox = $("lightbox");
  const lightboxImg = $("lightboxImg");
  const lightboxCaption = $("lightboxCaption");

  let npcs = [];
  let index = 0;
  let assetBase = "";
  let accessories = []; // accessories-manifest entries (npc + slot + GLB file)

  function setStatus(text, cls) {
    statusEl.textContent = text;
    statusEl.className = "manifest-status" + (cls ? " " + cls : "");
  }

  function absUrl(rel) {
    if (!rel) return null;
    if (/^https?:\/\//i.test(rel)) return rel;
    return assetBase + rel;
  }

  async function loadManifest() {
    setStatus("Loading…", "");
    try {
      // cache-busted so every open sees the newest revision without redeploying
      const url = MANIFEST_URL + (MANIFEST_URL.includes("?") ? "&" : "?") + "t=" + Date.now();
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      assetBase = data.assetBase || "";
      npcs = Array.isArray(data.characters) ? data.characters : [];
      if (!npcs.length) throw new Error("empty manifest");
      // Accessories manifest, live from the same asset base: every entry
      // carries npc + slot + GLB file, so the 3D view's head / left-hand /
      // back items come from the manifest, not from code. A failed fetch
      // only loses those slots — the held item still comes from each
      // NPC's own accessoryGlb, and nothing procedural is substituted.
      try {
        const accUrl = assetBase + "assets/npc-accessories/manifest.json?t=" + Date.now();
        const accRes = await fetch(accUrl, { cache: "no-store" });
        if (!accRes.ok) throw new Error("HTTP " + accRes.status);
        const accData = await accRes.json();
        accessories = Array.isArray(accData.accessories) ? accData.accessories : [];
      } catch (accErr) {
        accessories = [];
        console.warn("Showcase: accessories manifest unavailable, 3D view shows held items only", accErr);
      }
      index = 0;
      const ver = data.version != null ? " · v" + data.version : "";
      setStatus("Live manifest" + ver, "ok");
      renderStrip();
      renderCard();
    } catch (err) {
      setStatus("Manifest unavailable — check connection, then refresh", "err");
      card.name.textContent = "Could not load NPCs";
      card.role.textContent = "";
      card.notes.textContent = "The shared asset manifest did not load. Tap ⟳ to retry.";
      card.accessory.textContent = "";
      showMissing(card.faceZoom, card.faceImg);
      showMissing(card.outfitZoom, card.outfitImg);
    }
  }

  function showMissing(wrapBtn, img) {
    // Replace the <img> slot with an honest "no image" note when manifest has no art
    const parent = wrapBtn.parentElement;
    const old = parent.querySelector(".art-missing");
    if (old) old.remove();
    img.style.display = "none";
    wrapBtn.style.display = "none";
    const note = document.createElement("div");
    note.className = "art-missing";
    note.textContent = "No image in manifest";
    parent.insertBefore(note, parent.querySelector("figcaption"));
    wrapBtn.dataset.missingNote = note.textContent;
  }

  function restoreImg(wrapBtn, img) {
    const parent = wrapBtn.parentElement;
    const old = parent.querySelector(".art-missing");
    if (old) old.remove();
    img.style.display = "";
    wrapBtn.style.display = "";
  }

  function renderCard() {
    const npc = npcs[index];
    if (!npc) return;
    card.name.textContent = npc.name || "Unnamed";
    card.role.textContent = npc.role || "";

    const faceUrl = absUrl(npc.faceUrl);
    if (faceUrl) {
      restoreImg(card.faceZoom, card.faceImg);
      card.faceImg.src = faceUrl;
      card.faceImg.alt = (npc.name || "NPC") + " face";
      card.faceZoom.dataset.full = faceUrl;
      card.faceZoom.dataset.caption = (npc.name || "") + " — face";
    } else {
      showMissing(card.faceZoom, card.faceImg);
      const n = card.faceZoom.parentElement.querySelector(".art-missing");
      if (n) n.textContent = npc.faceNotes || "Face: no image in manifest";
    }

    const outfitUrl = absUrl(npc.outfitUrl);
    if (outfitUrl) {
      restoreImg(card.outfitZoom, card.outfitImg);
      card.outfitImg.alt = (npc.name || "NPC") + " outfit";
      setFrontOutfitTile(npc, outfitUrl);
      card.outfitZoom.dataset.full = outfitUrl;
      card.outfitZoom.dataset.caption = (npc.name || "") + " — outfit";
    } else {
      showMissing(card.outfitZoom, card.outfitImg);
      const n = card.outfitZoom.parentElement.querySelector(".art-missing");
      if (n) n.textContent = npc.outfitNotes || "Outfit: no image in manifest";
    }

    const notes = [npc.faceNotes, npc.outfitNotes].filter(Boolean).join(" · ");
    card.notes.textContent = notes;
    card.accessory.innerHTML = npc.accessory
      ? "Accessory: <strong>" + escapeHtml(npc.accessory) + "</strong>"
      : "";

    counter.textContent = (index + 1) + " / " + npcs.length;
    [...strip.children].forEach((t, i) => t.classList.toggle("active", i === index));
    const active = strip.children[index];
    if (active) active.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function renderStrip() {
    strip.innerHTML = "";
    npcs.forEach((npc, i) => {
      const b = document.createElement("button");
      b.className = "thumb" + (i === index ? " active" : "");
      b.setAttribute("aria-label", npc.name || ("NPC " + (i + 1)));
      const faceUrl = absUrl(npc.faceUrl);
      if (faceUrl) {
        const img = document.createElement("img");
        img.src = faceUrl;
        img.alt = "";
        img.loading = "lazy";
        b.appendChild(img);
      } else {
        const d = document.createElement("div");
        d.className = "thumb-initial";
        d.textContent = (npc.name || "?").trim().charAt(0).toUpperCase();
        b.appendChild(d);
      }
      b.addEventListener("click", () => { index = i; renderCard(); });
      strip.appendChild(b);
    });
  }

  function openLightbox(src, caption) {
    if (!src) return;
    lightboxImg.src = src;
    lightboxCaption.textContent = caption || "";
    lightbox.hidden = false;
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.removeAttribute("src");
  }

  $("prevBtn").addEventListener("click", () => {
    if (!npcs.length) return;
    index = (index - 1 + npcs.length) % npcs.length;
    renderCard();
  });
  $("nextBtn").addEventListener("click", () => {
    if (!npcs.length) return;
    index = (index + 1) % npcs.length;
    renderCard();
  });
  $("refreshBtn").addEventListener("click", loadManifest);
  // 3D viewer gallery + transform panel. The viewer shows the NPC's real
  // GLBs (local copies of the game's files, live game files as fallback);
  // prev/next cycle NPCs without closing, and the panel scales, moves, or
  // rotates the selected accessory live. Overrides live in the viewer for
  // the session and Copy scales exports them as manifest-shaped JSON.
  let activeSlot = null;
  let transformMode = 'scale'; // scale | move | rotate
  let transformAxis = 1; // 0 X, 1 Y, 2 Z (move/rotate only)
  const SLIDER_CFG = {
    scale: { min: 0.25, max: 2, step: 0.05 },
    move: { min: -0.5, max: 0.5, step: 0.01 },
    rotate: { min: -180, max: 180, step: 5 },
  };
  function viewer() { return window.__npcViewer3D; }
  function openViewerFor(i) {
    const npc = npcs[i];
    if (!npc || !viewer()) return;
    index = i;
    renderCard();
    $("viewer3dName").textContent = npc.name || "NPC";
    $("viewer3dCounter").textContent = (i + 1) + " / " + npcs.length;
    $("viewer3d").hidden = false;
    viewer().showNPC(npc, assetBase, accessories);
    buildScalePanel();
  }
  function buildScalePanel() {
    const list = viewer().getCurrentAccessories();
    const chips = $("scaleChips");
    chips.innerHTML = "";
    if (!list.length) { activeSlot = null; return; }
    if (!list.some((a) => a.slot === activeSlot)) activeSlot = list[0].slot;
    list.forEach((a) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "scale-chip" + (a.slot === activeSlot ? " active" : "");
      b.dataset.slot = a.slot;
      b.textContent = a.name;
      b.addEventListener("click", () => selectSlot(a.slot));
      chips.appendChild(b);
    });
    selectSlot(activeSlot);
  }
  function refreshSlider() {
    const a = viewer().getCurrentAccessories().find((x) => x.slot === activeSlot);
    if (!a) return;
    const s = $("scaleSlider"), cfg = SLIDER_CFG[transformMode];
    s.min = String(cfg.min); s.max = String(cfg.max); s.step = String(cfg.step);
    if (transformMode === 'scale') {
      s.value = String(a.scale);
      $("scaleValue").textContent = a.scale.toFixed(2) + "×";
    } else if (transformMode === 'move') {
      const v = a.offset[transformAxis];
      s.value = String(v);
      $("scaleValue").textContent = (v >= 0 ? "+" : "") + v.toFixed(2) + " m";
    } else {
      const deg = Math.round(a.rotation[transformAxis] * 180 / Math.PI);
      s.value = String(deg);
      $("scaleValue").textContent = deg + "°";
    }
  }
  function selectSlot(slot) {
    activeSlot = slot;
    const a = viewer().getCurrentAccessories().find((x) => x.slot === slot);
    if (!a) return;
    [...$("scaleChips").children].forEach((c) => c.classList.toggle("active", c.dataset.slot === slot));
    refreshSlider();
  }
  function applySlider(value) {
    if (!activeSlot) return;
    if (transformMode === 'scale') viewer().setAccessoryScale(activeSlot, value);
    else if (transformMode === 'move') viewer().setAccessoryOffset(activeSlot, transformAxis, value);
    else viewer().setAccessoryRotation(activeSlot, transformAxis, value * Math.PI / 180);
    refreshSlider();
  }
  [...$("modeChips").children].forEach((b) => b.addEventListener("click", () => {
    transformMode = b.dataset.mode;
    [...$("modeChips").children].forEach((c) => c.classList.toggle("active", c === b));
    $("axisChips").hidden = transformMode === 'scale';
    refreshSlider();
  }));
  [...$("axisChips").children].forEach((b) => b.addEventListener("click", () => {
    transformAxis = Number(b.dataset.axis);
    [...$("axisChips").children].forEach((c) => c.classList.toggle("active", c === b));
    refreshSlider();
  }));
  function flashBtn(btn, text) {
    const old = btn.textContent;
    btn.textContent = text;
    setTimeout(() => { btn.textContent = old; }, 1600);
  }
  $("view3dBtn").addEventListener("click", () => openViewerFor(index));
  $("viewer3dPrev").addEventListener("click", () => {
    if (npcs.length) openViewerFor((index - 1 + npcs.length) % npcs.length);
  });
  $("viewer3dNext").addEventListener("click", () => {
    if (npcs.length) openViewerFor((index + 1) % npcs.length);
  });
  $("scaleSlider").addEventListener("input", (e) => applySlider(parseFloat(e.target.value)));
  $("scaleDown").addEventListener("click", () => applySlider(parseFloat($("scaleSlider").value) - SLIDER_CFG[transformMode].step));
  $("scaleUp").addEventListener("click", () => applySlider(parseFloat($("scaleSlider").value) + SLIDER_CFG[transformMode].step));
  $("scaleReset").addEventListener("click", () => {
    if (!activeSlot) return;
    viewer().resetAccessoryTransform(activeSlot);
    refreshSlider();
  });
  $("copyScalesBtn").addEventListener("click", async () => {
    const btn = $("copyScalesBtn");
    const overrides = viewer().getTransformOverrides();
    if (!overrides.length) { flashBtn(btn, "No changes yet"); return; }
    const text = JSON.stringify(overrides, null, 2);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); ta.remove();
    }
    flashBtn(btn, "Copied");
  });
  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  // 2D card outfit tile: FRONT view only, cropped on canvas from the real
  // wraparound outfit PNG — centre 30% of the strip (u 0.35-0.65, FRONT
  // at u 0.5), full height, no repainting. The tile previously showed the
  // whole wraparound sheet (front + back + sides squashed into the square
  // tile), which is why dark back/side areas dominated. The full PNG is
  // shown first and kept if the crop load fails (e.g. CORS), and the
  // lightbox zoom still opens the full PNG.
  function setFrontOutfitTile(npc, outfitUrl) {
    card.outfitImg.src = outfitUrl;
    loadImage(outfitUrl).then((img) => {
      if (!npcs.length || npcs[index] !== npc) return;
      const fx = Math.round(img.width * 0.35), fw = Math.round(img.width * 0.30);
      if (!fw || !img.height) return;
      const c = document.createElement("canvas");
      c.width = fw; c.height = img.height;
      c.getContext("2d").drawImage(img, fx, 0, fw, img.height, 0, 0, fw, img.height);
      card.outfitImg.src = c.toDataURL("image/png");
    }).catch(() => { /* keep the full PNG fallback */ });
  }

  // Character card PNG: name + role header, face medallion, and the
  // FRONT slice of the wraparound outfit strip (u 0.35-0.65).
  async function downloadCard() {
    const npc = npcs[index];
    if (!npc) return;
    const W = 900, H = 1320;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const x = c.getContext("2d");
    x.fillStyle = "#f7f2e8"; x.fillRect(0, 0, W, H);
    x.fillStyle = "#1d2b22"; x.fillRect(0, 0, W, 170);
    x.fillStyle = "#f7f2e8"; x.textAlign = "center";
    x.font = "800 62px system-ui, sans-serif";
    x.fillText(npc.name || "Unnamed", W / 2, 78);
    x.font = "500 32px system-ui, sans-serif";
    x.fillStyle = "#cfe0d2";
    x.fillText(npc.role || "", W / 2, 128);
    x.fillStyle = "#5c6861"; x.font = "600 24px system-ui, sans-serif";
    x.fillText("Face", W / 2, 220);
    const faceUrl = absUrl(npc.faceUrl);
    if (faceUrl) {
      try {
        const img = await loadImage(faceUrl);
        x.save();
        x.beginPath(); x.arc(W / 2, 400, 175, 0, Math.PI * 2); x.clip();
        const s = Math.max(350 / img.width, 350 / img.height);
        x.drawImage(img, W / 2 - (img.width * s) / 2, 400 - (img.height * s) / 2, img.width * s, img.height * s);
        x.restore();
        x.strokeStyle = "#1d2b22"; x.lineWidth = 6;
        x.beginPath(); x.arc(W / 2, 400, 175, 0, Math.PI * 2); x.stroke();
      } catch { /* face stays blank if the image cannot load with CORS */ }
    }
    x.fillStyle = "#5c6861"; x.font = "600 24px system-ui, sans-serif";
    x.fillText("Outfit — front", W / 2, 640);
    const outfitUrl = absUrl(npc.outfitUrl);
    if (outfitUrl) {
      try {
        const img = await loadImage(outfitUrl);
        const fx = img.width * 0.35, fw = img.width * 0.30;
        x.drawImage(img, fx, 0, fw, img.height, 282, 665, 336, 560);
        x.strokeStyle = "#1d2b22"; x.lineWidth = 4;
        x.strokeRect(282, 665, 336, 560);
      } catch { /* outfit stays blank if the image cannot load with CORS */ }
    }
    x.fillStyle = "#5c6861"; x.font = "500 24px system-ui, sans-serif";
    x.fillText("Selfie Social Society · Cyclical City", W / 2, 1280);
    const a = document.createElement("a");
    a.download = "npc-" + (npc.id || "card") + "-card.png";
    a.href = c.toDataURL("image/png");
    a.click();
  }
  $("cardBtn").addEventListener("click", downloadCard);
  const closeViewer = () => {
    $("viewer3d").hidden = true;
    if (window.__npcViewer3D) window.__npcViewer3D.stopViewer();
  };
  $("viewer3dClose").addEventListener("click", closeViewer);
  $("viewer3d").addEventListener("click", (e) => { if (e.target === $("viewer3d")) closeViewer(); });
  card.faceZoom.addEventListener("click", () => openLightbox(card.faceZoom.dataset.full, card.faceZoom.dataset.caption));
  card.outfitZoom.addEventListener("click", () => openLightbox(card.outfitZoom.dataset.full, card.outfitZoom.dataset.caption));
  $("lightboxClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.hidden && e.key === "Escape") closeLightbox();
    if (lightbox.hidden && !$("viewer3d").hidden && e.key === "ArrowLeft") $("viewer3dPrev").click();
    else if (lightbox.hidden && !$("viewer3d").hidden && e.key === "ArrowRight") $("viewer3dNext").click();
    else if (lightbox.hidden && e.key === "ArrowLeft") $("prevBtn").click();
    else if (lightbox.hidden && e.key === "ArrowRight") $("nextBtn").click();
  });

  // Touch swipe on the card
  let touchX = null;
  card.name.closest(".npc-card").addEventListener("touchstart", (e) => {
    touchX = e.touches[0].clientX;
  }, { passive: true });
  card.name.closest(".npc-card").addEventListener("touchend", (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 48 && npcs.length) {
      index = (index + (dx < 0 ? 1 : -1) + npcs.length) % npcs.length;
      renderCard();
    }
  }, { passive: true });

  loadManifest();
})();
