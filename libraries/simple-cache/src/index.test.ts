import { SimpleCache } from "./index";

const cache = new SimpleCache();

function sum(a, b) {
  return a + b;
}

describe("adds 1 + 2 to equal 3", () => {
  it("test", async () => {
    console.log = jest.fn();

    expect(await cache.withCache(() => sum(1, 3), "4")).toBe(4);
    expect(await cache.withCache(() => sum(1, 3), "4")).toBe(4);
    expect(await cache.withCache(() => sum(1, 3), "4")).toBe(4);
    expect(await cache.withCache(() => sum(1, 3), "4")).toBe(4);

    // @ts-ignore
    expect(console.log.mock.calls[0][0]).toBe("Cache is hited 4");
    // @ts-ignore
    expect(console.log.mock.calls[1][0]).toBe("Cache is hited 4");
    // @ts-ignore
    expect(console.log.mock.calls[2][0]).toBe("Cache is hited 4");
    // @ts-ignore
    expect(console.log.mock.calls[3]).toBe(undefined);
  });
});

describe("cache feature", () => {
  it("save and get", async () => {
    cache.setItem("1", 1);

    expect(cache.getItem("1")).toBe(1);
  });
});
