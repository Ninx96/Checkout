import { IPriceRule } from "../IRule";

export class BulkDiscountRule implements IPriceRule {
  constructor(
    private sku: string,
    private price: number,
    private minQty: number,
    private disountedPrice: number
  ) {
    if (disountedPrice > price)
      throw new Error("Discounted price can't be more than actual price");

    if (minQty < 2)
      throw new Error("Minimum quantity should be greater than or equal to 2");
  }

  apply(items: Record<string, any>): number {
    const qty = items[this.sku];
    if (!qty) return 0;
    if (qty >= this.minQty) {
      return qty * this.disountedPrice;
    }
    return qty * this.price;
  }
}
