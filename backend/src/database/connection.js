import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

const USERNAME = process.env.DB_USER || 'root';
const PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'gamelib';

console.log('Database Connection Details:');
console.log(`DB_NAME: ${DB_NAME}`);
console.log(`USERNAME: ${USERNAME}`);
console.log(`PASSWORD: ${PASSWORD}`);
const sequelize = new Sequelize(DB_NAME, USERNAME, PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();

export default sequelize;
