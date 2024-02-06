import vendorService from '../services/vendorService'

const getVendor = async (req, res) => {
    try {
        let data=await vendorService.getVendor(req);
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

module.exports ={
    getVendor,
    createVendor,
    deleteVendor,
    updateVendor,
}
