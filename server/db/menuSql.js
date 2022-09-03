var menuSql = {
  queryGoodsTypeAll: 'SELECT * FROM goodstype',
  queryGoodsAll: 'SELECT * FROM goods',
  insertGoods: 'INSERT INTO goods(GID, GTID, GNAME, GPRICE, GIMG, GTIME, GINFO, GCOUNT) VALUES(?, ?, ?, ?, ?, ?, ?, 0)',
  insertGoodsType: 'INSERT INTO goodstype(GTID, GTNAME) VALUES(?, ?)',
}
module.exports = menuSql