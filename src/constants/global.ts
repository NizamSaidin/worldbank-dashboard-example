export const DEFAULT_TIME_RANGE = [2011, 2021];

export const ASEAN_COUNTRIES_ISO3 = [
  "BRN",
  "KHM",
  "IDN",
  "LAO",
  "MMR",
  "MYS",
  "PHL",
  "SGP",
  "THA",
  "VNM",
];

export const ASEAN_COUNTRIES_ISO2 = [
  "BN",
  "KH",
  "ID",
  "LA",
  "MM",
  "MY",
  "PH",
  "SG",
  "TH",
  "VN",
];

export const INDICATOR_DEFINITIONS = {
  "BX.KLT.DINV.WD.GD.ZS": "Foreign direct investment, net inflows (% of GDP)",
  "NE.EXP.GNFS.ZS": "Export of goods and services (% of GDP)",
  "BN.GSR.GNFS.CD": "Net trade in goods and services (BoP, current US$)",
  "EG.ELC.HYRO.ZS": "Electricity production from coal sources (% of total)",
  "SP.POP.TOTL": "Population, total",
  "NY.GDP.PCAP.CD": "Export of goods and services (%of GDP)",
} as const;
export type IndicatorType = keyof typeof INDICATOR_DEFINITIONS;
