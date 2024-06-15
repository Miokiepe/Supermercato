import {show_content, show_error, badges} from "../Components/data.js"
const admin_selezionati = []
const elimina = document.querySelector('#elimina')
const modifica = document.querySelector('#modifica')
const manage_user = (user, check) => {
    
    if(check.checked) {
        admin_selezionati.push(user)
        if(admin_selezionati.length == 1) modifica.style.display = "block"
        else modifica.style.display = "none"
        elimina.style.display = "block"
    }
    else {
        admin_selezionati.splice(admin_selezionati.at(user),1)
        if(admin_selezionati.length == 1) modifica.style.display = "block"
        else modifica.style.display = "none"
        if(admin_selezionati.length == 0) elimina.style.display = "none"
    }
    console.log(admin_selezionati)
}

//Renderizziamo i gestori
const gestori_t = document.querySelector('#gestori')
const render_admin = (gestori) => {
    gestori.forEach(elem => {
        const tr = document.createElement('tr')

        const checkbox_td = document.createElement('td')
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.className = "form-check-input"
        checkbox.onclick = () => manage_user(elem, checkbox)
        checkbox_td.appendChild(checkbox) 
        tr.appendChild(checkbox_td)

        const nome = document.createElement('td')
        nome.innerHTML = elem.nome
        tr.appendChild(nome)

        const cognome = document.createElement('td')
        cognome.innerHTML = elem.cognome
        tr.appendChild(cognome)

        const email = document.createElement('td')
        email.innerHTML = elem.email
        tr.append(email)

        const ruolo = document.createElement('td')
        const badge = elem.ruolo == "Admin" ? badges[0] : badges[1]
        ruolo.innerHTML = `<span class="badge" style="background-color: ${badge.colore}; color: white;">${badge.icona} ${badge.nome}</span>`
        tr.appendChild(ruolo)
       
        gestori_t.appendChild(tr)
    })
}

//Ottenimento di tutti gli utenti
fetch('http://localhost:5000/api/get_users',{
    method: "POST",
    headers: {
        'content-type': 'application/json'
    },
    body: JSON.stringify({
        email: localStorage.getItem('email'),
        password: localStorage.getItem('password'),
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role')
    })
}).then(res => res.json())
  .then(res => {
    console.log(res)
    render_admin(res.gestori)
    show_content()
  })
  .catch((e) => {
    show_error()
    console.log(e)
  })