import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import MundoBot, { LocalSlashCommandContent } from "../../structures/MundoBot";
import { AirdropCreateError } from "../../lib/airdrops/create";
import ms from "ms";


export default {
    name: "airdrop",
    description: "To airdrop",
    options: [
        {
            name: "amount",
            description: "Write the amount you airdoped.",
            required: true,
            type: ApplicationCommandOptionType.Number,
        },

        {
            name: "currency",
            description: "Write the currency of the airdrop.",
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "duration",
            description: "Write the duration.",
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],
    dm_permission: false,

    async run(client: MundoBot, int: ChatInputCommandInteraction) {

        const amount = int.options.getNumber("amount")!;
        const currency = int.options.getString("currency")!;
        const duration = int.options.getString("duration")!;


        if (amount <= 0) return int.reply({
            content: ":x: `|` Amount needs to be a number greater than 0.",
            ephemeral: true
        })

        const durationTime = ms(duration) ?? 0;

        if (durationTime <= 0) return int.reply({
            content: ":x: `|` Invalid duration was provided",
            ephemeral: true
        })

        const endAt = Date.now() + durationTime;

        await int.deferReply({ ephemeral: true });

        const airdrop = await client.Airdrops.create(int, { amount, currency, endAt }).catch((error) => {

            const errorReply = {
                [AirdropCreateError.UnknownUser]: ":x: `|` You are not registered, register with: </register:1121610579325485097>",
                [AirdropCreateError.InsufficientCurrencyAmount]: ":x: `|` You don't have that amount.",
                [AirdropCreateError.UnknownCurrency]: ":x: `|` Unknown Currency.",
            }[error as AirdropCreateError]

            if (!errorReply) return;

            int.editReply(errorReply)
        })

        if (!airdrop) return;

        int.editReply({
            content: "✅ `|` The airdrop has been sent.",
        })
    }
} satisfies LocalSlashCommandContent