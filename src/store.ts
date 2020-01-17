import * as IORedis from "ioredis";

const REDIS_NAMESPACE = "whisperbot:channels";

export class Store {
  private readonly redis: IORedis.Redis;

  constructor(options?: IORedis.RedisOptions) {
    this.redis = new IORedis(options);
  }

  async saveByChannel(
    channelId: string,
    value: IORedis.ValueType
  ): Promise<IORedis.BooleanResponse> {
    return await this.redis.hset(REDIS_NAMESPACE, channelId, value);
  }

  async loadByChannel(channelId: string): Promise<string | null> {
    return await this.redis.hget(REDIS_NAMESPACE, channelId);
  }
}
