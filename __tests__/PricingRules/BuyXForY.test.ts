import { beforeEach, describe, expect, test } from "@jest/globals";
import { BuyXPayForYRule } from "../../PricingRules/Rules/BuyXForYRule";

describe("BuyXPayForYRule - Constructor Validations", () => {
  test("Should throw error if pay quantity is greater than buying quantity", () => {
    expect(() => {
      new BuyXPayForYRule("vga", 30.0, 3, 4); // payQty > buyQty
    }).toThrow("Pay qty can't be more than or equal to buying qty");
  });

  test("Should throw error if pay quantity is equal to buying quantity", () => {
    expect(() => {
      new BuyXPayForYRule("vga", 30.0, 3, 3); // payQty = buyQty
    }).toThrow("Pay qty can't be more than or equal to buying qty");
  });

  test("Should not throw error if pay quantity is less than buying quantity", () => {
    expect(() => {
      new BuyXPayForYRule("vga", 30.0, 3, 2); // Valid case
    }).not.toThrow();
  });
});

// Test cases for BuyXPayForYRule
describe("BuyXPayForYRule", () => {
  let buyXPayForYDeal: BuyXPayForYRule;

  beforeEach(() => {
    // Example: Buy 5, Pay for 3 (for any product, in this case VGA adapters)
    buyXPayForYDeal = new BuyXPayForYRule("vga", 30.0, 5, 3);
  });

  test("No VGA adapters should return $0", () => {
    const items = {};
    expect(buyXPayForYDeal.apply(items)).toBe(0);
  });

  test("One VGA adapter should return full price $30.00", () => {
    const items = {
      vga: 1,
    };
    expect(buyXPayForYDeal.apply(items)).toBe(30.0);
  });

  test("Three VGA adapters should return $90.00 (no deal applied)", () => {
    const items = {
      vga: 3,
    };
    expect(buyXPayForYDeal.apply(items)).toBe(90.0); // No deal applied
  });

  test("Five VGA adapters should apply Buy 5, Pay for 3 deal and return $90.00", () => {
    const items = {
      vga: 5,
    };
    expect(buyXPayForYDeal.apply(items)).toBe(90.0); // Buy 5, Pay for 3 deal applied
  });

  test("Six VGA adapters should apply deal and return $120.00 (Buy 5, Pay for 3 for first 5)", () => {
    const items = {
      vga: 6,
    };
    expect(buyXPayForYDeal.apply(items)).toBe(120.0); // Buy 5, Pay for 3 deal applied for first 5, 1 at full price
  });

  test("Ten VGA adapters should apply deal and return $180.00 (two sets of Buy 5, Pay for 3)", () => {
    const items = {
      vga: 10,
    };
    expect(buyXPayForYDeal.apply(items)).toBe(180.0); // Two sets of Buy 5, Pay for 3 deal
  });

  test("Eleven VGA adapters should return $210.00 (two sets of Buy 5, Pay for 3, plus one at full price)", () => {
    const items = {
      vga: 11,
      mkb: 2,
    };
    expect(buyXPayForYDeal.apply(items)).toBe(210.0); // Two sets of Buy 5, Pay for 3 plus 1 full price
  });
});
