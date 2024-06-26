const navbar = document.querySelector('#nav'),
      footer = document.querySelector('#footer');
    fetch('../Components/navbar.html').then(res => res.text()).then(res => {
        navbar.className = "navbar navbar-expand-lg bg-body-tertiary"
        navbar.setAttribute('data-bs-theme',"dark") 
        navbar.innerHTML = res
        document.querySelector('#n').innerHTML = localStorage.getItem('n') || 0
    })

    fetch('../Components/footer.html').then(res => res.text()).then(res => { 
        footer.innerHTML = res
        document.querySelector('#year').innerHTML = (new Date().getFullYear())
    })

