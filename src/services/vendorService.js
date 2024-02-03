import db from '../models/index'

const getVendor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data=await db.User.findAll({
                include:[
                    {
                        model:db.Payment,as:'payment',attributes:['name']
                    }
                ]
            })
            resolve({data})
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    getVendor
}