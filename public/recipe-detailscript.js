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
const urlParams = new URLSearchParams(window.location.search);
const recipeTitle = urlParams.get('title');

if (recipeTitle) {
    fetchRecipeDetails(recipeTitle);
} else {
    document.getElementById('recipe-container').innerHTML = '<p>Recipe not found.</p>';
}
});

function fetchRecipeDetails(recipeTitle) {
fetch(`/api/recipe?title=${encodeURIComponent(recipeTitle)}`)
    .then(response => response.json())
    .then(data => displayRecipeDetails(data))
    .catch(error => console.error('Error fetching recipe details:', error));
}

function displayRecipeDetails(recipe) {
const recipeContainer = document.getElementById('recipe-container');
recipeContainer.innerHTML = '';

const imageDiv = document.createElement('div');
imageDiv.classList.add('recipe-image');
imageDiv.style.backgroundImage = `url(${recipe.image_url})`;
recipeContainer.appendChild(imageDiv);

const recipeTitle = document.createElement('h1');
recipeTitle.textContent = recipe.title;


 const ingredientsHeading = document.createElement('h2');
ingredientsHeading.textContent = 'Ingredients:';

const ingredientsParagraph = document.createElement('p');
ingredientsParagraph.textContent = recipe.ingredients;

// Instructions section
const instructionsHeading = document.createElement('h2');
instructionsHeading.textContent = 'Instructions:';

const instructionsParagraph = document.createElement('p');
instructionsParagraph.textContent = recipe.instructions;

// Cooking Time section
const cookingTimeHeading = document.createElement('h2');
cookingTimeHeading.textContent = 'Cooking Time:';

const cookingTimeParagraph = document.createElement('p');
cookingTimeParagraph.textContent = `${recipe.cooking_time}`;

// Serving Size section
const servingSizeHeading = document.createElement('h2');
servingSizeHeading.textContent = 'Serving Size:';

const servingSizeParagraph = document.createElement('p');
servingSizeParagraph.textContent = recipe.serving_size;

// Categories section
const categoriesHeading = document.createElement('h2');
categoriesHeading.textContent = 'Categories:';

const categoriesParagraph = document.createElement('p');
categoriesParagraph.textContent = recipe.categories;

// Appending all to recipeContainer
recipeContainer.appendChild(recipeTitle);

recipeContainer.appendChild(ingredientsHeading);
recipeContainer.appendChild(ingredientsParagraph);

recipeContainer.appendChild(instructionsHeading);
recipeContainer.appendChild(instructionsParagraph);

recipeContainer.appendChild(cookingTimeHeading);
recipeContainer.appendChild(cookingTimeParagraph);

recipeContainer.appendChild(servingSizeHeading);
recipeContainer.appendChild(servingSizeParagraph);

recipeContainer.appendChild(categoriesHeading);
recipeContainer.appendChild(categoriesParagraph);
}