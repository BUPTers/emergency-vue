<template>
  <!-- 编辑弹框 -->
  <el-dialog
    v-model="isVisible"
    :title="initData.type === 'edit' ? '编辑信息' : '详细信息'"
    width="50%"
  >
    <el-form label-width="100px">
      <el-form-item label="地理编码ID">
        <el-autocomplete
          :disabled="initData.type !== 'edit'"
          style="width: 80%"
          v-model="id"
          popper-class="my-autocomplete"
          placeholder="输入6位后即可搜索"
          :fetch-suggestions="querySearchId"
          @select="handleSelect"
        >
          <template #default="{ item }">
            <div class="menu">
              <p>{{ item.geoId }}</p>
              <p>
                <b>{{ item.location }}</b>
              </p>
            </div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="地理位置">
        <el-autocomplete
          :disabled="initData.type !== 'edit'"
          style="width: 80%"
          v-model="geo"
          popper-class="my-autocomplete"
          placeholder="输入2字符后即可搜索"
          :fetch-suggestions="querySearchLocation"
          @select="handleSelect"
        >
          <template #default="{ item }">
            <div class="menu">
              <p>{{ item.geoId }}</p>
              <p>
                <b>{{ item.location }}</b>
              </p>
            </div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="选择时间">
        <el-date-picker
          :disabled="initData.type !== 'edit'"
          style="width: 80%"
          v-model="time"
          type="datetime"
          placeholder="选择发生时间"
        />
      </el-form-item>
      <el-form-item label="来源">
        <el-cascader
          :disabled="initData.type !== 'edit'"
          style="width: 80%"
          v-model="sourceValue"
          :options="sourceOptions"
        />
      </el-form-item>
      <el-form-item label="灾情信息">
        <el-cascader
          :disabled="initData.type !== 'edit'"
          style="width: 80%"
          v-model="conditionValue"
          :options="conditionOptions"
          @change="handleCondition"
        />
      </el-form-item>
      <el-form-item label="指标">
        <el-select
          :disabled="initData.type !== 'edit'"
          v-model="targetValue"
          placeholder="选择指标"
          style="width: 80%"
        >
          <el-option
            v-for="item in targetOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="载体">
        <el-select
          :disabled="initData.type !== 'edit'"
          v-model="carrierValue"
          placeholder="选择载体"
          style="width: 80%"
        >
          <el-option
            v-for="item in carrierOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            @click="carrierChange(item.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="initData.type === 'edit'">
        <ElInput
          style="width: 80%"
          v-if="carrierValue === '0'"
          type="textarea"
          placeholder="请输入文字"
          :autosize="{ minRows: 4, maxRows: 6 }"
          :maxlength="120"
        />
        <el-upload
          v-if="carrierValue === '1'"
          v-model:file-list="fileList"
          class="upload-demo"
          action=""
          multiple
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :limit="3"
          :on-exceed="handleExceed"
        >
          <el-button type="primary">上传</el-button>
        </el-upload>
        <el-upload
          v-if="carrierValue === '2'"
          v-model:file-list="fileList"
          class="upload-demo"
          action=""
          multiple
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :limit="3"
          :on-exceed="handleExceed"
        >
          <el-button type="primary">上传</el-button>
        </el-upload>
        <el-upload
          v-if="carrierValue === '3'"
          v-model:file-list="fileList"
          class="upload-demo"
          action=""
          multiple
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :limit="3"
          :on-exceed="handleExceed"
        >
          <el-button type="primary">上传</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          :disabled="initData.type !== 'edit'"
          style="width: 80%"
          v-model="desc"
          placeholder="请输入练习描述"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="submit"
          v-if="initData.type === 'edit'"
        >
          保存
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "@pureadmin/components";
import { idGeo, locateGeo } from "@/api/geocoding";
import moment from "moment";
import { updateInfo } from "@/api/info";
import { ElMessage } from "element-plus";
const emit = defineEmits(["ok"]);
const props = defineProps<{
  initData?: {
    date: string;
    id: string;
    infoId: string;
    desc: string;
    carrier: string;
    type: string;
    location: {
      village: string;
    };
  } | null;
}>();
const isVisible = ref(true);
const id = ref("");
const geo = ref("");
const time = ref(new Date());
const sourceValue = ref("");
const conditionValue = ref("");
const carrierValue = ref("");
const targetValue = ref("");
const desc = ref("");
const fileList = ref([]);
const sourceOptions = [
  {
    value: "1",
    label: "业务报送数据",
    children: [
      { value: "100", label: "前方地震应急指挥部" },
      { value: "101", label: "后方地震应急指挥部" },
      { value: "120", label: "应急指挥技术系统" },
      { value: "121", label: "社会服务工程应急救援系统" },
      { value: "140", label: "危险区预评估工作组" },
      { value: "141", label: "地震应急指挥技术协调组" },
      { value: "142", label: "震后政府信息支持工作项目组" },
      { value: "180", label: "灾情快速上报接受处理系统" },
      { value: "181", label: "地方地震局应急信息服务相关技术系统" },
      { value: "199", label: "其他" }
    ]
  },
  {
    value: "2",
    label: "泛在感知数据",
    children: [
      { value: "200", label: "互联网感知" },
      { value: "201", label: "通信网感知" },
      { value: "202", label: "舆情网感知" },
      { value: "203", label: "电力系统感知" },
      { value: "204", label: "交通系统感知" },
      { value: "205", label: "其他" }
    ]
  },
  {
    value: "3",
    label: "其他数据",
    children: [{ value: "300", label: "" }]
  }
];
const conditionOptions = [
  {
    value: "1",
    label: "地震事件信息",
    children: [{ value: "101", label: "震情信息" }]
  },
  {
    value: "2",
    label: "人员伤亡及失踪信息",
    children: [
      { value: "201", label: "死亡" },
      { value: "202", label: "受伤" },
      { value: "203", label: "失踪" }
    ]
  },
  {
    value: "3",
    label: "房屋破坏信息",
    children: [
      { value: "301", label: "土木" },
      { value: "302", label: "砖木" },
      { value: "303", label: "砖混" },
      { value: "304", label: "框架" },
      { value: "305", label: "其他" }
    ]
  },
  {
    value: "4",
    label: "生命线工程灾情信息",
    children: [
      { value: "401", label: "交通" },
      { value: "402", label: "供水" },
      { value: "403", label: "输油" },
      { value: "404", label: "燃气" },
      { value: "405", label: "电力" },
      { value: "406", label: "通信" },
      { value: "407", label: "水利" }
    ]
  },
  {
    value: "5",
    label: "次生灾害信息",
    children: [
      { value: "501", label: "崩塌" },
      { value: "502", label: "滑坡" },
      { value: "503", label: "泥石流" },
      { value: "504", label: "岩溶塌陷" },
      { value: "505", label: "地裂缝" },
      { value: "506", label: "地面沉降" },
      { value: "507", label: "其他" }
    ]
  }
];
const target = new Map([
  [
    "1",
    [
      { value: "001", label: "地理位置" },
      { value: "002", label: "时间" },
      { value: "003", label: "震级" },
      { value: "004", label: "震源深度" },
      { value: "005", label: "烈度" }
    ]
  ],
  [
    "2",
    [
      { value: "001", label: "受灾人数" },
      { value: "002", label: "受灾程度" }
    ]
  ],
  [
    "3",
    [
      { value: "001", label: "一般损坏面积" },
      { value: "002", label: "严重损坏面积" },
      { value: "003", label: "受灾程度" }
    ]
  ],
  [
    "4",
    [
      { value: "001", label: "受灾设施数" },
      { value: "002", label: "受灾范围" },
      { value: "003", label: "受灾程度" }
    ]
  ],
  [
    "5",
    [
      { value: "001", label: "灾害损失" },
      { value: "002", label: "灾害范围" },
      { value: "003", label: "受灾程度" }
    ]
  ]
]);
const targetOptions = ref([]);

const carrierOptions = [
  { value: "0", label: "文字" },
  { value: "1", label: "图像" },
  { value: "2", label: "音频" },
  { value: "3", label: "视频" },
  { value: "4", label: "其他" }
];
const carrierChange = val => {
  carrierValue.value = val;
};
const handleRemove = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};

