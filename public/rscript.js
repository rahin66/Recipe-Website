fetch('/api/user-info')
            .then(response => response.json())
            .then(data => {
                const userGreeting = document.getElementById('userGreeting');
                const authButton = document.getElementById('authButton');
                if (data.username) {
                    userGreeting.innerHTML = `Hello, ${data.username}`;
                    authButton.innerHTML = 'Logout';
                    authButton.href = '/logout';
                } else {
                    userGreeting.innerHTML = '';
                    authButton.innerHTML = 'Login';
                    authButton.href = '/login.html';
                }
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
            });
        function searchRecipes() {
            const query = document.getElementById('search-bar').value.trim();
            if (!query) {
                alert('Please enter a search term');
                return;
            }

            fetch(`/api/recipess?title=${encodeURIComponent(query)}`)
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(error => {
                            throw new Error(error.error);
                        });
                    }
                    return response.json();
                })
                .then(data => displayRecipes(data))
                .catch(error => {
                    console.error('Error fetching recipes:', error);
                    alert(error.message);
                });
        }

        function displayRecipes(recipes) {
    const container = document.getElementById('recipes-container');
    container.innerHTML = '';

    recipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('card');

        const image = document.createElement('img');
        image.src = recipe.image;
        image.alt = recipe.title;
        recipeElement.appendChild(image);

        const content = document.createElement('div');
        content.classList.add('content');

        const title = document.createElement('h3');
        title.textContent = recipe.title;
        content.appendChild(title);

        const description = document.createElement('p');
        description.textContent = recipe.description;
        content.appendChild(description);

        const viewRecipeButton = document.createElement('button');
        viewRecipeButton.textContent = 'View Recipe';
        viewRecipeButton.addEventListener('click', () => {
            window.location.href = `recipe-details.html?title=${encodeURIComponent(recipe.title)}`;
        });
        content.appendChild(viewRecipeButton);

        recipeElement.appendChild(content);
        container.appendChild(recipeElement);
    });
}
function viewRecipe(title) {
            window.location.href = `recipe-details.html?title=${encodeURIComponent(title)}`;
        }

        document.addEventListener('DOMContentLoaded', () => {
            // Displaying recipes
            fetch('/api/recipess?title=')
                .then(response => response.json())
                .then(data => displayRecipes(data))
                .catch(error => console.error('Error fetching recipes:', error));
        });