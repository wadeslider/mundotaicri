"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "ready",
    run(client) {
        var _a;
        (_a = client.application) === null || _a === void 0 ? void 0 : _a.commands.set(client.slashCommands.map((x) => x));
        console.log("Sistema encedido");
    },
};
