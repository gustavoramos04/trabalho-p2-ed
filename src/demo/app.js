// Simulador de Heap: cada operação gera uma fila de "passos" (snapshots) exibidos um a um.
let modo = 'min', model = [], cur = { arr: [], hi: [] }, fila = [], cmp = 0, swp = 0, timer = null;
const $ = id => document.getElementById(id);
const antes = (a, b) => modo === 'min' ? a < b : a > b;
const reg = (hi, msg, dc = 0, ds = 0) => fila.push({ arr: [...model], hi, msg, dc, ds });

function inserir(v) {
  model.push(v); let i = model.length - 1;
  reg([i], `insert(${v}): coloca no fim, índice ${i}.`);
  while (i > 0) {
    const p = (i - 1) >> 1;
    reg([i, p], `Compara filho [${i}]=${model[i]} com pai [${p}]=${model[p]}.`, 1);
    if (!antes(model[i], model[p])) { reg([i], 'Propriedade do heap satisfeita. Fim do sift-up.'); return; }
    [model[i], model[p]] = [model[p], model[i]];
    reg([p, i], `Troca (sift-up): ${model[p]} sobe para o índice ${p}.`, 0, 1);
    i = p;
  }
  reg([0], 'Chegou à raiz. Fim do sift-up.');
}

function extrair() {
  if (!model.length) { reg([], 'Heap vazio: nada a extrair.'); return; }
  const topo = model[0], ultimo = model.pop();
  if (!model.length) { reg([], `extract(): removeu ${topo}. Heap vazio.`); return; }
  model[0] = ultimo;
  reg([0], `extract(): raiz ${topo} removida; último valor (${ultimo}) vai para a raiz.`);
  let i = 0; const n = model.length;
  while (true) {
    const l = 2 * i + 1, r = 2 * i + 2; let s = i;
    if (l < n) { reg([i, l], `Compara [${i}]=${model[i]} com esquerdo [${l}]=${model[l]}.`, 1); if (antes(model[l], model[s])) s = l; }
    if (r < n) { reg([s, r], `Compara [${s}]=${model[s]} com direito [${r}]=${model[r]}.`, 1); if (antes(model[r], model[s])) s = r; }
    if (s === i) { reg([i], 'Posição correta. Fim do sift-down.'); return; }
    [model[i], model[s]] = [model[s], model[i]];
    reg([i, s], `Troca (sift-down): ${model[i]} sobe, o valor desce para o índice ${s}.`, 0, 1);
    i = s;
  }
}

function passo() {
  const s = fila.shift();
  if (!s) { pausar(); return; }
  cur = s; cmp += s.dc; swp += s.ds;
  const li = document.createElement('li'); li.textContent = s.msg; $('log').prepend(li);
  desenhar(); $('msg').textContent = s.msg;
}
function executar() { if (!timer) timer = setInterval(passo, 700); }
function pausar() { clearInterval(timer); timer = null; }
function reiniciar() {
  pausar(); model = []; fila = []; cur = { arr: [], hi: [] }; cmp = swp = 0;
  $('log').innerHTML = ''; $('msg').textContent = 'Heap reiniciado.'; desenhar();
}

function desenhar() {
  const a = cur.arr, svg = $('arvore'); let h = '';
  const pos = i => { const nv = Math.floor(Math.log2(i + 1)), k = i - (2 ** nv - 1); return [(k + .5) / 2 ** nv * 600, 30 + nv * 62]; };
  a.forEach((_, i) => { if (i) { const [x1, y1] = pos(i), [x2, y2] = pos((i - 1) >> 1); h += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; } });
  a.forEach((v, i) => { const [x, y] = pos(i); h += `<circle cx="${x}" cy="${y}" r="20" class="${cur.hi.includes(i) ? 'hi' : ''}"/><text x="${x}" y="${y}">${v}</text>`; });
  svg.innerHTML = h;
  $('array').innerHTML = a.map((v, i) => `<div class="cel ${cur.hi.includes(i) ? 'hi' : ''}">${v}<small>[${i}]</small></div>`).join('');
  $('mCmp').textContent = cmp; $('mSwp').textContent = swp; $('mTam').textContent = a.length; $('mPend').textContent = fila.length;
}

function cenario(valores) { reiniciar(); valores.forEach(inserir); $('msg').textContent = 'Cenário carregado. Use Próximo passo ou Executar.'; desenhar(); }
$('cMedio').onclick = () => cenario([42, 17, 63, 8, 25, 51, 30, 4, 19, 36]);
$('cPior').onclick = () => cenario(modo === 'min' ? [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
$('bIns').onclick = () => {
  const v = parseInt($('valor').value, 10);
  if (isNaN(v)) { $('msg').textContent = 'Digite um número inteiro para inserir.'; return; }
  if (model.length >= 15) { $('msg').textContent = 'Limite de 15 nós para caber na tela.'; return; }
  inserir(v); $('valor').value = ''; desenhar();
};
$('bExt').onclick = () => { extrair(); desenhar(); };
$('bPeek').onclick = () => { reg(model.length ? [0] : [], model.length ? `peek(): a raiz é ${model[0]}. Custo O(1).` : 'Heap vazio.'); desenhar(); };
$('bPlay').onclick = executar; $('bPause').onclick = pausar; $('bStep').onclick = passo; $('bReset').onclick = reiniciar;
document.querySelectorAll('#modo button').forEach(b => b.onclick = () => {
  modo = b.dataset.m; document.querySelectorAll('#modo button').forEach(x => x.classList.toggle('on', x === b)); reiniciar();
});
desenhar();
