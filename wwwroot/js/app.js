const screenTable = document.getElementById('screen-table');
const screenMenu = document.getElementById('screen-menu');
const screenAside = document.querySelector('aside');
const asideList = document.getElementById('order-list');
const asideBottom = screenAside.querySelector(".aside-bottom")
const tables = screenTable.querySelectorAll('.btn-table');
const btnBack = document.getElementById('btn-back');
const btnAdd = document.querySelectorAll('.btn-add');
const cancelReceiptBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");

tables.forEach((table) => {
    table.addEventListener('click', async (event) => {
        const tableNum = Number(event.target.getAttribute('data-table-id') ?? -1);
        if (tableNum === -1) {
            return;
        }

        asideList.innerHTML = ''; // Clear previous items
        asideBottom.innerHTML = ''; // Clear previous items
        screenMenu.innerHTML = ''; // Clear previous items
        //console.log(tableNum);
        drawScreenMenu(tableNum);
        await isOccupied(tableNum);
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

function drawScreenMenu(tableNum) {

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
            btnAdd.onclick = event => {
                addOrderItem(product.id, tableNum);
            };
            productCard.appendChild(btnAdd);


        });
    });
};


function drawAsideItems(tableNum) {

    let title = document.createElement('div');
    title.textContent = "Order List";
    title.style.textAlign = "center";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "1em";
    asideList.appendChild(title);

    fetch(`api/CoffeeShop/GetOrderItems/${tableNum}`).then(response => {
        if (!response.ok) {
            throw new Error(response.status);
        }
        return response.json();
    }).then(data => {

        const orderItems = {};
        var totalPrice = 0.0;

        data.forEach(item => {
            if (!orderItems[item.productName]) {
                orderItems[item.productName] = { quantity: 0, unitPrice: item.unitPrice };
            }
            orderItems[item.productName].quantity += 1;
            totalPrice += item.unitPrice;
        });

        Object.keys(orderItems).forEach((item) => {

            let orderItemBox = document.createElement('div');
            orderItemBox.style.padding = "1em 0 0 0";
            orderItemBox.style.borderBottom = "1px dashed var(--color-text)";
            asideList.appendChild(orderItemBox);

            let itemName = document.createElement('span');
            itemName.textContent = item;
            itemName.style.display = "inline-block";
            itemName.style.width = "40%";
            itemName.style.textAlign = "left";
            orderItemBox.appendChild(itemName);

            let itemQuantity = document.createElement('span');
            itemQuantity.textContent = orderItems[item].quantity;
            itemQuantity.style.display = "inline-block";
            itemQuantity.style.width = "20%";
            itemQuantity.style.textAlign = "center";
            itemQuantity.style.border = "1px solid var(--color-text)";
            orderItemBox.appendChild(itemQuantity);

            let itemPrice = document.createElement('span');
            itemPrice.textContent = `${orderItems[item].unitPrice.toFixed(2)} €`;
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
            btnSub.onclick = event => {
                removeOrderItem(item, tableNum);
            };
            orderItemBox.appendChild(btnSub);
        })


        let totalPriceTag = document.createElement('div');
        totalPriceTag.textContent = `Total ${totalPrice.toFixed(2)} €`;
        totalPriceTag.style.textAlign = 'right';
        totalPriceTag.style.padding = "1em 0 0 0";
        asideBottom.appendChild(totalPriceTag);

        let btnPrint = document.createElement('button');
        btnPrint.textContent = 'Print';
        btnPrint.classList.add('print');
        btnPrint.onclick = event => {
            printReceipt(tableNum, totalPrice);
        };
        asideBottom.appendChild(btnPrint);

    });
}


