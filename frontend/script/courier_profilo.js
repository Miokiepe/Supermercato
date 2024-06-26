import { show_content, show_error } from "../Components/data.js"
const ids = ["nome","cognome","email"]
const modifica = document.querySelector('#modifica')
const iconEye = document.querySelector('#toggle')
const myModal = new bootstrap.Modal(document.getElementById("modal"))
let old_user;

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
//Restituzione account
fetch('http://localhost:5000/api/get_account',{
    method: "POST",
    headers: {
        'content-type' : 'application/json'
    },
    body: JSON.stringify({
       email: localStorage.getItem('email'),
       password : localStorage.getItem('password'),
       role: localStorage.getItem('role'),
       token: localStorage.getItem('token')
    })
})
.then(res => res.json())
.then(res => {
    ids.forEach(id => document.querySelector(`#${id}`).value = res.user[id])
    old_user = res.user
    show_content()
  
})
.catch(e => console.log(e))
//Modifica dell'account
modifica.addEventListener('click',() => {
    if(modifica.innerHTML.includes("Modifica")) {
        ids.forEach(id => document.querySelector(`#${id}`).disabled = false)
        document.querySelector('#password').disabled = false;
        modifica.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Salva'
    }
    else {
        let c = 0
        ids.forEach(id => !document.querySelector(`#${id}`).value && c++)
        if(c != 0)  {
            show_error("Uno o più campi vuoti. Compilali")
            return;
            }
        const new_user = {}
        ids.forEach(id => new_user[id] = document.querySelector(`#${id}`).value)
        const pass = document.querySelector('#password').value
        new_user.password = pass
        fetch('http://localhost:5000/api/update_account_admin',{
            method: "PUT",
            headers: {
                'content-type' : 'application/json'
            },
            body: JSON.stringify({
                new: new_user,
                old: old_user
            })
        }).then(async (res) => {
            localStorage.setItem('nome',new_user.nome)
            localStorage.setItem('cognome',new_user.cognome)
            localStorage.setItem('email',new_user.email)
            res = await res.json()
            localStorage.setItem('password',res.password.password)
            location.reload()
        }).catch(() => show_error())
    }
})
//Log-out
document.querySelector('#logout').addEventListener('click',() => {
    fetch('http://localhost:5000/api/logout',{
        method: "POST",
        headers: {
            'content-type' : 'application/json'
        },
        body: JSON.stringify({
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password'),
            role: localStorage.getItem('role')
        })
    }).then(() => location.replace('../index.html'))
      .catch(() => show_error())
})
//Eliminazione del corriere
document.querySelector('#delete').addEventListener('click', () => myModal.show())
document.querySelector('#delete_BBB').addEventListener('click',() => {
    fetch('http://localhost:5000/api/delete_admin', {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: document.querySelector('#nome').value,
            cognome: document.querySelector('#cognome').value,
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password'),
        })
    }).then(() => {
        localStorage.clear()
        location.replace('../index.html')
    })
      .catch(() => show_error("Server non raggiungibile! Operazione anullata"))
})