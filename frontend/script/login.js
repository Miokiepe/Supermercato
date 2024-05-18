const password = document.querySelector('#password')

const iconEye = document.querySelector('#toggle')
iconEye.addEventListener('click',()=>{
        if(password.type === "password") {
            password.type = "text"
            iconEye.innerHTML = '<i class="bi bi-eye"></i>'
        }
        else {
            password.type = "password"
            iconEye.innerHTML = '<i class="bi bi-eye-slash"></i>'
        }
})

const toggler = document.querySelector('#toggler')
const image = document.querySelector('#image')
const select = document.querySelector('#select')

toggler.addEventListener('click',() => {
    if(toggler.classList.contains('checked')) {
        toggler.classList.remove('checked')
        image.style.background = "linear-gradient(45deg, #4D194D, #006466)"
        select.style.display = "none"
    }
    else {
        toggler.classList.add('checked')
        image.style.background = "linear-gradient(45deg, #B7094C, #0091AD)"
        select.style.display = "block"
    }
})

const button = document.querySelector('#submit')
const loader = document.querySelector('#loader')
button.addEventListener('click',() => {
    button.disabled = true
    loader.style.display = "block"
    const email = document.querySelector('#email').value, password = document.querySelector('#password').value
    fetch('http://localhost:5000/api/login',{
        method: "POST",
        body: JSON.stringify({email: email, password: password})
    }).then(res => console.log(res)).catch(res=>{
        alert("ERRORE")
        button.disabled = false
        loader.style.display = "none"
    })
})