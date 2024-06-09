export const items = [{
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
}]

export const stati = [
    {
        icona: '<i class="fa-solid fa-spinner"></i>',
        nome: "In preparazione",
        perc: "0%",
        titolo: "Pacco in preparazione",
        desc: "Il pacco è in preparazione per la spedizione."
    },
    {
        icona: '<i class="fa-solid fa-truck"></i>',
        nome: "Spedito",
        perc: "25%",
        titolo: "Pacco spedito",
        desc: "Il pacco è partito dallo stabilimento in cui si trovava."
    },
    {
        icona: '<i class="fa-solid fa-truck-fast"></i>',
        nome: "In transito",
        perc: "50%",
        titolo: "Pacco in transito",
        desc: "Il pacco è in transito nei vari centri di smistamento."
    },
    {
        icona: '<i class="fa-solid fa-truck-ramp-box"></i>',
        nome: "In consegna",
        perc: "75%",
        titolo: "Pacco in consegna",
        desc: "Il pacco è in consegna."
    },
    {
        icona: '<i class="fa-solid fa-circle-check"></i>',
        nome: "Consegnato",
        perc: "100%",
        titolo: "Pacco consegnato",
        desc: "Il pacco è stato consegnato con successo.",
        colore: "success"
    }, 
    {
        icona: '<i class="fa-solid fa-circle-xmark"></i>',
        nome: "Mancata consegna",
        perc: "75%",
        titolo: "Mancata consegna",
        desc: "Non è stato possibile consegnare il pacco. Riproveremo domani alla stessa ora.",
        colore: "danger"
    },
    {
        icona: '<i class="fa-solid fa-question"></i>',
        nome: "Smarrito",
        perc: "0%",
        titolo: "Pacco smarrito",
        desc: "Il pacco è stato smarrito. Rivolgiti all'area clienti per assistenza.",
        colore: "secondary"
    }
]

export const show_error = (message = "Impossibile connettersi al server", className = "") => {
    const error = document.querySelector('#error')
    if(className !== "") error.className = className
    error.innerHTML = message
    error.style.display = 'block'
    document.querySelector('.spinner-border').style.display = 'none'
}

export const show_content = () => {
    document.querySelector('.spinner-border').style.display = 'none'
    document.querySelector('main').style.visibility = 'visible'
}

export default items