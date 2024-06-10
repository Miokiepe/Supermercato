import {items, show_content, show_error} from '../Components/data.js'
const items_div = document.querySelector('#items'),
      card_t = document.querySelector('template'),
      id = localStorage.getItem('id'),
      alert_t = localStorage.getItem('alert_t'),
      cerca = document.querySelector('#cerca')
let prodotti_g;

//Apertura del modale
const myModal = new bootstrap.Modal(document.getElementById("filtro_m"));
const myInput = document.getElementById('filtro_b')
myInput.addEventListener('click', () => {
  myModal.show()
})

//Funzione di ricerca
cerca.addEventListener('click',() => {

})

//Mostra eventuali messaggi
if(alert_t) {
    error.style.display = "block"
    switch(alert_t) {
        case 'cart':
            show_error('Elemento aggiunto al carrello! <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>','alert alert-success alert-dismissible fade show')
            break;
    }
}

//Aggiunta di elementi al carrello
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
            localStorage.setItem('alert_t','cart')
            location.reload()
            }
            else show_error()
            })
            .catch(() => show_error())
}

//Renderizzazzione degli elementi
fetch('http://localhost:5000/api/get_items/999')
    .then(res => res.json())
    .then(res => {
        show_content()
        if(!res.items) {
            items_div.innerHTML = "<i>Nessun prodotto disponibile</i>"
            return
            }
        prodotti_g = res.items
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

            const data_corrente = new Date().toISOString().split('T')[0];
            if(data_corrente !== elem.creazione) card.querySelector('.badge').style.display = "none"
            
            items_div.appendChild(card)
        })
}).catch(() => show_error())