const products = [
    {
        id: 1,
        name: 'Coca Cola',
        price: 1.55,
        image: 'picsum.photos/256/256'
    },
    {
        id: 2,
        name: 'Kapucino',
        price: 2.60,
        image: 'picsum.photos/256/256'
    },
    {
        id: 3,
        name: 'Espresso',
        price: 1.80,
        image: 'picsum.photos/256/256'
    },
    {
        id: 4,
        name: 'Pivo',
        price: 2.00,
        image: 'picsum.photos/256/256'
    },
    {
        id: 5,
        name: 'Vino',
        price: 3.00,
        image: 'picsum.photos/256/256'
    },
    {
        id: 6,
        name: 'Whiskey',
        price: 4.50,
        image: 'picsum.photos/256/256'
    },
    {
        id: 7,
        name: 'Rakija',
        price: 2.50,
        image: 'picsum.photos/256/256'
    },
    {
        id: 8,
        name: 'Caj',
        price: 36.20,
        image: 'picsum.photos/256/256'
    },
    {
        id: 9,
        name: 'Sok',
        price: 1.80,
        image: 'picsum.photos/256/256'
    },
    {
        id: 10,
        name: 'Mineralna voda',
        price: 1.00,
        image: 'picsum.photos/256/256'
    }
]

const orderList = [
    {
        quantity: 14,
        price: 54.80,
        productName: "Caj"
    },
    {
        quantity: 1,
        price: 1.55,
        productName: "Coca-Cola"
    },
    {
        quantity: 2,
        price: 3.60,
        productName: "Sok"
    },
    {
        quantity: 1,
        price: 1.55,
        productName: "Coca-Cola"
    },
    {
        quantity: 2,
        price: 3.60,
        productName: "Sok"
    },
    {
        quantity: 1,
        price: 1.55,
        productName: "Coca-Cola"
    },
    {
        quantity: 2,
        price: 3.60,
        productName: "Sok"
    },
    {
        quantity: 1,
        price: 1.55,
        productName: "Coca-Cola"
    },
    {
        quantity: 2,
        price: 3.60,
        productName: "Sok"
    }

]

const screenTable = document.getElementById('screen-table');
const screenMenu = document.getElementById('screen-menu');
const screenAside = document.querySelector('aside');
const asideList = document.getElementById('order-list');
const asideBottom = screenAside.querySelector(".aside-bottom")
const tables = screenTable.querySelectorAll('.btn-table');
const btnBack = document.getElementById('btn-back');

tables.forEach((table) => {
    table.addEventListener('click', (event) => {
        const tableNum = Number(event.target.getAttribute('data-table-id') ?? -1);
        if (tableNum === -1) {
            return;
        }

        asideList.innerHTML = ''; // Clear previous items
        screenMenu.innerHTML = ''; // Clear previous items
        console.log(tableNum);
        drawScreenMenu();
        isOccupied(tableNum);
        drawAsideItems(tableNum);

        screenTable.classList.add('hidden');
        screenMenu.classList.remove('hidden');
        btnBack.classList.remove('hidden');
        asideBottom.classList.remove('hidden');
        asideList.classList.remove('hidden');

        screenMenu.scrollTop = 0; // Reset scroll position
        asideList.scrollTop = 0; // Reset scroll position

        //console.log('Table clicked:', event.target.getAttribute('data-table-id') ?? -1);

        return;
    });
});

function drawScreenMenu() {

    fetch('api/CoffeeShop/GetProducts').then(response => {
        if (!response.ok) {
            throw new Error(response.status);
        }
        return response.json();
    }).then(data => {
        //console.log("Lista proizvoda: ", data);

        data.forEach((product) => {
            let productCard = document.createElement('div');
            productCard.classList.add('product-box');
            screenMenu.appendChild(productCard);

            let productImg = document.createElement('img');
            productImg.src = `/img/${product.imageFileName}`;
            productImg.alt = product.name;
            productImg.width = 256;
            productImg.height = 256;
            productImg.style.width = "80%";
            productImg.style.height = "auto";
            productImg.style.display = "block";
            productImg.style.borderRadius = "inherit";
            productCard.appendChild(productImg);

            let productName = document.createElement('div');
            productName.textContent = product.name;
            productName.style.fontWeight = "bold";
            productName.style.margin = "2px";
            productCard.appendChild(productName);

            let itemPrice = document.createElement('div');
            itemPrice.textContent = `${product.price.toFixed(2)} €`;
            itemPrice.style.display = "inline-block";
            itemPrice.style.textAlign = "left";
            itemPrice.style.width = "70px";
            itemPrice.style.fontSize = "1.2em";
            productCard.appendChild(itemPrice);

            let btnAdd = document.createElement('button');
            btnAdd.textContent = '+';
            btnAdd.classList.add('btn-add');
            productCard.appendChild(btnAdd);
        });
    });

}

