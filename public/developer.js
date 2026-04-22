function developer(){
  alert("👩🏻‍💻 Em desenvolvimento...");
}

const permissive = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];

input.addEventListener('change', (event) => {
  const archives = Array.from(event.target.files);
  
  for (let archive of archives) {
    const nome = archive.name.toLowerCase();
    const valido = permissive.some(ext => nome.endsWith(ext));
    
    if (!valido) {
      alert(`O arquivo "${archive.name}" não é suportado pelo editor`);
      
      input.value = '';
      break;
    }
  }
});