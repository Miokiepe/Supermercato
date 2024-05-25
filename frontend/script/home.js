import items from "../Components/data.js"
const prodotti_r = document.querySelector('#prodotti_r')
const card_t = document.querySelector('template')
const id = localStorage.getItem('id')
const error = document.querySelector('#error')
localStorage.removeItem('id')

const alert_t = localStorage.getItem('alert')
localStorage.removeItem('alert')
if(alert_t) {
    error.style.display = "block"
    switch(alert_t) {
        case 'cart':
            error.className = "alert alert-success alert-dismissible fade show"
            error.innerHTML = 'Elemento aggiunto al carrello! <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'
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
            id_utente: id,
            id_prodotto: prodotto.id_prodotto,
            quantità: parseInt(document.querySelector('#u' + prodotto.id_prodotto).value)
        })
    }).then(() => {
        localStorage.setItem('alert','cart')
        location.reload()
    })
}

fetch('http://localhost:5000/api/get_items/10')
    .then(res => res.json())
    .then(res => {
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
            card.querySelector('.quantità').innerHTML = elem.disponibilità
            card.querySelector('.costo').innerHTML = "€" + elem.costo
            const select = card.querySelector('.select_q')
            select.id = "u" + elem.id_prodotto
            for(let i = 2; i < elem.disponibilità && i < 10; i++) {
                const option = document.createElement('option')
                option.value = i
                option.innerHTML = i
                select.appendChild(option)
            }
            card.querySelector('.add_cart').onclick = () => add_cart(elem)
            prodotti_r.appendChild(card)
        })
    })
    .catch(() => {
        error.style.display = "block"
        error.innerHTML = "Impossibile connettersi al server"
    })