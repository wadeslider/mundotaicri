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
    name: "interactionCreate",
    run(client, interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isChatInputCommand())
                return;
            const command = client.slashCommands.get(interaction.commandName);
            if (!interaction.guildId)
                return interaction.reply({
                    content: "👋 `|` Por motivos personales, prefiero no hacer comandos por privado, gracias. ✨",
                    ephemeral: true
                });
            const { cooldowns } = client;
            if (!cooldowns.has(command === null || command === void 0 ? void 0 : command.name)) {
                cooldowns.set(command === null || command === void 0 ? void 0 : command.name, new discord_js_1.Collection());
            }
            const now = Date.now();
            const timestamps = cooldowns.get(command === null || command === void 0 ? void 0 : command.name);
            const defaultCooldownDuration = 3;
            const cooldownAmount = ((_a = command === null || command === void 0 ? void 0 : command.cooldown) !== null && _a !== void 0 ? _a : defaultCooldownDuration) * 1000;
            if (timestamps === null || timestamps === void 0 ? void 0 : timestamps.has(interaction.user.id)) {
                const expirationTime = (timestamps === null || timestamps === void 0 ? void 0 : timestamps.get(interaction.user.id)) + cooldownAmount;
                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1000);
                    return interaction.reply({
                        content: `Please wait, you are on a cooldown for \`${command === null || command === void 0 ? void 0 : command.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
                        ephemeral: true,
                    });
                }
            }
            timestamps === null || timestamps === void 0 ? void 0 : timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps === null || timestamps === void 0 ? void 0 : timestamps.delete(interaction.user.id), cooldownAmount);
            try {
                yield (command === null || command === void 0 ? void 0 : command.run(client, interaction));
            }
            catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
            }
        });
    },
};
