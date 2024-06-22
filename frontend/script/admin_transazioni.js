import {show_content, show_error, items, hide_content} from "../Components/data.js"
const transazione_t = document.querySelector('template')
const container = document.querySelector('#transazioni')
const filtro_m = new bootstrap.Modal(document.getElementById("filtro_m"));
let transazioni_g;
//Funzione di filtro
const filtra = (items_t) => {
    const 
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
        r4 = document.querySelector('#r4').checked,
        data = document.querySelector('#data').value
    let filtered_array = items_t
    categorie.forEach((elem, index) => {
        if(!elem)
            filtered_array = filtered_array.filter(e => e.tipo != index)
        })
    if(!r1) filtered_array = filtered_array.filter(elem => elem.costo > 9.99 )
    if(!r2) filtered_array = filtered_array.filter(elem => elem.costo < 10.00 || elem.costo > 24.99)
    if(!r3) filtered_array = filtered_array.filter(elem => elem.costo < 25.00 || elem.costo > 49.99 )
    if(!r4) filtered_array = filtered_array.filter(elem => elem.costo < 50.00)
    console.log(data)
    if(data != null) filtered_array = filtered_array.filter(elem => elem.creazione == data)
    console.log(filtered_array)
    filtro_m.hide()
    return filtered_array;
}

//Renderizziamo gli ordini
const render_transazioni = (items_t) => {
    if(items_t.length == 0 || items_t[0] === null) {
        container.innerHTML = "Nessuna transazione trovata"
        return
    }
    container.innerHTML = ""
    items_t.forEach(item => {
        const tran = transazione_t.content.cloneNode(true)
        tran.querySelector('.id_ordine').innerHTML = "#" + item.id_ordine
        tran.querySelector('.data').innerHTML = item.creazione
        tran.querySelector('.nome').innerHTML = item.nome

        if(item.tipo == 5) {
            tran.querySelector('.categoria').innerHTML = "Anullato e rimborsato"
        }
        else {
            tran.querySelector('.categoria').style.color = items[item.tipo].colore
            tran.querySelector('.categoria').innerHTML = items[item.tipo].icona + " " + items[item.tipo].nome
        }

        tran.querySelector('.quantità').innerHTML = "Quantità: " + item.quantità
        tran.querySelector('.costo').innerHTML = "€" + item.costo * item.quantità
        container.appendChild(tran)
    })
}

//Otteniamo le transazioni
fetch('http://localhost:5000/api/get_transazioni')
    .then(res => res.json())
    .then(res => {
        transazioni_g = res.transazioni
        render_transazioni(res.transazioni)
        show_content()
    })
    .catch(e => {
        show_error()
        console.log(e)
    })

//Ricerca di una transazione
document.querySelector('#cerca').addEventListener('click',() => {
    hide_content('.se','#transazioni')
    const id = document.querySelector('#nome_o').value
    if(id.trim() == "") location.reload()
    fetch(`http://localhost:5000/api/get_transazione/${id}`)
        .then(res => res.json())
        .then(res => {
            console.log([res])
            render_transazioni(filtra([res]))
            show_content('.se','#transazioni')
        })
})

document.querySelector('#filtro_b').addEventListener('click',() => filtro_m.show())
document.querySelector('#res').addEventListener('click',() => location.reload())
document.querySelector('#app').addEventListener('click',() => render_transazioni(filtra(transazioni_g)))