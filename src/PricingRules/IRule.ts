export interface IPriceRule {
  apply(items: Record<string, any>): number;
}
