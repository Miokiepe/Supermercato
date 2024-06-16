import {items, show_content, show_error, hide_content} from '../Components/data.js'
const items_div = document.querySelector('#items'),
      card_t = document.querySelector('template'),
      id = localStorage.getItem('id'),
      alert_t = localStorage.getItem('alert_t'),
      cerca = document.querySelector('#cerca')


let prodotti_g;
localStorage.removeItem('alert_t')
//Apertura del modale
const myModal = new bootstrap.Modal(document.getElementById("filtro_m"));
const myInput = document.getElementById('filtro_b')
myInput.addEventListener('click', () => {
  myModal.show()
})

//Funzione di ricerca //IMPLEMENTARE LE FUNZIONI DI RICERCA
const f_cerca = () => {
    const word = document.querySelector('#nome_p').value
    hide_content('.se','#items')
    fetch(`http://localhost:5000/api/search_items/${word}`)
        .then(res => res.json())
        .then(res => {
            show_content('.se','#items')
            prodotti_g = res.items;
            render_prodotti(filtra())
        })
}
cerca.addEventListener('click',f_cerca)
const filtra = () => {
    const 
        non_disponibili = document.querySelector('#dis').checked,
        nuovo = document.querySelector('#nuovo').checked,
        categorie = [
            document.querySelector('#arr').checked,
            document.querySelector('#ali').checked,
            document.querySelector('#ele').checked,
            document.querySelector('#ind').checked,
            document.querySelector('#spo').checked
        ],
        r1 = document.querySelector('#r1').checked,
        r2 = document.querySelector('#r2').checked,
        r3 =  document.querySelector('#r3').checked,
        r4 = document.querySelector('#r4').checked

    let filtered_array = prodotti_g
    if(!non_disponibili) filtered_array = filtered_array.filter(elem => elem.disponibilità != 0)
    if(!nuovo) filtered_array = filtered_array.filter(elem => elem.creazione != (new Date().toISOString().split('T')[0]))
    categorie.forEach((elem, index) => {
        if(!elem)
            filtered_array = filtered_array.filter(e => e.tipo != index)
        })
    if(!r1) filtered_array = filtered_array.filter(elem => elem.costo > 9.99 )
    if(!r2) filtered_array = filtered_array.filter(elem => elem.costo < 10.00 || elem.costo > 24.99)
    if(!r3) filtered_array = filtered_array.filter(elem => elem.costo < 25.00 || elem.costo > 49.99 )
    if(!r4) filtered_array = filtered_array.filter(elem => elem.costo < 50.00)
    console.log(filtered_array)
    myModal.hide()
    return filtered_array;
}
document.querySelector('#app').addEventListener('click',() => {render_prodotti(filtra())})
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

//Funzione che renderizza i prodotti
const render_prodotti = (prodotti) => {
    console.log(prodotti)
    items_div.innerHTML = ""
    if(prodotti.length == 0) {
        items_div.innerHTML = "<i>Nessun prodotto trovato</i>"
        return;
        }
        
        prodotti.forEach(elem => {
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
}
//Richiesta per la raccolta di prodotti
fetch('http://localhost:5000/api/get_items/999')
    .then(res => res.json())
    .then(res => {
        show_content()
        prodotti_g = res.items
        render_prodotti(res.items)
       
}).catch(() => show_error())