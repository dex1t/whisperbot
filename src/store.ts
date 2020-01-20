import * as IORedis from "ioredis";

const CHANNEL_NAMESPACE = "whisperbot:channels";
const CONVERSATIONS_NAMESPACE = "whisperbot:conversations";

export class Store {
  private readonly redis: IORedis.Redis;
  linkedChannel: string | null;

  constructor(options) {
    this.redis = new IORedis(options);
    this.linkedChannel = null;
  }

  async saveLinkingChannel(params: { channelId: string }): Promise<string> {
    this.linkedChannel = params.channelId;
    return await this.redis.set(CHANNEL_NAMESPACE, params.channelId);
  }

  async loadLinkedChannel(): Promise<string | null> {
    if (!this.linkedChannel) {
      this.linkedChannel = await this.redis.get(CHANNEL_NAMESPACE);
    }
    return this.linkedChannel;
  }

  async saveTsByConv(params: {
    ts: string;
    convId: string;
  }): Promise<IORedis.BooleanResponse> {
    return await this.redis.hset(
      CONVERSATIONS_NAMESPACE,
      params.convId,
      params.ts
    );
  }

  async loadTsByConv(params: { convId: string }): Promise<string | null> {
    return await this.redis.hget(CONVERSATIONS_NAMESPACE, params.convId);
  }

  async deleteByConv(params: { convId: string }): Promise<number> {
    return await this.redis.hdel(CONVERSATIONS_NAMESPACE, params.convId);
  }
}
