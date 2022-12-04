import { http } from "@/utils/http";

type GeoLocation = {
  province: string;
  city: string;
  county: string;
  town: string;
  village: string;
};

export type InfoRecord = {
  infoId: string;
  location: GeoLocation;
  createTime: Date;
  updateTime: Date;
  infoDesc: string;
};

type InfoPageResponse = {
  data?: {
    total: number;
    current: number;
    hitCount: boolean;
    pages: number;
    size: number;
    optimizeCountSql: boolean;
    records: Array<InfoRecord>;
    maxLimit?: number;
    searchCount: boolean;
    orders: Array<any>;
    countId?: any;
  };
  code?: number;
  message?: string;
  success?: boolean;
};

/** 分页查询信息 */
export const pageInfo = (param?: object) => {
  return http.request<InfoPageResponse>(
    "get",
    "/info/select",
    param ? { params: param } : null
  );
};

/** 录入信息 */
export const addInfo = (param?: object) => {
  return http.request<InfoPageResponse>(
    "post",
    "/info/insert",
    param ? { data: param } : null
  );
};

/** 删除信息 */
export const delInfo = (param?: object) => {
  return http.request<InfoPageResponse>(
    "get",
    "/info/delete",
    param ? { params: param } : null
  );
};
/** 编辑信息 */
export const updateInfo = (param?: object) => {
  return http.request<InfoPageResponse>(
    "post",
    "/info/update",
    param ? { data: param } : null
  );
};
