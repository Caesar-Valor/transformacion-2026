// ─────────────────────────────────────────
//  LOCALSTORAGE — Guardar progreso
// ─────────────────────────────────────────

// Al cargar la página, recupera las tareas guardadas
document.addEventListener('DOMContentLoaded', function () {
  cargarProgreso();
});

// Guarda el índice de cada tarea completada en localStorage
function guardarProgreso() {
  const tareas = document.querySelectorAll('.task');
  const estado = [];

  tareas.forEach(function (tarea, indice) {
    estado[indice] = tarea.classList.contains('done');
  });

  // Guarda el array en localStorage como texto
  localStorage.setItem('progreso-transformacion', JSON.stringify(estado));
}

// Lee el localStorage y restaura las tareas completadas
function cargarProgreso() {
  const guardado = localStorage.getItem('progreso-transformacion');

  // Si no hay nada guardado, no hace nada
  if (!guardado) return;

  const estado = JSON.parse(guardado);
  const tareas = document.querySelectorAll('.task');

  tareas.forEach(function (tarea, indice) {
    if (estado[indice] === true) {
      tarea.classList.add('done');
      const check = tarea.querySelector('.check');
      if (check) {
        check.style.borderColor = 'var(--accent-en)';
        check.style.background = 'var(--accent-en)';
      }
    }
  });

  // Actualiza todas las barras de progreso
  document.querySelectorAll('.card').forEach(function (card) {
    updateProgress(card);
  });
}

// ─────────────────────────────────────────
//  TABS — Filtrar por trimestre
// ─────────────────────────────────────────

function filterCards(q, btn) {
  document.querySelectorAll('.tab').forEach(function (t) {
    t.classList.remove('active');
  });
  btn.classList.add('active');

  document.querySelectorAll('.card').forEach(function (c) {
    if (q === 'all' || c.dataset.q === q) {
      c.classList.add('visible');
    } else {
      c.classList.remove('visible');
    }
  });
}

// ─────────────────────────────────────────
//  TAREAS — Marcar / desmarcar
// ─────────────────────────────────────────

function toggleTask(e, el) {
  e.stopPropagation();
  el.classList.toggle('done');

  // Actualiza la barra de progreso de la card
  const card = el.closest('.card');
  if (card) updateProgress(card);

  // Guarda el nuevo estado en localStorage
  guardarProgreso();
}

function updateProgress(card) {
  const tareas = card.querySelectorAll('.task');
  const hechas = card.querySelectorAll('.task.done').length;
  const porcentaje = tareas.length ? (hechas / tareas.length) * 100 : 0;
  const fill = card.querySelector('.progress-fill');
  if (fill) fill.style.width = porcentaje + '%';
}

// ─────────────────────────────────────────
//  MODAL — Ver detalle del mes
// ─────────────────────────────────────────

