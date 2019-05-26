const shortenerForm = document.querySelector('#shortener-form');
const originalUrlInput = document.querySelector('#original-url-input');
const hintMessage = document.querySelector('#hint-message');

shortenerForm.addEventListener('submit', e => {
  if (originalUrlInput.value === '') {
    e.preventDefault()
    hintMessage.classList.remove('d-none')
    hintMessage.innerHTML = 'Reminder：請優先輸入原始網址優！'
  }
})