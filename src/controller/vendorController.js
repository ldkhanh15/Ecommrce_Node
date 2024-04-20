import vendorService from '../services/vendorService'

const getVendor = async (req, res) => {
    try {
        let data=await vendorService.getVendor(req);
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const getVendorAll = async (req, res) => {
    try {
        let data=await vendorService.getVendorAll(req);
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const getDeliver = async (req, res) => {
    try {
        let data=await vendorService.getDeliver(req);
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const createVendor = async (req, res) => {
    try {
        let data=await vendorService.createVendor(req);
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const deleteVendor = async (req, res) => {
    try {
        let data=await vendorService.deleteVendor(req);
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const updateVendor = async (req, res) => {
    try {
        let data=await vendorService.updateVendor(req);
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const updateAvatarVendor = async (req, res) => {
    try {
        let data=await vendorService.updateAvatarVendor(req);
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const addDeliver = async (req, res) => {
    try {
        let data=await vendorService.addDeliver(req);
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const delDeliver = async (req, res) => {
    try {
        let data=await vendorService.delDeliver(req);
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const getSearch = async (req, res) => {
    try {
        let data=await vendorService.getSearch(req);
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

module.exports ={
    getVendor,
    getVendorAll,
    createVendor,
    deleteVendor,
    updateVendor,
    updateAvatarVendor,
    addDeliver,
    delDeliver,
    getDeliver,
    getSearch
}
