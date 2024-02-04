import categoryService from '../services/categoryService'

const getCate = async (req, res) => {
    try {
        let data = await categoryService.getCate(req);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
}

const createCate = async (req, res) => {
    try {
        let data = await categoryService.createCate(req);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
}

const deleteCate = async (req, res) => {
    try {
        let data = await categoryService.deleteCate(req);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
}

const updateCate = async (req, res) => {
    try {
        let data = await categoryService.updateCate(req);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
}

module.exports ={
    getCate,
    createCate,
    deleteCate,
    updateCate,
}