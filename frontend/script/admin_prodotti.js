const container = document.querySelector('#prodotti')
fetch('http://localhost:5000/api/get_items').then(res => res.json()).then(res => {
    res.items.foreach(elem => {
        
    })
})