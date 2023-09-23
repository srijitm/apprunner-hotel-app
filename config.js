var config = {
    infra: {},
    app: {},
    backend: {}
};
config.infra.region = process.env.AWS_REGION;
config.app.hotel_name = process.env.HOTEL_NAME;
config.app.backend = "https://iicmqtgz88.us-east-1.awsapprunner.com/";

module.exports = config;