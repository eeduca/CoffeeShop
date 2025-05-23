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
        price: 1.20,
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
        quantity: 4,
        price: 4.80,
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
    }

]

const screenTable = document.getElementById('screen-table');
const screenMenu = document.getElementById('screen-menu');
const screenAside = document.querySelector('aside');
const asideItems = document.getElementById('order-list');
const asideBottom = screenAside.querySelector(".aside-bottom")
const tables = screenTable.querySelectorAll('.btn-table');
const btnBack = document.getElementById('btn-back');

tables.forEach((table) => {
    table.addEventListener('click', (event) => {
        const tableId = Number(event.target.getAttribute('data-table-id') ?? -1);
        if (tableId === -1) {
            return;
        }
        else {
            asideItems.innerHTML = ''; // Clear previous items
            screenMenu.innerHTML = ''; // Clear previous items
            console.log(tableId);
            drawScreenMenu();
            screenMenu.scrollTop = 0; // Reset scroll position
            drawAsideItems(tableId);
        }

        screenTable.classList.add('hidden');
        screenMenu.classList.remove('hidden');
        btnBack.classList.remove('hidden');
        asideBottom.classList.remove('hidden');
        asideItems.classList.remove('hidden');

        //console.log('Table clicked:', event.target.getAttribute('data-table-id') ?? -1);

        return;
    });
});

function drawScreenMenu() {

    products.forEach((product) => {
        let productCard = document.createElement('div');
        productCard.classList.add('product-box');
        screenMenu.appendChild(productCard);

        let productName = document.createElement('div');
        productName.textContent = product.name;
        productCard.appendChild(productName);

        let productImg = document.createElement('img');
        productImg.src = `https://${product.image}`;
        productImg.alt = product.name;
        productImg.width = 256;
        productImg.height = 256; 
        productImg.style.width = "100%";
        productImg.style.height = "auto";
        productImg.style.display = "block";
        productCard.appendChild(productImg);

        let itemPrice = document.createElement('div');
        itemPrice.textContent = `${product.price} e`;
        itemPrice.style.display = "inline";
        productCard.appendChild(itemPrice);

        let btnAdd = document.createElement('button');
        btnAdd.textContent = '+';
        productCard.appendChild(btnAdd);
    });
}
function drawAsideItems(id) {


    let title = document.createElement('div');
    title.textContent = "Order List";
    title.textAlign = "center";
    title.style.marginBottom ="1em";
    asideItems.appendChild(title);

    orderList.forEach((orderItem) => {
        let orderItemBox = document.createElement('div');
        orderItemBox.style.padding= "1em 1em 1em 0";
        asideItems.appendChild(orderItemBox);

        let itemName = document.createElement('span');
        itemName.textContent = orderItem.productName;
        itemName.style.display = "inline-block";
        itemName.style.width = "33%";
        itemName.style.textAlign= "left";
        orderItemBox.appendChild(itemName);

        let itemQuantity = document.createElement('span');
        itemQuantity.textContent = orderItem.quantity;
        itemName.style.display = "inline-block";
        itemName.style.width = "33%";
        itemName.style.textAlign = "center";
        orderItemBox.appendChild(itemQuantity);

        let itemPrice = document.createElement('span');
        itemPrice.textContent = `${orderItem.price} e`;
        itemName.style.display = "inline-block";
        itemName.style.width = "33%";
        itemName.style.textAlign = "right";
        orderItemBox.appendChild(itemPrice);

    });

    //screenAsideItem
    //console.log(id);   
}

btnBack.addEventListener('click', (event) => {
    screenTable.classList.remove('hidden');
    screenMenu.classList.add('hidden');
    btnBack.classList.add('hidden');
    asideBottom.classList.add('hidden');
    asideItems.classList.add('hidden');
});
