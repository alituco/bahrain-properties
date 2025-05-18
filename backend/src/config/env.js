"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || '4000',
    databaseUrl: process.env.DATABASE_URL || '',
    flaskBaseUrl: process.env.FLASK_URL || 'http://localhost:5001',
    jwtSecret: process.env.JWT_SECRET || 'secret-jwt',
    emailHost: process.env.EMAIL_HOST || 'no_email_host set in env',
    emailPort: process.env.EMAIL_PORT || 'no_email_port set in env',
    emailUser: process.env.EMAIL_USER || 'no email_user set in env',
    emailPass: process.env.EMAIL_PASS || 'no email_pass set in env',
    // add the env variables as needed here
};
