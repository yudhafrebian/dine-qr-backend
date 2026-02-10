import { ICheckLimitParams } from "../../interface/policies.interface";
import { ApiError } from "../ApiError";

export const CheckPlanLimit = ({
  current,
  limit,
  featureName,
}: ICheckLimitParams): void => {
  if (limit === null) return;

  if (current >= limit)
    throw new ApiError(
      403,
      `Limit Reached for ${featureName}. Max limit is ${limit}`
    );
};
