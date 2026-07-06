const BrandModel = require('./BrandModel');


const getAll = async (req, res) => {
    try {
        const data = await BrandModel.get();
        res.json(data);
    } catch (error) {
        console.error(error);
    }
}


// const { id } = req.params;

// await BrandModel.delete(id);

// res.json({ message: "Brand deleted successfully" });


//  const { id } = req.params;
// const body = req.body;

// const response = await BrandModel.update(id, body);
// const data = await response.json();


//  const { id } = req.params;

// const response = await BrandModel.getById(id);
// const data = await response.json();

// if (!data) {
//     return res.status(404).json({ message: "Brand not found" });
// }

// const body = req.body;

//         const response = await BrandModel.create(body);
//         const data = await response.json();



module.exports = {
    getAll
}