function isOccupied(tableNum) {

    return fetch(`api/CoffeeShop/IsOccupied/${tableNum}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Došlo je do greške");
            }
            return response.json(); // true or false
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


async function addOrderItem(productIdentification, tableNumber) {
    try {
        const response = await fetch('api/CoffeeShop/AddOrderItem', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ tableNum: tableNumber, productId: productIdentification })
        });

        if (!response.ok) Error("Error in addOrderItem response is not ok");
        else { console.log("addOrderItem is ok!") }

    }
    catch (error) {
        console.error(error);
        return null;
    }
    //console.log("Proba test");
    asideList.innerHTML = '';// Clear previous items
    asideBottom.innerHTML = '';// Clear previous items
    drawAsideItems(tableNumber);
}

async function removeOrderItem(productName, tableNumber) {
    try {
        const response = await fetch('api/CoffeeShop/RemoveOrderItem', {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ tableNum: tableNumber, name: productName })
        });

        if (!response.ok) Error("Error in removeOrderItem response is not ok");
        else { console.log("removeOrderItem is ok!") }

    }
    catch (error) {
        console.error(error);
        return null;
    }
    //console.log("Proba test");
    asideList.innerHTML = ''; // Clear previous items
    asideBottom.innerHTML = '';// Clear previous items
    drawAsideItems(tableNumber);
}

function printReceipt(tableNumber, totalPrice) {
    console.log(`TableNum is ${tableNumber} in printReceipt func`);
    asideList.innerHTML = '';

    let title = document.createElement('div');
    title.textContent = "Order Receipt";
    title.style.textAlign = "center";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "1em";
    asideList.appendChild(title);

    fetch(`api/CoffeeShop/GetOrder/${tableNumber}`).then(response => {
        if (!response.ok) {
            throw new Error(response.status);
        }
        return response.json();
    }).then(data => {

        data.forEach((item) => {
            let tableNumBox = document.createElement('div');
            tableNumBox.style.padding = "1em 0 0 0";
            tableNumBox.style.borderBottom = "1px dashed var(--color-text)";
            asideList.appendChild(tableNumBox);

            let tableNumLabel = document.createElement('span');
            tableNumLabel.textContent = 'Table number:';
            tableNumLabel.style.display = "inline-block";
            tableNumLabel.style.width = "60%";
            tableNumLabel.style.textAlign = "left";
            tableNumBox.appendChild(tableNumLabel);

            let tableNum = document.createElement('span');
            tableNum.textContent = `${tableNumber}`;
            tableNum.style.display = "inline-block";
            tableNum.style.width = "25%";
            tableNum.style.fontSize = "1.2em";
            tableNum.style.textAlign = "right";
            tableNumBox.appendChild(tableNum);

            let totalPriceBox = document.createElement('div');
            totalPriceBox.style.padding = "1em 0 0 0";
            totalPriceBox.style.borderBottom = "1px dashed var(--color-text)";
            asideList.appendChild(totalPriceBox);

            let totalPriceLabel = document.createElement('span');
            totalPriceLabel.textContent = 'Total:';
            totalPriceLabel.style.display = "inline-block";
            totalPriceLabel.style.width = "60%";
            totalPriceLabel.style.textAlign = "left";
            totalPriceBox.appendChild(totalPriceLabel);

            let totalPriceValue = document.createElement('span');
            totalPriceValue.textContent = `${totalPrice.toFixed(2)} €`;
            totalPriceValue.style.display = "inline-block";
            totalPriceValue.style.width = "25%";
            totalPriceValue.style.fontSize = "1.2em";
            totalPriceValue.style.textAlign = "right";
            totalPriceBox.appendChild(totalPriceValue);

            let btnCancel = document.createElement('button');
            btnCancel.textContent = 'Cancel';
            btnCancel.style.display = "inline";
            btnCancel.classList.add('btn-sub');
            btnCancel.style.marginLeft = "1em";
            btnCancel.onclick = event => {
                cancelReceipt();
            };
            asideList.appendChild(btnDone);

            let btnDone = document.createElement('button');
            btnDone.textContent = 'Done';
            btnDone.style.display = "inline";
            btnDone.classList.add('btn-sub');
            btnDone.style.marginLeft = "1em";
            btnDone.onclick = event => {
                cancelReceipt();
            };
            asideList.appendChild(btnDone);

        });
    });

    }
function cancelReceipt() {
            console.log("Close the window");
        }

btnBack.addEventListener('click', (event) => {
    screenTable.classList.remove('hidden');
    screenMenu.classList.add('hidden');
    btnBack.classList.add('hidden');
    asideBottom.classList.add('hidden');
    asideList.classList.add('hidden');
});
