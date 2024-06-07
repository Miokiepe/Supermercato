import {show_content, show_error} from '../Components/data.js'
const iconEye = document.querySelector('#toggle')
const error = document.querySelector('#error')
const modifica = document.querySelector('#modifica')
const myModal = new bootstrap.Modal(document.getElementById("modal"));
let old_user;
iconEye.addEventListener('click',() => {
        if(password.type === "password") {
            password.type = "text"
            iconEye.innerHTML = '<i class="bi bi-eye"></i>'
        }
        else {
            password.type = "password"
            iconEye.innerHTML = '<i class="bi bi-eye-slash"></i>'
        }
})

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

document.querySelector('#delete_BBB').addEventListener('click',() => {
    fetch('http://localhost:5000/api/delete_account', {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(old_user.user)
    }).then(() => {
        localStorage.clear()
        location.replace('../index.html')
    })
      .catch(() => show_error("Server non raggiungibile! Operazione anullata"))
      console.log(old_user.user)
})

const IDs = ["nome","cognome","città","cap","via","genere","prefisso","numero","email"]

modifica.addEventListener('click',() => {
    if(modifica.innerHTML.includes("Modifica")) {
        IDs.forEach(elem => document.querySelector('#' + elem).disabled = false)
        document.querySelector('#password').disabled = false;
        modifica.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Salva'
    }
    else {
        //Esegui la richiesta per aggiornare l'account
        modifica.innerHTML = '<i class="fa-solid fa-pen"></i> Modifica'
        let c = 0
        IDs.forEach(elem => document.querySelector('#' + elem).value === "" && c++)
        if(c != 0) {
            show_error("Uno o più campi sono vuoti. Compilali")
            return;
        }
        const new_user = {}
        IDs.forEach(elem => new_user[elem] = document.querySelector('#' + elem).value)
        new_user['genere'] = parseInt(document.querySelector('#genere').value)
        new_user['password'] = document.querySelector('#password').value == "" ? old_user.user.password : document.querySelector('#password').value
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
          .catch(() => {
            error.style.display = "block"
            error.innerHTML = "Qualcosa è andato storto!"
        })
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
