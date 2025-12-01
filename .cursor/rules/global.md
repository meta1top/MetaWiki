# 服务端全局默认行为

## 统一的导出

使用 * 导出所有，不进行命名导出。
错误的实例：
```typescript
export * from "./wiki-repo.dto";
export { WikiRepoDetailDto, WikiRepoDto } from "./wiki-repo.dto";
```
正确的实例：
```typescript
export * from "./wiki-repo.dto";
export * from "./wiki-document.dto";
```


## 接口返回

所有的数据都会被包装成如下结构：

```json
{
    "code": 0,
    "success": true,
    "message": "success",
    "data": {
        "enable": false
    },
    "timestamp": "2025-11-28T07:58:02.212Z",
    "path": "/api/account/otp/status"
}
```

业务只需要返回 `data` 部分，如：

```json
{
  "enable": false
}
```


## Service 处理

- 返回 Dto 声明的格式
- 遇到错误，抛出异常，框架会全局包装后

### 如何抛出异常

#### code 定义
在各自模块的 shared 定义。

libs/{module}/src/shared/{module}.error-code.ts 示例（以 account 模块为例）：
```typescript
import type { AppErrorCode } from "@meta-1/nest-common";

export const ErrorCode: Record<string, AppErrorCode> = {
  // 错误码定义，code 需要保证全局唯一
  ACCOUNT_EXISTS: { code: 1000, message: "账号已存在" },
  MAIL_CODE_ERROR: { code: 1001, message: "验证码错误" },
} as const;
```

#### throw 错误

```typescript
...
import { AppError } from "@meta-1/nest-common";

  async register(dto: RegisterDto): Promise<TokenDto> {
    ...
    if (existingAccount) {
      throw new AppError(ErrorCode.ACCOUNT_EXISTS);
    }
    ...
  }
```

### 事务

修改数据的方法，需要添加事务装饰器。使用示例（以 account 模块为例）：

```typescript
...

import { ..., Transactional } from "@meta-1/nest-common"; // 引入装饰器

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private repository: Repository<Account>, // @Transactional 要求有一个注入的 Repository
    ...
  ) {}

  @Transactional() // 事务装饰器
  async register(dto: RegisterDto): Promise<Token> {
    // 注册验证码
    const isValid = await this.mailCodeService.verify(dto.email, "register", dto.code);
    if (!isValid) {
      throw new AppError(ErrorCode.MAIL_CODE_ERROR);
    }
    // 判断账号是否存在
    const existingAccount = await this.repository.findOne({ where: { email: dto.email, deleted: false } });
    if (existingAccount) {
      throw new AppError(ErrorCode.ACCOUNT_EXISTS);
    }

    // 获取配置
    const config = this.accountConfigService.get();
    const { privateKey, aesKey, expiresIn } = config;
    const decryptedPassword = this.encryptService.decryptWithPrivateKey(dto.password, privateKey);
    const encryptedPassword = this.encryptService.encryptWithAES(decryptedPassword, aesKey);

    // 创建账号
    // username 是 email @ 前面的部分
    const username = dto.email.split("@")[0];
    const account = this.repository.create({
      ...dto,
      username,
      password: encryptedPassword,
    });

    // save
    this.repository.save(account);

    // 创建令牌
    const token = this.tokenService.create({
      id: account.id,
      username: account.email,
      expiresIn,
    });

    // 创建会话
    await this.sessionService.login({
      id: account.id,
      username: account.email,
      jwtToken: token,
      expiresIn,
    });

    return {
      token: md5(token),
      expiresIn: ms(expiresIn),
    };
  }
}
```

### 分布式锁

可能会出现的并发操作，按照如下方法加锁：

#### Key 规则

`@WithLock` 和 `@Cacheable` 装饰器的 `key` 参数支持动态占位符，会自动添加前缀（`lock:` 或 `cache:`）。

**语法规则：**

1. **`#{3}`** - 索引直接取值
   ```typescript
   @WithLock({ key: "order:#{0}" })  // 最终为 'lock:order:#{0}'
   async createOrder(userId: string) { }
   ```

