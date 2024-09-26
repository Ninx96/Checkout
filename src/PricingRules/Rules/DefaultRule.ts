import { IPriceRule } from "../IRule";

export class DefaultRule implements IPriceRule {
  constructor(private sku: string, private price: number) {}

  apply(items: Record<string, any>): number {
    const qty = items[this.sku];
    if (!qty) return 0;
    return qty * this.price;
  }
}
