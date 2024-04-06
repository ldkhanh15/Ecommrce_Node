import blogService from '../services/blogService'


const getBlog = async (req, res) => {
    try {
        let data = await blogService.getBlog(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const getBlogDetail = async (req, res) => {
    try {
        let data = await blogService.getBlogDetail(req);
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

const getComment = async (req, res) => {
    try {
        let data = await blogService.getComment(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const createComment = async (req, res) => {
    try {
        let data = await blogService.createComment(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const deleteComment = async (req, res) => {
    try {
        let data = await blogService.deleteComment(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const updateComment = async (req, res) => {
    try {
        let data = await blogService.updateComment(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const uploadImage = async (req, res) => {
    try {
        let data = await blogService.uploadImage(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getBlog,
    createBlog,
    deleteBlog,
    updateBlog,
    getBlogDetail,
    getComment,
    deleteComment,
    updateComment,
    createComment,
    uploadImage,
}