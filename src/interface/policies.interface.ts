export interface ICheckLimitParams {
  current: number;
  limit: number | null;
  featureName: "Menu" | "User" | "Table";
}
