const express = require('express');
const mongoose = require('mongoose');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/post', postRoutes);
app.use('/comment', commentRoutes);

mongoose.connect('mongodb://localhost:27017/assignmentDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
