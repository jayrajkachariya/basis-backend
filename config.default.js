const sendCred = {
    user: 'tester0',
    pass: 'tester0'
};

let config = {
    host: 'localhost',
    db: 'mongodb://127.0.0.1/user-prototype-for-basis',
    sandDb: `mongodb://${sendCred.user}:${sendCred.pass}@ds139427.mlab.com:39427/user-prototype-for-basis`,
    secrets: {
        session: 'F6dJu_7dxOQlIDdPGHT'
    }
};

module.exports = config;
