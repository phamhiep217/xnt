const env = process.env;
// export const nodeEnv = env.NODE_ENV || 'developement'
// export const logStars = function(message) {
//     console.info('**********');
//     console.info(message);
//     console.info('**********');
// };
export default {
    mongodbUri: 'mongodb://localhost:27017/logistic',
    jwt_key: "secret",
    port: env.PORT || 5001,
    host: env.HOST || '0.0.0.0',
    get serverUrl() {
        return `http://${this.host}:${this.port}`;
    }
};
//404 ko tim thay trang
//500 loi tren server
//401 đăng nhập ko thành công, ko tìm thấy data
//409 dữ liệu bị trùng
//200 lấy dự liệu thành công
//201 CRUD dữ liệu thành công
