import { beforeEach, describe, expect, test } from "@jest/globals";
import { BulkDiscountRule } from "../../src/PricingRules/Rules/BulkDiscountRule";

describe("BulkDiscountRule - Constructor Validations", () => {
  test("Should throw error if discounted price is greater than the actual price", () => {
    expect(() => {
      new BulkDiscountRule("ipd", 549.99, 5, 600); // Discounted price > Regular price
    }).toThrow("Discounted price can't be more than actual price");
  });

  test("Should not throw error if discounted price is less than the actual price", () => {
    expect(() => {
      new BulkDiscountRule("ipd", 549.99, 5, 499.99); // Valid
    }).not.toThrow();
  });

  test("Should throw error if minimum quantity (threshold) is less than 2", () => {
    expect(() => {
      new BulkDiscountRule("ipd", 549.99, 1, 499.99); // Min qty < 2
    }).toThrow("Minimum quantity should be greater than or equal to 2");
  });

  test("Should not throw error if minimum quantity (threshold) is 2 or greater", () => {
    expect(() => {
      new BulkDiscountRule("ipd", 549.99, 2, 499.99); // Valid
    }).not.toThrow();
  });
});

// Test cases for BulkDiscountRule
describe("BulkDiscountRule", () => {
  let bulkDiscountRule: BulkDiscountRule;

  beforeEach(() => {
    // For the Super iPad: Discount if more than 4 items are bought
    bulkDiscountRule = new BulkDiscountRule("ipd", 549.99, 5, 499.99);
  });

  test("No iPads should return $0", () => {
    const items: Record<string, number> = {
      mkb: 2,
    };
    expect(bulkDiscountRule.apply(items)).toBe(0);
  });

  test("One iPad should return regular price $549.99", () => {
    const items: Record<string, number> = {
      ipd: 1,
    };
    expect(bulkDiscountRule.apply(items)).toBe(549.99);
  });

  test("Four iPads should return regular price for each, total $2199.96", () => {
    const items: Record<string, number> = {
      ipd: 4,
    };
    expect(bulkDiscountRule.apply(items)).toBe(2199.96); // 549.99 * 4
  });

  test("Six iPads should apply bulk discount and return total $2999.94", () => {
    const items: Record<string, number> = {
      ipd: 6,
    };
    expect(bulkDiscountRule.apply(items)).toBe(2999.94); // 499.99 * 6
  });

  test("Other products (e.g. MacBook Pro) should not affect iPad discount, total only applies to iPads", () => {
    const items: Record<string, number> = {
      ipd: 5,
      mbp: 2,
    };
    expect(bulkDiscountRule.apply(items)).toBe(2499.95); // Only iPads are counted (499.99 * 5), MBP is ignored
  });
});
