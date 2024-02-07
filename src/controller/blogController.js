import blogService from '../services/blogService'


const getBlog = async (req, res) => {
    try {
        let data = await blogService.getBlog(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const createBlog = async (req, res) => {
    try {
        let data = await blogService.createBlog(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const deleteBlog = async (req, res) => {
    try {
        let data = await blogService.deleteBlog(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const updateBlog = async (req, res) => {
    try {
        let data = await blogService.updateBlog(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getBlog,
    createBlog,
    deleteBlog,
    updateBlog
}