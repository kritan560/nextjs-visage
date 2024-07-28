import { TruncatePhotgrapherNameCharacterLimit } from "@/constants/constants";

/**
 * Truncate the name of photographer that has length greater than 15
 * @param photographerName string
 * @param truncateLength number
 * @default truncateLength 15
 * @returns string
 *
 */
export function TruncateCreatorName(photographerName: string) {
  if (photographerName.length > TruncatePhotgrapherNameCharacterLimit) {
    const truncatedName = photographerName
      .slice(0, TruncatePhotgrapherNameCharacterLimit)
      .concat("...");

    return truncatedName;
  }

  return photographerName;
}
