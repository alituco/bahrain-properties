"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
const coordinates_routes_1 = __importDefault(require("./routes/coordinates.routes"));
const parcel_routes_1 = __importDefault(require("./routes/parcel.routes"));
const predict_routes_1 = __importDefault(require("./routes/predict.routes"));
const valuation_routes_1 = __importDefault(require("./routes/valuation.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const app = (0, express_1.default)();
// CORS
app.use((0, cors_1.default)({
    credentials: true,
    origin: [
        'http://147.182.185.158:3002',
        process.env.ORIGIN1 || 'http://localhost:3000',
        process.env.ORIGIN2 || 'http://localhost:3001',
        process.env.ORIGIN3 || 'http://192.168.100.147:3001',
        process.env.ORIGIN4 || 'http://147.182.185.158:3002',
    ],
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Mount route handlers
app.use('/coordinates', coordinates_routes_1.default);
app.use('/parcelData', parcel_routes_1.default);
app.use('/predict', predict_routes_1.default);
app.use('/valuation', valuation_routes_1.default);
app.use('/auth', auth_routes_1.default);
app.use('/user', user_routes_1.default);
// Start the Server
app.listen(Number(env_1.config.port), '0.0.0.0', () => {
    console.log(`Server running on port ${env_1.config.port}`);
});
