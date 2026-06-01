// Complete list of all 195 countries (193 UN members + Vatican City + Palestine)
// This ensures all countries are available even if not in the map topology

export interface CountryEntry {
  id: string;
  name: string;
  iso3?: string;
  iso2?: string;
}

// Generate ID from name (slug format)
function countryId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toUpperCase();
}

export const ALL_195_COUNTRIES: CountryEntry[] = [
  { name: "Afghanistan", iso3: "AFG", iso2: "AF" },
  { name: "Albania", iso3: "ALB", iso2: "AL" },
  { name: "Algeria", iso3: "DZA", iso2: "DZ" },
  { name: "Andorra", iso3: "AND", iso2: "AD" },
  { name: "Angola", iso3: "AGO", iso2: "AO" },
  { name: "Antigua and Barbuda", iso3: "ATG", iso2: "AG" },
  { name: "Argentina", iso3: "ARG", iso2: "AR" },
  { name: "Armenia", iso3: "ARM", iso2: "AM" },
  { name: "Australia", iso3: "AUS", iso2: "AU" },
  { name: "Austria", iso3: "AUT", iso2: "AT" },
  { name: "Azerbaijan", iso3: "AZE", iso2: "AZ" },
  { name: "Bahamas", iso3: "BHS", iso2: "BS" },
  { name: "Bahrain", iso3: "BHR", iso2: "BH" },
  { name: "Bangladesh", iso3: "BGD", iso2: "BD" },
  { name: "Barbados", iso3: "BRB", iso2: "BB" },
  { name: "Belarus", iso3: "BLR", iso2: "BY" },
  { name: "Belgium", iso3: "BEL", iso2: "BE" },
  { name: "Belize", iso3: "BLZ", iso2: "BZ" },
  { name: "Benin", iso3: "BEN", iso2: "BJ" },
  { name: "Bhutan", iso3: "BTN", iso2: "BT" },
  { name: "Bolivia", iso3: "BOL", iso2: "BO" },
  { name: "Bosnia and Herzegovina", iso3: "BIH", iso2: "BA" },
  { name: "Botswana", iso3: "BWA", iso2: "BW" },
  { name: "Brazil", iso3: "BRA", iso2: "BR" },
  { name: "Brunei", iso3: "BRN", iso2: "BN" },
  { name: "Bulgaria", iso3: "BGR", iso2: "BG" },
  { name: "Burkina Faso", iso3: "BFA", iso2: "BF" },
  { name: "Burundi", iso3: "BDI", iso2: "BI" },
  { name: "Cabo Verde", iso3: "CPV", iso2: "CV" },
  { name: "Cambodia", iso3: "KHM", iso2: "KH" },
  { name: "Cameroon", iso3: "CMR", iso2: "CM" },
  { name: "Canada", iso3: "CAN", iso2: "CA" },
  { name: "Central African Republic", iso3: "CAF", iso2: "CF" },
  { name: "Chad", iso3: "TCD", iso2: "TD" },
  { name: "Chile", iso3: "CHL", iso2: "CL" },
  { name: "China", iso3: "CHN", iso2: "CN" },
  { name: "Colombia", iso3: "COL", iso2: "CO" },
  { name: "Comoros", iso3: "COM", iso2: "KM" },
  { name: "Congo", iso3: "COG", iso2: "CG" },
  { name: "Costa Rica", iso3: "CRI", iso2: "CR" },
  { name: "Croatia", iso3: "HRV", iso2: "HR" },
  { name: "Cuba", iso3: "CUB", iso2: "CU" },
  { name: "Cyprus", iso3: "CYP", iso2: "CY" },
  { name: "Czech Republic", iso3: "CZE", iso2: "CZ" },
  { name: "Denmark", iso3: "DNK", iso2: "DK" },
  { name: "Djibouti", iso3: "DJI", iso2: "DJ" },
  { name: "Dominica", iso3: "DMA", iso2: "DM" },
  { name: "Dominican Republic", iso3: "DOM", iso2: "DO" },
  { name: "Ecuador", iso3: "ECU", iso2: "EC" },
  { name: "Egypt", iso3: "EGY", iso2: "EG" },
  { name: "El Salvador", iso3: "SLV", iso2: "SV" },
  { name: "Equatorial Guinea", iso3: "GNQ", iso2: "GQ" },
  { name: "Eritrea", iso3: "ERI", iso2: "ER" },
  { name: "Estonia", iso3: "EST", iso2: "EE" },
  { name: "Eswatini", iso3: "SWZ", iso2: "SZ" },
  { name: "Ethiopia", iso3: "ETH", iso2: "ET" },
  { name: "Fiji", iso3: "FJI", iso2: "FJ" },
  { name: "Finland", iso3: "FIN", iso2: "FI" },
  { name: "France", iso3: "FRA", iso2: "FR" },
  { name: "Gabon", iso3: "GAB", iso2: "GA" },
  { name: "Gambia", iso3: "GMB", iso2: "GM" },
  { name: "Georgia", iso3: "GEO", iso2: "GE" },
  { name: "Germany", iso3: "DEU", iso2: "DE" },
  { name: "Ghana", iso3: "GHA", iso2: "GH" },
  { name: "Greece", iso3: "GRC", iso2: "GR" },
  { name: "Grenada", iso3: "GRD", iso2: "GD" },
  { name: "Guatemala", iso3: "GTM", iso2: "GT" },
  { name: "Guinea", iso3: "GIN", iso2: "GN" },
  { name: "Guinea-Bissau", iso3: "GNB", iso2: "GW" },
  { name: "Guyana", iso3: "GUY", iso2: "GY" },
  { name: "Haiti", iso3: "HTI", iso2: "HT" },
  { name: "Honduras", iso3: "HND", iso2: "HN" },
  { name: "Hungary", iso3: "HUN", iso2: "HU" },
  { name: "Iceland", iso3: "ISL", iso2: "IS" },
  { name: "India", iso3: "IND", iso2: "IN" },
  { name: "Indonesia", iso3: "IDN", iso2: "ID" },
  { name: "Iran", iso3: "IRN", iso2: "IR" },
  { name: "Iraq", iso3: "IRQ", iso2: "IQ" },
  { name: "Ireland", iso3: "IRL", iso2: "IE" },
  { name: "Israel", iso3: "ISR", iso2: "IL" },
  { name: "Italy", iso3: "ITA", iso2: "IT" },
  { name: "Jamaica", iso3: "JAM", iso2: "JM" },
  { name: "Japan", iso3: "JPN", iso2: "JP" },
  { name: "Jordan", iso3: "JOR", iso2: "JO" },
  { name: "Kazakhstan", iso3: "KAZ", iso2: "KZ" },
  { name: "Kenya", iso3: "KEN", iso2: "KE" },
  { name: "Kiribati", iso3: "KIR", iso2: "KI" },
  { name: "Kuwait", iso3: "KWT", iso2: "KW" },
  { name: "Kyrgyzstan", iso3: "KGZ", iso2: "KG" },
  { name: "Laos", iso3: "LAO", iso2: "LA" },
  { name: "Latvia", iso3: "LVA", iso2: "LV" },
  { name: "Lebanon", iso3: "LBN", iso2: "LB" },
  { name: "Lesotho", iso3: "LSO", iso2: "LS" },
  { name: "Liberia", iso3: "LBR", iso2: "LR" },
  { name: "Libya", iso3: "LBY", iso2: "LY" },
  { name: "Liechtenstein", iso3: "LIE", iso2: "LI" },
  { name: "Lithuania", iso3: "LTU", iso2: "LT" },
  { name: "Luxembourg", iso3: "LUX", iso2: "LU" },
  { name: "Madagascar", iso3: "MDG", iso2: "MG" },
  { name: "Malawi", iso3: "MWI", iso2: "MW" },
  { name: "Malaysia", iso3: "MYS", iso2: "MY" },
  { name: "Maldives", iso3: "MDV", iso2: "MV" },
  { name: "Mali", iso3: "MLI", iso2: "ML" },
  { name: "Malta", iso3: "MLT", iso2: "MT" },
  { name: "Marshall Islands", iso3: "MHL", iso2: "MH" },
  { name: "Mauritania", iso3: "MRT", iso2: "MR" },
  { name: "Mauritius", iso3: "MUS", iso2: "MU" },
  { name: "Mexico", iso3: "MEX", iso2: "MX" },
  { name: "Micronesia", iso3: "FSM", iso2: "FM" },
  { name: "Moldova", iso3: "MDA", iso2: "MD" },
  { name: "Monaco", iso3: "MCO", iso2: "MC" },
  { name: "Mongolia", iso3: "MNG", iso2: "MN" },
  { name: "Montenegro", iso3: "MNE", iso2: "ME" },
  { name: "Morocco", iso3: "MAR", iso2: "MA" },
  { name: "Mozambique", iso3: "MOZ", iso2: "MZ" },
  { name: "Myanmar", iso3: "MMR", iso2: "MM" },
  { name: "Namibia", iso3: "NAM", iso2: "NA" },
  { name: "Nauru", iso3: "NRU", iso2: "NR" },
  { name: "Nepal", iso3: "NPL", iso2: "NP" },
  { name: "Netherlands", iso3: "NLD", iso2: "NL" },
  { name: "New Zealand", iso3: "NZL", iso2: "NZ" },
  { name: "Nicaragua", iso3: "NIC", iso2: "NI" },
  { name: "Niger", iso3: "NER", iso2: "NE" },
  { name: "Nigeria", iso3: "NGA", iso2: "NG" },
  { name: "North Korea", iso3: "PRK", iso2: "KP" },
  { name: "North Macedonia", iso3: "MKD", iso2: "MK" },
  { name: "Norway", iso3: "NOR", iso2: "NO" },
  { name: "Oman", iso3: "OMN", iso2: "OM" },
  { name: "Pakistan", iso3: "PAK", iso2: "PK" },
  { name: "Palau", iso3: "PLW", iso2: "PW" },
  { name: "Palestine", iso3: "PSE", iso2: "PS" },
  { name: "Panama", iso3: "PAN", iso2: "PA" },
  { name: "Papua New Guinea", iso3: "PNG", iso2: "PG" },
  { name: "Paraguay", iso3: "PRY", iso2: "PY" },
  { name: "Peru", iso3: "PER", iso2: "PE" },
  { name: "Philippines", iso3: "PHL", iso2: "PH" },
  { name: "Poland", iso3: "POL", iso2: "PL" },
  { name: "Portugal", iso3: "PRT", iso2: "PT" },
  { name: "Qatar", iso3: "QAT", iso2: "QA" },
  { name: "Romania", iso3: "ROU", iso2: "RO" },
  { name: "Russia", iso3: "RUS", iso2: "RU" },
  { name: "Rwanda", iso3: "RWA", iso2: "RW" },
  { name: "Saint Kitts and Nevis", iso3: "KNA", iso2: "KN" },
  { name: "Saint Lucia", iso3: "LCA", iso2: "LC" },
  { name: "Saint Vincent and the Grenadines", iso3: "VCT", iso2: "VC" },
  { name: "Samoa", iso3: "WSM", iso2: "WS" },
  { name: "San Marino", iso3: "SMR", iso2: "SM" },
  { name: "Sao Tome and Principe", iso3: "STP", iso2: "ST" },
  { name: "Saudi Arabia", iso3: "SAU", iso2: "SA" },
  { name: "Senegal", iso3: "SEN", iso2: "SN" },
  { name: "Serbia", iso3: "SRB", iso2: "RS" },
  { name: "Seychelles", iso3: "SYC", iso2: "SC" },
  { name: "Sierra Leone", iso3: "SLE", iso2: "SL" },
  { name: "Singapore", iso3: "SGP", iso2: "SG" },
  { name: "Slovakia", iso3: "SVK", iso2: "SK" },
  { name: "Slovenia", iso3: "SVN", iso2: "SI" },
  { name: "Solomon Islands", iso3: "SLB", iso2: "SB" },
  { name: "Somalia", iso3: "SOM", iso2: "SO" },
  { name: "South Africa", iso3: "ZAF", iso2: "ZA" },
  { name: "South Korea", iso3: "KOR", iso2: "KR" },
  { name: "South Sudan", iso3: "SSD", iso2: "SS" },
  { name: "Spain", iso3: "ESP", iso2: "ES" },
  { name: "Sri Lanka", iso3: "LKA", iso2: "LK" },
  { name: "Sudan", iso3: "SDN", iso2: "SD" },
  { name: "Suriname", iso3: "SUR", iso2: "SR" },
  { name: "Sweden", iso3: "SWE", iso2: "SE" },
  { name: "Switzerland", iso3: "CHE", iso2: "CH" },
  { name: "Syria", iso3: "SYR", iso2: "SY" },
  { name: "Taiwan", iso3: "TWN", iso2: "TW" },
  { name: "Tajikistan", iso3: "TJK", iso2: "TJ" },
  { name: "Tanzania", iso3: "TZA", iso2: "TZ" },
  { name: "Thailand", iso3: "THA", iso2: "TH" },
  { name: "Timor-Leste", iso3: "TLS", iso2: "TL" },
  { name: "Togo", iso3: "TGO", iso2: "TG" },
  { name: "Tonga", iso3: "TON", iso2: "TO" },
  { name: "Trinidad and Tobago", iso3: "TTO", iso2: "TT" },
  { name: "Tunisia", iso3: "TUN", iso2: "TN" },
  { name: "Turkey", iso3: "TUR", iso2: "TR" },
  { name: "Turkmenistan", iso3: "TKM", iso2: "TM" },
  { name: "Tuvalu", iso3: "TUV", iso2: "TV" },
  { name: "Uganda", iso3: "UGA", iso2: "UG" },
  { name: "Ukraine", iso3: "UKR", iso2: "UA" },
  { name: "United Arab Emirates", iso3: "ARE", iso2: "AE" },
  { name: "United Kingdom", iso3: "GBR", iso2: "GB" },
  { name: "United States", iso3: "USA", iso2: "US" },
  { name: "Uruguay", iso3: "URY", iso2: "UY" },
  { name: "Uzbekistan", iso3: "UZB", iso2: "UZ" },
  { name: "Vanuatu", iso3: "VUT", iso2: "VU" },
  { name: "Vatican City", iso3: "VAT", iso2: "VA" },
  { name: "Venezuela", iso3: "VEN", iso2: "VE" },
  { name: "Vietnam", iso3: "VNM", iso2: "VN" },
  { name: "Yemen", iso3: "YEM", iso2: "YE" },
  { name: "Zambia", iso3: "ZMB", iso2: "ZM" },
  { name: "Zimbabwe", iso3: "ZWE", iso2: "ZW" },
].map((country) => ({
  ...country,
  id: countryId(country.name),
}));

// Export a map for quick lookup
export const COUNTRIES_BY_ID = new Map(
  ALL_195_COUNTRIES.map((c) => [c.id, c])
);

export const COUNTRIES_BY_NAME = new Map(
  ALL_195_COUNTRIES.map((c) => [c.name.toLowerCase(), c])
);

// Helper to find country by various identifiers
export function findCountry(identifier: string): CountryEntry | undefined {
  const lower = identifier.toLowerCase();
  
  // Try by ID
  const byId = COUNTRIES_BY_ID.get(identifier.toUpperCase());
  if (byId) return byId;
  
  // Try by name
  const byName = COUNTRIES_BY_NAME.get(lower);
  if (byName) return byName;
  
  // Try by ISO3
  const byIso3 = ALL_195_COUNTRIES.find((c) => c.iso3?.toLowerCase() === lower);
  if (byIso3) return byIso3;
  
  // Try by ISO2
  const byIso2 = ALL_195_COUNTRIES.find((c) => c.iso2?.toLowerCase() === lower);
  if (byIso2) return byIso2;
  
  return undefined;
}

