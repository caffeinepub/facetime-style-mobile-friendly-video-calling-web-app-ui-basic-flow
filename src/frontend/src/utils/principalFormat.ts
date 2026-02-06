/**
 * Formats a principal ID into a shortened display format
 * Example: "2vxsx-fae" from "2vxsx-fae-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaa"
 */
export function formatPrincipal(principal: string): string {
  if (!principal) return '';
  
  const parts = principal.split('-');
  if (parts.length < 2) return principal;
  
  return `${parts[0]}-${parts[1]}`;
}
