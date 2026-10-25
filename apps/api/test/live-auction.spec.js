const test = require("node:test");
const assert = require("node:assert/strict");
const { LiveAuctionService } = require("../dist/modules/live-auction/live-auction.service.js");
const { LiveAuctionRedisService } = require("../dist/modules/live-auction/live-auction.redis.service.js");

function createMockRedis() {
  const store = new Map();
  const lists = new Map();
  const hashes = new Map();

  const redis = {
    _store: store,
    _lists: lists,
    _hashes: hashes,

    async llen(key) {
      return (lists.get(key) || []).length;
    },
    async lrange(key, start, stop) {
      const list = lists.get(key) || [];
      if (stop === -1) {
        return list.slice(start);
      }
      return list.slice(start, stop + 1);
    },
    async rpush(key, ...items) {
      const list = lists.get(key) || [];
      list.push(...items);
      lists.set(key, list);
      return list.length;
    },
    async del(...keys) {
      for (const k of keys) {
        store.delete(k);
        lists.delete(k);
        hashes.delete(k);
      }
      return keys.length;
    },
    async get(key) {
      return store.get(key) || null;
    },
    async set(key, val) {
      store.set(key, String(val));
      return "OK";
    },
    async mget(...keys) {
      return keys.map((k) => store.get(k) || null);
    },
    async expire(key, ttl) {
      return 1;
    },
    async hset(key, ...args) {
      let map = hashes.get(key);
      if (!map) {
        map = new Map();
        hashes.set(key, map);
      }
      if (args.length === 1 && typeof args[0] === "object") {
        for (const [f, v] of Object.entries(args[0])) {
          map.set(f, String(v));
        }
      } else {
        for (let i = 0; i < args.length; i += 2) {
          map.set(args[i], String(args[i + 1]));
        }
      }
      return 1;
    },
    async hget(key, field) {
      const map = hashes.get(key);
      return map ? map.get(field) || null : null;
    },
    async hgetall(key) {
      const map = hashes.get(key);
      if (!map) return {};
      const obj = {};
      for (const [k, v] of map.entries()) {
        obj[k] = v;
      }
      return obj;
    },
    multi() {
      const operations = [];
      const chain = {
        set: (k, v) => { operations.push(() => redis.set(k, v)); return chain; },
        del: (...k) => { operations.push(() => redis.del(...k)); return chain; },
        exec: async () => {
          const results = [];
          for (const op of operations) {
            results.push(await op());
          }
          return results;
        },
      };
      return chain;
    },
    pipeline() {
      const operations = [];
      const chain = {
        hset: (k, ...args) => { operations.push(() => redis.hset(k, ...args)); return chain; },
        del: (...k) => { operations.push(() => redis.del(...k)); return chain; },
        expire: (k, ttl) => { operations.push(() => redis.expire(k, ttl)); return chain; },
        rpush: (k, ...items) => { operations.push(() => redis.rpush(k, ...items)); return chain; },
        set: (k, v) => { operations.push(() => redis.set(k, v)); return chain; },
        exec: async () => {
          const results = [];
          for (const op of operations) {
            results.push(await op());
          }
          return results;
        },
      };
      return chain;
    },
  };

  return redis;
}

function createMockPrisma() {
  let players = [];
  let teams = [];
  let categories = [];
  let auctions = [];

  return {
    _setPlayers: (p) => { players = p; },
    _setTeams: (t) => { teams = t; },
    _setCategories: (c) => { categories = c; },
    _setAuctions: (a) => { auctions = a; },
    prisma: {
      player: {
        findMany: async ({ where, select, include }) => {
          let list = [...players];
          if (where) {
            if (where.auctionId) list = list.filter((p) => p.auctionId === where.auctionId);
            if (where.status) list = list.filter((p) => p.status === where.status);
            if (where.id?.not) list = list.filter((p) => p.id !== where.id.not);
          }
          if (select) {
            return list.map((p) => {
              const res = {};
              if (select.id) res.id = p.id;
              if (select.auctionId) res.auctionId = p.auctionId;
              if (select.categoryId) res.categoryId = p.categoryId;
              if (select.category) res.category = p.category;
              if (select.name) res.name = p.name;
              if (select.status) res.status = p.status;
              if (select.basePrice) res.basePrice = p.basePrice;
              if (select.soldPrice) res.soldPrice = p.soldPrice;
              if (select.team) res.team = p.team ? { name: p.team.name } : null;
              return res;
            });
          }
          return list;
        },
        count: async ({ where }) => {
          let list = [...players];
          if (where) {
            if (where.auctionId) list = list.filter((p) => p.auctionId === where.auctionId);
            if (where.status) list = list.filter((p) => p.status === where.status);
          }
          return list.length;
        },
      },
      team: {
        findMany: async ({ where }) => {
          return teams.filter((t) => t.auctionId === where?.auctionId);
        },
      },
      category: {
        findMany: async ({ where }) => {
          return categories.filter((c) => c.auctionId === where?.auctionId);
        },
      },
      auction: {
        findUnique: async ({ where }) => {
          return auctions.find((a) => a.id === where?.id) || null;
        },
      },
    },
  };
}

