let infoFlie = "Algo deu errado ao carrega parte algum arquivo";

async function loadJSON(path) {
  const res = await fetch(path);
  return await res.json();
}

async function retry(fn, attempts = 1) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts - 1) throw err;
    }
  }
}

function withTimeout(promise, time) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timeout")), time);
    
    promise
      .then(res => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function loadCSS(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    
    link.onload = () => resolve(href);
    link.onerror = () => reject(new Error(infoFlie));
    
    document.head.appendChild(link);
  });
}

function loadJS(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    
    script.onload = () => resolve(src);
    script.onerror = () => reject(new Error("infoFlie"));
    
    document.body.appendChild(script);
  });
}

async function loadFiles() {
  const config = await loadJSON("files.json");
  
  for (const file of config.files) {
    const attempts = file.retry || config.config.retry || 1;
    const timeout = config.config.timeout || 0;
    
    try {
      let loadFn = () => {
        if (file.type === "css") return loadCSS(file.path);
        if (file.type === "js") return loadJS(file.path);
      };
      
      let promise = retry(loadFn, attempts);
      
      if (timeout > 0) {
        promise = withTimeout(promise, timeout);
      }
      
      await promise;
      
      console.log("Carregado:", file.path);
      
    }
    catch (err) {
      console.error("Erro:", file.path);
      
      // fallback
      if (file.fallback) {
        console.log("Tentando fallback:", file.fallback);
        
        try {
          if (file.type === "css") await loadCSS(file.fallback);
          if (file.type === "js") await loadJS(file.fallback);
          continue;
        } catch {
          console.error("Fallback falhou:", file.fallback);
        }
      }
      
      if (file.required && config.config.stopOnError) {
        console.error("Parando tudo por erro crítico ❌");
        break;
      }
    }
  }
  
  console.clear();
  console.info("%cEditor Inicializado!", "color: #00B0FF;");
}
loadFiles();

document.getElementById("save-button").addEventListener("click", () => {
  canvas.toBlob((blob) => {
    const link = document.createElement("a");
    
    const letras = "abcdefghijklmnopqrstuvwxyz"
    let palavra = ""
    
    for (let i = 0; i < 6; i++) {
       palavra += letras[Math.floor(Math.random() * letras.length)]
    }
    
    
    link.download = "catseed-views" + palavra + ".png";
    
    link.href = URL.createObjectURL(blob);
    link.click();
    
    URL.revokeObjectURL(link.href);
    
  }, "image/png");
});