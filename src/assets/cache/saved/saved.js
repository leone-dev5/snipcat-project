window.addEventListener('DOMContentLoaded', () => {
  const linesOn = localStorage.getItem('linesOn');
  confirmMemory.checked = linesOn === 'true';
});

