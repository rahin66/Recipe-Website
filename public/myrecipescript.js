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

        // Fetching and displaying user's recipes
        fetch('/api/user-recipes')
            .then(response => response.json())
            .then(recipes => {
                const container = document.getElementById('myRecipesContainer');
                container.innerHTML = ''; // Clear existing content
                recipes.forEach(recipe => {
                    const recipeDiv = document.createElement('div');
                    recipeDiv.classList.add('recipe');
                    recipeDiv.innerHTML = `
                        <div class="recipe-image">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </div>
                        <div class="recipe-details">
                            <h3>${recipe.title}</h3>
                            <div class="recipe-content">
                                <div class="recipe-info">
                                    <p>${recipe.ingredients}</p>
                                    <p>${recipe.instructions}</p>
                                    <p>Cooking time: ${recipe.cooking_time}</p>
                                    <p>Serving size: ${recipe.serving_size}</p>
                                    <p>Categories: ${recipe.categories}</p>
                                </div>
                                <button onclick="deleteRecipe('${recipe.title}')">Delete</button>
                            </div>
                        </div>
                    `;
                    container.appendChild(recipeDiv);
                });
            })
            .catch(error => console.error('Error fetching user recipes:', error));

        // Deleting recipe function
        function deleteRecipe(title) {
    const confirmed = confirm(`Are you sure you want to delete the recipe "${title}"?`);
    if (!confirmed) return;

    fetch(`/api/delete-recipe?title=${encodeURIComponent(title)}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                location.reload();
            } else {
                console.error('Error deleting recipe');
            }
        })
        .catch(error => console.error('Error deleting recipe:', error));
}
