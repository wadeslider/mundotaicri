import {
  Client,
  ClientOptions,
  Collection,
  CacheType,
  Message,
  ChatInputCommandInteraction,
  ColorResolvable,
  HexColorString,
} from "discord.js";
import "dotenv/config";
import mongoose from "mongoose";

export interface LocalSlashCommandContent {
  name: string;
  description: string;
  cooldown?: number;
  run(
    ...args: (MundoBot | ChatInputCommandInteraction<CacheType>)[]
  ): Promise<any> | any;
}

export default class MundoBot extends Client {
  public slashCommands: Collection<string, LocalSlashCommandContent>;
  public cooldowns: Collection<string, Collection<string, number>>;
  public color: HexColorString;

  public constructor(options: ClientOptions) {
    super(options);

    this.slashCommands = new Collection();
    this.cooldowns = new Collection();
    this.color = "#d60411";
  }

  public async start(): Promise<void> {
    ["events", "slashCommands"].forEach(async (h) => {
      const handler = (await import(`../handlers/${h}`)).default;
      handler(this);
    });

    await this.connectMongoDB();
    await this.login(process.env.TOKEN);
  }

  public async connectMongoDB(): Promise<void> {
    mongoose.set("strictQuery", true);
    const mongoSecret: string = process.env.MONGODB_URL ?? "none";
    await mongoose.connect(mongoSecret)
  }
}
