import overviewService from '../services/overviewService'

const getOverview=async(req,res)=>{
    try {
        let data=await overviewService.getOverview(req)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    getOverview
}