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
        icona: '<i class="fa-solid fa-hourglass-start"></i>',
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
    },
    {   
        icona: '<i class="fa-solid fa-xmark"></i>',
        nome: "Anullato",
        perc: "100%",
        titolo: "Spedizione anullata",
        desc: "Dopo due tentativi di consegna fallimentari, abbiamo anullato l'ordine. Otterrai il rimborso nelle prossime ore.",
        colore: "secondary"
    }
]

export const badges = [
    {
        nome: "Admin",
        colore: "#ad1151",
        icona: '<i class="fa-solid fa-user-tie"></i>'
    },
    {
        nome: "Corriere",
        colore: "#088ca9",
        icona: '<i class="fa-solid fa-user-tag"></i>'
    }
]

export const prefixes = [
    { prefisso: '1', emoji: '🇺🇸' },     // Stati Uniti
    { prefisso: '20', emoji: '🇪🇬' },    // Egitto
    { prefisso: '27', emoji: '🇿🇦' },    // Sudafrica
    { prefisso: '30', emoji: '🇬🇷' },    // Grecia
    { prefisso: '31', emoji: '🇳🇱' },    // Paesi Bassi
    { prefisso: '32', emoji: '🇧🇪' },    // Belgio
    { prefisso: '33', emoji: '🇫🇷' },    // Francia
    { prefisso: '34', emoji: '🇪🇸' },    // Spagna
    { prefisso: '36', emoji: '🇭🇺' },    // Ungheria
    { prefisso: '39', emoji: '🇮🇹' },    // Italia
    { prefisso: '40', emoji: '🇷🇴' },    // Romania
    { prefisso: '41', emoji: '🇨🇭' },    // Svizzera
    { prefisso: '43', emoji: '🇦🇹' },    // Austria
    { prefisso: '44', emoji: '🇬🇧' },    // Regno Unito
    { prefisso: '45', emoji: '🇩🇰' },    // Danimarca
    { prefisso: '46', emoji: '🇸🇪' },    // Svezia
    { prefisso: '47', emoji: '🇳🇴' },    // Norvegia
    { prefisso: '48', emoji: '🇵🇱' },    // Polonia
    { prefisso: '49', emoji: '🇩🇪' },    // Germania
    { prefisso: '51', emoji: '🇵🇪' },    // Perù
    { prefisso: '52', emoji: '🇲🇽' },    // Messico
    { prefisso: '54', emoji: '🇦🇷' },    // Argentina
    { prefisso: '55', emoji: '🇧🇷' },    // Brasile
    { prefisso: '56', emoji: '🇨🇱' },    // Cile
    { prefisso: '60', emoji: '🇲🇾' },    // Malesia
    { prefisso: '62', emoji: '🇮🇩' },    // Indonesia
    { prefisso: '63', emoji: '🇵🇭' },    // Filippine
    { prefisso: '64', emoji: '🇳🇿' },    // Nuova Zelanda
    { prefisso: '64', emoji: '🇨🇦' },    // Canada
    { prefisso: '65', emoji: '🇸🇬' },    // Singapore
    { prefisso: '66', emoji: '🇹🇭' },    // Thailandia
    { prefisso: '81', emoji: '🇯🇵' },    // Giappone
    { prefisso: '82', emoji: '🇰🇷' },    // Corea del Sud
    { prefisso: '86', emoji: '🇨🇳' },    // Cina
    { prefisso: '90', emoji: '🇹🇷' },    // Turchia
    { prefisso: '91', emoji: '🇮🇳' },    // India
    { prefisso: '98', emoji: '🇮🇷' },    // Iran
    { prefisso: '212', emoji: '🇲🇦' },   // Marocco
    { prefisso: '234', emoji: '🇳🇬' },   // Nigeria
    { prefisso: '256', emoji: '🇺🇬' },   // Uganda
    { prefisso: '258', emoji: '🇲🇿' },   // Mozambico
    { prefisso: '354', emoji: '🇮🇸' },   // Islanda
    { prefisso: '358', emoji: '🇫🇮' },   // Finlandia
    { prefisso: '420', emoji: '🇨🇿' },   // Repubblica Ceca
    { prefisso: '43', emoji: '🇦🇹' },    // Austria (doppio, ma corretto)
    { prefisso: '48', emoji: '🇵🇱' },    // Polonia (doppio, ma corretto)
    { prefisso: '64', emoji: '🇳🇿' },    // Nuova Zelanda (doppio, ma corretto)
    { prefisso: '971', emoji: '🇦🇪' },   // Emirati Arabi Uniti
    { prefisso: '964', emoji: '🇮🇶' }    // Iraq
  ];

export const mesi = [
    {   nome: "Gennaio",
        giorni: 31
    },
    {
        nome: "Febbraio",
        giorni: 28
    },
    {
        nome: "Marzo",
        giorni: 31
    },
    {
        nome: "Aprile",
        giorni: 30
    },
    {
        nome: "Maggio",
        giorni: 31
    },
    {
        nome: "Giugno",
        giorni: 30
    },
    {
        nome: "Luglio",
        giorni: 31
    },
    {
        nome: "Agosto",
        giorni: 31
    },
    {
        nome: "Settembre",
        giorni: 30
    },
    {
        nome: "Ottobre",
        giorni: 31
    },
    {
        nome: "Novembre",
        giorni: 30
    },
    {
        nome: "Dicembre",
        giorni: 31
    }
]

export const show_error = (message = "Impossibile connettersi al server", className = "", dismissible = false) => {
    const error = document.querySelector('#error')
    if(className !== "") error.className = className
    error.innerHTML = message
    if(dismissible) error.innerHTML += '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'
    error.style.display = 'block'
    document.querySelector('.spinner-border').style.display = 'none'
}

export const show_content = (spinner = '.spinner-border', content = 'main') => {
    document.querySelector(spinner).style.display = 'none'
    document.querySelector(content).style.visibility = 'visible'
}

export const hide_content = (spinner = '.spinner-border', content = 'main') => {
    document.querySelector(spinner).style.display = 'block'
    document.querySelector(content).style.visibility = 'hidden'
}

export default items