"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: "ping",
    description: "To see the latency of the bot.",
    run(client, interaction) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor(client.color)
                        .setDescription("pong... 🏓")
                        .setFooter({
                        text: (_a = client.user) === null || _a === void 0 ? void 0 : _a.username,
                        iconURL: (_b = client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL({
                            size: 4096,
                        }),
                    })
                        .setTimestamp(),
                ],
            }).then((m) => {
                var _a, _b;
                interaction.editReply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`🤖 \`|\` Bot: **${Date.now() - m.createdTimestamp}ms**\n📡 \`|\` Api: **${client.ws.ping}ms**`)
                            .setFooter({
                            text: (_a = client.user) === null || _a === void 0 ? void 0 : _a.username,
                            iconURL: (_b = client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL({
                                size: 4096,
                            }),
                        })
                            .setTimestamp(),
                    ]
                });
            });
        });
    },
};
