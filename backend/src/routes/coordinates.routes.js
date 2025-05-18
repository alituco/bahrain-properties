"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coordinates_controller_1 = require("../controllers/coordinates.controller");
const router = (0, express_1.Router)();
router.get('/', coordinates_controller_1.getCoordinates);
exports.default = router;
