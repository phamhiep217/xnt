const env = process.env;
// export const nodeEnv = env.NODE_ENV || 'developement'
// export const logStars = function(message) {
//     console.info('**********');
//     console.info(message);
//     console.info('**********');
// };
export default {
  mongodbUri: "mongodb://192.168.5.107:27017/logistic",
  jwt_key: "secret",
  port: env.PORT || 5001,
  host: env.HOST || "127.0.0.1",
  get serverUrl() {
    return `http://${this.host}:${this.port}`;
  },
  sqlserver: {
    database: "100",
    server: "localhost",
    driver: "msnodesqlv8",
    requestTimeout: 5400000,
    options: {
      trustedConnection: true,
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 10000,
    },
  },
  sqlserver200: {
    database: "200",
    server: "localhost",
    driver: "msnodesqlv8",
    requestTimeout: 5400000,
    options: {
      trustedConnection: true,
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 10000,
    },
  },
  wareHouse: [
    "1100",
    "1101",
    "1104",
    "1200",
    "1201",
    "1202",
    "1204",
    "1205",
    "2100",
    "2102",
    "2107",
    "2110",
    "2113",
    "2200",
    "2202",
    "2207",
    "2210",
    "2211",
    "2213",
    "2214",
    "3100",
    "3110",
    "3200",
    "3300",
    "3310",
  ],
};
//404 ko tim thay trang
//500 loi tren server
//401 đăng nhập ko thành công, ko tìm thấy data
//409 dữ liệu bị trùng
//200 lấy dự liệu thành công
//201 CRUD dữ liệu thành công
