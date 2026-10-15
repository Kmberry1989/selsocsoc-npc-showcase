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
      card.outfitImg.src = outfitUrl;
      card.outfitImg.alt = (npc.name || "NPC") + " outfit";
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
  card.faceZoom.addEventListener("click", () => openLightbox(card.faceZoom.dataset.full, card.faceZoom.dataset.caption));
  card.outfitZoom.addEventListener("click", () => openLightbox(card.outfitZoom.dataset.full, card.outfitZoom.dataset.caption));
  $("lightboxClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.hidden && e.key === "Escape") closeLightbox();
    if (lightbox.hidden && e.key === "ArrowLeft") $("prevBtn").click();
    if (lightbox.hidden && e.key === "ArrowRight") $("nextBtn").click();
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
