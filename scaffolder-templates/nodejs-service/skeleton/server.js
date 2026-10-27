const express = require('express');
const app = express();
const port = process.env.PORT || ${{ values.port }};

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: '${{ values.name }}' });
});

app.get('/', (req, res) => {
  res.send('Welcome to ${{ values.name }}!');
});

app.listen(port, () => {
  console.log(`${{ values.name }} listening on port ${port}`);
});
