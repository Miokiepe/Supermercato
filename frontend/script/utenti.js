import {show_content, show_error, badges, prefixes} from "../Components/data.js"
const admin_selezionati = [], utenti_selezionati = []
const elimina = document.querySelector('#elimina_a')
const modifica = document.querySelector('#modifica_a')
const elimina_u = document.querySelector('#elimina_u')
const modifica_m = new bootstrap.Modal(document.getElementById("modifica_m"));
const elimina_m = new bootstrap.Modal(document.getElementById("elimina_m"));
const elimina_m_u = new bootstrap.Modal(document.getElementById("elimina_m_u"));
const aggiungi = document.querySelector('#add')
const aggiungi_m = new bootstrap.Modal(document.getElementById("aggiungi_m"));
//Mostriamo eventuali alert
const alert = localStorage.getItem('alert')
switch(alert) {
    case 'modifica_admin':
        show_error('Utente gestore modificato','alert alert-success alert-dismissible fade show', true)
        break;
    case 'delete_admin':
            show_error('Account gestori selezionati eliminati','alert alert-info alert-dismissible fade show', true)
            break;
    case 'delete_user':
            show_error('Account selezionati eliminati','alert alert-info alert-dismissible fade show', true)
            break;
    case 'added_admin':
        show_error('Account aggiunto con successo','alert alert-info alert-dismissible fade show', true)
        break;
        }
localStorage.removeItem('alert')

const manage_admin = (user, check) => {
    
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
        checkbox.className = "form-check-input check"
        checkbox.onclick = () => manage_admin(elem, checkbox)
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
        if(elem.email ==  localStorage.getItem('email') && elem.nome == localStorage.getItem('nome')) ruolo.innerHTML += " <span style='color: #664577;'>Profilo corrente</span>"
        tr.appendChild(ruolo)
       
        gestori_t.appendChild(tr)
    })
}

//Modifica di un admin selezionato
modifica.addEventListener('click',() => {
    document.querySelector('#nome_a').value = admin_selezionati[0].nome
    document.querySelector('#cognome_a').value = admin_selezionati[0].cognome
    document.querySelector('#email_a').value = admin_selezionati[0].email
    const badge = admin_selezionati[0].ruolo == "Admin" ? badges[0] : badges[1]
    document.querySelector('#ruolo_a').innerHTML = badge.icona + " " + badge.nome
    document.querySelector('#ruolo_a').style=`background-color: ${badge.colore}; color: white;`
    modifica_m.show()
})

//Effetuiamo il salvataggio sul server
document.querySelector('#salva').addEventListener('click',() => {

    fetch('http://localhost:5000/api/update_account_admin',{
        method: "PUT",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            old: admin_selezionati[0],
            new: {
                nome: document.querySelector('#nome_a').value,
                cognome: document.querySelector('#cognome_a').value,
                email: document.querySelector('#email_a').value,
                password: "",
                ruolo: document.querySelector('#ruolo_a').innerHTML.includes('Admin') ? 'Admin' : 'Corriere'
            }
        })
    }).then(() => {
        if(document.querySelector('#cognome_a').value == localStorage.getItem('email')) {
            localStorage.setItem('nome',document.querySelector('#nome_a').value)
            localStorage.setItem('email',document.querySelector('#email_a').value)
        }
        localStorage.setItem('alert','modifica_admin')
        location.reload()
    }).catch((e) => {
        console.log(e)
        show_error()
    })
})


//Mostriamo il modale per eliminare gli account gestori
document.querySelector('#elimina_a').addEventListener('click',() => {
    document.querySelector('#xaccount').innerHTML = admin_selezionati.length
    elimina_m.show()
})

//Mostriamo il modale per eliminare gli account utente
document.querySelector('#elimina_u').addEventListener('click',() => {
    document.querySelector('#xaccount_u').innerHTML = utenti_selezionati.length
    elimina_m_u.show()
})

