import { show_content, show_error, stati } from "../Components/data.js"

document.querySelector('#title').innerHTML = "Benvenuto " + localStorage.getItem('nome')

fetch('http://localhost:5000/api/get_data_courier')
    .then(res => res.json())
    .then(res => {

        const data = {
            labels: [],
            datasets: [{
              label: '',
              data: [],
              backgroundColor: ["#31D2F2","#0B5ED7","#09316b","#19283e","#157347","red","#6C757D","#5C636A","#DC3545"],
              hoverOffset: 4
            }]
          };

        stati.forEach(stato => data.labels.push(stato.nome))
        res.spedizioni.forEach(elem => data.datasets[0].data.push(elem.n_item))
        new Chart(document.querySelector('#graph'), {
            type: 'doughnut',
            data: data
        })
        show_content()
    })
    .catch((e) => {
        console.log(e)
        show_error()
    })