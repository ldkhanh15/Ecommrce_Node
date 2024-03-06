import bannerService from '../services/bannerService'

const getBanner = async (req, res) => {
    try {
        let data = await bannerService.getBanner(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const createBanner = async (req, res) => {
    try {
        let data = await bannerService.createBanner(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const deleteBanner = async (req, res) => {
    try {
        let data = await bannerService.deleteBanner(req.body);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const updateBanner = async (req, res) => {
    try {
        let data = await bannerService.updateBanner(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getBanner,
    createBanner,
    deleteBanner,
    updateBanner
}