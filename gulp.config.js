module.exports = function(){
    var client = './src/client/';
    var clientApp = client + 'app/';
    var temp = './.tmp/';

    var config = {
        alljs: ['./src/**/*.js', './*.js'],
        temp: temp,
        less: client + 'styles/styles.less',
        client: client,
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js'
        ],
        css: temp + 'styles.css',
        index: client + 'index.html',
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'
        }
    };

    config.getWiredepDefaultoptions = function () {
        return {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath,
            dependencies: {
                bootstrap: "~3.3.1"
            },
            overrides: {
                bootstrap: {
                    "main": ["dist/css/bootstrap.css", "dist/js/bootstrap.js"]
                }
            }
        };
    };

    return config;

};