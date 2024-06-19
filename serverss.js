const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const path = require('path');

const app = express();

// Database connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Rndum!pss123',
    database: 'recipe',
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
console.log("Hello");
// Login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Registration page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Server error');
        }

        const user = results[0];
        if (!user) {
            return res.redirect('/'); // Redirect back to login page on failed login
        } else {
            req.session.userId = user.id;
            req.session.role = user.role;
            return res.redirect('/home');
        }
    });
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send('Error logging out');
        }
        res.redirect('/');
    });
});

// Home page route
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Recipe route
app.get('/recipe', (req, res) => {
    const role = req.session.role;

    console.log('Session Role:', role);

    if (!role) {
        res.redirect('/');
        return;
    }

    if (role === 'user') {
        console.log('Redirecting to recipe.html for user');
        res.sendFile(path.join(__dirname, 'public', 'recipe.html'));
    } else if (role === 'moderator') {
        console.log('Redirecting to recipeadmin.html for moderator');
        res.sendFile(path.join(__dirname, 'public', 'recipeadmin.html'));
    } else {
        console.log('Unauthorized access');
        res.send('Unauthorized');
    }
});

// Registration route
app.post('/signup', (req, res) => {
    const { username, password, email } = req.body;

    db.query('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)', [username, password, email, 'user'], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Server error');
        }

        req.session.userId = results.insertId;
        req.session.role = 'user';

        res.redirect('/home');
    });
});

// Add recipe route
app.post('/add-recipe', (req, res) => {
    const { title, ingredients, instructions, cooking_time, serving_size, categories } = req.body;

    const sql = 'INSERT INTO recipes (title, ingredients, instructions, cooking_time, serving_size, categories) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [title, ingredients, instructions, cooking_time, serving_size, categories];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Server error');
        }

        res.redirect('/recipe');
    });
});



// Example: Serve homepage directly
app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Serve other static files, like CSS and JavaScript
app.get('/public/*', (req, res) => {
    res.sendFile(path.join(__dirname, req.url));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
