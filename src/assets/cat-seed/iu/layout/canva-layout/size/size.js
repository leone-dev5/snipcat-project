canvas.height = 1080;
canvas.width = 1080;

const CONFIG_PS_STYLE = {
  
  CANONICAL_SIZE: 600,
  PADDING_VISUAL: 40,
  SCALE_MAX: 1.0,
  SCALE_MIN: 0.1,
  PRESERVE_PROPORTION: true   
  
};

/**
 * Calcula escala estilo Photoshop - mantém tamanho canônico confortável
 * @param {number} widhtDoc - Largura do documento
 * @param {number} heightDoc - Altura do documento
 * @returns {number} Escala calculada
 */
function CalcutorScale(widhtDoc, heightDoc) {

  const largerSide  = Math.max(widhtDoc, heightDoc);
  
  if (largerSide <= CONFIG_PS_STYLE.CANONICAL_SIZE) {
    return CONFIG_PS_STYLE.SCALE_MAX;
  }
  
  let scale = CONFIG_PS_STYLE.CANONICAL_SIZE / largerSide;
  
  const SCALE_PADDING = scale * 0.5;
  
  return Math.max(
    CONFIG_PS_STYLE.SCALE_MIN,
    Math.min(SCALE_PADDING, CONFIG_PS_STYLE.SCALE_MAX)
  );
}


function applyScale() {
  
  const scale = CalcutorScale(canvas.width, canvas.height);
  
  canvas.style.transform = `scale(${scale})`;
  canvas.style.transformOrigin = 'center center';
  
}

function ZoomStability() {

  canvas.style.transform = `scale(${CONFIG_PS_STYLE.SCALE_MAX})`;
}

function AdjustmentStabily() {
  
  const viewportWidth = window.innerWidth - CONFIG_PS_STYLE.PADDING_VISUAL * 2;
  
  const viewportHeight = window.innerHeight - CONFIG_PS_STYLE.PADDING_VISUAL * 2;
  
  const escalaX = viewportWidth / canvas.width;
  const escalaY = viewportHeight / canvas.height;
  
  const escala = Math.min(escalaX, escalaY) * 0.9; 
  
  const SCALE_LIMIT = Math.max(
    CONFIG_PS_STYLE.SCALE_MIN,
    Math.min(escala, CONFIG_PS_STYLE.SCALE_MAX)
  );
  
  canvas.style.transform = `scale(${SCALE_LIMIT})`;
}

// Inicialização
applyScale();

let resizeTimeout;

window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(applyScale, 100);
});

applyScale();
ZoomStability();
AdjustmentStabily();