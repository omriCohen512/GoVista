
import mysql2, { PoolOptions, QueryError, QueryResult } from "mysql2";
import { appConfig } from "./app-config";

// Data Access Layer:
class Dal {

    // Database connection configuration:
    private readonly options: PoolOptions = {
        host: appConfig.mysqlHost,
        user: appConfig.mysqlUser,
        password: appConfig.mysqlPassword,
        database: appConfig.mysqlDatabase
    };

    // Create a MySQL connection pool:
    private readonly connection = mysql2.createPool(this.options);

    // Execute SQL:
    public execute(sql: string, values?: (string | number | boolean | null)[]): Promise<QueryResult> {

        // Convert callback-based query into a Promise:
        return new Promise<QueryResult>((resolve, reject) => {

            // Execute the query and receive the result:
            this.connection.query(sql, values, (err: QueryError | null, result: QueryResult) => {

                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }

            });

        });

    }

}

export const dal = new Dal();
