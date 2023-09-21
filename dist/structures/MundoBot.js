"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
class MundoBot extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.slashCommands = new discord_js_1.Collection();
        this.cooldowns = new discord_js_1.Collection();
        this.color = "#d60411";
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            ["events", "slashCommands"].forEach((h) => __awaiter(this, void 0, void 0, function* () {
                const handler = (yield Promise.resolve(`${`../handlers/${h}`}`).then(s => __importStar(require(s)))).default;
                handler(this);
            }));
            yield this.connectMongoDB();
            yield this.login(process.env.TOKEN);
        });
    }
    connectMongoDB() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            mongoose_1.default.set("strictQuery", true);
            const mongoSecret = (_a = process.env.MONGODB_URL) !== null && _a !== void 0 ? _a : "none";
            yield mongoose_1.default.connect(mongoSecret);
        });
    }
}
exports.default = MundoBot;