const handlePreview = uploadFile => {
  console.log(uploadFile);
};

const handleExceed = (files, uploadFiles) => {
  ElMessage.warning(`不能超过3M`);
  console.log(files, uploadFiles);
};

const submit = async () => {
  let code =
    id.value +
    moment(time.value).format("YYYYMMDDHHmmss") +
    sourceValue.value[1] +
    carrierValue.value +
    conditionValue.value[1] +
    targetValue.value;
  console.log(code);
  await updateInfo({ infoId: code, infoDesc: desc.value })
    .then(data => {
      if (data.code === 200) {
        message.success("录入成功");
        return;
      }

      message.error(data.message);
    })
    .catch(error => {
      message.error(error.message);
    })
    .finally(() => {
      isVisible.value = false;
      emit("ok", "ok");
    });
};

const querySearchId = async (_, cb: (arg: any) => void) => {
  if (id.value.length < 6) {
    return;
  }
  await idGeo({ id: id.value })
    .then(data => {
      cb(data.data);
    })
    .catch(error => {
      message.error(error.message);
    });
};

const querySearchLocation = async (_, cb: (arg: any) => void) => {
  if (geo.value.length < 2) {
    return;
  }
  await locateGeo({ location: geo.value })
    .then(data => {
      cb(data.data);
    })
    .catch(error => {
      message.error(error.message);
    });
};

const handleSelect = item => {
  id.value = item.geoId;
  geo.value = item.location;
};

const handleCondition = item => {
  targetValue.value = "";
  targetOptions.value = target.get(item[0]);
};

onMounted(() => {
  const initData = { ...(props.initData ?? {}) };
  console.log("initData", initData);
  id.value = initData.id.substring(0, 12);
  time.value = new Date(
    moment(initData.date, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss")
  );
  sourceValue.value = initData.id.substring(26, 29);
  conditionValue.value = initData.id.substring(30, 33);
  targetValue.value = initData.id.substring(33, 36);
  targetOptions.value = target.get(conditionValue.value.substring(0, 1));
  desc.value = initData.desc;
  geo.value = initData.location.village;
  carrierOptions.forEach(item => {
    if (initData.carrier === item.label) {
      carrierValue.value = item.value;
    }
  });
});
</script>
