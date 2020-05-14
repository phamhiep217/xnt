import jwt from "jsonwebtoken";
import config from "../../config";
module.exports = (req, res, next) => {
  try {
      //request từ headers , thay vì req.body.tentoken
    const token = req.headers.authorization.split(" ")[1]; //[0] là bearer còn [1] là chuỗi token
    const decoded = jwt.verify(token, config.jwt_key); // kiểm chứng chuỗi token có phù hợp.
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Kết nối thất bại",
    });
  }
};
