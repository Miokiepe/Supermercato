const navbar = document.querySelector('#nav');
fetch('../Components/admin_navbar.html').then(res => res.text()).then(res => {
    navbar.className = "navbar navbar-expand-lg bg-body-tertiary"
    navbar.setAttribute('data-bs-theme',"dark")
    navbar.innerHTML = res
})