const sql = require('../config/db');

const Crypto = function (crypto){
    this.name = crypto.name;
    this.prix = crypto.prix;
    this.devise = crypto.devise;
}

Crypto.create = (newCrypto, result) => {
    sql.query("INSERT INTO crypto SET ? ", newCrypto, (err,res) => {
        if(err) {
            result(err, null);
            return
        }
        result(null, {id: res.insertId, ...newCrypto})
    })
}

module.exports = Crypto;