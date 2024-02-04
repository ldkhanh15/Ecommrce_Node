import paymentService from '../services/paymentService'

const getPayment=async(req,res)=>{
    try {
        const data=await paymentService.getPayment(req.body);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const createPayment=async(req,res)=>{
    try {
        const data=await paymentService.createPayment(req.body);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const deletePayment=async(req,res)=>{
    try {
        const data=await paymentService.deletePayment(req.body);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const updatePayment=async(req,res)=>{
    try {
        const data=await paymentService.updatePayment(req.body);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

module.exports ={
    getPayment,
    createPayment,
    deletePayment,
    updatePayment,
}