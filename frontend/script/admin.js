import {show_content, show_error, items} from "../Components/data.js"

document.querySelector('#title').innerHTML = "Benvenuto " + localStorage.getItem('nome')

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
      
      const mesi = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"]
      let mese_attuale = new Date().getMonth()
      for(let i = 0; i <= mese_attuale; i++) Data.labels.push(mesi[i])

      res.venduti_mese.forEach(elem => Data.datasets[0].data.push( elem == null ? 0 : elem.n_venduti))

    new Chart(document.querySelector('#venduti_mese'), {
        type: 'line',
        data: Data
    })
}

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