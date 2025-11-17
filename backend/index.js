const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('BMG corp Backend is running!');
});

// Define Routes
app.use('/api/auth', require('./routes/auth'));

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
