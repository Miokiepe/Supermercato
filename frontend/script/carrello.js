import {items, show_content, show_error} from '../Components/data.js'
const error = document.querySelector('#error')
const card_t = document.querySelector('template')
const container = document.querySelector('#prodotti')

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
    console.log(res)
    res.items.forEach(elem => {
        const card = card_t.content.cloneNode(true)
        card.querySelector('.card-title', elem.nome)
        card.querySelector(".card-subtitle").innerHTML = 
                `<span style='color: ${items[elem.tipo].colore}'>
                    ${items[elem.tipo].icona} ${items[elem.tipo].nome}
                </span>`
        card.querySelector('.quantità').innerHTML = elem.disponibilità
        card.querySelector('.costo').innerHTML = "€" + elem.costo
        const select = card.querySelector('.select_q')
            select.id = "u" + elem.id_prodotto
            for(let i = 2; i < elem.disponibilità && i < elem.disponibilità; i++) {
                const option = document.createElement('option')
                option.value = i
                option.innerHTML = i
                select.appendChild(option)
            }
        select.value = elem.quantità_richiesta
        card.querySelector('.costo_d').innerHTML = "€" + elem.quantità_richiesta * elem.costo
        card.querySelector('.delete').onclick = () => delete_item({id_utente: elem.id_utente, id_prodotto: elem.id_prodotto, quantità: elem.quantità_richiesta})
        container.appendChild(card)
    })
    //Renderizza il template carte formato da: Nome, tipo, quantità scelta e prezzo TOTALE.
}).catch(() => show_error())
