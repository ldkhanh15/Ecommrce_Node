import product from './product'
import user from './user'
import voucher from './voucher'
import blog from './blog'
import vendor from './vendor'
import bill from './bill'
import cart from './cart'
import category from './category'
import deliver from './deliver'
import banner from './banner'
import auth from './auth'
import size from './size'
import payment from './payment'
import productSale from './productSale'
function route(app) {
    app.use('/api/product', product)
    app.use('/api/user', user)
    app.use('/api/voucher', voucher)
    app.use('/api/blog', blog)
    app.use('/api/vendor', vendor)
    app.use('/api/bill', bill)
    app.use('/api/cart', cart)
    app.use('/api/category', category)
    app.use('/api/deliver', deliver)
    app.use('/api/banner', banner)
    app.use('/api/payment', payment)
    app.use('/api/size', size)
    app.use('/api', auth)
    app.use('/api/product-sale', productSale)
}

module.exports = route