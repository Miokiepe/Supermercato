import {items, show_content, show_error, hide_content} from '../Components/data.js'
const container = document.querySelector('#prodotti')
const card_t = document.querySelector("template")
let prodotti_g

//Funzione per renderizzare i prodotti
const render_prodotti = (prodotti) => {
    container.innerHTML = ""
    if (prodotti.length != 0) {
        prodotti.forEach(elem => {
        const card = card_t.content.cloneNode(true)
        card.querySelector(".card-title").innerHTML = elem.nome
        card.querySelector(".card-subtitle").innerHTML = 
            `<span style='color: ${items[elem.tipo].colore}'>
                ${items[elem.tipo].icona} ${items[elem.tipo].nome}
            </span>`
        card.querySelector('.quantità').innerHTML = elem.disponibilità
        card.querySelector('.costo').innerHTML = '€' + elem.costo
        card.querySelector('.delete').onclick = () => delete_item(elem)
        card.querySelector('.modify').onclick = () => modify_item(elem)
        container.appendChild(card)
        });
    } else {
        container.innerHTML = "Nessun prodotto trovato";
    }
}

//Cancellazione prodotto nel server
const delete_item = (prodotto) => {
    fetch('http://localhost:5000/api/delete_item',{
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(prodotto)
    })
        .then(() => location.reload())
        .catch(() => show_error("Server non disponibile! Operazione anullata"))
}

//Apertura del modale filtro
const myModalf = new bootstrap.Modal(document.getElementById("filtro_m"));
const myInput = document.getElementById('filtro_b')
myInput.addEventListener('click', () => {
  myModalf.show()
})

//Funzione di ricerca prodotti
const search = () => {
    const nome = document.querySelector('#nome_o').value
    if(nome == "") location.reload()
    hide_content('.se','#prodotti')
    fetch(`http://localhost:5000/api/search_items/${nome}`)
        .then(res => res.json())
        .then(res => {
            show_content('.se','#prodotti')
            prodotti_g = res.items;
            render_prodotti(filter_prodotti())
        })
    }

document.querySelector('#cerca').addEventListener('click',() => search())
    
//Funzione filtro
const filter_prodotti = () => {
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
    myModalf.hide()
    return filtered_array;
}

document.querySelector('#app').addEventListener('click',() =>  render_prodotti(filter_prodotti()))

//Modale di modifica
let old_prodotto;
const modify_item = (prodotto) => {
    document.querySelector('#m_nome').value = prodotto.nome
    document.querySelector('#m_icona').style.color = items[prodotto.tipo].colore
    document.querySelector('#m_icona').innerHTML = items[prodotto.tipo].icona
    m_categoria = document.querySelector('#m_categoria').value = prodotto.tipo
    document.querySelector('#m_costo').value = prodotto.costo
    document.querySelector('#m_disponibilità').value = prodotto.disponibilità
    new bootstrap.Modal(document.getElementById("mod")).show();
    old_prodotto = prodotto
}

//Salvataggio sul server del prodotto modificato
document.querySelector('#mod_item').addEventListener('click',() => {
    const nome = document.querySelector('#m_nome').value,
          costo = document.querySelector('#m_costo').value,
          disponibilità = document.querySelector('#m_disponibilità').value

    if(!nome || !costo || !disponibilità) {
        error.style.display = "block"
        document.querySelector('#text').innerHTML = "Procedura di modifica annullata! Uno o più campi non sono stati compilati";
        return;
    } 
    fetch('http://localhost:5000/api/update_item',{
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            old: old_prodotto,
            new: {
                id_prodotto: 0,
                nome: nome,
                tipo: m_categoria,
                costo: parseFloat(costo),
                disponibilità: parseInt(disponibilità),
                creazione: null
            }
        })
    }).then(() => location.reload())
})


//Otteniamo gli items dal server
fetch('http://localhost:5000/api/get_items/999')
    .then(res => res.json())
    .then(res => {
        show_content()
        prodotti_g = res.items
        render_prodotti(res.items)
    })
    .catch(() => show_error());


//Quando si preme il bottone +, appare il modale per l'aggiunta di un prodotto
const myModal = new bootstrap.Modal(document.getElementById("modal"));
document.getElementById('add').addEventListener('click', function () {
    myModal.show();
});


const m_categoria_item = document.querySelector('#m_categoria')
const m_icona = document.querySelector('#m_icona')
let m_categoria
document.querySelector('#m_categoria').addEventListener('change',() => {
    const index = m_categoria_item.value
    m_categoria = index
    m_icona.innerHTML = items[index].icona
    m_icona.style.color = items[index].colore
})

const categoria_item = document.querySelector('#categoria')
const icona = document.querySelector('#icona')
let categoria = categoria_item.value;
categoria_item.addEventListener('change',() => {
    const index = categoria_item.value
    categoria = index
    icona.innerHTML = items[index].icona
    icona.style.color = items[index].colore
})

const error = document.querySelector('#error')
//Salvataggio del prodotto nel server
document.querySelector('#add_item').addEventListener('click',() => {
    const nome = document.querySelector('#nome').value,
          costo = document.querySelector('#costo').value,
          disponibilità = document.querySelector('#disponibilità').value

    if(!nome || !costo || !disponibilità) {
        error.style.display = "block"
        document.querySelector('#text').innerHTML = "Procedura di aggiunta annullata! Uno o più campi non sono stati compilati";
        return;
    } 

    fetch('http://localhost:5000/api/add_item',{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_prodotto: 0,
            nome: nome,
            tipo: categoria,
            costo: parseFloat(costo),
            disponibilità: parseInt(disponibilità),
            creazione: "0"
        })
    }).then(() => location.reload())
})