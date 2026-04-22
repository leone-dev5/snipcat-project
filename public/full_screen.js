const activeFull = document.getElementById("fullScreen");

activeFull.addEventListener("click", () => {
  const doc = document.documentElement;

  const request = doc.requestFullscreen || doc.webkitRequestFullscreen || doc.mozRequestFullScreen || doc.msRequestFullscreen;
  
  const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;

  if (!request) {
    console.error("Tela cheia não suportada neste navegador");
    return;
  }

  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  ) {
    exit.call(document);
    activeFull.textContent = "Expandir";
  }
  
  else {
    request.call(doc); 
    activeFull.textContent = "Sair";
  }
  
});