//Eliminazione dell'account gestore nel server
document.querySelector('#elimina_def').addEventListener('click',async () => {
   admin_selezionati.forEach(admin => {
    fetch('http://localhost:5000/api/delete_admin',{
        method: "DELETE",
        headers: {
            "content-type" : "application/json"
        },
        body: JSON.stringify(admin)
    }).then(() => {
        localStorage.setItem('alert','delete_admin')
        location.reload()
    })
   })
})

//Eliminazione dell'account utente nel server
document.querySelector('#elimina_def_utenti').addEventListener('click',async () => {
    utenti_selezionati.forEach(user => {
     user.id_utente = 0
     user.via = "" 
     user.autenticato = ""
     user.cap = "" 
     console.log(user)
     fetch('http://localhost:5000/api/delete_account',{
         method: "DELETE",
         headers: {
             "content-type" : "application/json"
         },
         body: JSON.stringify(user)
     }).then(() => {
         localStorage.setItem('alert','delete_user')
         location.reload()
     })
    })
 })

const manage_user = (user, check) => {
    if(check.checked) {
        utenti_selezionati.push(user)
        elimina_u.style.display = "block"
    }
    else {
        utenti_selezionati.splice(utenti_selezionati.at(user),1)
        if(utenti_selezionati.length == 0) elimina_u.style.display = "none"
    }
    console.log(utenti_selezionati)
}

//Renderizziamo gl iutenti
const utenti_t = document.querySelector('#utenti')
const render_utenti = (utenti) => {
    if(utenti.length === 0 ) {
        document.querySelector('#cont_utenti').innerHTML = "Nessun utente"
        return;
    }
    utenti.forEach(elem => {
        const tr = document.createElement('tr')

        const checkbox_td = document.createElement('td')
        const checkbox = document.createElement('input')
        checkbox.type = "checkbox"
        checkbox.className = "form-check-input check_u"
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
        tr.appendChild(email)

        const genere = document.createElement('td')
        genere.innerHTML = elem.genere == 1 ? "Uomo" : elem.genere == 2 ? "Donna" : "Non specificato"
        tr.appendChild(genere)

        const città = document.createElement('td')
        città.innerHTML = elem.città
        tr.appendChild(città)

        const numero = document.createElement('td')
        numero.innerHTML = "+" + elem.prefisso +  " " +  elem.numero
        tr.appendChild(numero)

        utenti_t.appendChild(tr)
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
    render_utenti(res.utenti)
    show_content()
  })
  .catch((e) => {
    show_error()
    console.log(e)
  })

//Mostriamo il modale per l'aggiunta di un utente
aggiungi.addEventListener('click',() => aggiungi_m.show())

const 
    password = document.querySelector('#password_g'), 
    iconEye = document.querySelector('#toggle'), 
    tipo_g = document.querySelector('#tipo_g'),
    icona_g = document.querySelector('#icona_g')
//Mostriamo / Nascondiamo la password
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

//Modifica dell'icona quando si clicca sul select
tipo_g.addEventListener('change', () => {
    icona_g.innerHTML = badges[tipo_g.value].icona
    icona_g.style.color = badges[tipo_g.value].colore
})

//Aggiunta del nuovo account sul server
document.querySelector('#salva_g').addEventListener('click', () => {
    const 
        nome = document.querySelector('#nome_g').value,
        cognome = document.querySelector('#cognome_g').value,
        email = document.querySelector('#email_g').value
    
    if(!nome || !cognome || !email || !password) {
        show_error("Uno o più campi vuoti! Procedura annullata")
        aggiungi_m.hide()
        return
    }

    fetch('http://localhost:5000/api/add_admin',{
        method: "POST",
        headers: {
            'content-type' : 'application/json'
        },
        body: JSON.stringify({
            nome: nome,
            cognome: cognome,
            email: email, 
            password: password.value,
            role: tipo_g.value == "0" ? "Admin" : "Corriere"
        })
    }).then((res) => {
        if(res.status === 409) {
            show_error("Esiste già un gestore con la stessa email e ruolo", "alert alert-info alert-dismissible fade show", true)
            aggiungi_m.hide()
            return;
        }
        localStorage.setItem('alert','added_admin')
        location.reload()
    }).catch(e => {
        console.log(e)
        show_error()
    })
})