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

        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM fully loaded and parsed');
            document.getElementById('category-form').addEventListener('submit', event => {
                event.preventDefault();
                const category = document.getElementById('category-select').value;
                console.log('Category selected:', category);
                fetchRecipes(category);
            });
            fetchCategories();
        });
        function fetchCategories() {
    fetch('/categories')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(categories => {
            console.log('Categories fetched:', categories);
            populateCategoriesDropdown(categories);
        })
        .catch(error => console.error('Error fetching categories:', error));
}

function populateCategoriesDropdown(categories) {
    const categorySelect = document.getElementById('category-select');

    // Clear existing options
    categorySelect.innerHTML = '<option value="">Select a category</option>';

    // Add options for each category
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

        function fetchRecipes(category = '') {
            const url = category ? `/api/recipes?category=${category}` : '/api/recipes';
            console.log('Fetching recipes from URL:', url);

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Recipes fetched:', data);
                    displayRecipes(data);
                })
                .catch(error => console.error('Error fetching recipes:', error));
        }

        function displayRecipes(recipes) {
            const recipesContainer = document.getElementById('recipes-container');
            recipesContainer.innerHTML = '';

            if (recipes.length === 0) {
                recipesContainer.innerHTML = '<p>No recipes found.</p>';
                return;
            }

            recipes.forEach(recipe => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipecategory');

                const recipeLink = document.createElement('a');
                recipeLink.href = `recipe-details.html?title=${encodeURIComponent(recipe.title)}`;
                recipeLink.textContent = recipe.title;

                const recipeImage = document.createElement('img');
                recipeImage.src = recipe.image;
                recipeImage.alt = recipe.title;
                recipeImage.classList.add('recipecategory-image');

                recipeDiv.appendChild(recipeImage);
                recipeDiv.appendChild(recipeLink);
                recipesContainer.appendChild(recipeDiv);
            });
        }