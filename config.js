const env = process.env;
// export const nodeEnv = env.NODE_ENV || 'developement'
// export const logStars = function(message) {
//     console.info('**********');
//     console.info(message);
//     console.info('**********');
// };
export default {
    mongodbUri: 'mongodb://localhost:27017/test',
    port: env.PORT || 5001,
    host: env.HOST || '0.0.0.0',
    get serverUrl() {
        return `http://${this.host}:${this.port}`;
    }
};
