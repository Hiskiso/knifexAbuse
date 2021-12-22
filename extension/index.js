window.onload = ()=>{
    window.temp = document.querySelector("#g-recaptcha-response").value

setInterval(()=>{
if(window.temp != document.querySelector("#g-recaptcha-response").value){
console.log(document.querySelector("#g-recaptcha-response").value)
window.temp = document.querySelector("#g-recaptcha-response").value
}}, 1000)
}