export default {
	localhost: {
		default: {
			username: process.env.MYSQL_USERNAME || 'sa',
            password: process.env.MYSQL_PASSWORD || 'fEdVkEu62e71NJpKR6Ri@',
            dialect: 'mssql',
            dialectOptions: {
                encrypt: true
            },
            port: 1433,
            logging: true,
            host: '112.213.88.237',
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },
            database: 'VOVLiveDemo'
		}
	},
	production: {
		default: {
            username: process.env.MYSQL_USERNAME || 'sa',
            password: process.env.MYSQL_PASSWORD || 'fEdVkEu62e71NJpKR6Ri@',
            dialect: 'mssql',
            dialectOptions: {
				encrypt: true,
                instanceName: "SQLEXPRESS",
                requestTimeout: 1500
            },
            port: 1433,
            logging: true,
            host: '112.213.88.237',
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },
            database: 'VOVLiveDemo',
		}
	},
};