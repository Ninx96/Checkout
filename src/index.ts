import { Checkout } from "./Checkout";
import { BulkDiscountRule } from "./PricingRules/Rules/BulkDiscountRule";
import { BuyXPayForYRule } from "./PricingRules/Rules/BuyXForYRule";
import { DefaultRule } from "./PricingRules/Rules/DefaultRule";

const products = [
  { sku: "ipd", name: "Super iPad", price: 549.99 },
  { sku: "mbp", name: "MacBook Pro", price: 1399.99 },
  { sku: "atv", name: "Apple TV", price: 109.5 },
  { sku: "vga", name: "VGA adapter", price: 30.0 },
];

const pricingRules = products.map((_product) => {
  if (_product.sku === "ipd")
    return new BulkDiscountRule(_product.sku, _product.price, 5, 499.99);

  if (_product.sku === "atv")
    return new BuyXPayForYRule(_product.sku, _product.price, 3, 2);

  return new DefaultRule(_product.sku, _product.price);
});

const co = new Checkout(pricingRules);
co.scan("atv");
co.scan("atv");
co.scan("atv");
co.scan("atv");
co.scan("atv");
co.scan("atv");
co.scan("vga");
console.log("$", co.total());
