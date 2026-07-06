const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json("server is healthy");
})

app.use('/brand', BrandRoutes);

app.listen(5000, () => {
    console.log("server is running at 5000");
});