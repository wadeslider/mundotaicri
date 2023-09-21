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
const node_fs_1 = __importDefault(require("node:fs"));
function default_1(client) {
    try {
        node_fs_1.default.readdirSync("./src/events/").forEach((folder) => __awaiter(this, void 0, void 0, function* () {
            const events = node_fs_1.default
                .readdirSync(`./src/events/${folder}`)
                .filter((file) => file.endsWith(".ts"));
            for (const file of events) {
                const pull = yield Promise.resolve(`${`../events/${folder}/${file.split(".")[0]}`}`).then(s => __importStar(require(s)));
                if (pull.default.name && pull.default.run) {
                    if (pull.default.once) {
                        client.once(pull.default.name, (...args) => pull.default.run(client, ...args));
                    }
                    else {
                        client.on(pull.default.name, (...args) => pull.default.run(client, ...args));
                    }
                }
                else {
                    console.error(`El evento ${file} esta mal configurado.`);
                }
            }
        }));
    }
    catch (error) {
        console.error(error);
    }
}
exports.default = default_1;
