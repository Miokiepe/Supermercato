import {items, show_content, show_error, stati} from '../Components/data.js'
const  
    prodotti_r = document.querySelector('#prodotti_r'), 
    card_t = document.querySelectorAll('template')[0],
    ordini_t = document.querySelectorAll('template')[1], 
    email = localStorage.getItem('email'), 
    password = localStorage.getItem('password'),  
    token = localStorage.getItem('token'), 
    role = localStorage.getItem('role'), 
    id = localStorage.getItem('id'), 
    alert_t = localStorage.getItem('alert_t'),
    annulla_m = new bootstrap.Modal(document.getElementById("annulla_m"));
let ordini_g;
//Mostra eventuali messaggi
if(alert_t) {
    switch(alert_t) {
        case 'cart':
            show_error('Elemento aggiunto al carrello!','alert alert-success alert-dismissible fade show',true)
            break;
        case 'annullato':
            show_error('Ordine annullato correttamente','alert alert-info alert-dismissible fade show',true)
    }
    localStorage.removeItem('alert_t')
}

document.querySelector('#title').innerHTML = "Benvenuto " + localStorage.getItem('nome')

//Aggiunta di un elemento al carrello
const add_cart = (prodotto) => {
    fetch('http://localhost:5000/api/add_cart',{
        method: "POST",
        headers: {   
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_utente: parseInt(id),
            id_prodotto: prodotto.id_prodotto,
            quantità: parseInt(document.querySelector('#u' + prodotto.id_prodotto).value)
        })
    })
    .then((res) => {
        if(res.status === 201) {
            localStorage.setItem('alert_t','cart')
            location.reload()
        }
        else show_error()
        })
    .catch(() => show_error())
}

//Renderizzazzione degli ordini
const render_ordini = (gruppi) => {
        const ordini = document.querySelector('#ordini')
        ordini.innerHTML = ""
        let n_ordine, data;
        gruppi.forEach(array => {
            
            const container = document.createElement('div')
            container.style = "background-color: white; box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px; display: flex; flex-wrap: wrap; margin-bottom: 20px; gap: 10px; flex-direction: column; padding: 10px; border-radius: 12px;"
            
            const container_ordine = document.createElement('div')
            container_ordine.style = "display: flex; flex-direction: row; gap: 10px; flex-wrap: wrap;"
            
            n_ordine = document.createElement('h3')
            n_ordine.innerHTML = "N. ordine #"
            container.appendChild(n_ordine)
    
            let item_consegnati = 0
            array.forEach(elem => {
    
                const ordine = ordini_t.content.cloneNode(true)
                ordine.querySelector('.card-title').innerHTML = elem.nome
                if(elem.tipo == 5) {
                    ordine.querySelector('.card-subtitle').innerHTML = `<span style='color: red'>
                                                                        <i class="fa-solid fa-trash"></i> Eliminato
                                                                    </span>`
                }
                else 
                ordine.querySelector('.card-subtitle').innerHTML = `<span style='color: ${items[elem.tipo].colore}'>
                                                                        ${items[elem.tipo].icona} ${items[elem.tipo].nome}
                                                                    </span>`
                ordine.querySelector('.ddesc').innerHTML = "Quantità: "  + elem.quantità
                ordine.querySelector('.costo').innerHTML = '€' + elem.costo
                if(elem.stato != 4 && elem.stato != 7) ordine.querySelector('.update').addEventListener('click',() => show_annulla_ordine(elem))
                else ordine.querySelector('.update').style.visibility = 'hidden'
                const btn = ordine.querySelector('.btn')
                const stato = stati[elem.stato]
                btn.innerHTML = stato.icona
                btn.setAttribute('data-bs-title', stato.titolo)
                btn.setAttribute('data-bs-content', stato.desc)
                btn.setAttribute('data-bs-toggle','popover')
                btn.className = "btn btn-" + (stato.colore ? stato.colore : 'primary')
    
                ordine.querySelector('.nome').innerHTML = stato.nome
                ordine.querySelector('.progress-bar').style.width = stato.perc
                ordine.querySelector('.progress-bar').innerHTML = stato.perc
                ordine.querySelector('.progress-bar').classList.add("bg-" + (stato.colore ? stato.colore : 'primary'))
                
                if(elem.stato == 4 || elem.stato == 7) {
                    ordine.querySelector('.progress-bar').classList.remove("progress-bar-animated")
                    ordine.querySelector('.progress-bar').classList.remove("progress-bar-striped")
                    item_consegnati++
                }
    
                container_ordine.appendChild(ordine)
                n_ordine.innerHTML += elem.id_ordine
                container.appendChild(container_ordine)
                
                if(item_consegnati == array.length) {
                    const consegnato = document.createElement('div')
                    consegnato.innerHTML = '<i class="fa-solid fa-circle-check"></i> Consegnato'
                    consegnato.style.color = "green"
                    container.appendChild(consegnato)
                }
                data = elem.creazione
            })
            n_ordine.innerHTML = `<div class='d-flex flex-row justify-content-between'>${n_ordine.innerHTML} <span>${data}</span></div>`
            ordini.appendChild(container)
            })
}

