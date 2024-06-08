import {items, show_content, show_error} from '../Components/data.js'
const error = document.querySelector('#error')
const card_t = document.querySelector('template')
const container = document.querySelector('#prodotti')
let items_g;

document.querySelector('#acquista').addEventListener('click',() => {
    const cart_item = {items: []}
    items_g.items.forEach(elem => {
        cart_item.items.push({
            id_utente: elem.id_utente,
            id_prodotto: elem.id_prodotto,
            quantità: elem.quantità_richiesta
        })
    })
    fetch('http://localhost:5000/api/buy_cart',{
        method: "PUT",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(cart_item)
    }).then(() => {
        localStorage.setItem('alert',JSON.stringify({
            message: "Ordine effettuato! Torna alla home per visualizzare il tuo ordine",
            className: "alert alert-info"
        }))
        location.reload()
    }).catch(() => show_error())
})

const delete_item = (prodotto) => {
    fetch('http://localhost:5000/api/delete_cart', {
        method: "DELETE",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(prodotto)
    }).then(() => location.reload())
      .catch(() => show_error("Impossibile connettersi al server. Operazione annullata"))
}

const update_item = (prodotto, nuova_quantità) => {
    prodotto.quantità_richiesta = nuova_quantità
    fetch('http://localhost:5000/api/update_cart',{
        method: "PUT",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id_utente: prodotto.id_utente,
            id_prodotto: prodotto.id_prodotto,
            quantità: parseInt(nuova_quantità)
        })
    }).then(() => location.reload())
      .catch(() => show_error())
}

const alert = JSON.parse(localStorage.getItem('alert'))
if(alert) {
    show_error(alert.message, alert.className)
    localStorage.removeItem('alert')
}


fetch('http://localhost:5000/api/get_cart', {
    method: "POST",
    headers: {
        'Content-type': 'application/json'
    },
    body: JSON.stringify({
        id_utente: localStorage.getItem('id')
    })
}).then(res => res.json()).then(res => {
    show_content()
    let n_elementi = 0, costo_t = 0;
    if(res.items.length === 0) {
        container.innerHTML = "Nessun prodotto nel carrello"
        document.querySelector('#checkout').style.display = "none"
        document.querySelector('#acquista').disabled = true
        return;
        }
    items_g = res
    res.items.forEach(elem => {
        const card = card_t.content.cloneNode(true)
        card.querySelector('.card-title').innerHTML = elem.nome
        card.querySelector(".card-subtitle").innerHTML = 
                `<span style='color: ${items[elem.tipo].colore}'>
                    ${items[elem.tipo].icona} ${items[elem.tipo].nome}
                </span>`
        const costo = elem.quantità_richiesta * elem.costo
        //TODO Se l'elemnto non è disponibile, utilizzare un alert-info, non contarlo nel prezzo, disabilitare il bottone
        if(elem.disponibilità == 0) {
            show_error("Uno o più elementi non sono più disponibili","alert alert-info")
            card.querySelector('.quantità').innerHTML = "<i>Non disponibile<i>"
            card.querySelector('.quantità').style.color = "red"
            card.querySelector('.sep').style.visibility = "hidden"
        }
        else {
            card.querySelector('.quantità').innerHTML = elem.disponibilità
            card.querySelector('.costo').innerHTML = "€" + elem.costo
            const select = card.querySelector('.select_q')
            select.id = "u" + elem.id_prodotto
                for(let i = 2; i <= elem.disponibilità; i++) {
                    const option = document.createElement('option')
                    option.value = i
                    option.innerHTML = i
                    select.appendChild(option)
                }
            select.value = elem.quantità_richiesta
            select.onchange = () => update_item(elem, select.value)
            
            costo_t += costo
            n_elementi += elem.quantità_richiesta
            }
        card.querySelector('.delete').onclick = () => delete_item({id_utente: elem.id_utente, id_prodotto: elem.id_prodotto, quantità: elem.quantità_richiesta})
        card.querySelector('.costo_d').innerHTML = "€" + costo
        container.appendChild(card)
    })
    document.querySelector('#n_item').innerHTML =  n_elementi
    document.querySelector('#costo_t').innerHTML = costo_t.toFixed(2)
}).catch(() => show_error())
