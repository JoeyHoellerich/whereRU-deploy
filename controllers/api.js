const router = require ('express').Router()

router.use('/places', require("./places"))
router.use('/users', require('./users'))

module.exports = router