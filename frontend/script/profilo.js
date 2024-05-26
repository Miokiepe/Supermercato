const iconEye = document.querySelector('#toggle')
const error = document.querySelector('#error')
const modifica = document.querySelector('#modifica')
iconEye.addEventListener('click',()=>{
        if(password.type === "password") {
            password.type = "text"
            iconEye.innerHTML = '<i class="bi bi-eye"></i>'
        }
        else {
            password.type = "password"
            iconEye.innerHTML = '<i class="bi bi-eye-slash"></i>'
        }
})

const IDs = ["nome","cognome","città","cap","via","genere","prefisso","numero","email"]

modifica.addEventListener('click',() => {
    if(modifica.innerHTML.includes("Modifica")) {
        IDs.forEach(elem => document.querySelector('#' + elem).disabled = false)
        modifica.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Salva'
    }
    else {
        //Esegui la richiesta per aggiornare l'account
        modifica.innerHTML = '<i class="fa-solid fa-pen"></i> Modifica'
    }
})

fetch('http://localhost:5000/api/get_account',{
    method: "POST",
    headers: {
         'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: localStorage.getItem('email'),
        password: localStorage.getItem('password'),
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role')
    })
}).then(res => res.json()).then(res => {
    console.log(res)
    IDs.forEach(elem => {
        const a = document.querySelector('#' + elem)
        if(a) a.value = res.user[elem]
    })
}).catch((e) => {
    console.log(e)
    error.style.display = "block"
    error.innerHTML = "Impossibile connettersi al server"
})
