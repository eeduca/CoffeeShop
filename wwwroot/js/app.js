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

const screenTable = document.getElementById('screen-table');
const screenMenu = document.getElementById('screen-menu');
const screenAside = document.getElementById('screen-aside');
const tables = screenTable.querySelectorAll('.btn-table');
const btnBack = document.getElementById('btn-back');

tables.forEach((table) => {
    table.addEventListener('click', (event) => {
        const tableId = Number(event.target.getAttribute('data-table-id') ?? -1);
        if (tableId === -1) {
            return;
        }

        if (tableId === 0) {
            console.log('Izabrana je kasa')
        }
        else {
            console.log(tableId);
            drawScreenMenu();
            drawAsideItems(tableId);
        }

        screenTable.classList.add('hidden');
        screenMenu.classList.remove('hidden');
        btnBack.classList.remove('hidden');

        //console.log('Table clicked:', event.target.getAttribute('data-table-id') ?? -1);

        return;
    });
});

function drawScreenMenu() {
    products.forEach((product) => {
        let newElement = document.createElement('div');
        newElement.textContent = product.name;
        newElement.classList.add('testClass');
        screenMenu.appendChild(newElement);
    });
}
function drawAsideItems(id) {
    console.log(id);   
}

btnBack.addEventListener('click', (event) => {
    screenTable.classList.remove('hidden');
    screenMenu.classList.add('hidden');
    btnBack.classList.add('hidden');
});
