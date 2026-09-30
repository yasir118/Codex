const model = document.getElementById('model');
const wrap = document.getElementById('modelWrap');
const title = document.getElementById('panelTitle');
const copy = document.getElementById('panelCopy');
const viewSelect = document.getElementById('viewSelect');
const chapters = [...document.querySelectorAll('.chapter')];
const views = {
  overview: { rx: 58, rz: -26, title: 'A house drawn<br>by the land.', copy: 'A low, circular profile follows the fall of the mountain, offering a different horizon from every room.' },
  terraces: { rx: 64, rz: -7, title: 'Three levels,<br>one landscape.', copy: 'Cascading rooms step lightly down the slope, gathering around planted terraces and a sheltered court.' },
  screen: { rx: 49, rz: -49, title: 'A breathing<br>timber veil.', copy: 'Fine vertical fins temper the alpine sun and create a soft, changing rhythm along the glazed façade.' },
  roof: { rx: 79, rz: -18, title: 'A roof made<br>for the ridge.', copy: 'Native planting carries the mountain meadow across every horizontal surface, cooling the house below.' },
  pavilion: { rx: 52, rz: 13, title: 'The quiet<br>lookout.', copy: 'A raised, glass-wrapped pavilion gives the studio its own horizon above the living terraces.' }
};
function setView(name) {
  const view = views[name]; if (!view) return;
  model.style.setProperty('--rx', view.rx + 'deg'); model.style.setProperty('--rz', view.rz + 'deg');
  title.innerHTML = view.title; copy.textContent = view.copy; viewSelect.value = name;
  chapters.forEach(c => c.classList.toggle('active', c.dataset.focus === name));
}
chapters.forEach(button => button.addEventListener('click', () => setView(button.dataset.focus)));
document.querySelectorAll('[data-focus]').forEach(button => { if (!button.classList.contains('chapter')) button.addEventListener('click', () => setView(button.dataset.focus)); });
viewSelect.addEventListener('change', e => setView(e.target.value));
document.getElementById('reset').addEventListener('click', () => setView('overview'));
document.getElementById('wireframe').addEventListener('click', e => { document.body.classList.toggle('wireframe'); e.currentTarget.classList.toggle('selected'); });
document.getElementById('fullscreen').addEventListener('click', () => document.documentElement.requestFullscreen?.());
let dragging = false, startX, startY, baseX, baseZ;
wrap.addEventListener('pointerdown', e => { dragging=true; startX=e.clientX; startY=e.clientY; baseX=parseFloat(getComputedStyle(model).getPropertyValue('--rx')); baseZ=parseFloat(getComputedStyle(model).getPropertyValue('--rz')); wrap.setPointerCapture(e.pointerId); model.style.transition='none'; });
wrap.addEventListener('pointermove', e => { if(!dragging) return; model.style.setProperty('--rz', (baseZ+(e.clientX-startX)*.22)+'deg'); model.style.setProperty('--rx', Math.max(35,Math.min(78,baseX-(e.clientY-startY)*.14))+'deg'); });
wrap.addEventListener('pointerup', () => { dragging=false; model.style.transition='transform .65s cubic-bezier(.2,.8,.2,1)'; });
wrap.addEventListener('wheel', e => { e.preventDefault(); const current = model.dataset.scale ? +model.dataset.scale : 1; const scale=Math.max(.65,Math.min(1.25,current-e.deltaY*.0007)); model.dataset.scale=scale; model.style.scale=scale; }, {passive:false});
