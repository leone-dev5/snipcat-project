document.getElementById("save-button").addEventListener("click", () => {
  canvas.toBlob((blob) => {
    const link = document.createElement("a");
    
    link.download = "catseed-views-" + keySign + ".png";
    
    link.href = URL.createObjectURL(blob);
    link.click();
    
    URL.revokeObjectURL(link.href);
    
    alert("Arquivo Salvo ✅")
  }, "image/png");
});