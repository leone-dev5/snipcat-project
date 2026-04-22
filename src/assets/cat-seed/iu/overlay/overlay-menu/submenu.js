function closeAllMenus() {
  document.querySelectorAll(".context-menu, .context-menu-right, .context-menu-top").forEach(menu => {
    menu.style.display = "none";
  });
}

function positionMenuIntelligently(menu, btn, preferredPosition = 'bottom') {
  const btnRect = btn.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const spacing = 10;
  let top, left;
  
  switch (preferredPosition) {
    case 'right':
      
      left = btnRect.right + spacing;
      top = btnRect.top;
    
      if (left + menuRect.width > viewportWidth) {
        left = btnRect.left - menuRect.width - spacing;
      }
      
      break;
      
    case 'left':
      
      left = btnRect.left - menuRect.width - spacing;
      top = btnRect.top;
      
      if (left < 0) {
        left = btnRect.right + spacing;
      }
      break;
      
    case 'bottom':
    default:

      top = btnRect.bottom + spacing;
      left = btnRect.left;
      

      if (top + menuRect.height > viewportHeight) {
        top = btnRect.top - menuRect.height - spacing;
      }
      
      if (left + menuRect.width > viewportWidth) {
        left = viewportWidth - menuRect.width - spacing;
      }
      
      if (left < 0) {
        left = spacing;
      }
      
      break;
  }
  
  top = Math.max(spacing, Math.min(top, viewportHeight - menuRect.height - spacing));
  left = Math.max(spacing, Math.min(left, viewportWidth - menuRect.width - spacing));
  
  menu.style.top = top + 'px';
  menu.style.left = left + 'px';
  menu.style.right = 'auto';
  menu.style.bottom = 'auto';
  
}

//document.querySelectorAll(".tool-btn").forEach((btn) => {
 // btn.addEventListener("click", (e) => {
//  e.stopPropagation();
    
//    const menu = btn.nextElementSibling;
//    const isMenuVisible = menu && menu.style.display === "block";
    
//    closeAllMenus();
    
//    if (menu && menu.classList.contains("context-menu") && !isMenuVisible) {
  //    menu.style.display = "block";
      
//      setTimeout(() => positionMenuIntelligently(menu, btn, 'right'), 10);
//    }
//  });
//});

//document.querySelectorAll(".tool-btn-right").forEach((btn) => {
// btn.addEventListener("click", (e) => {
//  e.stopPropagation();
    
//  const menu = btn.nextElementSibling;
//  const isMenuVisible = menu && menu.style.display === "block";
    
//closeAllMenus();
    
//  if (menu && menu.classList.contains("context-menu-right") && !isMenuVisible) {
//  menu.style.display = "block";
      

//   setTimeout(() => positionMenuIntelligently(menu, btn, 'left'), 10);
//  }
//  });
///});


document.querySelectorAll(".btn-top").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    
    const menu = btn.nextElementSibling;
    const isMenuVisible = menu && menu.style.display === "block";
    
    closeAllMenus();
    

    if (menu && menu.classList.contains("context-menu-top") && !isMenuVisible) {
      menu.style.display = "block";
      
      setTimeout(() => positionMenuIntelligently(menu, btn, 'bottom'), 10);
    }
  });
});

document.addEventListener("click", () => {
  closeAllMenus();
});

document.querySelectorAll(".context-menu, .context-menu-right, .context-menu-top").forEach(menu => {
  menu.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});

window.addEventListener('resize', () => {
  
  document.querySelectorAll(".context-menu[style*='display: block'], .context-menu-right[style*='display: block'], .context-menu-top[style*='display: block']").forEach(menu => {
    menu.style.display = 'none';
    
  });
});

const botoes = document.querySelectorAll(".tool-btn");

botoes.forEach(btn => {
  btn.addEventListener("click", () => {

    botoes.forEach(b => b.removeAttribute("data-selected"));
  
    btn.setAttribute("data-selected", "true");
  });
  
});