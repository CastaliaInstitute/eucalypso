document.querySelectorAll('.note').forEach((note) => {
  note.addEventListener('click', () => {
    const open = note.getAttribute('aria-expanded') === 'true'
    note.setAttribute('aria-expanded', String(!open))
  })
})
