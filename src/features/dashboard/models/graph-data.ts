export interface PaginationMetaData {
  page: number;
  pages: number;
  per_page: number;
  total: number;
  sourceid: string;
  lastupdated: string;
}

export interface IndicatorData {
  id: string;
  value: string;
}

export interface CountryData {
  id: string;
  value: string;
}

export interface DataItem {
  indicator: IndicatorData;
  country: CountryData;
  countryiso3code: string;
  date: string;
  value: number;
  unit: string;
  obs_status: string;
  decimal: number;
}

export type GraphDataApiResponse = {
  paginationData: PaginationMetaData;
  item: DataItem[];
};
