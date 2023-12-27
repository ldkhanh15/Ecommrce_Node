import User from '../models/User'
const getUser = (id) => {
    return new Promise(async(resolve,reject)=>{
        try {
            let data=await User.find();
            resolve({
                data
            })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    getUser
}