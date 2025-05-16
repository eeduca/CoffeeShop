function changeContent(page) {
	var containerDiv = document.getElementById('container'); 

	switch (page) {
		case 'home':
			{
				containerDiv.innerHTML = `
				
				<h2>
					Welcome to the Home Page!
				</h2>
				<p>
					This is the main page.
				</p>
				<p>
					Explore the different sections using
					the navigation menu.
				</p>
			`;
				break;
			}
		default:
			{
				containerDiv.innerHTML = `
				
				<h2>
					Error Page Not Found!
				</h2>
				<p>
					Page was not found.
				</p>
				<p>
					Explore the different sections using
					the navigation menu.
				</p>
			`;
				break;
			}

	}
	}