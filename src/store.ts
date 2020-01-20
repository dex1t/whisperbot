import * as IORedis from "ioredis";

const CHANNEL_NAMESPACE = "whisperbot:channels";
const CONVERSATIONS_NAMESPACE = "whisperbot:conversations";

export class Store {
  private readonly redis: IORedis.Redis;

  constructor(options?: IORedis.RedisOptions) {
    this.redis = new IORedis(options);
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
