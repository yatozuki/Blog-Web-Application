import express from "express";
import bodyParser from "body-parser";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
    
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));


const posts = [];

app.get('/', (req, res) => {
    res.render('index.ejs', {posts});
});

app.get('/post', (req, res) => {
    res.render('post.ejs');
});

app.get('/content/:id', (req, res) => {
    const id = Number(req.params.id);
    const post = posts[id];

    if (!post) {
        return res.status(404).render('nothing.ejs')
    }

    res.render('content.ejs', { post });
});

app.post('/submit', (req, res) => {
    const title = req.body['title'];
    const context = req.body['text-area'];
    const id = posts.length;


    const date = new Date();
    const year = date.getFullYear(); // Get the full year (e.g., 2024)
    const month = date.toLocaleString('default', { month: 'long' }); // Get the full month name (e.g., December)
    const day = date.getDate(); // Get the day of the month (e.g., 21)
    
    const dateData = `${year}, ${month} ${day}`;


    posts.push({id, title, context, dateData});
    res.redirect('/');

});


app.post('/delete', (req, res) => {
    const id = Number(req.body.id); // Get the ID from the form

    // Find the post with the given ID
    const postIndex = posts.findIndex(post => post.id === id);

    if (postIndex === -1) {
        return res.status(404).render('nothing.ejs');
    }

    // Remove the post from the array by its index
    posts.splice(postIndex, 1);
    // Redirect to the home page after deleting the post
    res.redirect('/');
});




app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));