// Shared page behavior — extracted from od-oneforce-noir-2 (index.html + contact.html).
// Every block below guards for the elements it needs, so one file can serve every page.
(function () {
  // ---------- word-by-word blur reveal ----------
  function wrapWords(el) {
    var text = el.textContent;
    el.innerHTML = text.split(/(\s+)/).map(function (part) {
      if (part.trim() === '') return part;
      return '<span class="bw">' + part + '</span>';
    }).join('');
    var i = 0;
    el.querySelectorAll('.bw').forEach(function (span) {
      span.style.transitionDelay = (i * 45) + 'ms';
      i++;
    });
  }
  var targets = document.querySelectorAll('.blur-target');
  targets.forEach(wrapWords);

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('in-view'); });
  }

  // ---------- particle network canvas (home hero) ----------
  var canvas = document.getElementById('particle-canvas');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var hero = document.querySelector('.hero');
    var W, H, particles;
    var COUNT = 70;
    var LINK_DIST = 130;

    function resize() {
      var rect = hero.getBoundingClientRect();
      W = canvas.width = rect.width * devicePixelRatio;
      H = canvas.height = rect.height * devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function init() {
      particles = [];
      var w = canvas.clientWidth, h = canvas.clientHeight;
      for (var i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          r: Math.random() * 1.4 + 0.6
        });
      }
    }

    function step() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(226, 196, 140, 0.55)';
        ctx.fill();
      }
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = 'rgba(226, 196, 140,' + (0.12 * (1 - d / LINK_DIST)) + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      if (!reduceMotion) requestAnimationFrame(step);
    }

    resize();
    init();
    step();
    window.addEventListener('resize', function () { resize(); init(); if (reduceMotion) step(); });
  }

  // ---------- feature visuals: static node motif (SVG, home page) ----------
  function nodeMotif(el, seed) {
    if (!el) return;
    var pts = seed === 1
      ? [[20,30],[55,15],[85,35],[40,60],[70,70],[25,80]]
      : [[15,20],[50,35],[80,15],[60,55],[30,65],[80,75]];
    var lines = '';
    for (var i = 0; i < pts.length - 1; i++) {
      lines += '<line x1="' + pts[i][0] + '%" y1="' + pts[i][1] + '%" x2="' + pts[i+1][0] + '%" y2="' + pts[i+1][1] + '%" stroke="rgba(226,196,140,0.22)" stroke-width="1"/>';
    }
    var dots = pts.map(function (p, i) {
      var r = i % 2 === 0 ? 4 : 2.4;
      var op = i % 2 === 0 ? 0.9 : 0.5;
      return '<circle cx="' + p[0] + '%" cy="' + p[1] + '%" r="' + r + '" fill="rgba(226,196,140,' + op + ')"/>';
    }).join('');
    el.innerHTML = '<svg width="100%" height="100%" style="position:absolute;inset:0;">' + lines + dots + '</svg>';
  }
  nodeMotif(document.getElementById('visual-hub'), 1);
  nodeMotif(document.getElementById('visual-talent'), 2);

  // ---------- contact form (contact page) ----------
  // Deployed as a Google Apps Script Web App bound to the intake Sheet — it
  // appends a row and emails the notify address in one doPost(). See
  // scripts/apps-script.gs alongside this repo for the exact script.
  var SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzWoucciRr1GAkGWt4qey-22a7hxx4Ns76UbYdkIoBStPXYkrtLNIcgG5QmvM5SS-G2/exec';

  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var submitBtn = form.querySelector('button[type="submit"]');
  var submitLabel = submitBtn ? submitBtn.textContent : 'Send message';

  function setInvalid(field, invalid) {
    field.closest('.form-field').classList.toggle('invalid', invalid);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.querySelector('#f-name');
    var email = form.querySelector('#f-email');
    var company = form.querySelector('#f-company');
    var message = form.querySelector('#f-message');
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    var nameOk = name.value.trim().length > 1;
    var messageOk = message.value.trim().length > 8;

    setInvalid(name, !nameOk);
    setInvalid(email, !emailOk);
    setInvalid(message, !messageOk);

    if (!nameOk || !emailOk || !messageOk) {
      status.textContent = 'Please fill in your name, a valid email, and a short message.';
      status.className = 'form-status show';
      return;
    }

    // URLSearchParams, not FormData: FormData is sent as multipart/form-data,
    // which Apps Script does NOT unpack into e.parameter — doPost would append
    // a row of empty strings. URLSearchParams sets the Content-Type to
    // application/x-www-form-urlencoded, which e.parameter does read.
    var payload = new URLSearchParams();
    payload.append('name', name.value.trim());
    payload.append('email', email.value.trim());
    payload.append('company', company.value.trim());
    payload.append('message', message.value.trim());
    payload.append('page', location.href);
    payload.append('submittedAt', new Date().toISOString());

    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

    // Default (CORS) mode, not 'no-cors': the Apps Script endpoint returns
    // access-control-allow-origin:* on both its 302 and the final response,
    // and a urlencoded POST is a CORS "simple request" — so no OPTIONS
    // preflight is sent, which matters because Apps Script never answers one.
    // Reading the response is what lets the messages below be truthful: the
    // script replies {"ok":true} only after the row is appended and the
    // notification is sent. Anything else falls through to .catch and the
    // visitor keeps what they typed.
    fetch(SHEET_ENDPOINT, { method: 'POST', body: payload })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data || data.ok !== true) throw new Error('endpoint reported failure');
        form.reset();
        status.textContent = 'Thanks — your message is on its way. We typically reply within one business day.';
        status.className = 'form-status show ok';
      })
      .catch(function () {
        status.textContent = 'Something went wrong sending your message — please reach out via LinkedIn and we\'ll pick it up there.';
        status.className = 'form-status show';
      })
      .then(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitLabel; }
      });
  });
})();
