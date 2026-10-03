const scenarios = [
  ['The Hour Foretold','Meaning','transform',.58,.64],['The Fire That We Prepared','Stewardship','response',.72,.46],
  ['The Invisible Conqueror','Health commons','recovery',.66,.61],['The Mind That Escaped','Kinship of minds','response',.69,.55],
  ['The Night of Broken Circuits','Materiality','buffer',.63,.59],['The Day the Systems Stopped','Local competence','buffer',.71,.52],
  ['The Collapse of Value','Worth','transform',.57,.68],['The Disassembly of Order','Self-government','response',.65,.49],
  ['The Death of Shared Reality','Recovery of inheritance','recovery',.74,.43],['The Planet Leaves Us','Earth belonging','transform',.79,.51],
  ['The Silence of the Living World','Attention','recovery',.76,.47],['The Sun’s Long Breath','Cosmic humility','buffer',.42,.36],
  ['The Falling Sky','Prepared wonder','buffer',.38,.57]
]
const ledger = document.querySelector('#ledger')
const render = (scope='global', lens='all') => {
  const local = scope === 'local'
  ledger.innerHTML = scenarios.filter(s => lens === 'all' || s[2] === lens).map(([name,capacity,type,pressure,base],i) => {
    const p = local ? Math.max(.12, pressure - .05 + ((i % 3) * .025)) : pressure
    const c = local ? Math.min(.9, base + ((i % 4) * .035)) : base
    return `<div class="ledger-row"><div class="scenario">${String(i+1).padStart(2,'0')} / ${name}<small>${capacity}</small></div><div class="metric"><b>${p.toFixed(2)}</b><span class="bar"><i style="width:${p*100}%"></i></span></div><div class="metric"><b>${c.toFixed(2)}</b><span class="bar capacity"><i style="width:${c*100}%"></i></span></div><div class="field">${local ? 'LOCAL / illustrative' : 'GLOBAL / illustrative'}<small>${type}</small></div></div>`
  }).join('')
}
let scope='global'
render()
document.querySelectorAll('.scope').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.scope').forEach(b=>b.classList.remove('active')); button.classList.add('active'); scope=button.dataset.scope; render(scope,document.querySelector('#lens').value) }))
document.querySelector('#lens').addEventListener('change', event => render(scope,event.target.value))
