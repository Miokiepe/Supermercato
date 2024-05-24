const container = document.querySelector('#prodotti');
const card_t = document.querySelector("template")
/*fetch('http://localhost:5000/api/get_items')
    .then(res => res.json())
    .then(res => {
        console.log(res);
        if (res.items) {
            res.items.forEach(elem => {
            const card = card_t.content.cloneNode(true)
            container.appendChild(card)
            });
        } else {
            container.innerHTML = "Nessun prodotto disponibile";
        }
    })
    .catch(() => {
        error.style.display = "block"
        error.innerHTML = "Server non raggiungibile!";
    });*/

const items = [{
    nome: "Arredamento",
    colore: "#f6511d",
    icona: '<i class="fa-solid fa-couch"></i>'
}, {
    nome: "Alimentari",
    colore: "#ffb400",
    icona: '<i class="fa-solid fa-burger"></i>'
}, {
    nome: "Elettronica",
    colore: "#00a6ed",
    icona: ' <i class="fa-solid fa-mobile"></i>'
}, {
    nome: "Indumenti",
    colore: "#7fb800",
    icona: '<i class="fa-solid fa-shirt"></i>'
}, {
    nome: "Sport",
    colore: "#0d2c54 ",
    icona: '<i class="fa-solid fa-volleyball"></i>'
}
]

const myModal = new bootstrap.Modal(document.getElementById("modal"));
//Quando si preme il bottone +, appare il modale
document.getElementById('add').addEventListener('click', function () {
    myModal.show();
});

const categoria_item = document.querySelector('#categoria')
const icona = document.querySelector('#icona')
let categoria = categoria_item.value;

categoria_item.addEventListener('change',() => {
    const index = categoria_item.value
    categoria = items[index].nome
    icona.innerHTML = items[index].icona
    icona.style.color = items[index].colore
})

const error = document.querySelector('#error')

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
            id: 0,
            nome: nome,
            tipo: categoria,
            costo: parseFloat(costo),
            disponibilità: parseInt(disponibilità),
            creazione: "0"
        })
    }).then(window.location.reload())
})