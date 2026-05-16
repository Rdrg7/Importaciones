/* =========================================
   IMPORTACIONES — app.js
   =========================================

   CONFIGURACIÓN SUPABASE
   ──────────────────────
   1. Crea tu proyecto en https://supabase.com
   2. Ve a Project Settings → API
   3. Copia Project URL y anon public key
   4. Pégalos abajo
   5. Ejecuta el SQL del README para crear las tablas

   Sin Supabase configurado:
   • Los 12 recuadros fijos SÍ funcionan (están en el HTML).
   • Pendientes, Contactos, Trackings, Correos y recuadros
     nuevos NO se guardarán hasta configurar Supabase.
   ========================================= */

const SUPABASE_URL      = 'https://omceoxlwgxpzbttdkaop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tY2VveGx3Z3hwemJ0dGRrYW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NDM3NTcsImV4cCI6MjA5NDUxOTc1N30.o1FL82ladUZdmlZWfQmE7r5AuiYupAh9PspVC4ASXq0';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// ─────────────────────────────────────────
// 1. CANVAS — ESTRELLAS DE FONDO
// ─────────────────────────────────────────
(function initStars() {
  const canvas = document.getElementById('starsCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, stars = [], meteors = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeStars() {
    stars = [];
    for (let i = 0; i < 170; i++) {
      stars.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        r:  Math.random() * 1.3 + 0.2,
        a:  Math.random(),
        da: (Math.random() * 0.005 + 0.001) * (Math.random() < 0.5 ? 1 : -1)
      });
    }
  }

  function spawnMeteor() {
    const angle = Math.PI / 5.5 + Math.random() * 0.3;
    const speed = 9 + Math.random() * 8;
    meteors.push({
      x:   Math.random() * W * 0.75,
      y:   Math.random() * H * 0.45,
      vx:  Math.cos(angle) * speed,
      vy:  Math.sin(angle) * speed,
      len: 70 + Math.random() * 90,
      a:   1,
      da:  0.013 + Math.random() * 0.007
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const g1 = ctx.createRadialGradient(-60,-60,10,-60,-60,350);
    g1.addColorStop(0,'rgba(99,40,180,0.16)'); g1.addColorStop(1,'transparent');
    ctx.fillStyle = g1; ctx.fillRect(0,0,W,H);

    const g2 = ctx.createRadialGradient(W+50,H+30,10,W+50,H+30,300);
    g2.addColorStop(0,'rgba(20,120,200,0.13)'); g2.addColorStop(1,'transparent');
    ctx.fillStyle = g2; ctx.fillRect(0,0,W,H);

    stars.forEach(s => {
      s.a += s.da;
      if (s.a > 1 || s.a < 0.05) s.da *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a.toFixed(2)})`;
      ctx.fill();
    });

    meteors = meteors.filter(m => m.a > 0);
    meteors.forEach(m => {
      const tail = m.len / 10;
      const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx*tail, m.y - m.vy*tail);
      grad.addColorStop(0, `rgba(255,255,255,${m.a.toFixed(2)})`);
      grad.addColorStop(0.4, `rgba(167,139,250,${(m.a*0.45).toFixed(2)})`);
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx*tail, m.y - m.vy*tail);
      ctx.strokeStyle = grad; ctx.lineWidth = 1.6; ctx.stroke();
      m.x += m.vx; m.y += m.vy; m.a -= m.da;
    });

    requestAnimationFrame(draw);
  }

  setInterval(spawnMeteor, 2400);
  resize(); makeStars(); draw();
  window.addEventListener('resize', () => { resize(); makeStars(); });
})();


// ─────────────────────────────────────────
// 2. SPLASH — ocultar al terminar animación
// ─────────────────────────────────────────
(function initSplash() {
  const splash = document.getElementById('splashScreen');
  if (!splash) return;
  splash.addEventListener('animationend', () => splash.classList.add('hidden'));
})();


// ─────────────────────────────────────────
// 3. ABRIR ENLACE EN NUEVA PESTAÑA
//    Reemplaza completamente al iframe anterior.
// ─────────────────────────────────────────
function openLink(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}


// ─────────────────────────────────────────
// 4. PESTAÑAS DEL HEADER
// ─────────────────────────────────────────
let activePanel = null;

function togglePanel(name) {
  const panel   = document.getElementById(`panel-${name}`);
  const chevron = document.getElementById(`chevron-${name}`);

  if (activePanel && activePanel !== name) {
    document.getElementById(`panel-${activePanel}`).classList.remove('open');
    document.getElementById(`chevron-${activePanel}`).classList.remove('open');
  }

  const isOpen = panel.classList.toggle('open');
  chevron.classList.toggle('open', isOpen);
  activePanel = isOpen ? name : null;
}

document.addEventListener('click', e => {
  if (!e.target.closest('.panel-tab') && !e.target.closest('.modal-overlay')) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('open'));
    document.querySelectorAll('.tab-chevron').forEach(c => c.classList.remove('open'));
    activePanel = null;
  }
});


// ─────────────────────────────────────────
// 5. PENDIENTES
// ─────────────────────────────────────────
async function loadPendientes() {
  const { data, error } = await db.from('pendientes').select('*').order('created_at');
  if (error) { console.warn('Supabase pendientes:', error.message); return; }
  data.forEach(p => appendPendienteDOM(p.id, p.texto));
}

function appendPendienteDOM(id, texto) {
  const li = document.createElement('li');
  li.className = 'pendiente-item';
  li.dataset.id = id;
  li.innerHTML = `
    <span class="del-dot" onclick="deletePendiente(${id},this)" title="Marcar completado"></span>
    <span>${texto}</span>`;
  document.getElementById('pendientesList').appendChild(li);
}

async function addPendiente() {
  const input = document.getElementById('pendienteInput');
  const texto = input.value.trim();
  if (!texto) return;
  const { data, error } = await db.from('pendientes').insert([{ texto }]).select();
  if (error) { alert('Error. ¿Configuraste Supabase?'); return; }
  appendPendienteDOM(data[0].id, data[0].texto);
  input.value = '';
}

async function deletePendiente(id, dot) {
  await db.from('pendientes').delete().eq('id', id);
  dot.closest('.pendiente-item').remove();
}


// ─────────────────────────────────────────
// 6. CONTACTOS
// ─────────────────────────────────────────
async function loadContactos() {
  const { data, error } = await db.from('contactos').select('*').order('nombre');
  if (error) { console.warn('Supabase contactos:', error.message); return; }
  data.forEach(c => appendContactoDOM(c.id, c.nombre, c.numero));
}

function appendContactoDOM(id, nombre, numero) {
  const li = document.createElement('li');
  li.className = 'contacto-item';
  li.dataset.id = id;
  li.innerHTML = `
    <i class="fa-solid fa-user" style="color:var(--teal);font-size:12px;flex-shrink:0"></i>
    <span style="flex:1"><strong>${nombre}</strong>&nbsp;&nbsp;${numero}</span>
    <button class="del-btn" onclick="deleteContacto(${id},this)"><i class="fa-solid fa-xmark"></i></button>`;
  document.getElementById('contactosList').appendChild(li);
}

async function addContacto() {
  const nombre = document.getElementById('contactoNombre').value.trim();
  const numero = document.getElementById('contactoNumero').value.trim();
  if (!nombre || !numero) return;
  const { data, error } = await db.from('contactos').insert([{ nombre, numero }]).select();
  if (error) { alert('Error. ¿Configuraste Supabase?'); return; }
  appendContactoDOM(data[0].id, data[0].nombre, data[0].numero);
  document.getElementById('contactoNombre').value = '';
  document.getElementById('contactoNumero').value = '';
}

async function deleteContacto(id, btn) {
  await db.from('contactos').delete().eq('id', id);
  btn.closest('.contacto-item').remove();
}


// ─────────────────────────────────────────
// 7. TRACKINGS
// ─────────────────────────────────────────
async function loadTrackings() {
  const { data, error } = await db.from('trackings').select('*').order('created_at');
  if (error) { console.warn('Supabase trackings:', error.message); return; }
  data.forEach(t => appendTrackingDOM(t.id, t.icono, t.label, t.url));
}

function appendTrackingDOM(id, icono, label, url) {
  const li = document.createElement('li');
  li.className = 'tracking-item';
  li.dataset.id = id;
  const iconHtml = icono
    ? `<i class="${icono} tracking-icon-preview"></i>`
    : `<i class="fa-solid fa-link tracking-icon-preview"></i>`;
  li.innerHTML = `
    ${iconHtml}
    <a href="${url}" target="_blank" rel="noopener" class="tracking-link">${label}</a>
    <button class="del-btn" onclick="deleteTracking(${id},this)"><i class="fa-solid fa-xmark"></i></button>`;
  document.getElementById('trackingsList').appendChild(li);
}

async function addTracking() {
  const icono = document.getElementById('trackingIcon').value.trim();
  const label = document.getElementById('trackingLabel').value.trim();
  const url   = document.getElementById('trackingUrl').value.trim();
  if (!label || !url) return;
  const { data, error } = await db.from('trackings').insert([{ icono, label, url }]).select();
  if (error) { alert('Error. ¿Configuraste Supabase?'); return; }
  appendTrackingDOM(data[0].id, data[0].icono, data[0].label, data[0].url);
  document.getElementById('trackingIcon').value  = '';
  document.getElementById('trackingLabel').value = '';
  document.getElementById('trackingUrl').value   = '';
}

async function deleteTracking(id, btn) {
  await db.from('trackings').delete().eq('id', id);
  btn.closest('.tracking-item').remove();
}


// ─────────────────────────────────────────
// 8. CORREOS — PLANTILLAS PARA OUTLOOK
// ─────────────────────────────────────────

// ── Cargar desde Supabase ──
async function loadCorreos() {
  const { data, error } = await db.from('correos').select('*').order('created_at');
  if (error) { console.warn('Supabase correos:', error.message); return; }
  data.forEach(c => appendCorreoDOM(c.id, c.titulo, c.destinatarios, c.asunto, c.mensaje));
}

// ── Agregar a la lista del panel ──
function appendCorreoDOM(id, titulo, destinatarios, asunto, mensaje) {
  const li = document.createElement('li');
  li.className = 'correo-item';
  li.dataset.id = id;
  li.innerHTML = `
    <span class="correo-item-title" title="${titulo}">${titulo}</span>
    <div class="correo-item-actions">
      <button class="correo-item-btn open-btn" title="Abrir en Outlook"
              onclick="abrirEnOutlook('${encodeData(destinatarios)}','${encodeData(asunto)}','${encodeData(mensaje)}')">
        <i class="fa-solid fa-envelope-open-text"></i>
      </button>
      <button class="correo-item-btn edit-btn" title="Editar"
              onclick="editCorreo(${id})">
        <i class="fa-solid fa-pen"></i>
      </button>
      <button class="correo-item-btn del-btn-c" title="Eliminar"
              onclick="deleteCorreo(${id},this)">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>`;
  document.getElementById('correosList').appendChild(li);
}

// ── Helper para codificar datos en el onclick ──
function encodeData(str) {
  return (str || '').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,'\\n');
}

// ── Abrir en Outlook vía mailto ──
//    Outlook 2016 respeta el protocolo mailto: y lo abre directamente.
function abrirEnOutlook(destinatarios, asunto, mensaje) {
  const to      = decodeData(destinatarios);
  const subject = decodeData(asunto);
  const body    = decodeData(mensaje);

  // mailto: estándar — Outlook 2016 lo intercepta automáticamente
  const mailto = `mailto:${encodeURIComponent(to)}`
    + `?subject=${encodeURIComponent(subject)}`
    + `&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;
}

function decodeData(str) {
  return (str || '').replace(/\\n/g,'\n').replace(/\\'/g,"'").replace(/\\\\/g,'\\');
}

// ── Modal: mostrar ──
function showCorreoModal(id) {
  document.getElementById('correoModalTitle').textContent = id ? 'Editar plantilla' : 'Nueva plantilla de correo';
  document.getElementById('correoSaveBtn').textContent    = id ? 'Guardar cambios' : 'Guardar plantilla';
  document.getElementById('editCorreoId').value           = id || '';

  if (!id) {
    document.getElementById('correoTitulo').value        = '';
    document.getElementById('correoDestinatarios').value = '';
    document.getElementById('correoAsunto').value        = '';
    document.getElementById('correoMensaje').value       = '';
  }

  document.getElementById('correoModal').classList.add('open');
}

// ── Modal: cerrar ──
function closeCorreoModal(e) {
  if (e && e.target !== document.getElementById('correoModal')) return;
  document.getElementById('correoModal').classList.remove('open');
}

// ── Guardar / Editar ──
async function saveCorreo() {
  const titulo        = document.getElementById('correoTitulo').value.trim();
  const destinatarios = document.getElementById('correoDestinatarios').value.trim();
  const asunto        = document.getElementById('correoAsunto').value.trim();
  const mensaje       = document.getElementById('correoMensaje').value.trim();
  const editId        = document.getElementById('editCorreoId').value;

  if (!titulo) { alert('El título es obligatorio.'); return; }

  if (editId) {
    // Actualizar
    const { error } = await db.from('correos')
      .update({ titulo, destinatarios, asunto, mensaje })
      .eq('id', editId);
    if (error) { alert('Error al guardar.'); return; }

    // Actualizar DOM
    const li = document.querySelector(`.correo-item[data-id="${editId}"]`);
    if (li) {
      li.querySelector('.correo-item-title').textContent = titulo;
      li.querySelector('.open-btn').setAttribute('onclick',
        `abrirEnOutlook('${encodeData(destinatarios)}','${encodeData(asunto)}','${encodeData(mensaje)}')`);
    }
  } else {
    // Insertar
    const { data, error } = await db.from('correos')
      .insert([{ titulo, destinatarios, asunto, mensaje }]).select();
    if (error) { alert('Error. ¿Configuraste Supabase?'); return; }
    appendCorreoDOM(data[0].id, data[0].titulo, data[0].destinatarios, data[0].asunto, data[0].mensaje);
  }

  document.getElementById('correoModal').classList.remove('open');
}

// ── Editar: rellena el modal con datos existentes ──
async function editCorreo(id) {
  const { data, error } = await db.from('correos').select('*').eq('id', id).single();
  if (error || !data) return;

  document.getElementById('correoTitulo').value        = data.titulo        || '';
  document.getElementById('correoDestinatarios').value = data.destinatarios || '';
  document.getElementById('correoAsunto').value        = data.asunto        || '';
  document.getElementById('correoMensaje').value       = data.mensaje       || '';

  showCorreoModal(id);
}

// ── Eliminar ──
async function deleteCorreo(id, btn) {
  if (!confirm('¿Eliminar esta plantilla?')) return;
  await db.from('correos').delete().eq('id', id);
  btn.closest('.correo-item').remove();
}

// ── "Abrir en Outlook" desde el modal (previa al guardar) ──
function previewCorreo() {
  const destinatarios = document.getElementById('correoDestinatarios').value.trim();
  const asunto        = document.getElementById('correoAsunto').value.trim();
  const mensaje       = document.getElementById('correoMensaje').value.trim();
  abrirEnOutlook(destinatarios, asunto, mensaje);
}


// ─────────────────────────────────────────
// 9. CARDS DINÁMICAS (Supabase)
// ─────────────────────────────────────────
async function loadCards() {
  const { data, error } = await db.from('cards').select('*').order('created_at');
  if (error) { console.warn('Supabase cards:', error.message); return; }
  data.forEach(c => appendDynamicCardDOM(c.id, c.title, c.description, c.url, c.color));
}

function appendDynamicCardDOM(id, title, desc, url, color) {
  const addBtn = document.getElementById('addCardBtn');
  const card   = document.createElement('div');
  card.className   = `menu-card ${color}`;
  card.dataset.id  = id;
  card.dataset.url = url;
  card.onclick     = () => openLink(url);
  card.innerHTML   = `
    <div class="card-actions">
      <button class="card-btn-edit" onclick="editDynamicCard(event,${id})">
        <i class="fa-solid fa-pen"></i>
      </button>
      <button class="card-btn-del" onclick="deleteDynamicCard(event,${id},this)">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="card-title ${color}-text">${title}</div>
    <div class="card-desc">${desc || ''}</div>
    <div class="card-arrow">→</div>`;
  document.getElementById('cardsGrid').insertBefore(card, addBtn);
}

async function deleteDynamicCard(e, id, btn) {
  e.stopPropagation();
  if (!confirm('¿Eliminar este enlace?')) return;
  await db.from('cards').delete().eq('id', id);
  btn.closest('.menu-card').remove();
}

async function editDynamicCard(e, id) {
  e.stopPropagation();
  const card    = document.querySelector(`.menu-card[data-id="${id}"]`);
  const title   = card.querySelector('.card-title').textContent;
  const desc    = card.querySelector('.card-desc').textContent;
  const url     = card.dataset.url;
  const color   = [...card.classList].find(c => ['purple','blue','teal','amber','pink','green'].includes(c));

  document.getElementById('modalTitle').textContent   = 'Editar enlace';
  document.getElementById('modalSaveBtn').textContent = 'Guardar cambios';
  document.getElementById('editCardId').value   = id;
  document.getElementById('newCardTitle').value = title;
  document.getElementById('newCardDesc').value  = desc;
  document.getElementById('newCardUrl').value   = url;
  document.getElementById('cardModal')._staticCardEl = null;
  selectColorByValue(color);
  document.getElementById('cardModal').classList.add('open');
}


// ─────────────────────────────────────────
// 10. EDITAR / ELIMINAR CARDS ESTÁTICAS
// ─────────────────────────────────────────
function editStaticCard(e, btn) {
  e.stopPropagation();
  const card      = btn.closest('.menu-card');
  const titleEl   = card.querySelector('.card-title');
  const descEl    = card.querySelector('.card-desc');
  const colorClass = [...card.classList].find(c =>
    ['purple','blue','teal','amber','pink','green'].includes(c)) || 'purple';
  const onclickStr = card.getAttribute('onclick') || '';
  const urlMatch   = onclickStr.match(/openLink\('([^']+)'\)/);
  const currentUrl = urlMatch ? urlMatch[1] : '';

  document.getElementById('modalTitle').textContent   = 'Editar enlace';
  document.getElementById('modalSaveBtn').textContent = 'Guardar cambios';
  document.getElementById('editCardId').value   = '';
  document.getElementById('newCardTitle').value = titleEl.textContent;
  document.getElementById('newCardDesc').value  = descEl.textContent;
  document.getElementById('newCardUrl').value   = currentUrl;
  document.getElementById('cardModal')._staticCardEl = card;

  selectColorByValue(colorClass);
  document.getElementById('cardModal').classList.add('open');
}

function deleteStaticCard(e, btn) {
  e.stopPropagation();
  if (!confirm('¿Eliminar este enlace?')) return;
  btn.closest('.menu-card').remove();
}


// ─────────────────────────────────────────
// 11. MODAL CARDS — ABRIR / CERRAR / GUARDAR
// ─────────────────────────────────────────
function showAddCardModal() {
  document.getElementById('modalTitle').textContent   = 'Nuevo enlace';
  document.getElementById('modalSaveBtn').textContent = 'Guardar enlace';
  document.getElementById('editCardId').value   = '';
  document.getElementById('newCardTitle').value = '';
  document.getElementById('newCardDesc').value  = '';
  document.getElementById('newCardUrl').value   = '';
  document.getElementById('cardModal')._staticCardEl = null;
  selectColorByValue('purple');
  document.getElementById('cardModal').classList.add('open');
}

function closeCardModal(e) {
  if (e && e.target !== document.getElementById('cardModal')) return;
  document.getElementById('cardModal').classList.remove('open');
}

async function saveCard() {
  const title   = document.getElementById('newCardTitle').value.trim();
  const desc    = document.getElementById('newCardDesc').value.trim();
  const url     = document.getElementById('newCardUrl').value.trim();
  const color   = document.querySelector('.color-dot.selected')?.dataset.color || 'purple';
  const editId  = document.getElementById('editCardId').value;
  const modal   = document.getElementById('cardModal');

  if (!title || !url) { alert('El título y la URL son obligatorios.'); return; }

  // Card estática — solo DOM
  if (!editId && modal._staticCardEl) {
    const card    = modal._staticCardEl;
    const titleEl = card.querySelector('.card-title');
    const descEl  = card.querySelector('.card-desc');
    titleEl.textContent = title;
    titleEl.className   = `card-title ${color}-text`;
    descEl.textContent  = desc;
    card.className      = card.className.replace(/\b(purple|blue|teal|amber|pink|green)\b/, color);
    card.setAttribute('onclick', `openLink('${url}')`);
    modal._staticCardEl = null;
    modal.classList.remove('open');
    return;
  }

  // Card dinámica — editar en Supabase
  if (editId) {
    const { error } = await db.from('cards').update({ title, description: desc, url, color }).eq('id', editId);
    if (error) { alert('Error al guardar.'); return; }
    const card    = document.querySelector(`.menu-card[data-id="${editId}"]`);
    const titleEl = card.querySelector('.card-title');
    const descEl  = card.querySelector('.card-desc');
    titleEl.textContent = title;
    titleEl.className   = `card-title ${color}-text`;
    descEl.textContent  = desc;
    card.dataset.url    = url;
    card.className      = card.className.replace(/\b(purple|blue|teal|amber|pink|green)\b/, color);
    card.onclick        = () => openLink(url);
    modal.classList.remove('open');
    return;
  }

  // Card nueva — insertar en Supabase
  const { data, error } = await db.from('cards').insert([{ title, description: desc, url, color }]).select();
  if (error) { alert('Error. ¿Configuraste Supabase?'); return; }
  appendDynamicCardDOM(data[0].id, data[0].title, data[0].desc, data[0].url, data[0].color);
  modal.classList.remove('open');
}


// ─────────────────────────────────────────
// 12. SELECTOR DE COLOR
// ─────────────────────────────────────────
function selectColor(dot) {
  document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('selected'));
  dot.classList.add('selected');
}

function selectColorByValue(color) {
  document.querySelectorAll('.color-dot').forEach(d => {
    d.classList.toggle('selected', d.dataset.color === color);
  });
}


// ─────────────────────────────────────────
// 13. INICIALIZAR
// ─────────────────────────────────────────
async function init() {
  await Promise.all([
    loadPendientes(),
    loadContactos(),
    loadTrackings(),
    loadCorreos(),
    loadCards()
  ]);
}

init();
