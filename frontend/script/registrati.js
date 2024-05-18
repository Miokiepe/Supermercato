const registrati = document.querySelector('#registrati')
registrati.addEventListener('click', () => {
    const 
     nome = document.querySelector('#nome').value,
     cognome = document.querySelector('#cognome').value,
     email = document.querySelector('#email').value,
     prefisso = document.querySelector('#prefisso').value,
     numero = document.querySelector('#numero').value,
     genere = document.querySelector('#genere').value

     console.log(nome,cognome,email,prefisso,numero,genere)
})