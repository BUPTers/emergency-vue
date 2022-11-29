import moment from "moment";

/**
 * 36位解码
 * @param info
 */
import { InfoRecord } from "@/api/info";

export const decode = (info: InfoRecord) => {
  return {
    id: info.infoId,
    location: info.location,
    date: moment(info.infoId.substring(12, 26), "YYYYMMDDHHmmss").format(
      "YYYY-MM-DD HH:mm:ss"
    ),
    source: decodeSource(info.infoId.substring(26, 29)),
    carrier: decodeCarrier(info.infoId.substring(29, 30)),
    condition: decodeCondition(info.infoId.substring(30, 36)),
    desc: info.infoDesc
  };
};

const source = new Map([
  ["1", "业务报送数据"],
  ["100", "前方地震应急指挥部"],
  ["101", "后方地震应急指挥部"],
  ["120", "应急指挥技术系统"],
  ["121", "社会服务工程应急救援系统"],
  ["140", "危险区预评估工作组"],
  ["141", "地震应急指挥技术协调组"],
  ["142", "震后政府信息支持工作项目组"],
  ["180", "灾情快速上报接受处理系统"],
  ["181", "地方地震局应急信息服务相关技术系统"],
  ["199", "其他"],
  ["2", "泛在感知数据"],
  ["200", "互联网感知"],
  ["201", "通信网感知"],
  ["202", "舆情网感知"],
  ["203", "电力系统感知"],
  ["204", "交通系统感知"],
  ["205", "其他"],
  ["3", "其他数据"],
  ["300", ""]
]);

const decodeSource = (str: string) => {
  return {
    type: source.get(str.substring(0, 1)),
    subType: source.get(str.substring(0, 3))
  };
};

const carrier = new Map([
  ["0", "文字"],
  ["1", "图像"],
  ["2", "音频"],
  ["3", "视频"],
  ["4", "其他"]
]);

const decodeCarrier = (str: string) => {
  return carrier.get(str);
};

const condition = new Map([
  ["1", "地震事件信息"],
  ["101", "震情信息"],
  ["2", "人员伤亡及失踪信息"],
  ["201", "死亡"],
  ["202", "受伤"],
  ["203", "失踪"],
  ["3", "房屋破坏信息"],
  ["301", "土木"],
  ["302", "砖木"],
  ["303", "砖混"],
  ["304", "框架"],
  ["305", "其他"],
  ["4", "生命线工程灾情信息"],
  ["401", "交通"],
  ["402", "供水"],
  ["403", "输油"],
  ["404", "燃气"],
  ["405", "电力"],
  ["406", "通信"],
  ["407", "水利"],
  ["5", "次生灾害信息"],
  ["501", "崩塌"],
  ["502", "滑坡"],
  ["503", "泥石流"],
  ["504", "岩溶塌陷"],
  ["505", "地裂缝"],
  ["506", "地面沉降"],
  ["507", "其他"] // （沙土液化、火灾、毒气泄露、爆炸、环境污染、瘟疫、海啸等）
]);

const decodeCondition = (str: string) => {
  return {
    type: condition.get(str.substring(0, 1)),
    subType: condition.get(str.substring(0, 3)),
    target: target.get(str.substring(0, 1))?.get(str.substring(3, 6))
  };
};

const target = new Map([
  [
    "1",
    new Map([
      ["001", "地理位置"],
      ["002", "时间"],
      ["003", "震级"],
      ["004", "震源深度"],
      ["005", "烈度"]
    ])
  ],
  [
    "2",
    new Map([
      ["001", "受灾人数"],
      ["002", "受灾程度"]
    ])
  ],
  [
    "3",
    new Map([
      ["001", "一般损坏面积"],
      ["002", "严重损坏面积"],
      ["003", "受灾程度"]
    ])
  ],
  [
    "4",
    new Map([
      ["001", "受灾设施数"],
      ["002", "受灾范围"],
      ["003", "受灾程度"]
    ])
  ],
  [
    "5",
    new Map([
      ["001", "灾害损失"],
      ["002", "灾害范围"],
      ["003", "受灾程度"]
    ])
  ]
]);
