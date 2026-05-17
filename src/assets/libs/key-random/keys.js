const caracter = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

let keySign = "";

for (let i = 0; i < 20; i++) {
  keySign += caracter[Math.floor(Math.random() * caracter.length)]
}