test("Live Auction Reconciliation & Business Rules Test Suite", async (t) => {
  const auctionId = "9697bcb5-6d72-48c2-939f-51fb9d2dcedf";
  const cat1 = { id: "cat-bat-1", name: "Batsman", color: "#3498db", auctionId };
  const cat2 = { id: "cat-bowl-1", name: "Bowler", color: "#e74c3c", auctionId };

  const samplePlayers = [
    {
      id: "p-1",
      name: "Virat Kohli",
      auctionId,
      categoryId: cat1.id,
      category: cat1,
      status: "UPCOMING",
      basePrice: 2000000,
    },
    {
      id: "p-2",
      name: "Jasprit Bumrah",
      auctionId,
      categoryId: cat2.id,
      category: cat2,
      status: "UPCOMING",
      basePrice: 2000000,
    },
    {
      id: "p-3",
      name: "Rohit Sharma",
      auctionId,
      categoryId: cat1.id,
      category: cat1,
      status: "SOLD",
      basePrice: 2000000,
      soldPrice: 15000000,
      team: { name: "Mumbai Indians" },
    },
    {
      id: "p-4",
      name: "Glenn Maxwell",
      auctionId,
      categoryId: cat1.id,
      category: cat1,
      status: "UNSOLD",
      basePrice: 1500000,
    },
    {
      id: "p-other-auc",
      name: "Foreign Auction Player",
      auctionId: "other-auction-uuid",
      categoryId: "cat-foreign",
      status: "UPCOMING",
      basePrice: 1000000,
    },
  ];

  await t.test("1. Auction contains eligible players in PostgreSQL but Redis state is empty -> self-healing selects valid player", async () => {
    const mockRedis = createMockRedis();
    const redisService = new LiveAuctionRedisService(mockRedis);
    const mockPrisma = createMockPrisma();
    mockPrisma._setPlayers(samplePlayers);

    const service = new LiveAuctionService(mockPrisma, redisService);

    // Initial check: Redis queue is empty
    const initialRedisCount = await mockRedis.llen(`auction:${auctionId}:unsold`);
    assert.equal(initialRedisCount, 0);

    // Call selectPlayer
    const selected = await service.selectPlayer(auctionId, "SEQUENCE");
    assert.ok(selected, "Expected a player to be returned via self-healing reconciliation");
    assert.equal(selected.id, "p-1");
    assert.equal(selected.status, "UPCOMING");

    // After selection, the remaining UPCOMING player (p-2) should still be in Redis unsold list
    const postCount = await mockRedis.llen(`auction:${auctionId}:unsold`);
    assert.equal(postCount, 1);
  });

  await t.test("2. Dashboard snapshot includes categoryId & category so category counts are accurate", async () => {
    const mockRedis = createMockRedis();
    const redisService = new LiveAuctionRedisService(mockRedis);
    const mockPrisma = createMockPrisma();
    mockPrisma._setPlayers(samplePlayers);
    mockPrisma._setCategories([cat1, cat2]);
    mockPrisma._setTeams([
      { id: "team-1", name: "Chennai Super Kings", auctionId, originalPurse: 100000000, purseSpent: 0 },
      { id: "team-2", name: "Royal Challengers Bengaluru", auctionId, originalPurse: 100000000, purseSpent: 0 },
    ]);
    mockPrisma._setAuctions([{ id: auctionId, logo: "logo.png", budgetPerTeam: 100000000 }]);

    const service = new LiveAuctionService(mockPrisma, redisService);
    const snapshot = await service.buildDashboardSnapshot(auctionId);

    assert.ok(snapshot.players.upcoming.length > 0);
    assert.ok(snapshot.players.sold.length > 0);
    assert.ok(snapshot.players.unsold.length > 0);

    // Verify all players have categoryId and category
    for (const p of [...snapshot.players.upcoming, ...snapshot.players.sold, ...snapshot.players.unsold]) {
      assert.ok(p.categoryId, `Player ${p.name} missing categoryId`);
      assert.ok(p.category, `Player ${p.name} missing category object`);
    }

    // Verify category counting matching frontend logic:
    const allPlayers = [...snapshot.players.upcoming, ...snapshot.players.sold, ...snapshot.players.unsold];
    const cat1Count = allPlayers.filter((p) => (p.categoryId || p.category?.id) === cat1.id).length;
    const cat2Count = allPlayers.filter((p) => (p.categoryId || p.category?.id) === cat2.id).length;

    assert.equal(cat1Count, 3, "Cat 1 (Batsman) should have 3 players (p-1, p-3, p-4)");
    assert.equal(cat2Count, 1, "Cat 2 (Bowler) should have 1 player (p-2)");
  });

  await t.test("3. Respects category filter when selecting players", async () => {
    const mockRedis = createMockRedis();
    const redisService = new LiveAuctionRedisService(mockRedis);
    const mockPrisma = createMockPrisma();
    mockPrisma._setPlayers(samplePlayers);

    const service = new LiveAuctionService(mockPrisma, redisService);

    // Explicitly request Bowler category (cat2)
    const selected = await service.selectPlayer(auctionId, "SEQUENCE", cat2.id);
    assert.ok(selected);
    assert.equal(selected.id, "p-2");
    assert.equal(selected.categoryId, cat2.id);
  });

  await t.test("4. Returns null when category has no available eligible players", async () => {
    const mockRedis = createMockRedis();
    const redisService = new LiveAuctionRedisService(mockRedis);
    const mockPrisma = createMockPrisma();
    mockPrisma._setPlayers(samplePlayers);

    const service = new LiveAuctionService(mockPrisma, redisService);

    const nonExistentCat = "cat-all-rounder-empty";
    const selected = await service.selectPlayer(auctionId, "SEQUENCE", nonExistentCat);
    assert.equal(selected, null, "Should return null when category has no upcoming players");
  });

  await t.test("5. Sold players and Unsold players are excluded from initial upcoming queue", async () => {
    const mockRedis = createMockRedis();
    const redisService = new LiveAuctionRedisService(mockRedis);
    const mockPrisma = createMockPrisma();
    mockPrisma._setPlayers(samplePlayers);

    const service = new LiveAuctionService(mockPrisma, redisService);

    // Draw first player
    const p1 = await service.selectPlayer(auctionId, "SEQUENCE");
    // Draw second player
    const p2 = await service.selectPlayer(auctionId, "SEQUENCE");
    // Draw third player (should be null because p-3 is SOLD and p-4 is UNSOLD)
    const p3 = await service.selectPlayer(auctionId, "SEQUENCE");

    assert.ok(p1);
    assert.ok(p2);
    assert.equal(p3, null, "No more UPCOMING players should be drawn");
    assert.notEqual(p1.id, "p-3", "SOLD player must not be selected");
    assert.notEqual(p2.id, "p-3", "SOLD player must not be selected");
    assert.notEqual(p1.id, "p-4", "UNSOLD player must not be selected without re-auction");
    assert.notEqual(p2.id, "p-4", "UNSOLD player must not be selected without re-auction");
  });

  await t.test("6. Players belonging to other auctions are NEVER selected", async () => {
    const mockRedis = createMockRedis();
    const redisService = new LiveAuctionRedisService(mockRedis);
    const mockPrisma = createMockPrisma();
    mockPrisma._setPlayers(samplePlayers);

    const service = new LiveAuctionService(mockPrisma, redisService);

    const p1 = await service.selectPlayer(auctionId, "SEQUENCE");
    const p2 = await service.selectPlayer(auctionId, "SEQUENCE");
    const p3 = await service.selectPlayer(auctionId, "SEQUENCE");

    assert.notEqual(p1?.id, "p-other-auc");
    assert.notEqual(p2?.id, "p-other-auc");
    assert.equal(p3, null);
  });

  await t.test("7. Self-healing reconciliation is idempotent and does not duplicate players", async () => {
    const mockRedis = createMockRedis();
    const redisService = new LiveAuctionRedisService(mockRedis);
    const mockPrisma = createMockPrisma();
    mockPrisma._setPlayers(samplePlayers);

    const service = new LiveAuctionService(mockPrisma, redisService);

    // Call selectPlayer twice
    const p1 = await service.selectPlayer(auctionId, "SEQUENCE");
    assert.equal(p1.id, "p-1");

    // Queue in Redis should now have exactly 1 player left (p-2), not duplicates
    const count = await mockRedis.llen(`auction:${auctionId}:unsold`);
    assert.equal(count, 1);

    const p2 = await service.selectPlayer(auctionId, "SEQUENCE");
    assert.equal(p2.id, "p-2");

    const finalCount = await mockRedis.llen(`auction:${auctionId}:unsold`);
    assert.equal(finalCount, 0);
  });
});
