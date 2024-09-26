import { IPriceRule } from "./PricingRules/IRule";

export class Checkout {
  private items: Record<string, number> = {};

  constructor(private pricingRules: IPriceRule[]) {}

  scan(sku: string) {
    this.items[sku] = (this.items[sku] || 0) + 1;
  }

  total(): number {
    let total = 0;

    // Apply pricing rules
    for (let _pricingRule of this.pricingRules) {
      total += _pricingRule.apply(this.items);
    }

    return parseFloat(total.toFixed(2));
  }
}
