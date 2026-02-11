/**
 * Check if a campaign has expired (considering end of day)
 * @param endDate - The campaign end date (ISO string or Date object)
 * @returns boolean - true if campaign has expired, false otherwise
 */
export function isCampaignExpired(endDate: string | Date | null | undefined): boolean {
  if (!endDate) return false;
  
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  return new Date() > end;
}
