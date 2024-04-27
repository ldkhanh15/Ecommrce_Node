import db from '../models'
import { Sequelize, Op, } from 'sequelize';
import moment from 'moment';
const getOverview = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (req.user.role === 'R2') {
                let shop = await db.Shop.findOne({
                    where: {
                        idUser: req.user.id
                    }
                })
                let bill = await db.Bill.findAll({
                    where: {
                        idShop: shop.id
                    },
                    attributes: [
                        [Sequelize.literal('COUNT(*)'), 'totalBills'],
                        [Sequelize.literal('SUM(totalPrice)'), 'totalPrice']
                    ],
                    include: [
                        {
                            model: db.StatusBill,
                            as: 'status',
                            attributes: ['status']
                        }
                    ],
                    group: ['status.status'] // 

                });
                let user = await db.Bill.count({
                    distinct: true,
                    col: 'idBuyer',
                    where: {
                        idShop: shop.id
                    }
                })
                let product = await db.Product.count({
                    where: {
                        idShop: shop.id
                    }
                })
                const currentDate = new Date();

                const recentMonths = [];
                for (let i = 0; i < 12; i++) {
                    recentMonths.push(moment(currentDate).subtract(i, 'months').startOf('month').toDate());
                }


                const topProductsByMonth = [];
                for (let i = 0; i < recentMonths.length; i++) {
                    const monthStart = recentMonths[i];
                    const monthEnd = moment(monthStart).endOf('month').toDate();

                    const productsInMonth = await db.Bill.findAll({
                        where: {
                            idShop: shop.id
                        },
                        attributes: [
                            [Sequelize.fn('YEAR', Sequelize.col('Bill.createdAt')), 'year'],
                            [Sequelize.fn('MONTH', Sequelize.col('Bill.createdAt')), 'month'],
                            [Sequelize.fn('SUM', Sequelize.col('totalPrice')), 'totalPrice']
                        ],
                        where: {
                            createdAt: {
                                [Op.between]: [monthStart, monthEnd]
                            }
                        },
                        limit: 3,
                        group: ['year', 'month',],
                        order: [['year', 'DESC'], ['month', 'DESC']]
                    });

                    topProductsByMonth.push({
                        totalPrice: productsInMonth[0]?.totalPrice || 0,
                        date: moment(recentMonths[i]).format('MM-YYYY'),
                    });
                }
                const topProduct = await db.BillProduct.findAll({
                    attributes: ['idProduct', [Sequelize.fn('COUNT', Sequelize.col('BillProduct.idProduct')), 'total_sold']],
                    group: ['BillProduct.idProduct'],
                    order: [[Sequelize.fn('COUNT', Sequelize.col('BillProduct.idProduct')), 'DESC']],
                    include: [
                        {
                            model: db.Product, as: 'product', attributes: ['name'],
                            include: [
                                {
                                    model: db.ProductReview, as: 'review', attributes: ['star']
                                },
                                {
                                    model: db.Shop, as: 'shop', attributes: ['name']
                                }
                            ]
                        }
                    ]
                })


                resolve({
                    bill,
                    user,
                    product,
                    topProduct,
                    revenue: topProductsByMonth,
                    message: 'Successfully'
                })
            } else if (req.user.role === 'R1') {
                let bill = await db.Bill.findAll({
                    attributes: [
                        [Sequelize.literal('COUNT(*)'), 'totalBills'],
                        [Sequelize.literal('SUM(totalPrice)'), 'totalPrice']
                    ],
                    include: [
                        {
                            model: db.StatusBill,
                            as: 'status',
                            attributes: ['status']
                        }
                    ],
                    group: ['status.status'] // 

                });
                let user = await db.User.count()
                let product = await db.Product.count()
                const currentDate = new Date();

                const recentMonths = [];
                for (let i = 0; i < 12; i++) {
                    recentMonths.push(moment(currentDate).subtract(i, 'months').startOf('month').toDate());
                }

                // Mảng chứa kết quả của từng tháng
                const topProductsByMonth = [];
                for (let i = 0; i < recentMonths.length; i++) {
                    const monthStart = recentMonths[i];
                    const monthEnd = moment(monthStart).endOf('month').toDate();

                    const productsInMonth = await db.Bill.findAll({
                        attributes: [
                            [Sequelize.fn('YEAR', Sequelize.col('Bill.createdAt')), 'year'],
                            [Sequelize.fn('MONTH', Sequelize.col('Bill.createdAt')), 'month'],
                            [Sequelize.fn('SUM', Sequelize.col('totalPrice')), 'totalPrice']
                        ],
                        where: {
                            createdAt: {
                                [Op.between]: [monthStart, monthEnd]
                            }
                        },
                        limit: 3,
                        group: ['year', 'month',],
                        order: [['year', 'DESC'], ['month', 'DESC']]
                    });

                    topProductsByMonth.push({
                        totalPrice: productsInMonth[0]?.totalPrice || 0,
                        date: moment(recentMonths[i]).format('MM-YYYY'),
                    });
                }



                resolve({
                    bill,
                    user,
                    product,
                    revenue: topProductsByMonth,
                    message: 'Successfully'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    getOverview
}