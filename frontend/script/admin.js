import {show_content, show_error, items, mesi} from "../Components/data.js"

document.querySelector('#title').innerHTML = "Benvenuto " + localStorage.getItem('nome')
const modale = new bootstrap.Modal(document.getElementById("modal_gl"));
let graph, graph2 = null
//Funzione per renderizzare i grafici
const render_grafici = (res) => {
    
    //Grafico a torta
    const data = {
        labels: [],
        datasets: [{
          label: 'Prodotti venduti per categoria',
          data: [],
          backgroundColor: [],
          hoverOffset: 4
        }]
      };
      let venduti = 0
      items.forEach((item, index) => {
        data.labels.push(item.nome)
        data.datasets[0].backgroundColor.push(item.colore)
        data.datasets[0].data.push(res.venduti_categorie[index].n_venduti)
        venduti += res.venduti_categorie[index].n_venduti
      });
      //Grafico a linea
      document.querySelector('#totale').innerHTML = `Item venduti quest'anno: ${venduti}`
      new Chart(document.querySelector('#venduti_tipo'),{
        type: 'doughnut',
        data: data
      })

    
    const Data = {
      labels:[],
        datasets: [{
          label: 'Vendite di prodotti al mese',
          data: [],
          fill: false,
          borderColor: '#555280',
          tension: 0.1
        }]
      }
      
      
      let mese_attuale = new Date().getMonth()
      for(let i = 0; i <= mese_attuale; i++) Data.labels.push(mesi[i].nome)

      res.venduti_mese.forEach(elem => Data.datasets[0].data.push( elem == null ? 0 : elem.n_venduti))

      graph = new Chart(document.querySelector('#venduti_mese'), {
        type: 'line',
        data: Data
      })
}

//Otteniamo i dati dal server
fetch('http://localhost:5000/api/get_data_admin')
    .then(res => res.json())
    .then(res => {
        show_content()
        console.log(res)
        render_grafici(res)
    })
    .catch((e) => {
        console.log(e)
        show_error()
    })

//Mostriamo il modale di filtro e renderizziamo gli input radio
document.querySelector('#open_gl').addEventListener('click', () => {
  modale.show()
  const mese_attuale = new Date().getMonth()

  const continer = document.querySelector('#filtri')
  continer.innerHTML = ""

  for(let i = 0; i <= mese_attuale; i++) {
    const div = document.createElement('div')
    const label = document.createElement('label')
    const radio = document.createElement('input')

    div.className = "d-flex flex-row gap-2"

    radio.id = `e${i}`
    radio.className = "form-check-input check"
    radio.type = 'radio'
    radio.name = 'mese'
    div.appendChild(radio)

    label.innerHTML = mesi[i].nome
    label.for = radio.id
    label.className = "form-check-label"
    div.appendChild(label)
    
    continer.appendChild(div)
  }

  const div = document.createElement('div')
  const label = document.createElement('label')
  const radio = document.createElement('input')

  div.className = "d-flex flex-row gap-2"

  radio.id = 'e13'
  radio.className = "form-check-input check"
  radio.type = 'radio'
  radio.name = 'mese'
  div.appendChild(radio)

  label.innerHTML = "Tutti i mesi"
  label.for = radio.id
  label.className = "form-check-label"
  div.appendChild(label)

  continer.appendChild(div)   
})

//Applichiamo i filtri
document.querySelector('#app').addEventListener('click',() => {
  if (document.querySelector('#e13').checked) location.reload()
  const mese_attuale = new Date().getMonth()
  let i = 0;
  while(!document.querySelector(`#e${i}`).checked) i++
  fetch(`http://localhost:5000/api/get_data/${i}`)
    .then(res => res.json())
    .then(res => {
      console.log(res)
      //Renderizziamo un nuovo grafico a linea
      const Data = {
        labels:[],
          datasets: [{
            label: `Vendite di prodotti a ${mesi[i].nome}`,
            data: [],
            fill: false,
            borderColor: '#555280',
            tension: 0.1
          }]
        }

        for(let j = 1; j <= mesi[i].giorni; j++) 
          Data.labels.push(j)

        let total_items = 0
        res.venduti_mese.forEach(elem => {
          Data.datasets[0].data.push( elem == null ? 0 : elem.n_venduti)
          elem != null && (total_items += elem.n_venduti)
        })

        graph.destroy()

        if(graph2) graph2.destroy()

        graph2 = new Chart( document.querySelector('#venduti_mese'), {
          type: 'bar',
          data: Data,
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        })
        
        document.querySelector('#totale').innerHTML = `Totale item venduti a ${mesi[i].nome} ${total_items}`
        //Modificare i colori per la estetica
        modale.hide()
    })
    .catch((e) => {
      console.log(e)
      show_error()
    })
})