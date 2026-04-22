function positionLog() {
  
  const posX = document.getElementById("position-x");
  
  const posY = document.getElementById("position-y");
  
  const rotatePs = document.getElementById("rotatePos");
  
  const counterH = document.getElementById("counter-height");
  
  const counterW = document.getElementById("counter-widht");

  
  AppState.layers.forEach((layer, index) => {
    
    posX.value = Math.round(layer.x);
    posY.value = Math.round(layer.y);
    rotatePs.value = Math.round(layer.rotation * 180 / Math.PI);
    counterH.value = Math.round(layer.height);
    
    counterW.value = Math.round(layer.width);
  });
  
}

function clearMove() {
  document.getElementById("move-info").style.display = "flex";
}

buttonOn.addEventListener('click', clearMove);

setInterval(positionLog, 100);