import { http } from "@/utils/http";

type GeoRecord = {
  geoId: number;
  location: string;
  type: string;
};

type InfoPageResponse = {
  data?: Array<GeoRecord>;
  code?: number;
  message?: string;
  success?: boolean;
};

/** ID查询地理编码 */
export const idGeo = (param?: object) => {
  return http.request<InfoPageResponse>(
    "get",
    "/geocoding/select/id",
    param ? { params: param } : null
  );
};

/** 名称查询地理编码 */
export const locateGeo = (param?: object) => {
  return http.request<InfoPageResponse>(
    "get",
    "/geocoding/select/location",
    param ? { params: param } : null
  );
};
