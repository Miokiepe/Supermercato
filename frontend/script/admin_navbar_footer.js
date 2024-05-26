const navbar = document.querySelector('#nav');
fetch('../Components/admin_navbar.html').then(res => res.text()).then(res => {
    navbar.className = "navbar navbar-expand-lg bg-body-tertiary"
    navbar.setAttribute('data-bs-theme',"dark")
    navbar.innerHTML = res
})

fetch('../Components/footer.html').then(res => res.text()).then(res => { 
    footer.innerHTML = res
    document.querySelector('#year').innerHTML = (new Date().getFullYear())
})