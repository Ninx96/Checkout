import { beforeEach, describe, expect, test } from "@jest/globals";
import { BulkDiscountRule } from "../src/PricingRules/Rules/BulkDiscountRule";
import { BuyXPayForYRule } from "../src/PricingRules/Rules/BuyXForYRule";
import { DefaultRule } from "../src/PricingRules/Rules/DefaultRule";
import { Checkout } from "../src/Checkout";

// Products catalogue (as provided)
const products = [
  { sku: "ipd", name: "Super iPad", price: 549.99 },
  { sku: "mbp", name: "MacBook Pro", price: 1399.99 },
  { sku: "atv", name: "Apple TV", price: 109.5 },
  { sku: "vga", name: "VGA adapter", price: 30.0 },
];

// Pricing Rules for the test cases
const pricingRules = products.map((_product) => {
  if (_product.sku === "ipd")
    return new BulkDiscountRule(_product.sku, _product.price, 5, 499.99);

  if (_product.sku === "atv")
    return new BuyXPayForYRule(_product.sku, _product.price, 3, 2);

  return new DefaultRule(_product.sku, _product.price);
});

// Test cases
describe("Checkout System", () => {
  let co: Checkout;

  beforeEach(() => {
    co = new Checkout(pricingRules);
  });

  test("Total price with no items should be 0", () => {
    expect(co.total()).toBe(0);
  });

  test("Single Apple TV should cost $109.50", () => {
    co.scan("atv");
    expect(co.total()).toBe(109.5);
  });

  test("Three Apple TVs should trigger 3-for-2 deal and cost $219.00", () => {
    co.scan("atv");
    co.scan("atv");
    co.scan("atv");
    expect(co.total()).toBe(219.0);
  });

  test("Four Apple TVs should cost $328.50 (3-for-2 deal applies only once)", () => {
    co.scan("atv");
    co.scan("atv");
    co.scan("atv");
    co.scan("atv");
    expect(co.total()).toBe(328.5);
  });

  test("Five Super iPads should trigger bulk discount and cost $2499.95", () => {
    co.scan("ipd");
    co.scan("ipd");
    co.scan("ipd");
    co.scan("ipd");
    co.scan("ipd");
    expect(co.total()).toBe(2499.95); // 499.99 * 5
  });

  test("Four Super iPads should not trigger bulk discount and cost $2199.96", () => {
    co.scan("ipd");
    co.scan("ipd");
    co.scan("ipd");
    co.scan("ipd");
    expect(co.total()).toBe(2199.96); // 549.99 * 4
  });

  test("Combination of Apple TVs (3-for-2) and Super iPads (bulk discount)", () => {
    co.scan("atv");
    co.scan("atv");
    co.scan("atv");
    co.scan("ipd");
    co.scan("ipd");
    co.scan("ipd");
    co.scan("ipd");
    co.scan("ipd");
    expect(co.total()).toBe(2718.95); // 219.00 (ATV) + 2499.95 (iPad)
  });

  test("MacBook Pro and VGA adapter with no discount", () => {
    co.scan("mbp");
    co.scan("vga");
    expect(co.total()).toBe(1429.99); // 1399.99 + 30.00
  });

  test("Empty checkout should return total of 0", () => {
    expect(co.total()).toBe(0);
  });

  test("Five Apple TVs should trigger 3-for-2 once and the rest at regular price", () => {
    co.scan("atv");
    co.scan("atv");
    co.scan("atv");
    co.scan("atv");
    co.scan("atv");
    expect(co.total()).toBe(438.0); // 219.00 (for 3 ATVs) + 109.50 * 2
  });

  test("Five Super iPads and a MacBook Pro should apply iPad bulk discount", () => {
    co.scan("ipd");
    co.scan("ipd");
    co.scan("ipd");
    co.scan("ipd");
    co.scan("ipd");
    co.scan("mbp");
    expect(co.total()).toBe(3899.94); // 2499.95 (iPad) + 1399.99 (MacBook Pro)
  });
});
