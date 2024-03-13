import deliverService from '../services/deliverService'

const createDeliver = async (req, res) => {
    try {
        let data = await deliverService.createDeliver(req.body);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const getDeliver = async (req, res) => {
    try {
        let data = await deliverService.getDeliver();
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const deleteDeliver = async (req, res) => {
    try {
        let data = await deliverService.deleteDeliver(req.body);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const updateDeliver = async (req, res) => {
    try {
        let data = await deliverService.updateDeliver(req.body);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
module.exports ={
    createDeliver,
    getDeliver,
    deleteDeliver,
    updateDeliver
}