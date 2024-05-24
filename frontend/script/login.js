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
const error = document.querySelector('#message')

button.addEventListener('click',() => {
    button.disabled = true;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const role = document.querySelector('#select').value == "0" ? "utente" : document.querySelector('#select').value == "1" ? "corriere" : "admin"
    console.log(role)
    if (!email.trim() || !password.trim()) {
        error.innerHTML = "Uno o più campi vuoti!";
        error.style.display = "block";
        button.disabled = false;
        return;
    }
    fetch('http://localhost:5000/api/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password, role: role })
    }).then(async res => {
        if (res.status == 401) {
            error.innerHTML = "Credenziali inserite errate";
            error.style.display = "block";
            button.disabled = false;
            return;
        }
        localStorage.clear()
        localStorage.setItem('email', email);
        localStorage.setItem('pass', password);
        const re = await res.json()
        localStorage.setItem('email',email);
        localStorage.setItem('password',password);
        localStorage.setItem('token',re.token);
        localStorage.setItem('role',role);
        if(role == "utente") window.location.replace("./Pages/home.html")
        else if(role == "admin") window.location.replace("./Pages/admin.html")
             else window.location.replace('./Pages/corriere.html')
    })
    .catch(error => {
        console.error('Error:', error);
        button.disabled = false;
        error.style.display = 'block';
        error.innerHTML = "Errore con il server. Riprova più tardi";
    });
});