// script.js
// nanganin menu mobile + carousel hero
// ditulis awal maret, dirombak pas carousel dikasih auto-play

document.addEventListener("DOMContentLoaded", function () {
  // cek dulu, header cuma jadi solid kalau halaman punya hero
  // halaman tentang/kenapa ga ada, jadi skip
  const bar = document.getElementById("barAtas");
  const heroAda = document.querySelector(".hero");

  if (bar && heroAda) {
    var cekGulir = function () {
      if (window.scrollY > 40) {
        bar.classList.add("sticky");
      } else {
        bar.classList.remove("sticky");
      }
    };
    cekGulir();
    window.addEventListener("scroll", cekGulir, { passive: true });
  }

  // ---------- menu burger ----------
  const burger = document.querySelector(".nav-burger");
  const navMenu = document.querySelector(".nav");

  if (burger && navMenu) {
    burger.addEventListener("click", function () {
      let kebuka = navMenu.classList.toggle("buka");

      if (kebuka) {
        burger.setAttribute("aria-expanded", "true");
      } else {
        burger.setAttribute("aria-expanded", "false");
      }
    });

    // tutup menu begitu salah satu link diklik
    const links = navMenu.getElementsByTagName("a");

    for (let i = 0; i < links.length; i++) {
      links[i].onclick = function () {
        navMenu.classList.remove("buka");
        burger.setAttribute("aria-expanded", "false");
      };
    }
  }

  // ---------- carousel ----------
  const slides = document.querySelectorAll(".hsl");
  const dotBox = document.getElementById("titikList");
  const btnPrev = document.querySelector(".arw-prev");
  const btnNext = document.querySelector(".arw-next");
  const numNow = document.getElementById("nomorSekarang");
  const numTotal = document.getElementById("nomorTotal");

  // halaman dalam ga punya carousel, keluar aja
  if (!slides.length || !dotBox) return;

  let posisi = 0;
  let ticker = null;

  const JEDA_MS = 6500; // 6.5 detik, tadinya 8 tapi kelamaan

  if (numTotal) {
    numTotal.textContent = slides.length;
  }

  // bikin dot satu-satu
  let k = 0;
  while (k < slides.length) {
    let dot = document.createElement("button");
    dot.className = k === 0 ? "dot aktif" : "dot";
    dot.setAttribute("aria-label", "slide ke-" + (k + 1));

    // simpen index, fungsi terpisah biar ga ketutup loop
    dot.onclick = buatHandler(k);

    dotBox.appendChild(dot);
    k = k + 1;
  }

  function buatHandler(idx) {
    return function () {
      pindahKe(idx);
      restartTicker();
    };
  }

  const semuaDot = dotBox.querySelectorAll(".dot");

  function pindahKe(target) {
    if (target < 0) target = slides.length - 1;
    if (target >= slides.length) target = 0;

    slides[posisi].classList.remove("aktif");
    semuaDot[posisi].classList.remove("aktif");

    posisi = target;

    slides[posisi].classList.add("aktif");
    semuaDot[posisi].classList.add("aktif");

    if (numNow) {
      numNow.textContent = posisi + 1;
    }
  }

  function next() {
    pindahKe(posisi + 1);
  }

  function prev() {
    pindahKe(posisi - 1);
  }

  function startTicker() {
    ticker = setInterval(next, JEDA_MS);
  }

  function restartTicker() {
    if (ticker !== null) {
      clearInterval(ticker);
      startTicker();
    }
  }

  if (btnPrev) {
    btnPrev.addEventListener("click", function () {
      prev();
      restartTicker();
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", function () {
      next();
      restartTicker();
    });
  }

  // pause kalo mouse ada di atas hero, biar user bisa baca
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.addEventListener("mouseenter", function () {
      if (ticker) clearInterval(ticker);
    });

    hero.addEventListener("mouseleave", function () {
      startTicker();
    });
  }

  // keyboard nav (kiri/kanan)
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      prev();
      restartTicker();
    } else if (e.key === "ArrowRight") {
      next();
      restartTicker();
    }
  });

  startTicker();

  if (numNow) numNow.textContent = 1;
});
