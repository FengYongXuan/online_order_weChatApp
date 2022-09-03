/*
 Navicat Premium Data Transfer

 Source Server         : demo
 Source Server Type    : MySQL
 Source Server Version : 50726
 Source Host           : localhost:3306
 Source Schema         : online_order

 Target Server Type    : MySQL
 Target Server Version : 50726
 File Encoding         : 65001

 Date: 03/09/2022 15:03:31
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for customer
-- ----------------------------
DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer`  (
  `CUSID` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `OPENID` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `NICKNAME` varchar(200) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `ISADMIN` int(5) NULL DEFAULT NULL COMMENT '是不是管理员(1是管理员，0不是)',
  PRIMARY KEY (`CUSID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of customer
-- ----------------------------
INSERT INTO `customer` VALUES ('b5e079e5-2cd4-4b11-a437-9df3c94ceccb', 'ok1p05FSwG6_w4U6SVk5EqtT48Bo', '南极石', 1);

-- ----------------------------
-- Table structure for goods
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods`  (
  `GID` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `GTID` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `GNAME` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `GPRICE` decimal(10, 2) NULL DEFAULT NULL,
  `GIMG` varchar(200) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `GTIME` int(11) NULL DEFAULT NULL COMMENT '需要时间（单位：分钟）',
  `GINFO` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `GCOUNT` int(11) NULL DEFAULT NULL COMMENT '用于统计商品在购物车中的数量',
  PRIMARY KEY (`GID`) USING BTREE,
  INDEX `FK_Relationship_4`(`GTID`) USING BTREE,
  CONSTRAINT `goods_ibfk_1` FOREIGN KEY (`GTID`) REFERENCES `goodstype` (`GTID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of goods
-- ----------------------------
INSERT INTO `goods` VALUES ('48849d17-38eb-4f4b-9dcb-a9b864296c73', '1', '面条', 10.00, 'food7.png', 10, '非常劲道，爽口', 0);
INSERT INTO `goods` VALUES ('4b9363b7-a4f8-4329-8024-b53386cf4ddc', '3', '咖啡', 50.00, 'food3.png', 4, '现磨咖啡豆', 0);
INSERT INTO `goods` VALUES ('58d9a28f-8746-492b-9f25-bcbe440ed636', '2', '山竹', 20.00, 'food9.png', 10, '好吃不贵', 0);
INSERT INTO `goods` VALUES ('82cb2db1-fd7e-48ed-89f5-24813da9dca6', '2', '梨', 20.00, 'food1.png', 5, '润滑爽口', 0);
INSERT INTO `goods` VALUES ('89e8ec77-8820-48c1-9d4e-f001f093ff93', '1', '饭团', 5.22, 'food6.png', 4, '精选大米，非常非常非常非常非常非常好吃，你说呢', 0);
INSERT INTO `goods` VALUES ('d5646197-83c5-459e-85f9-f69e4207e52a', '3', '布丁', 38.00, 'food2.png', 5, '非常Q弹', 0);

-- ----------------------------
-- Table structure for goodstype
-- ----------------------------
DROP TABLE IF EXISTS `goodstype`;
CREATE TABLE `goodstype`  (
  `GTID` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `GTNAME` varchar(30) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  PRIMARY KEY (`GTID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of goodstype
-- ----------------------------
INSERT INTO `goodstype` VALUES ('1', '主食');
INSERT INTO `goodstype` VALUES ('2', '水果');
INSERT INTO `goodstype` VALUES ('3', '甜点');

-- ----------------------------
-- Table structure for orderdetails
-- ----------------------------
DROP TABLE IF EXISTS `orderdetails`;
CREATE TABLE `orderdetails`  (
  `GID` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `ORDERID` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `GNAME` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `GCOUNT` int(11) NULL DEFAULT NULL,
  `GPRICE` decimal(11, 2) NULL DEFAULT NULL,
  `GTIME` int(11) NULL DEFAULT NULL,
  INDEX `FK_Relationship_6`(`ORDERID`) USING BTREE,
  INDEX `FK_Relationship_7`(`GID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orderdetails
-- ----------------------------
INSERT INTO `orderdetails` VALUES ('48849d17-38eb-4f4b-9dcb-a9b864296c73', '4f4e3b30-2ace-11ed-b1d1-c1799e283168', '面条', 1, 10.00, 10);
INSERT INTO `orderdetails` VALUES ('82cb2db1-fd7e-48ed-89f5-24813da9dca6', '4f4e3b30-2ace-11ed-b1d1-c1799e283168', '梨', 2, 20.00, 5);
INSERT INTO `orderdetails` VALUES ('48849d17-38eb-4f4b-9dcb-a9b864296c73', '8e905af0-2ad1-11ed-86af-c9b74008dc6e', '面条', 1, 10.00, 10);
INSERT INTO `orderdetails` VALUES ('82cb2db1-fd7e-48ed-89f5-24813da9dca6', '8e905af0-2ad1-11ed-86af-c9b74008dc6e', '梨', 2, 20.00, 5);
INSERT INTO `orderdetails` VALUES ('48849d17-38eb-4f4b-9dcb-a9b864296c73', '43123980-2ad2-11ed-8800-6bb24cfee2d4', '面条', 1, 10.00, 10);
INSERT INTO `orderdetails` VALUES ('82cb2db1-fd7e-48ed-89f5-24813da9dca6', '43123980-2ad2-11ed-8800-6bb24cfee2d4', '梨', 2, 20.00, 5);
INSERT INTO `orderdetails` VALUES ('48849d17-38eb-4f4b-9dcb-a9b864296c73', '61175510-2b3a-11ed-8beb-a303315fcc60', '面条', 1, 10.00, 10);
INSERT INTO `orderdetails` VALUES ('82cb2db1-fd7e-48ed-89f5-24813da9dca6', '61175510-2b3a-11ed-8beb-a303315fcc60', '梨', 2, 20.00, 5);
INSERT INTO `orderdetails` VALUES ('4b9363b7-a4f8-4329-8024-b53386cf4ddc', '61175510-2b3a-11ed-8beb-a303315fcc60', '咖啡', 1, 50.00, 4);
INSERT INTO `orderdetails` VALUES ('48849d17-38eb-4f4b-9dcb-a9b864296c73', 'e9ea5720-2b3a-11ed-aaca-25d8e5d1f10b', '面条', 1, 10.00, 10);
INSERT INTO `orderdetails` VALUES ('82cb2db1-fd7e-48ed-89f5-24813da9dca6', 'e9ea5720-2b3a-11ed-aaca-25d8e5d1f10b', '梨', 2, 20.00, 5);
INSERT INTO `orderdetails` VALUES ('4b9363b7-a4f8-4329-8024-b53386cf4ddc', 'e9ea5720-2b3a-11ed-aaca-25d8e5d1f10b', '咖啡', 1, 50.00, 4);
INSERT INTO `orderdetails` VALUES ('48849d17-38eb-4f4b-9dcb-a9b864296c73', 'a209f5e0-2b3b-11ed-aaca-25d8e5d1f10b', '面条', 1, 10.00, 10);
INSERT INTO `orderdetails` VALUES ('58d9a28f-8746-492b-9f25-bcbe440ed636', 'a209f5e0-2b3b-11ed-aaca-25d8e5d1f10b', '山竹', 2, 20.00, 10);
INSERT INTO `orderdetails` VALUES ('89e8ec77-8820-48c1-9d4e-f001f093ff93', '057a5170-2b4a-11ed-93ff-69e623b7ac20', '饭团', 1, 5.22, 4);
INSERT INTO `orderdetails` VALUES ('1d85bb08-7afb-49db-b317-eb08a1dbf8fc', '29cabc40-2b4a-11ed-93ff-69e623b7ac20', '柠檬汁', 1, 11.00, 5);
INSERT INTO `orderdetails` VALUES ('4b9363b7-a4f8-4329-8024-b53386cf4ddc', 'f040db70-2b4a-11ed-8d83-cf56e7b3d193', '咖啡', 1, 50.00, 4);
INSERT INTO `orderdetails` VALUES ('1d85bb08-7afb-49db-b317-eb08a1dbf8fc', 'f040db70-2b4a-11ed-8d83-cf56e7b3d193', '柠檬汁', 1, 11.00, 5);

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `ORDERID` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `CUSID` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `ORDERTIME` int(11) NULL DEFAULT NULL,
  `ORDERSTATE` int(11) NULL DEFAULT NULL COMMENT '0--临时\r\n            1--下单\r\n            2--正在处理\r\n            3--处理完成',
  `ORDERTOTALPRICE` decimal(10, 2) NULL DEFAULT NULL,
  `ORDERNUM` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT '设置自动递增，所以不用赋值',
  `ORDERDATE` datetime NULL DEFAULT NULL COMMENT '下单日期',
  PRIMARY KEY (`ORDERNUM`) USING BTREE,
  INDEX `FK_Relationship_5`(`CUSID`) USING BTREE,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`CUSID`) REFERENCES `customer` (`CUSID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orders
-- ----------------------------
INSERT INTO `orders` VALUES ('4f4e3b30-2ace-11ed-b1d1-c1799e283168', 'b5e079e5-2cd4-4b11-a437-9df3c94ceccb', 20, 3, 50.00, 0000000005, '2022-09-02 22:48:30');
INSERT INTO `orders` VALUES ('43123980-2ad2-11ed-8800-6bb24cfee2d4', 'b5e079e5-2cd4-4b11-a437-9df3c94ceccb', 20, 3, 50.00, 0000000007, '2022-09-02 23:16:47');
INSERT INTO `orders` VALUES ('61175510-2b3a-11ed-8beb-a303315fcc60', 'b5e079e5-2cd4-4b11-a437-9df3c94ceccb', 24, 3, 100.00, 0000000008, '2022-09-01 11:42:05');
INSERT INTO `orders` VALUES ('e9ea5720-2b3a-11ed-aaca-25d8e5d1f10b', 'b5e079e5-2cd4-4b11-a437-9df3c94ceccb', 24, 3, 100.00, 0000000009, '2022-09-03 11:45:55');
INSERT INTO `orders` VALUES ('057a5170-2b4a-11ed-93ff-69e623b7ac20', 'b5e079e5-2cd4-4b11-a437-9df3c94ceccb', 4, 3, 5.22, 0000000011, '2022-09-03 13:34:03');
INSERT INTO `orders` VALUES ('29cabc40-2b4a-11ed-93ff-69e623b7ac20', 'b5e079e5-2cd4-4b11-a437-9df3c94ceccb', 5, 3, 11.00, 0000000012, '2022-09-03 13:35:04');

SET FOREIGN_KEY_CHECKS = 1;
