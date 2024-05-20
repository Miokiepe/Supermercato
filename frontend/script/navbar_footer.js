window.onload = () => {
    const navbar = document.querySelector('#nav');
    fetch('../Components/navbar.html').then(res => res.text()).then(res => navbar.innerHTML = res)
}