//Renderizzazzione degli ultimi 10 item disponibili
fetch('http://localhost:5000/api/get_items/10')
.then(res => res.json())
    .then(res => {
        show_content()
        console.log(res)
        if(!res.items) {
            prodotti_r.innerHTML = "<i>Nessun prodotto disponibile</i>"
            return
        }
        res.items.forEach(elem => {
            const card = card_t.content.cloneNode(true)
            card.querySelector(".card-title").innerHTML = elem.nome;
            card.querySelector(".card-subtitle").innerHTML = 
                `<span style='color: ${items[elem.tipo].colore}'>
                    ${items[elem.tipo].icona} ${items[elem.tipo].nome}
                </span>`

            if(elem.disponibilità == 0) {
                card.querySelector('.ddesc').innerHTML = ""
                card.querySelector('.quantità').innerHTML = "<i>Non disponibile<i>"
                card.querySelector('.quantità').style.color = "red"
                card.querySelector(".add_cart").style.display = "none"
                card.querySelector('.costo').style.visibility = "hidden"
                card.querySelector(".sep").style.visibility = "hidden"
                card.querySelector("hr").style.visibility = "hidden"
                }
                else {
                card.querySelector('.quantità').innerHTML = elem.disponibilità
                card.querySelector('.add_cart').onclick = () => add_cart(elem)
                card.querySelector('.costo').innerHTML = "€" + elem.costo
            }
            const select = card.querySelector('.select_q')
            select.id = "u" + elem.id_prodotto
            for(let i = 2; i < elem.disponibilità && i < 10; i++) {
                const option = document.createElement('option')
                option.value = i
                option.innerHTML = i
                select.appendChild(option)
                }
                prodotti_r.appendChild(card)
                })
            })
    .catch(() => show_error())
    
//Richiesta degli ordini
fetch('http://localhost:5000/api/get_orders_user', {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
        },
    body: JSON.stringify({
                email: email, 
                password: password, 
                token: token, 
                role: role
            })
        }).then(res => res.json())
          .then(res => {
            const container = document.querySelector('#ordini_cards')
            if(res.ordini.length === 0) {
                container.innerHTML = "Nessun ordine effetuato"
                return;
            }
            //Creazione di x array per quanti sono i gruppi ordine
            const gruppi = [];
            let gruppo = [], n_gruppo = res.ordini[0].gruppo;
            res.ordini.forEach(elem => {
                if(n_gruppo != elem.gruppo) {
                    gruppi.push(gruppo)
                    gruppo = []
                }
                    gruppo.push(elem)
                    n_gruppo = elem.gruppo
                })

            gruppi.push(gruppo)
            ordini_g = gruppi
            render_ordini(gruppi)
        })
        .then(() => {
        //Caricamento dei popover degli ordini
        const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
        const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
    })
        .catch(() => show_error())


//Apertura del modale di filtro
const myModal = new bootstrap.Modal(document.getElementById("filtro_m"));
const myInput = document.getElementById('filtro_b')
myInput.addEventListener('click', () => {
  myModal.show()
})

//Filtraggio degli ordini 
document.querySelector('#app').addEventListener('click',() => {
    let filtered_array = [...ordini_g], non_disp = [...ordini_g];
    const 
        con = document.querySelector('#con').checked,
        m1 = document.querySelector('#m1').checked,
        m2 = document.querySelector('#m2').checked,
        m3 = document.querySelector('#m3').checked,
        m4 = document.querySelector('#m4').checked,
        m5 = document.querySelector('#m5').checked
    
    if(!con) {
        console.log(m5)
        const indici = [];
        ordini_g.forEach((array, i) => {
            let consegnati = 0;
            array.forEach((elem) => {
                if(elem.stato === 4 || elem.stato === 7) 
                    consegnati++  
            })

            if(consegnati === array.length) indici.push(i)
        })
        // Ordinamento  degli indici in ordine decrescente
        indici.sort((a, b) => b - a)
        indici.forEach(index => {
            filtered_array.splice(index, 1)
        })
        non_disp = filtered_array;
    }
    if(m1) 
        filtered_array = filtered_array.filter(elem => elem[0].creazione.substring(5,7) == (new Date().getMonth() + 1))
    else if(m2) {
        filtered_array = filtered_array.filter(elem => {
        const data_ordine = new Date(elem[0].creazione.substring(0,4),(elem[0].creazione.substring(5,7) - 1),elem[0].creazione.substring(8,10)), oggi = new Date()
        oggi.setMonth(oggi.getMonth() - 3)
        return data_ordine.valueOf() > oggi.valueOf()   
        })
    }
    else if(m3) {
        filtered_array = filtered_array.filter(elem => {
            const data_ordine = new Date(elem[0].creazione.substring(0,4),(elem[0].creazione.substring(5,7) - 1),elem[0].creazione.substring(8,10)), oggi = new Date()
            oggi.setMonth(oggi.getMonth() - 6)
            return data_ordine.valueOf() > oggi.valueOf()   
        })
    }
    else if(m4) {
        filtered_array = filtered_array.filter(elem => {
            const data_ordine = new Date(elem[0].creazione.substring(0,4),(elem[0].creazione.substring(5,7) - 1),elem[0].creazione.substring(8,10)), oggi = new Date()
            oggi.setMonth(oggi.getMonth() - 9)
            return data_ordine.valueOf() > oggi.valueOf()   
        })
    }
    else filtered_array = non_disp
    //IMPLEMENTARE IL CAZZO DI INPUT 'TUTTI GLI ORDINI'
    myModal.hide()
    render_ordini(filtered_array)    
})  

//Annullamento dell'ordine
const show_annulla_ordine = (ordine) => {
    annulla_m.show()
    document.querySelector('#ann').addEventListener('click',() => annulla_ordine(ordine))
}

const annulla_ordine = (ordine) => {
    let o = {...ordine}
    o.stato = 7
    fetch('http://localhost:5000/api/update_status', {
        method: "PUT",
        headers: {
            'content-type' : 'application/json'
        },
        body: JSON.stringify(o)
    })
        .then(() => {
            localStorage.setItem('alert_t','annullato')
            location.reload()
        })
        .catch(() => show_error())
}