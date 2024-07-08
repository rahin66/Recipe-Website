const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const path = require('path');
const multer = require('multer');
//Importing all of the modules

// Initializing express
const app = express();

// Database connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Rndum!pss123',
    database: 'recipe',
});

// Middleware
app.use(express.json());  //Using express to parse json files
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Create tables
function createTables() {
    const createRecipesTable = `CREATE TABLE IF NOT EXISTS recipes (
        title VARCHAR(255) UNIQUE,
        ingredients TEXT,
        instructions TEXT,
        cooking_time VARCHAR(50),
        serving_size VARCHAR(50),
        categories VARCHAR(255),
        image_url VARCHAR(255),
        username VARCHAR(255)
    )`;

    const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
        username VARCHAR(255),
        password VARCHAR(255),
        email VARCHAR(255),
        role ENUM('user', 'moderator') DEFAULT 'moderator'
    )`;

    db.query(createRecipesTable, (err) => {
        if (err) throw err;
        console.log('Recipes table created or already exists');
    });

    db.query(createUsersTable, (err) => {
        if (err) throw err;
        console.log('Users table created or already exists');
    });
}

createTables();

// Function to insert recipes for featured recipes page
function insertRecipes() {
    const recipes = [
      {
        title: 'Pasta',
        ingredients: '200g pasta\n2 tbsp olive oil\n2 cloves garlic, minced\n1 can diced tomatoes\n1 tsp dried basil',
        instructions: 'Cook pasta according to package instructions.\nIn a pan, heat olive oil and sauté garlic until fragrant.\nAdd diced tomatoes and basil, cook for 10 minutes.',
        cooking_time: '20 minutes',
        serving_size: '2',
        categories: 'Appetizers',
        image_url: '/images/pasta.jpg',
        username: null
      },
      {
        title: 'Biryani',
        ingredients: '1 cup basmati rice\n200g chicken, diced\n1 onion, sliced\n2 tomatoes, chopped\n1 cup yogurt\n1 tbsp ginger-garlic paste\n1 tsp biryani masala\n2 tbsp ghee\nSalt to taste\nFresh coriander for garnish',
        instructions: 'Cook rice until half done, set aside.\nIn a pot, heat ghee, sauté onions until golden brown.\nAdd ginger-garlic paste and chicken, cook until chicken is browned.\nAdd tomatoes, yogurt, and biryani masala, cook until oil separates.',
        cooking_time: '45 minutes',
        serving_size: '4',
        categories: 'Homefood',
        image_url: '/images/biryani.jpg',
        username: null
      },
      {
        title: 'Shakshuka',
        ingredients: '2 tbsp olive oil\n1 onion, diced\n1 bell pepper, diced\n2 cloves garlic, minced\n1 can diced tomatoes\n1 tsp cumin\n1 tsp paprika\n4 eggs\nSalt and pepper to taste\nFresh parsley for garnish',
        instructions: 'Heat olive oil in a pan, sauté onion and bell pepper until soft.\nAdd garlic, cumin, and paprika, cook for 1 minute.\nPour in diced tomatoes, simmer for 10 minutes.\nMake 4 wells in the sauce, crack an egg into each well.',
        cooking_time: '20 minutes',
        serving_size: '2',
        categories: 'Homefood',
        image_url: '/images/shakshuka.jpg',
        username: null
      },
      {
        title: 'Salad',
        ingredients: '4 cups mixed greens\n1 cucumber, sliced\n1 tomato, chopped\n1 red onion, sliced\n1 avocado, diced\n1/4 cup olive oil\n2 tbsp balsamic vinegar\nSalt and pepper to taste',
        instructions: 'In a large bowl, combine mixed greens, cucumber, tomato, onion, and avocado.\nIn a small bowl, whisk together olive oil, balsamic vinegar, salt, and pepper.\nDrizzle dressing over salad and toss to combine.',
        cooking_time: '10 minutes',
        serving_size: '2',
        categories: 'Vegan',
        image_url: '/images/salad.jpg',
        username: null
      },
      {
        title: 'Lasagna',
        ingredients: '12 lasagna noodles\n500g ground beef\n1 onion, diced\n2 cloves garlic, minced\n2 cups marinara sauce\n2 cups ricotta cheese\n2 cups shredded mozzarella cheese\n1/2 cup grated Parmesan cheese\n1 egg\n2 tbsp olive oil\nSalt and pepper to taste',
        instructions: 'Preheat oven to 375°F (190°C). Cook lasagna noodles according to package instructions.\nIn a pan, heat olive oil, sauté onion and garlic, then add ground beef and cook until browned.\nAdd marinara sauce, simmer for 10 minutes.\nIn a bowl, mix ricotta cheese, egg, salt, and pepper.\nTop with Parmesan cheese and bake for 30 minutes.',
        cooking_time: '60 minutes',
        serving_size: '6',
        categories: 'Exotic',
        image_url: '/images/lasagna.jpg',
        username: null
      },
      {
        title: 'Butter Chicken',
        ingredients: '500g chicken, cubed\n2 tbsp butter\n1 onion, diced\n2 cloves garlic, minced\n1 tbsp ginger paste\n1 cup tomato puree\n1/2 cup cream\n1 tsp garam masala\n1 tsp turmeric\n1 tsp chili powder\nSalt to taste\nFresh coriander for garnish',
        instructions: 'In a pan, melt butter and sauté onion, garlic, and ginger until fragrant.\nAdd chicken and cook until browned.\nAdd tomato puree, garam masala, turmeric, chili powder, and salt, simmer for 15 minutes.\nStir in cream and cook for another 5 minutes.\nGarnish with fresh coriander and serve.',
        cooking_time: '30 minutes',
        serving_size: '4',
        categories: 'Homefood',
        image_url: '/images/butterchicken.jpg',
        username: null
      },
      {
        title: 'Samosa',
        ingredients: 'For the dough:\n2 cups all-purpose flour\n1/4 cup vegetable oil\n1/2 tsp salt\nWater, as needed\n\nFor the filling:\n2 potatoes, boiled and mashed\n1/2 cup green peas, boiled\n1 onion, finely chopped\n2 green chilies, finely chopped\n1/2 inch ginger, grated\n1 tsp cumin seeds',
        instructions: '1. To make the dough, mix flour, salt, and oil in a bowl. Add water gradually and knead into a firm dough.',
        cooking_time: '40 minutes',
        serving_size: '4',
        categories: 'Fried Food',
        image_url: '/images/samosa.jpg',
        username: null
      },
      {
        title: 'Sushi',
        ingredients: '2 cups sushi rice\n3 cups water\n1/2 cup rice vinegar\n1 tbsp sugar\n1 tsp salt\nNori sheets\nAssorted fillings (e.g., cucumber, avocado, fish)\nSoy sauce for serving',
        instructions: 'Rinse rice until water runs clear, cook with water in a rice cooker.\nIn a small bowl, mix rice vinegar, sugar, and salt. Fold into cooked rice.\nPlace a nori sheet on a bamboo mat, spread rice over nori.\nAdd fillings and roll tightly.\nSlice into pieces and serve with soy sauce.',
        cooking_time: '40 minutes',
        serving_size: '4',
        categories: 'Exotic',
        image_url: '/images/sushi.jpg',
        username: null
      }
    ];
  
    const query = 'INSERT IGNORE INTO recipes (title, ingredients, instructions, cooking_time, serving_size, categories, image_url, username) VALUES ?';
  
    // Mapping recipes for insert
    const values = recipes.map(recipe => [
      recipe.title,
      recipe.ingredients,
      recipe.instructions,
      recipe.cooking_time,
      recipe.serving_size,
      recipe.categories,
      recipe.image_url,
      recipe.username
    ]);
  
    db.query(query, [values], (err, results) => {
      if (err) {
        console.error('Error inserting recipes:', err.stack);
        return;
      }
      console.log('Recipes inserted successfully');
      console.log(results);
    });
}
  
// function to insert recipes
insertRecipes();

// Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Routes
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});
// Signup route
app.post('/signup', (req, res) => {
    const { username, password, email } = req.body;

    db.query('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)', [username, password, email, 'moderator'], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Server error');
        }

        req.session.userId = results.insertId;
        req.session.role = 'moderator';
        req.session.username = username;

        res.redirect('/home');
    });
});
// Login using sql and express
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ? AND password = ? AND role = "moderator"', [username, password], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Server error');
        }

        const user = results[0];
        if (!user) {
            return res.redirect('/');
        } else {
            req.session.userId = user.id;
            req.session.role = user.role;
            req.session.username = user.username;
            return res.redirect('/home');
        }
    });
});
// Destroying session to logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send('Error logging out');
        }
        res.redirect('/');
    });
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Route to determine what page to go to depending on user role
app.get('/recipe', (req, res) => {
    const role = req.session.role;

    if (!role) {
        res.sendFile(path.join(__dirname, 'public', 'recipe.html'));
    } else if (role === 'moderator') {
        res.sendFile(path.join(__dirname, 'public', 'recipeadmin.html'));
    } else {
        res.send('Unauthorized');
    }
});
// Route for adding recipe
app.post('/add-recipe', upload.single('recipeImage'), (req, res) => { // Using multer to insert a single image
    const { title, ingredients, instructions, cooking_time, serving_size, categories } = req.body;
    const imageUrl = `/images/${req.file.filename}`;
    const username = req.session.username;

    if (!username) {
        return res.status(401).send('Unauthorized: Username not found in session');
    }

    const sql = 'INSERT INTO recipes (title, ingredients, instructions, cooking_time, serving_size, categories, image_url, username) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [title, ingredients, instructions, cooking_time, serving_size, categories, imageUrl, username];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Server error');
        }

        res.redirect('/recipe'); // After adding recipe, redirected back to /recipe route
    });
});
// API to fetch a single recipe for recipdetails page
app.get('/api/recipe', (req, res) => {
    const title = req.query.title;

    if (!title) {
        return res.status(400).send('Recipe title is required');
    }

    const sql = 'SELECT * FROM recipes WHERE title = ?';
    db.query(sql, [title], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            return res.status(404).send('Recipe not found');
        }

        res.json(results[0]);
    });
});
// API to get user info through session
app.get('/api/user-info', (req, res) => {
    res.json({ username: req.session.username || null });
});

// API to search recipes through title
app.get('/api/recipess', (req, res) => {
    const title = req.query.title;

    if (!title) {
        return res.status(400).json({ error: 'Title parameter is required' });
    }

    const sql = 'SELECT * FROM recipes WHERE title LIKE ?';
    const values = [`%${title}%`];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No recipes found' });
        }

        const recipes = results.map(recipe => ({
            title: recipe.title,
            description: recipe.description,
            image: recipe.image_url
        }));

        res.json(recipes);
    });
});
// API to fetch the recipe through category
app.get('/api/recipes', (req, res) => {
    const category = req.query.category;

    const sql = category ? 'SELECT * FROM recipes WHERE categories LIKE ?' : 'SELECT * FROM recipes';
    const values = category ? [`%${category}%`] : [];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No recipes found' });
        }

        const recipes = results.map(recipe => ({
            title: recipe.title,
            description: recipe.description,
            image: recipe.image_url
        }));

        res.json(recipes);
    });
});

app.get('/api/user-recipes', (req, res) => {
    const username = req.session.username; // Using session to get username

    const query = 'SELECT * FROM recipes WHERE username = ?';
    db.query(query, [username], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results);
    });
});

// Delete a recipe
app.delete('/api/delete-recipe', (req, res) => {
    const recipeTitle = req.query.title;

    // Disable SQL safe updates for this session
    db.query('SET SQL_SAFE_UPDATES = 0', (error) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        const query = 'DELETE FROM recipes WHERE title = ?';
        db.query(query, [recipeTitle], (error, results) => {
            // Again enabling SQL safe updates
            db.query('SET SQL_SAFE_UPDATES = 1', (safeUpdateError) => {
                if (safeUpdateError) {
                    console.error('Error re-enabling SQL_SAFE_UPDATES:', safeUpdateError);
                }

                if (error) {
                    return res.status(500).json({ error: error.message });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({ message: 'Recipe not found or not authorized' });
                }

                res.json({ message: 'Recipe deleted successfully' });
            });
        });
    });
});


//Populating the categories dropdown
app.get('/categories', (req, res) => {
    const query = 'SELECT DISTINCT categories FROM recipes';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).send('Server error');
        }
        const categories = results.map(result => result.categories);
        res.json(categories);
    });
});


app.listen(3000, () => {
    console.log('Server running on port 3000');
});
