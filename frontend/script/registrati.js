import { prefixes } from "../Components/data.js"
const registrati = document.querySelector('#registrati')
const error = document.querySelector('#message')

const prefisso = document.querySelector('#prefisso')
prefixes.forEach(prefix => {
    const opt = document.createElement('option')
    opt.value = prefix.prefisso
    opt.innerHTML =prefix.emoji +  " +" + prefix.prefisso
    prefisso.appendChild(opt)
})

registrati.addEventListener('click', () => {
    const 
     nome = document.querySelector('#nome').value,
     cognome = document.querySelector('#cognome').value,
     email = document.querySelector('#email').value,
     password = document.querySelector('#password').value,
     numero = document.querySelector('#numero').value,
     genere = document.querySelector('#genere').value,
     citta = document.querySelector('#città').value,
     cap = document.querySelector('#cap').value,
     via = document.querySelector('#via').value
     registrati.disabled = true;
     if(!nome || !cognome || !email || !password || !numero || genere == 0 || !citta || !cap || !via) {
            error.style.display = 'block'
            error.innerHTML = "Uno o più campi vuoti"
            registrati.disabled = false;
            return;
     }
     fetch('http://localhost:5000/api/create_account',{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_utente: 0,
            nome: nome,
            cognome: cognome,
            email: email,
            password: password,
            prefisso: prefisso.value, 
            numero: numero,
            genere: genere,
            città: citta,
            cap: cap,
            via: via
        })
     }).then(res => {
        if(res.status == 409) {
            error.style.display = 'block'
            error.innerHTML = "La mail risulta già registrata. Accedi"
            return;
        }
        setTimeout(()=>{
            error.className = 'alert alert-success'
            error.style.display = 'block'
            error.innerHTML = "Account creato! Clicca su 'accedi'"
        },2500);
     }).catch(res => {
        error.style.display = 'block';
        registrati.disabled = false;
     })
})