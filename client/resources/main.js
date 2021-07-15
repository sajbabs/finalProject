function displayHomePage() {
    document.getElementById('shopping').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'block';
    document.getElementById('loginErrorMsg').textContent = '';
    getProducts();
}

function displayLoginPage() {
    document.getElementById('shopping').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';
}

window.onload = function () {
    if (sessionStorage.getItem('accessToken')) {
        displayHomePage();
    } else {
        displayLoginPage();
    }

    document.getElementById('loginBtn').onclick = async function (event) {
        event.preventDefault();
        let result = await fetch('http://localhost:3000/authorize', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            })
        }).then(response => response.json());
        console.log(result);
        if (result.accessToken) {
            window.sessionStorage.setItem('accessToken', result.accessToken);
            displayHomePage();
        } else {
            document.getElementById('loginErrorMsg').textContent = result.error;
        }
    }

    document.getElementById('logoutBtn').onclick = function (event) {
        sessionStorage.removeItem('accessToken');
        location.reload();
    }

    // add/update product
    document.getElementById('product-btn').onclick = function (event) {
        event.preventDefault();
        if (!document.getElementById('product-btn').dataset.id) {
            console.log("Awaab");
            addProduct();
        } else {
            editProduct();
        }
    }
}

async function getProducts() {
    let products = await fetch('http://localhost:3000/books/', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
        }
    }).then(response => response.json());
    products.data.forEach(prod => {
        if (prod.id !== '') {
            // console.log(prod.id);
            renderProduct(prod);
        }


    });
}

function renderProduct(prod) {
    const div = document.createElement('div');
    div.classList = 'col-lg-2';
    // console.log(prod.id);
    div.id = prod.id;
    // div.innerHTML = `<svg class="bd-placeholder-img rounded-circle" 
    // width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" 
    // aria-label="Placeholder: 140x140" preserveAspectRatio="xMidYMid slice" 
    // focusable="false">
    // <title>Placeholder</title>
    // <rect width="100%" height="100%" fill="#777">
    // </rect><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text>
    // </svg>`;

    const h2 = document.createElement('h2');
    h2.textContent = prod.name;

    const price = document.createElement('p');
    price.textContent = prod.price;

    // const publishedDate = document.createElement('p');
    // publishedDate.textContent = prod.publishedDate;

    // const author = document.createElement('p');
    // author.textContent = prod.author;

    div.appendChild(h2);
    div.appendChild(price);
    // div.appendChild(publishedDate);
    // div.appendChild(author);

    const actions = document.createElement('p');
    const updateBtn = document.createElement('a');
    updateBtn.classList = 'btn btn-secondary';
    updateBtn.textContent = 'UPDATE';
    updateBtn.addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('product-heading').textContent = 'Edit Book';
        document.getElementById('title').value = prod.name;
        document.getElementById('price').value = prod.price;
        // document.getElementById('publishedDate').value = prod.publishedDate;
        // document.getElementById('author').value = prod.author;
        // document.getElementById('product-btn').dataset.id = prod.id;
    });

    const deleteBtn = document.createElement('a');
    deleteBtn.classList = 'btn btn-secondary';
    deleteBtn.textContent = 'DELETE';
    deleteBtn.addEventListener('click',  function (event) {
        event.preventDefault();
        fetch('http://localhost:3000/books', {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
            },
            body: JSON.stringify({ id: prod.id })
        }).then(response => {
            // alert('Delete Successfully!');
            response.json().then(data => {
                console.log(data.message);
                document.getElementById('alert').innerHTML = data.message;
            });

            div.remove();
            document.getElementById('product-form').reset();
        });
    });

    actions.appendChild(updateBtn);
    actions.appendChild(deleteBtn);

    div.appendChild(actions);

    document.getElementById('products').appendChild(div);
}


async function addProduct() {
    let result =  await fetch('http://localhost:3000/books/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
        },
        body: JSON.stringify({
            id: document.getElementById('id').value,
            name: document.getElementById('title').value,
            price: document.getElementById('price').value,
            // publishedDate: document.getElementById('publishedDate').value,
            // author: document.getElementById('author').value
        })
    }).then(response => {
        response.json().then(data => {
            console.log(data.message);
            document.getElementById('alert').innerHTML = data.message;
        });
        document.getElementById('product-form').reset();
    });
    renderProduct(result);
}

function editProduct() {
    const prodId = document.getElementById('product-btn').dataset.id;
    document.getElementById('id').value = prodId;
    console.log("prodId");
    const name = document.getElementById('title').value;
    const price = document.getElementById('price').value;
    // const publishedDate = document.getElementById('publishedDate').value;
    // const author = document.getElementById('author').value;
    fetch('http://localhost:3000/books/', {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
        },
        body: JSON.stringify({
            id: prodId,
            name: name,
            price: price
            // publishedDate: publishedDate,
            // author: author
        })
    }).then(response => response.json())
        .then(jsonObj => {
            jsonObj.json().then(data => console.log(data));
            const productDiv = document.getElementById(prodId);
            productDiv.querySelector('h2').textContent = name;
            const paragraphArr = productDiv.querySelectorAll('p');
            paragraphArr[0].textContent = name;
            paragraphArr[1].textContent = price;
            document.getElementById('product-heading').textContent = 'Add a new Book';
            document.getElementById('product-btn').dataset.id = '';
            document.getElementById('product-form').reset();
        });
}