import product from './product'
import user from './user'
import voucher from './voucher'

function route(app) {
    app.use('/api/product', product)
    app.use('/api/user', user)
    app.use('/api/voucher', voucher)
}

module.exports = route