const color_1 = document.getElementById("painter-black");

const color_2 = document.getElementById("painter-white");

const inputBlack = document.createElement("input");

inputBlack.type = "color";
inputBlack.style.display = "none";

color_1.appendChild(inputBlack);

color_1.addEventListener('click', ()=>{
  inputBlack.click();
});

const inputWhite = document.createElement("input")

inputWhite.type = "color";
inputWhite.style.display = "none";

color_2.appendChild(inputWhite);

color_2.addEventListener('click', ()=>{
  inputWhite.click();
})

color_1.addEventListener('input', ()=>{
  color_1.style.background = inputBlack.value;
})
color_2.addEventListener('input', ()=>{
  color_2.style.background = inputWhite.value;
})