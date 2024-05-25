window.onload = () => {
    const email = localStorage.getItem('email'), 
          password = localStorage.getItem('password'), 
          token = localStorage.getItem('token'),
          role = localStorage.getItem('role')
    if(!email || !password || !token) window.location.reload('../index.html')
    fetch("http://localhost:5000/api/home", {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({email: email, password: password, token: token, role: role})
    }).then(async res => {
        if(res.status === 301) {
            localStorage.clear()
            window.location.replace('../index.html')
        }
        res = await res.json()
        localStorage.setItem('nome', res.nome)
        localStorage.setItem('id',res.id)
        localStorage.setItem('n', res.carrello.n)
    }).catch(e => console.log(e))
}