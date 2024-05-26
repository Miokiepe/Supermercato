const iconEye = document.querySelector('#toggle')
const error = document.querySelector('#error')
const modifica = document.querySelector('#modifica')
let old_user;
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
        let c = 0
        IDs.forEach(elem => document.querySelector('#' + elem).value === "" && c++)
        if(c != 0) {
            error.style.display = "block"
            error.innerHTML = "Uno o più campi sono vuoti!"
            return;
        }
        const new_user = {}
        IDs.forEach(elem => new_user[elem] = document.querySelector('#' + elem).value)
        new_user['password'] = document.querySelector('#password').value == "" ? old_user.password : document.querySelector('#password').value
        new_user['autenticato'] = old_user.autenticato
        new_user['id_utente'] = old_user.id_utente
        /*fetch('http://localhost:5000/api/update_account',{
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                old: old_user,
                new: new_user
            })
        }).then(() => location.reload())
          .catch(() => {
            error.style.display = "block"
            error.innerHTML = "Qualcosa è andato storto!"
        })*/
        console.log(old_user)
        console.log(new_user)
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
    old_user = res
    IDs.forEach(elem => {
        const a = document.querySelector('#' + elem)
        if(a) a.value = res.user[elem]
    })
}).catch((e) => {
    console.log(e)
    error.style.display = "block"
    error.innerHTML = "Impossibile connettersi al server"
})
