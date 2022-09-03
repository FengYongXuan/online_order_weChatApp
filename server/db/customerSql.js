var customerSql = {
  // 这里默认新注册的用户非管理员
  insert: 'INSERT INTO customer(CUSID, OPENID, NICKNAME, ISADMIN) VALUES(?, ?, ?, 0)',
  queryAll: 'SELECT * FROM customer',
  getCustomerByOPENID: 'SELECT * FROM customer WHERE OPENID'
}
module.exports = customerSql