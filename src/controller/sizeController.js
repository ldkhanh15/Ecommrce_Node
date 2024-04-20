import sizeService from '../services/sizeService'


const getSize = async (req, res) => {
    try {
        const data = await sizeService.getSize(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const createSize = async (req, res) => {
    try {
        const data = await sizeService.createSize(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const deleteSize = async (req, res) => {
    try {
        const data = await sizeService.deleteSize(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const updateSize = async (req, res) => {
    try {
        const data = await sizeService.updateSize(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const getSearch = async (req, res) => {
    try {
        const data = await sizeService.getSearch(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getSize,
    createSize,
    deleteSize,
    updateSize,
    getSearch
}