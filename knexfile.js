const path = require("path");
module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: "babar.db.elephantsql.com",
      port: 5432, // porta padrão do PostgreSQL
      database: "jmkmvyxt",
      user: "jmkmvyxt",
      password: "y3Wt6bgb1SC1h20z3M18YC4do_25FoQf",
    },
    pool: {
      afterCreate: (conn, cb) => {
        conn.query("SET CONSTRAINTS ALL DEFERRED;", cb);
      },
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "migrations"),
      tableName: "knex_migrations",
    },
    seeds: {
      directory: path.resolve(__dirname, "src", "database", "seeds"),
    },
  },
};
