function sum(a, b) {
  return a + b;
}

describe("sum test", () => {
  it("1 + 1 is must 2", async () => {
    expect(sum(1, 1)).toBe(2);
  });
});

export {};
