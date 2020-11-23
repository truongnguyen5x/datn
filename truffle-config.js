module.exports = {
    contracts_directory: "./contract/src",
    contracts_build_directory: "./contract/build",
    migrations_directory: "./contract/migrate",
    networks: {
        development: {
            host: "127.0.0.1",
            port: 9545,
            network_id: "*" // Match any network id
        }
    },
    compilers: {
        solc: {
          version: "^0.7.5"
        }
    }
}