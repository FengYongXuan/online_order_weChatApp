var orderSql = {
  insertOrder: 'INSERT INTO orders(ORDERID, CUSID, ORDERTIME, ORDERSTATE, ORDERTOTALPRICE, ORDERDATE) VALUES(?, ?, ?, ?, ?, ?)',
  insertOrderDetail: 'INSERT INTO orderdetails(GID, ORDERID, GNAME, GCOUNT, GPRICE, GTIME) VALUES(?, ?, ?, ?, ?, ?)',
  queryUnfinishedOrders: 'SELECT * FROM orders WHERE ORDERSTATE!="3"',
  queryOverOrders: 'SELECT * FROM orders WHERE ORDERSTATE="3"',
  selectOrderDetails: 'SELECT * FROM orderdetails WHERE ORDERID=',
  deleteOrder: 'DELETE FROM orders WHERE ORDERID=',
  updateOrderStateById: 'update orders set ORDERSTATE="3" where ORDERID='
}

module.exports = orderSql