const modalData = [
  { title: "Mes 1 · Cero Absoluto", quarter: "Q1 · Mar 2026", note: "Este mes es sobre comenzar, no sobre ser perfecto. La cadena importa más que la calidad todavía. Solo levántate a las 5 AM y sigue la rutina.", focus: "Rutina 5 AM arraigada · Guardia de boxeo natural · Primeras 500 palabras" },
  { title: "Mes 2 · Primer Golpe", quarter: "Q1 · Abr 2026", note: "El jab es el golpe más importante del boxeo. 100 jabs diarios frente al espejo. En inglés, Charlotte's Web terminado significa que ya eres lector en inglés.", focus: "100 jabs seguidos · Charlotte's Web completado · 1,000 palabras Anki" },
  { title: "Mes 3 · La Combinación Base", quarter: "Q1 · May 2026", note: "El 1-2 es la combinación madre del boxeo. Cuando la ejecutas en movimiento sin pensar, has cruzado el primer umbral real. Review trimestral Q1 este domingo.", focus: "Combinación 1-2 en movimiento · Puente de cuello estable · A2 temprano" },
  { title: "Mes 4 · La Esquiva", quarter: "Q2 · Jun 2026", note: "La defensa te distingue de alguien que solo golpea. El slip debe ser reflejo, no pensamiento. En código, el certificado freeCodeCamp es tu primer logro oficial.", focus: "Slip automático al ver jab · Band cuello sin molestia · A2 consolidado" },
  { title: "Mes 5 · El Gancho", quarter: "Q2 · Jul 2026", note: "El hook requiere rotación de cadera total. Si el codo no llega a 90°, no es hook. En inglés, el blog te fuerza a producir y no solo consumir.", focus: "Hook con rotación visible · Band 4 planos fluido · 3,000 palabras inglés" },
  { title: "Mes 6 · Revisión Semestral", quarter: "Q2 · Ago 2026", note: "Para aquí. Mide todo honestamente. Seis meses de consistencia ya te ponen en el top 5% de personas que empezaron igual que tú en marzo.", focus: "A2 sólido · 20+ proyectos GitHub · Cuello Fase 2 completa" },
  { title: "Mes 7 · Golpe Corto", quarter: "Q3 · Sep 2026", note: "El uppercut es el golpe de distancia corta. Empieza con las rodillas, no con el brazo. En programación, React cambia tu forma de pensar en interfaces.", focus: "React funcionando · Uppercut con piernas · Neck curl sin molestia" },
  { title: "Mes 8 · Defensa Activa", quarter: "Q3 · Oct 2026", note: "La defensa activa (roll + contraataque) convierte tu boxeo en algo fluido y peligroso. En inglés, cambiar el teléfono al inglés es inmersión real 24/7.", focus: "Roll + contraataque fluido · Cuello 3kg · Conversación 30+ min" },
  { title: "Mes 9 · Combinaciones Largas", quarter: "Q3 · Nov 2026", note: "B1 en inglés es el umbral de independencia. Ya puedes funcionar en el idioma. 30+ proyectos en GitHub cuentan una historia visible de progreso.", focus: "B1 inglés · Combo 5 golpes · Full-stack competente" },
  { title: "Mes 10 · Automatización", quarter: "Q4 · Dic 2026", note: "Shadow boxing 15 min sin pensar qué golpe sigue — ese es el momento en que el boxeo pasa del cerebro al cuerpo. La automatización es el objetivo real.", focus: "Shadow boxing automático 15 min · Docker+CI/CD · B2 inglés en ruta" },
  { title: "Mes 11 · Fluidez Total", quarter: "Q4 · Ene 2027", note: "Grabarte boxeando este mes y comparar con el mes 1: esa diferencia visual es la recompensa. En inglés, 60 minutos de conversación fluida es casi B2.", focus: "Conversación 60 min · Sesión boxeo fluida en video · Portfolio sólido" },
  { title: "Mes 12 · Fundamentos Sólidos", quarter: "Q4 · Feb 2027 · CIERRE AÑO 1", note: "6 rounds de shadow boxing con 4 golpes, esquivas y footwork automáticos. B2 entrada en inglés. 40–50 proyectos en GitHub. Esto es lo que 1 año consistente construye.", focus: "6 rounds boxeo automático · B2 entrada inglés · Full-stack listo · Identidad nueva" },
];

function openModal(idx) {
  const d = modalData[idx];
  document.getElementById('m-quarter').textContent = d.quarter;
  document.getElementById('m-title').textContent = d.title;
  document.getElementById('m-body').innerHTML = `
    <div class="modal-section">
      <h4>🎯 Meta clave del mes</h4>
      <p style="font-family:Literata,serif;font-style:italic;color:#b0b0d0;font-size:14px;line-height:1.7;background:var(--surface2);padding:16px 18px;border-radius:8px;border-left:3px solid var(--accent-en)">${d.focus}</p>
    </div>
    <div class="modal-section">
      <h4>💬 Reflexión del mes</h4>
      <p style="font-family:Literata,serif;color:#9090b8;font-size:13px;line-height:1.8">${d.note}</p>
    </div>
    <div class="modal-section">
      <h4>📋 Cómo usar esto en Notion</h4>
      <div class="task" style="background:var(--surface2);font-size:13px;pointer-events:none;border-radius:8px"><span>→</span>&nbsp;Crea una página de base de datos por mes</div>
      <div class="task" style="background:var(--surface2);font-size:13px;pointer-events:none;border-radius:8px;margin-top:6px"><span>→</span>&nbsp;Marca cada tarea con estado: "Pendiente / En curso / ✓ Hecho"</div>
      <div class="task" style="background:var(--surface2);font-size:13px;pointer-events:none;border-radius:8px;margin-top:6px"><span>→</span>&nbsp;Agrega columna de "Evidencia" (link video, screenshot, nota)</div>
      <div class="task" style="background:var(--surface2);font-size:13px;pointer-events:none;border-radius:8px;margin-top:6px"><span>→</span>&nbsp;Revisa cada domingo con el template semanal</div>
    </div>
  `;
  document.getElementById('overlay').classList.add('open');
}

function closeModal(e) {
  if (e.target === document.getElementById('overlay')) closeModalDirect();
}

function closeModalDirect() {
  document.getElementById('overlay').classList.remove('open');
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModalDirect();
});