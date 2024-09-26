import { IPriceRule } from "../IRule";

export class BuyXPayForYRule implements IPriceRule {
  constructor(
    private sku: string,
    private price: number,
    private buyQty: number,
    private payQty: number
  ) {
    if (payQty >= buyQty)
      throw new Error("Pay qty can't be more than or equal to buying qty");
  }

  apply(items: Record<string, number>): number {
    const qty = items[this.sku];
    if (!qty) return 0;

    if (qty >= this.buyQty) {
      return (
        (Math.floor(qty / this.buyQty) * this.payQty + (qty % this.buyQty)) *
        this.price
      );
    }

    return qty * this.price;
  }
}
