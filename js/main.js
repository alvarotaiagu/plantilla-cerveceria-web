/* ==========================================================================
   TRASFEGA — plantilla de demostración (negocio ficticio)
   Concepto «Trasfega». HTML + CSS + este archivo. GSAP, ScrollTrigger y Lenis
   por CDN. Sin ellos la página se lee entera: el esquema del obrador se ve con
   todos los recipientes llenos, que es su estado legible.
   ========================================================================== */

(function () {
  "use strict";

  var raiz = document.documentElement;
  var mqReducido = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reducido = mqReducido.matches;
  var gsapListo = !!(window.gsap && window.ScrollTrigger);
  var movimiento = gsapListo && !reducido;

  if (gsapListo) { window.gsap.registerPlugin(window.ScrollTrigger); }
  if (movimiento) { raiz.classList.add("has-motion"); }

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ======================================================================
     0. MEDIDA DE TAREAS LARGAS
     El pliego pide verificar el canvas con `PerformanceObserver` de longtask,
     no mirando los FPS. Se deja montado en la propia página: apunta cada tarea
     larga con su marca de tiempo para poder separar las de carga (GSAP y las
     webfonts) de las que provoque la animación una vez arrancada.
     ====================================================================== */
  window.__tareasLargas = [];
  window.__tFuentes = null;
  (function medirTareasLargas() {
    if (!("PerformanceObserver" in window)) { return; }
    try {
      var po = new PerformanceObserver(function (lista) {
        lista.getEntries().forEach(function (e) {
          window.__tareasLargas.push({ t: Math.round(e.startTime), d: Math.round(e.duration) });
        });
      });
      po.observe({ entryTypes: ["longtask"] });
    } catch (e) { /* navegador sin soporte: no pasa nada */ }
  })();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { window.__tFuentes = Math.round(performance.now()); });
  }

  /* ======================================================================
     1. CONTENIDO — con o sin movimiento
     ====================================================================== */

  (function menu() {
    var boton = $("#hamburguesa"), nav = $("#nav");
    if (!boton || !nav) { return; }
    function cerrar() {
      boton.setAttribute("aria-expanded", "false");
      boton.setAttribute("aria-label", "Abrir menú");
      nav.classList.remove("esta-abierto");
    }
    boton.addEventListener("click", function () {
      var abierto = boton.getAttribute("aria-expanded") === "true";
      boton.setAttribute("aria-expanded", abierto ? "false" : "true");
      boton.setAttribute("aria-label", abierto ? "Abrir menú" : "Cerrar menú");
      nav.classList.toggle("esta-abierto", !abierto);
    });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", cerrar); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("esta-abierto")) { cerrar(); boton.focus(); }
    });
  })();

  (function cookies() {
    var banner = $("#cookie-banner"), ok = $("#cookie-ok");
    if (!banner || !ok) { return; }
    var CLAVE = "trasfega-cookies";
    var aceptado = false;
    try { aceptado = localStorage.getItem(CLAVE) === "1"; } catch (e) {}
    if (!aceptado) { banner.hidden = false; }
    ok.addEventListener("click", function () {
      banner.hidden = true;
      try { localStorage.setItem(CLAVE, "1"); } catch (e) {}
    });
  })();

  (function mapa() {
    var boton = $("#mapa-boton"), caja = $("#mapa");
    if (!boton || !caja) { return; }
    boton.addEventListener("click", function () {
      var marco = document.createElement("iframe");
      /* localidad, nunca una calle concreta: la dirección es inventada y no
         queremos señalar el portal de nadie */
      marco.src = "https://www.google.com/maps?q=Betanzos+A+Coruna&output=embed";
      marco.title = "Mapa de Betanzos, A Coruña (la dirección del obrador es ficticia)";
      marco.loading = "lazy";
      marco.referrerPolicy = "no-referrer-when-downgrade";
      marco.setAttribute("width", "600");
      marco.setAttribute("height", "320");
      caja.insertBefore(marco, boton.nextSibling);
      boton.remove();
    });
  })();

  (function formulario() {
    var form = $("#formulario"), salida = $("#formulario-respuesta");
    if (!form || !salida) { return; }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = $("#f-nombre").value.trim();
      var correo = $("#f-correo").value.trim();
      if (!$("#f-edad").checked) {
        salida.textContent = "Hay que confirmar que eres mayor de 18 años.";
        return;
      }
      if (!nombre || !correo || !$("#f-ok").checked) {
        salida.textContent = "Faltan el nombre, el correo o el aviso legal.";
        return;
      }
      salida.textContent = "Demostración: no se envía nada. Te escribiríamos, " + nombre + ".";
      form.reset();
    });
  })();

  /* Paso activo del proceso: es contenido (dice por dónde va la explicación),
     así que se marca también sin GSAP y con movimiento reducido. */
  var marcarPaso = (function () {
    var pasos = $$(".paso");
    var vasos = $$(".vaso");
    var aviso = $("#trasfega-aviso");
    if (!pasos.length) { return function () {}; }

    function marcar(i) {
      pasos.forEach(function (p, j) { p.classList.toggle("esta-activa", j === i); });
      var nombre = pasos[i] ? pasos[i].dataset.vaso : null;
      vasos.forEach(function (v) {
        v.classList.toggle("esta-activa", v.dataset.vaso === nombre);
        v.classList.toggle("esta-apagado", !!nombre && v.dataset.vaso !== nombre);
      });
      if (aviso && pasos[i]) {
        aviso.textContent = $(".paso-num", pasos[i]).textContent + " · " + $("h3", pasos[i]).textContent;
      }
    }
    marcar(0);

    if ("IntersectionObserver" in window && !movimiento) {
      var io = new IntersectionObserver(function (ent) {
        ent.forEach(function (e) {
          if (e.isIntersecting) { marcar(pasos.indexOf(e.target)); }
        });
      }, { rootMargin: "-40% 0px -40% 0px", threshold: 0 });
      pasos.forEach(function (p) { io.observe(p); });
    }
    return marcar;
  })();


  /* --- Contenedores con scroll accesibles por teclado ----------------------
     axe: `scrollable-region-focusable`. Un contenedor que se recorre con el
     dedo tiene que poder recorrerse también con las flechas, así que se hace
     focusable; pero solo cuando de verdad desborda, porque en escritorio no
     desborda y una parada de tabulación de más solo estorba. */
  (function scrollAccesible() {
    var cajas = $$("[data-scroll-teclado]");
    if (!cajas.length) { return; }
    function revisar() {
      cajas.forEach(function (c) {
        var desborda = (c.scrollWidth > c.clientWidth + 4) || (c.scrollHeight > c.clientHeight + 4);
        if (desborda) { c.setAttribute("tabindex", "0"); }
        else { c.removeAttribute("tabindex"); }
      });
    }
    revisar();
    window.addEventListener("resize", revisar);
    window.addEventListener("load", revisar);
  })();

  /* ======================================================================
     2. HERO DE CANVAS — malta cayendo al molino y amontonándose
     Se dibuja también sin GSAP; con movimiento reducido, un solo fotograma.
     Nada de ctx.filter ni shadowBlur por fotograma: el grano es un sprite
     cacheado que se pinta con drawImage.
     ====================================================================== */

  (function heroCanvas() {
    var lienzo = $("#hero-canvas");
    if (!lienzo || !lienzo.getContext) { return; }
    var ctx = lienzo.getContext("2d");
    var w = 0, h = 0, dpr = 1;
    var granos = [];
    var cubos = [];          /* mapa de alturas del montón */
    var NCUBOS = 64;
    var raf = null, visible = true, t = 0;

    var sprite = document.createElement("canvas");
    (function pintarSprite() {
      var s = 26;
      sprite.width = s; sprite.height = s;
      var c = sprite.getContext("2d");
      var g = c.createLinearGradient(0, 4, 0, s - 4);
      g.addColorStop(0, "#C89A54");
      g.addColorStop(0.55, "#9A6F35");
      g.addColorStop(1, "#6B4A22");
      c.fillStyle = g;
      c.beginPath();
      c.ellipse(s / 2, s / 2, 5.5, 9, 0, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = "rgba(20,14,8,.75)";
      c.lineWidth = 1.2;
      c.beginPath();
      c.moveTo(s / 2, s / 2 - 7);
      c.lineTo(s / 2, s / 2 + 7);
      c.stroke();
    })();

    function nuevoGrano(alto) {
      return {
        x: Math.random() * w,
        y: alto ? -20 - Math.random() * h : -20 - Math.random() * 300,
        vy: 2.4 + Math.random() * 2.6,
        vx: (Math.random() - 0.5) * 0.5,
        r: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.12,
        e: 0.55 + Math.random() * 0.5
      };
    }

    function medir() {
      var caja = lienzo.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(caja.width, 1);
      h = Math.max(caja.height, 1);
      lienzo.width = Math.round(w * dpr);
      lienzo.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(Math.max(w / 14, 40), 110));
      granos = [];
      for (var i = 0; i < n; i++) { granos.push(nuevoGrano(true)); }
      cubos = [];
      for (var j = 0; j < NCUBOS; j++) { cubos.push(10 + Math.sin(j / 5) * 6); }
    }

    function cuboDe(x) {
      var i = Math.floor((x / w) * NCUBOS);
      return Math.max(0, Math.min(NCUBOS - 1, i));
    }

    function pintarMonton() {
      var paso = w / (NCUBOS - 1);
      var g = ctx.createLinearGradient(0, h - 140, 0, h);
      g.addColorStop(0, "#7A5525");
      g.addColorStop(1, "#2A1E10");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (var i = 0; i < NCUBOS; i++) {
        ctx.lineTo(i * paso, h - cubos[i]);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(255,46,138,.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (var j = 0; j < NCUBOS; j++) {
        if (j === 0) { ctx.moveTo(0, h - cubos[0]); } else { ctx.lineTo(j * paso, h - cubos[j]); }
      }
      ctx.stroke();
    }

    function pintar() {
      ctx.clearRect(0, 0, w, h);

      var fondo = ctx.createLinearGradient(0, 0, 0, h);
      fondo.addColorStop(0, "#0E1013");
      fondo.addColorStop(0.6, "#0C0D0F");
      fondo.addColorStop(1, "#0A0B0C");
      ctx.fillStyle = fondo;
      ctx.fillRect(0, 0, w, h);

      var haz = ctx.createLinearGradient(w * 0.78, 0, w * 0.5, h);
      haz.addColorStop(0, "rgba(255,46,138,0.10)");
      haz.addColorStop(1, "rgba(255,46,138,0)");
      ctx.fillStyle = haz;
      ctx.beginPath();
      ctx.moveTo(w * 0.58, 0); ctx.lineTo(w * 1.04, 0);
      ctx.lineTo(w * 0.82, h); ctx.lineTo(w * 0.3, h);
      ctx.closePath();
      ctx.fill();

      for (var i = 0; i < granos.length; i++) {
        var p = granos[i];
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.globalAlpha = p.e;
        ctx.drawImage(sprite, -13, -13, 26, 26);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      pintarMonton();
    }

    function paso() {
      t += 0.016;
      for (var i = 0; i < granos.length; i++) {
        var p = granos[i];
        p.y += p.vy;
        p.x += p.vx;
        p.r += p.vr;
        var c = cuboDe(p.x);
        if (p.y > h - cubos[c] - 6) {
          /* el grano aterriza: engorda el montón y vuelve arriba */
          cubos[c] += 2.2;
          if (c > 0) { cubos[c - 1] += 0.9; }
          if (c < NCUBOS - 1) { cubos[c + 1] += 0.9; }
          granos[i] = nuevoGrano(false);
        } else if (p.x < -30 || p.x > w + 30) {
          granos[i] = nuevoGrano(false);
        }
      }
      /* el montón se deshace despacio, como si el molino fuese tragando */
      var tope = Math.min(h * 0.34, 180);
      for (var j = 0; j < NCUBOS; j++) {
        cubos[j] -= 1.1;
        if (cubos[j] < 6) { cubos[j] = 6; }
        if (cubos[j] > tope) { cubos[j] = tope; }
      }
      /* y se asienta hacia los lados */
      for (var k = 1; k < NCUBOS - 1; k++) {
        var media = (cubos[k - 1] + cubos[k + 1]) / 2;
        cubos[k] += (media - cubos[k]) * 0.12;
      }
      pintar();
      raf = requestAnimationFrame(paso);
    }

    function arrancar() { if (!raf && !reducido && visible) { raf = requestAnimationFrame(paso); } }
    function parar() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    medir();
    pintar();
    if (!reducido) { arrancar(); }

    var temporizador;
    window.addEventListener("resize", function () {
      clearTimeout(temporizador);
      temporizador = setTimeout(function () { medir(); pintar(); }, 180);
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) {
        visible = e[0].isIntersecting;
        if (visible) { arrancar(); } else { parar(); }
      }, { threshold: 0.02 }).observe(lienzo);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { parar(); } else { arrancar(); }
    });
  })();

  /* ======================================================================
     3. MOVIMIENTO
     ====================================================================== */
  if (!movimiento) { return; }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  var lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.17, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var destino = document.querySelector(a.getAttribute("href"));
        if (!destino) { return; }
        e.preventDefault();
        lenis.scrollTo(destino, { offset: -80 });
      });
    });
  }

  /* Un ScrollTrigger con `once` no dispara si el elemento ya está en pantalla
     al crearse: lo de una sola vez va con IntersectionObserver. */
  function alEntrar(el, hacer) {
    if (!("IntersectionObserver" in window)) { hacer(); return; }
    var io = new IntersectionObserver(function (ent) {
      ent.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); hacer(); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.04 });
    io.observe(el);
  }

  function titulares() {
    $$("[data-revelar]").forEach(function (el) {
      var texto = (el.textContent || "").replace(/\s+/g, " ").trim();
      el.setAttribute("aria-label", texto);
      el.textContent = "";
      var frag = document.createDocumentFragment();
      var partes = [];
      texto.split(" ").forEach(function (palabra) {
        var caja = document.createElement("span");
        caja.className = "palabra";
        caja.setAttribute("aria-hidden", "true");
        var dentro = document.createElement("i");
        dentro.textContent = palabra;
        caja.appendChild(dentro);
        frag.appendChild(caja);
        frag.appendChild(document.createTextNode(" "));
        partes.push(dentro);
      });
      el.appendChild(frag);
      /* y:0 explícito: GSAP lee el translate3d del CSS como `y` en píxeles */
      gsap.set(partes, { y: 0, yPercent: 112 });
      alEntrar(el, function () {
        gsap.to(partes, { yPercent: 0, duration: 0.7, ease: "power3.out", stagger: 0.045 });
      });
    });
  }

  function apariciones() {
    $$("[data-aparecer]").forEach(function (el, i) {
      alEntrar(el, function () {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: (i % 4) * 0.07 });
      });
    });
  }

  function franja() {
    var pista = $("#franja-pista");
    if (!pista) { return; }
    var bucle = gsap.to(pista, { xPercent: -50, duration: 24, ease: "none", repeat: -1 });
    var vuelta;
    ScrollTrigger.create({
      onUpdate: function (self) {
        bucle.timeScale(1 + Math.min(Math.abs(self.getVelocity()) / 700, 5));
        clearTimeout(vuelta);
        vuelta = setTimeout(function () { gsap.to(bucle, { timeScale: 1, duration: 0.8 }); }, 140);
      }
    });
  }

  /* --- LA TRASFEGA: la escena se ancla y el líquido pasa de vaso en vaso ---
     Se animan los atributos `y` y `height` de los rectángulos recortados por
     cada recipiente. Nada de transform en CSS sobre los <g>: GSAP escribe el
     transform de un SVG en el atributo y el CSS lo pisaría. */
  function trasfega() {
    var escena = $("#trasfega-escena");
    var planta = $("#planta");
    if (!escena || !planta || window.innerWidth < 900) { return; }

    /* geometría de cada recipiente: [fondo, altura máxima] */
    var vasos = [
      { id: "#liq-macerador", fondo: 320, alto: 150 },
      { id: "#liq-caldera", fondo: 320, alto: 150 },
      { id: "#liq-fermentador", fondo: 340, alto: 190 },
      { id: "#liq-envasado", fondo: 300, alto: 120 }
    ];
    var flujo = $(".tuberia .flujo", planta);

    function vaciar(v) {
      var el = $(v.id);
      if (el) { gsap.set(el, { attr: { y: v.fondo, height: 0 } }); }
    }
    vasos.forEach(vaciar);

    escena.classList.add("esta-anclada");

    var ultimo = -1;
    var linea = gsap.timeline({
      scrollTrigger: {
        trigger: escena,
        start: "top top",
        end: "+=" + Math.round(window.innerHeight * 2.6),
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          var i = Math.min(Math.floor(self.progress * 5), 4);
          if (i !== ultimo) { ultimo = i; marcarPaso(i); }
        }
      }
    });

    /* molienda: el primer tramo es solo el molino girando */
    linea.to(flujo, { strokeDashoffset: -120, duration: 1, ease: "none" }, 0);

    vasos.forEach(function (v, i) {
      var el = $(v.id);
      if (!el) { return; }
      var entra = 1 + i * 1.1;
      linea.to(el, {
        attr: { y: v.fondo - v.alto, height: v.alto },
        duration: 0.8, ease: "power1.inOut"
      }, entra);
      /* el recipiente anterior se vacía mientras el siguiente se llena */
      if (i > 0) {
        var previo = $(vasos[i - 1].id);
        linea.to(previo, {
          attr: { y: vasos[i - 1].fondo, height: 0 },
          duration: 0.8, ease: "power1.inOut"
        }, entra);
      }
    });
  }

  function contadores() {
    $$(".contador").forEach(function (el) {
      var hasta = parseFloat(el.dataset.hasta || el.textContent) || 0;
      var estado = { v: 0 };
      el.textContent = "0";
      alEntrar(el, function () {
        gsap.to(estado, {
          v: hasta, duration: 1.4, ease: "power2.out",
          onUpdate: function () {
            el.textContent = hasta >= 1000
              ? Math.round(estado.v).toLocaleString("es-ES")
              : Math.round(estado.v);
          }
        });
      });
    });
  }

  function imanes() {
    if (!window.matchMedia("(hover:hover)").matches) { return; }
    $$("[data-iman]").forEach(function (el) {
      var aX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
      var aY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
      el.addEventListener("mousemove", function (e) {
        var c = el.getBoundingClientRect();
        aX((e.clientX - (c.left + c.width / 2)) * 0.3);
        aY((e.clientY - (c.top + c.height / 2)) * 0.42);
      });
      el.addEventListener("mouseleave", function () { aX(0); aY(0); });
    });
  }

  function cursor() {
    var caja = $("#cursor"), texto = $("#cursor-texto");
    if (!caja || !window.matchMedia("(hover:hover)").matches) { return; }
    var aX = gsap.quickTo(caja, "x", { duration: 0.2, ease: "power3.out" });
    var aY = gsap.quickTo(caja, "y", { duration: 0.2, ease: "power3.out" });
    window.addEventListener("mousemove", function (e) { aX(e.clientX); aY(e.clientY); }, { passive: true });

    [
      { sel: "#planta", txt: "la trasfega" },
      { sel: ".lote", txt: "lote" },
      { sel: ".equipo img", txt: "ilustración" },
      { sel: ".visita", txt: "visita" }
    ].forEach(function (g) {
      $$(g.sel).forEach(function (el) {
        el.addEventListener("mouseenter", function () { caja.classList.add("es-grande"); texto.textContent = g.txt; });
        el.addEventListener("mouseleave", function () { caja.classList.remove("es-grande"); texto.textContent = ""; });
      });
    });
    $$("a, button").forEach(function (el) {
      el.addEventListener("mouseenter", function () { caja.classList.add("es-grande"); });
      el.addEventListener("mouseleave", function () { caja.classList.remove("es-grande"); });
    });
  }

  function arrancar() {
    titulares();
    apariciones();
    franja();
    trasfega();
    contadores();
    imanes();
    cursor();
    ScrollTrigger.refresh();
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(arrancar);
  } else {
    window.addEventListener("load", arrancar);
  }

  if (mqReducido.addEventListener) {
    mqReducido.addEventListener("change", function () { window.location.reload(); });
  }
})();
