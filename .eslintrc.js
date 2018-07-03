module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "semi": 0,
        "comma-dangle": ["error", "never"],
        "class-methods-use-this": 0,
        "camelcase": 0,
        "no-param-reassign": 1
    },
    "globals": {
        "Promise": true,
        "fs": true,
        "util": true,
        "createProxy": true,
        "DB": true,
        "knex": true,
        "_": true,
        "log": true
    }
};