import {show_content, show_error, stati, items} from '../Components/data.js'
const ordini = document.querySelector('#container')
const ordini_t = document.querySelector('template')
const cerca = document.querySelector('#cerca')

//Aggiornamento dello stato dell'ordine
const update_ordine = (ordine) => {

    const change_status = () => {
        const new_index = document.querySelector('#m_stato').value
        modal.querySelector('#m_icona').innerHTML = `<button class="btn btn-${stati[new_index].colore ? stati[new_index].colore : "primary"}">${stati[new_index].icona}</button >`
        modal.querySelector('#desc').innerHTML = stati[new_index].desc
    }

    const update_server = (o) => {
       o.stato = modal.querySelector('#m_stato').value

       fetch('http://localhost:5000/api/update_status',{
        method: "PUT",
        headers: {
            'content-type' : 'application/json'
        },
        body: JSON.stringify(o)
       })
            .then(() => location.reload())
            .catch(() => show_error())
    }

    const modal = document.querySelector('#mod')
    modal.querySelector('#m_nome').value = "#" + ordine.id_ordine + ordine.id_prodotto
    modal.querySelector('#m_quantità').value = ordine.quantità
    modal.querySelector('#m_stato').value = ordine.stato
    modal.querySelector('#m_stato').onchange = () => change_status()
    modal.querySelector('#desc').innerHTML = stati[ordine.stato].desc
    modal.querySelector('#m_icona').innerHTML = `<button class="btn btn-${stati[ordine.stato].colore ? stati[ordine.stato].colore : "primary"}">${stati[ordine.stato].icona}</button >`
    modal.querySelector('#mod_item').onclick = () => update_server(ordine)
    const myModal = new bootstrap.Modal(document.getElementById("mod"));
    myModal.show();
}

//Render degli ordini
const render_ordini = (gruppi) => {
    ordini.innerHTML = ""
    if(!gruppi[0] || gruppi[0].length == 0) {
        ordini.innerHTML = "Nessun prodotto trovato"
        return;
    }
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
            ordine.querySelector('.card-title').innerHTML =  '#' + elem.id_ordine + elem.id_prodotto
            ordine.querySelector('.input').onclick = () => update_ordine(elem)
            ordine.querySelector('.ddesc').innerHTML = "Quantità: "  + elem.quantità
            
            const icona = ordine.querySelector('.icon')
            const stato = stati[elem.stato]
            icona.innerHTML = stato.icona
            icona.className = "btn btn-" + (stato.colore ? stato.colore : 'primary')

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
            n_ordine.innerHTML += elem.id_ordine + "-"
            container.appendChild(container_ordine)
            
            if(item_consegnati == array.length) {
                const consegnato = document.createElement('div')
                consegnato.innerHTML = '<i class="fa-solid fa-circle-check"></i> Consegnato'
                consegnato.style.color = "green"
                container.appendChild(consegnato)
            }
            data = elem.creazione
        })
        n_ordine.innerHTML = n_ordine.innerHTML.substring(0, n_ordine.innerHTML.length - 1)
        n_ordine.innerHTML = `<div class='d-flex flex-row justify-content-between'>${n_ordine.innerHTML}<span>${data}</span></div>`
        ordini.appendChild(container)
        })
}

//Otteniamo tutti gli ordini
fetch('http://localhost:5000/api/get_orders',{
    method: "POST",
    headers: {
        'content-type' : 'application/json'
    },
    body: JSON.stringify({
        email: localStorage.getItem('email'),
        password: localStorage.getItem('password'),
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role')
    })
})
    .then(res => res.json())
    .then(res => {
        if(res.items.length == 0) {
            container.innerHTML = "Nessun ordine disponibile"
            return
        }

        //Ordinamento per gruppo
        const res_sorted = res.items.sort((a, b) => a.gruppo - b.gruppo)
        
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
        render_ordini(gruppi)
        show_content()
    })
    .catch((ee) => show_error(), console.log(ee))

//Ricerca di un ordine
const search = () => {
    const id_ordine = document.querySelector('#nome_o').value.trim()
    if(!id_ordine) location.reload()
    fetch(`http://localhost:5000/api/search_orders/${id_ordine}`)
        .then(res => res.json())
        .then(res => render_ordini(Array(res.ordini)))
        .catch((e) => show_error(), console.log(e))
    }

cerca.addEventListener('click',search)
document.addEventListener('keydown',(e) => {
    if(e.key === 'Enter') cerca.click()
})

//Filtro. PER DEFAULT GLI ORDINI CONSEGNATI NON SONO RENDERIZZATI
document.querySelector('#filtro_b').addEventListener('click',() => {
    const myModal = new bootstrap.Modal(document.getElementById("filtro_m"));
    myModal.show();
    //NON FUNZIONA 
})