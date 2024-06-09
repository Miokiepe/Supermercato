import {items, show_content, show_error, stati} from '../Components/data.js'
const  
    prodotti_r = document.querySelector('#prodotti_r'), 
    card_t = document.querySelectorAll('template')[0],
    ordini_t = document.querySelectorAll('template')[1], 
    email = localStorage.getItem('email'), 
    password = localStorage.getItem('password'), 
    error = document.querySelector('#error'), 
    token = localStorage.getItem('token'), 
    role = localStorage.getItem('role'), 
    id = localStorage.getItem('id'), 
    alert_t = localStorage.getItem('alert')
localStorage.removeItem('alert')


if(alert_t) {
    error.style.display = "block"
    switch(alert_t) {
        case 'cart':
            show_error('Elemento aggiunto al carrello! <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>','alert alert-success alert-dismissible fade show')
            break;
    }
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
    }).then((res) => {
        if(res.status === 201) {
            localStorage.setItem('alert','cart')
            location.reload()
            }
            else show_error()
            
            }).catch(() => show_error())
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
//Renderizzazzione degli ordini
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
            
            if(!res.ordini) {
                container.innerHTML = "Nessun ordine effetuato"
        return;
        }

        //riordinare l'arry in base al tipo
        const res_sorted = res.ordini.sort((a, b) => a.gruppo - b.gruppo)
        
    //Creazione di x array per quanti sono i gruppi ordine
    const gruppi = [];
    let gruppo = [], n_gruppo = res_sorted[0].gruppo;
    res_sorted.forEach(elem => {
        if(n_gruppo != elem.gruppo) {
            gruppi.push(gruppo)
            gruppo = []
            }
            gruppo.push(elem)
            n_gruppo = elem.gruppo
            })
            gruppi.push(gruppo)
    const ordini = document.querySelector('#ordini')
    //Renderizzazzione degli ordini
    gruppi.forEach(array => {
        const container = document.createElement('div')
        const container_ordine = document.createElement('div')
        container_ordine.style = "display: flex; flex-direction: row; gap: 10px; flex-wrap: wrap;"
        const n_ordine = document.createElement('h3')
        n_ordine.innerHTML = "N. ordine #"
        container.appendChild(n_ordine)
        container.style = "background-color: white; box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px; display: flex; flex-wrap: wrap; margin-bottom: 20px; gap: 10px; flex-direction: column; padding: 10px; border-radius: 12px;"
        console.log(array)
        array.forEach(elem => {
            const ordine = ordini_t.content.cloneNode(true)
            ordine.querySelector('.card-title').innerHTML = elem.nome
            ordine.querySelector('.card-subtitle').innerHTML = `<span style='color: ${items[elem.tipo].colore}'>
                                                                    ${items[elem.tipo].icona} ${items[elem.tipo].nome}
                                                                </span>`
            ordine.querySelector('.ddesc').innerHTML = "Quantità: "  + elem.quantità
            ordine.querySelector('.costo').innerHTML = '€' + elem.costo
            const btn = ordine.querySelector('.btn')
            btn.innerHTML = stati[elem.stato].icona
            btn.setAttribute('data-bs-title', stati[elem.stato].titolo)
            btn.setAttribute('data-bs-content', stati[elem.stato].desc)
            btn.setAttribute('data-bs-toggle','popover')
            btn.className = "btn btn-" + (stati[elem.stato].colore ? stati[elem.stato].colore : 'primary')
            ordine.querySelector('.nome').innerHTML = stati[elem.stato].nome
            ordine.querySelector('.progress-bar').style.width = stati[elem.stato].perc
            ordine.querySelector('.progress-bar').innerHTML = stati[elem.stato].perc
            ordine.querySelector('.progress-bar').classList.add("bg-" + (stati[elem.stato].colore ? stati[elem.stato].colore : 'primary'))
            if(elem.stato == 4) {
                ordine.querySelector('.progress-bar').classList.remove("progress-bar-animated")
                ordine.querySelector('.progress-bar').classList.remove("progress-bar-striped")
            }
            container_ordine.appendChild(ordine)
            n_ordine.innerHTML += elem.id_ordine
            container.appendChild(container_ordine)
        })
        ordini.appendChild(container)
        })
}).then(() => {
    //Caricamento dei popover degli ordini
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
})
.catch((err) => show_error())
