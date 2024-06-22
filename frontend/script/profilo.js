import {show_content, show_error, prefixes} from '../Components/data.js'
const iconEye = document.querySelector('#toggle')
const modifica = document.querySelector('#modifica')
const myModal = new bootstrap.Modal(document.getElementById("modal"));
const elimina_err = new bootstrap.Modal(document.getElementById("elimina_err"));
let old_user;

const prefissi = document.querySelector('#prefisso')
prefixes.forEach(prefix => {
    const opt = document.createElement('option')
    opt.value = prefix.prefisso
    opt.innerHTML =prefix.emoji +  " +" + prefix.prefisso
    prefissi.appendChild(opt)
})
//Alterniamo l'input type text e password quando si clicca l'icona dell'occhio
iconEye.addEventListener('click',() => {
    const password = document.querySelector('#password')
        if(password.type === "password") {
            password.type = "text"
            iconEye.innerHTML = '<i class="bi bi-eye"></i>'
        }
        else {
            password.type = "password"
            iconEye.innerHTML = '<i class="bi bi-eye-slash"></i>'
        }
})

//Log-out
document.querySelector('#logout').addEventListener('click',() => {
    fetch('http://localhost:5000/api/logout',{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password'),
            role: localStorage.getItem('role')
        })
    }).then(() => {
        localStorage.clear()
        location.replace('../index.html')
    }).catch(() => {
        show_error("Server non raggiungibile! Operazione anullata")
    })
})

document.querySelector('#delete').addEventListener('click', () => myModal.show())

//Eliminazione dell'account
document.querySelector('#delete_BBB').addEventListener('click',() => {
    fetch('http://localhost:5000/api/delete_account', {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(old_user.user)
    }).then(async res => {
        if(res.status === 400) {
            myModal.hide()
            const n = await res.json(); 
            elimina_err.show()
            document.querySelector('#n_or').innerHTML = n.detail.ordini
        }
        else {
            localStorage.clear()
            location.replace('../index.html')
        }
    })
      .catch(() => show_error("Server non raggiungibile! Operazione anullata"))
})

const IDs = ["nome","cognome","città","cap","via","genere","prefisso","numero","email"]

//Modifica del profilo nel server
modifica.addEventListener('click',() => {
    if(modifica.innerHTML.includes("Modifica")) {
        IDs.forEach(elem => document.querySelector('#' + elem).disabled = false)
        document.querySelector('#password').disabled = false;
        modifica.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Salva'
    }
    else {
        //Esegui la richiesta per aggiornare l'account
        let c = 0
        IDs.forEach(elem => document.querySelector('#' + elem).value === "" && c++)
        if(c != 0) {
            show_error("Uno o più campi sono vuoti. Compilali")
            return;
            }
        const new_user = {}
        IDs.forEach(elem => new_user[elem] = document.querySelector('#' + elem).value)
        new_user['genere'] = parseInt(document.querySelector('#genere').value)
        new_user['password'] = document.querySelector('#password').value
        new_user['autenticato'] = old_user.user.autenticato
        new_user['id_utente'] = old_user.user.id_utente
        fetch('http://localhost:5000/api/update_account',{
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                old: old_user.user,
                new: new_user
            })
        }).then(() => {
            localStorage.setItem('nome',new_user.nome)
            localStorage.setItem('email',new_user.email)
            localStorage.setItem('password',new_user.password)
            localStorage.setItem('token',new_user.autenticato)
            location.reload()
        })
          .catch(() => show_error("Qualcosa è andato storto"))
    }
})

//Otteniamo l'account
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
    show_content()
    old_user = res;
    console.log(res)
    IDs.forEach(elem => {
        const a = document.querySelector('#' + elem)
        if(a) {
            if(elem == "genere") a.value = String(res.user[elem])
            else a.value = res.user[elem]
        }
    })
}).catch((e) => {
    show_error()
    console.log(e)
})