async function drawAsideItems(tableNum) {
    const orderId = await getOrderId(tableNum);

    if (orderId !== null) {
        //console.log(`Za sto ${tableNum} aktivna porudžbina ima ID: ${orderId}`);

        let title = document.createElement('div');
        title.textContent = "Order List";
        title.style.textAlign = "center";
        title.style.fontWeight = "bold";
        title.style.marginBottom = "1em";
        asideList.appendChild(title);

        fetch(`api/CoffeeShop/GetOrderItems/${orderId}`).then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        }).then(data => {
            data.forEach((orderItem) => {
                let orderItemBox = document.createElement('div');
                orderItemBox.style.padding = "1em 0 0 0";
                orderItemBox.style.borderBottom = "1px dashed var(--color-text)";
                asideList.appendChild(orderItemBox);

                let itemName = document.createElement('span');
                itemName.textContent = orderItem.productName;
                itemName.style.display = "inline-block";
                itemName.style.width = "40%";
                itemName.style.textAlign = "left";
                orderItemBox.appendChild(itemName);

                let itemQuantity = document.createElement('span');
                itemQuantity.textContent = orderItem.quantity;
                itemQuantity.style.display = "inline-block";
                itemQuantity.style.width = "20%";
                itemQuantity.style.textAlign = "center";
                itemQuantity.style.border = "1px solid var(--color-text)";
                orderItemBox.appendChild(itemQuantity);

                let itemPrice = document.createElement('span');
                itemPrice.textContent = `${orderItem.price.toFixed(2)} €`;
                itemPrice.style.display = "inline-block";
                itemPrice.style.width = "25%";
                itemPrice.style.fontSize = "1.2em";
                itemPrice.style.textAlign = "right";
                orderItemBox.appendChild(itemPrice);


                let btnSub = document.createElement('button');
                btnSub.textContent = '-';
                btnSub.style.display = "inline-block";
                btnSub.classList.add('btn-sub');
                btnSub.style.marginLeft = "1em";
                orderItemBox.appendChild(btnSub);
            })
        });
    }
    else {
        console.log(`Nema aktivne porudžbine za sto ${tableNum}`);
    }
}

async function getOrderId(tableNum) {
    try {
        const response = await fetch(`/api/CoffeeShop/GetOrderId/${tableNum}`);
        const orderId = await response.json();
        return orderId;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}


function isOccupied(tableNum) {

    fetch(`api/CoffeeShop/IsOccupied/${tableNum}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Došlo je do greške");
            }
            return response.json(); // ovo će biti true ili false
        })
        .then(result => {
            if (result === false) {
                //The table is not occupied, you can proceed to create a new order
                createNewOrder(tableNum);
                return;
            }
        })
        .catch(error => {
            console.error("Error in fetch function.", error);
        });
}

function createNewOrder(tableNum) {
    fetch('api/CoffeeShop/CreateOrder', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ tableNumber: tableNum }) // Replace with the actual table number
    }).then(response => {
        if (!response.ok) Error("Error in createNewOrder response is not ok");
        else { console.log("createNewOrder is ok!") }
    });
}


async function addOrderItem(tableNum) {
    const orderId = await getOrderId(tableNum);


}
btnAdd.addEventListener('click', (event) => {
});

btnBack.addEventListener('click', (event) => {
    screenTable.classList.remove('hidden');
    screenMenu.classList.add('hidden');
    btnBack.classList.add('hidden');
    asideBottom.classList.add('hidden');
    asideList.classList.add('hidden');
});
