import db from '../models'
const getDeliver = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Deliver.findAll();
            resolve({
                message: 'Successfully',
                errCode: 1,
                data: data
            })
        } catch (error) {
            reject(error)
        }
    })
}
const createDeliver = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { name,price } = data;
            if (name && price) {
                const deliver = await db.Deliver.create(data)
                await deliver.save();
                resolve({
                    message: 'Successfully',
                    errCode: 1,
                })
            }
            resolve({
                errMessage: 'Missing name deliver or price!',
                errCode: 2
            })
        } catch (error) {
            reject(error)
        }
    })
}
const deleteDeliver = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = data;
            if (id) {
                await db.Deliver.destroy({
                    where: { id }
                })
                resolve({
                    message: 'Successfully',
                    errCode: 1,
                })
            }
            resolve({
                errMessage: 'Missing id Deliver!',
                errCode: 2
            })
        } catch (error) {
            reject(error)
        }
    })
}
const updateDeliver = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id, name ,price} = data;
            if (id && name && price) {
                await db.Deliver.update({ name: name }, {
                    where: { id }
                })
                resolve({
                    message: 'Successfully',
                    errCode: 1,
                })
            }
            resolve({
                errMessage: 'Missing id Deliver or name Deliver or price!',
                errCode: 2
            })
        } catch (error) {
            reject(error)
        }
    })
}
module.exports ={
    createDeliver,
    getDeliver,
    deleteDeliver,
    updateDeliver
}