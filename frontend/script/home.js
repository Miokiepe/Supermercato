import {items, show_content, show_error} from '../Components/data.js'
const prodotti_r = document.querySelector('#prodotti_r')
const card_t = document.querySelector('template')
const email = localStorage.getItem('email')
const password = localStorage.getItem('password')
const error = document.querySelector('#error')
const token = localStorage.getItem('token')
const role = localStorage.getItem('role')
const id = localStorage.getItem('id');
const alert_t = localStorage.getItem('alert')
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
                card.querySelector('.quantità').innerHTML = "<i>Non disponibile<i>"
                card.querySelector('.quantità').style.color = "red"
                card.querySelector(".add_cart").style.display = "none"
                card.querySelector(".sep").style.visibility = "hidden"
                card.querySelector("hr").style.visibility = "hidden"
            }
            else {
                card.querySelector('.quantità').innerHTML = elem.disponibilità
                card.querySelector('.add_cart').onclick = () => add_cart(elem)
            }
            card.querySelector('.costo').innerHTML = "€" + elem.costo
            const select = card.querySelector('.select_q')
            select.id = "u" + elem.id_prodotto
            for(let i = 2; i < elem.disponibilità && i < 10; i++) {
                const option = document.createElement('option')
                option.value = i
                option.innerHTML = i
                select.appendChild(option)
            }
            prodotti_r.appendChild(card)
            //Quando si preme il bottone rosso, eseguire la cancellazzione
            //Quando si cambia item, aggiornare la quantità
        })
    })
    .catch(() => show_error())

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
    //Renderizzare gli ordini
    console.log(res)
})
  .catch(() => show_error())