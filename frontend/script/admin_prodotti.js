import items from "../Components/data.js";
const container = document.querySelector('#prodotti');
const card_t = document.querySelector("template")
//Cancellazione prodotto
const delete_item = (prodotto) => {
    fetch('http://localhost:5000/api/delete_item',{
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(prodotto)
    }).then(location.reload())
}
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

fetch('http://localhost:5000/api/get_items/999')
    .then(res => res.json())
    .then(res => {//nome,tipo,costo,disponibilità
        if (res.items) {
            res.items.forEach(elem => {
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
            container.innerHTML = "Nessun prodotto salvato";
        }
    })
    .catch(() => {
        error.style.display = "block"
        error.innerHTML = "Server non raggiungibile!";
    });


const myModal = new bootstrap.Modal(document.getElementById("modal"));
//Quando si preme il bottone +, appare il modale
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
//Aggiunta di un prodotto al db
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
    }).then(window.location.reload())
})