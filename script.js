const scenarios = [
  ['The Hour Foretold','Meaning','transform'],['The Fire That We Prepared','Stewardship','response'],
  ['The Invisible Conqueror','Health commons','recovery'],['The Mind That Escaped','Kinship of minds','response'],
  ['The Night of Broken Circuits','Materiality','buffer'],['The Day the Systems Stopped','Local competence','buffer'],
  ['The Collapse of Value','Worth','transform'],['The Disassembly of Order','Self-government','response'],
  ['The Death of Shared Reality','Recovery of inheritance','recovery'],['The Planet Leaves Us','Earth belonging','transform'],
  ['The Silence of the Living World','Attention','recovery'],['The Sun’s Long Breath','Cosmic humility','buffer'],
  ['The Falling Sky','Prepared wonder','buffer']
]
const ledger = document.querySelector('#ledger')
const render = (scope='global', lens='all') => {
  ledger.innerHTML = scenarios.filter(s => lens === 'all' || s[2] === lens).map(([name,capacity,type],i) => {
    return `<div class="ledger-row"><div class="scenario">${String(scenarios.indexOf(scenarios.find(s => s[0] === name))+1).padStart(2,'0')} / ${name}<small>${capacity}</small></div><div class="metric unavailable"><b>—</b><span class="bar"><i style="width:0%"></i></span></div><div class="metric unavailable"><b>—</b><span class="bar capacity"><i style="width:0%"></i></span></div><div class="field">${scope.toUpperCase()} / awaiting source<small>${type}</small></div></div>`
  }).join('')
}
let scope='global'
render()
document.querySelectorAll('.scope').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.scope').forEach(b=>b.classList.remove('active')); button.classList.add('active'); scope=button.dataset.scope; render(scope,document.querySelector('#lens').value) }))
document.querySelector('#lens').addEventListener('change', event => render(scope,event.target.value))
