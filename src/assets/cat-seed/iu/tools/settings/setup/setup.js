const confirmMemory = document.getElementById("metric-lines");

confirmMemory.addEventListener('change', () => {
  
  if (confirmMemory.checked) {
    localStorage.setItem('linesOn', 'true');
    console.log("Ligado");
  }
  
  else {
    localStorage.setItem('linesOn', 'false');
    console.log("Desativado");
  }
  
});