2. **`#{1.book.title}`** - 按路径读取属性
   ```typescript
   @WithLock({ key: "order:#{1.book.title}" })
   async processOrder(orderId: string, book: { title: string }) { }
   ```

3. **`#{user.id}`** - 等同于 `#{0.user.id}`，0 可以省略
   ```typescript
   @WithLock({ key: "order:#{user.id}" })
   async processOrder(data: { user: { id: string } }) { }
   ```

**注意事项：**
- 前缀会自动添加，如果 key 已包含前缀则不会重复添加
- 路径解析使用 lodash 的 `get` 方法，支持嵌套属性访问
- 如果值为 `undefined` 或 `null`，占位符不会被替换

#### 使用示例

```typescript
...

@Injectable()
export class {Module}Service {
  ...

  /**
   * 示例 1: 基础分布式锁 - 防止重复操作
   *
   * 使用场景：防止用户快速点击多次导致重复操作
   */
  @WithLock({
    key: "{resource}:create:#{0}", // 会自动添加 'lock:' 前缀，最终为 'lock:{resource}:create:#{0}'
    ttl: 10000, // 10 秒
    waitTimeout: 2000, // 等待 2 秒
    errorMessage: "操作进行中，请稍后重试",
  })
  async create{Resource}(userId: string, ...args): Promise<{Resource}> {
    ...
  }

  /**
   * 示例 2: 零等待时间 - 防止重复提交
   *
   * 使用场景：防止用户重复提交请求
   * 特点：waitTimeout 设为 0，不等待，立即失败
   */
  @WithLock({
    key: "{resource}:#{id}", // #{id} 等同于 #{0.id}
    ttl: 30000, // 30 秒
    waitTimeout: 0, // 不等待，立即失败
    errorMessage: "操作正在进行中，请勿重复提交",
  })
  async process{Resource}(data: {id: string}): Promise<void> {
    ...
  }

  /**
   * 示例 3: 资源扣减
   *
   * 使用场景：防止并发操作导致数据不一致
   * 特点：锁粒度为资源级别，不同资源可以并发操作
   */
  @WithLock({
    key: "{resource}:#{0}",
    ttl: 5000, // 5 秒
    waitTimeout: 2000, // 等待 2 秒
  })
  async reduce{Resource}(resourceId: string, quantity: number): Promise<number> {
    ...
  }

  /**
   * 示例 4: 深度路径访问
   */
  @WithLock({
    key: "{resource}:#{1.user.id}:#{status}", // 从第二个参数获取 user.id，从第一个参数获取 status
    ttl: 10000,
  })
  async process{Resource}(
    resource: { status: string },
    user: { id: string }
  ): Promise<void> {
    ...
  }
  ...
}
```

注意：示例中的 `{Module}`、`{Resource}`、`{resource}` 等占位符需要替换为实际的模块名和资源名。

### 缓存

请合理的使用缓存，妥善处理更新时候重置缓存的处理。

#### Key 规则

`@Cacheable` 和 `@CacheEvict` 装饰器的 `key` 参数支持动态占位符，会自动添加 `cache:` 前缀。语法规则与分布式锁相同，详见上方 [Key 规则](#key-规则) 说明。

#### 使用示例

```typescript
...

@Injectable()
@CacheableService() // service 开启缓存
export class {Module}Service {
  ...

  @Cacheable({ key: "{module}:#{0}" })  // 最终为 'cache:{module}:#{0}'
  async findBy{Key}(key: string): Promise<{Entity} | null> {
    return this.repository.findOne({ where: { key, deleted: false } });
  }

  @CacheEvict({ key: "{module}:#{key}" })  // #{key} 等同于 #{0.key}
  async edit(dto: EditDto): Promise<void> {
    ...
  }

  @Cacheable({ key: "{module}:#{data.profile.id}" })  // 深度路径访问
  async get{Resource}Profile(data: { profile: { id: string } }): Promise<{Resource}> {
    ...
  }
  ...
}
```

注意：示例中的 `{Module}`、`{module}`、`{Entity}`、`{Resource}`、`{Key}`、`{key}` 等占位符需要替换为实际的模块名、实体名、资源名和键名。
