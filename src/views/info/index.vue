<script setup lang="ts">
import { onMounted, ref } from "vue";
// import { default as vElTableInfiniteScroll } from "el-table-infinite-scroll";
import { message } from "@pureadmin/components";
import { pageInfo, delInfo } from "@/api/info";
import { IconifyIconOffline } from "@/components/ReIcon";
import { decode } from "@/utils/encode";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Edit from "./edit.vue";
// import axios from "axios";

defineOptions({
  name: "InfoIndex"
});

const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;

const table = ref([]);
const disabled = ref(false);
const page = ref(1);
const total = ref(0);
const preview = ref();
const dataLoading = ref(true);
const searchValue = ref("");
const editData = ref(null);
const isShowEdit = ref(false);
const showImg = ref(false);
const imgSrc = ref("");
const handleShowEdit = (row, type) => {
  isShowEdit.value = true;
  row.type = type;
  editData.value = row;
};
const handleDel = async row => {
  dataLoading.value = true;
  try {
    await delInfo({ infoId: row.id })
      .then(data => {
        if (data.code === 200) {
          getInfo();
        }
        console.log("删除", data);
      })
      .catch(error => {
        message.error(error.message);
      });
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      dataLoading.value = false;
    }, 500);
  }
};

const handleCurrentPage = (val: number) => {
  page.value = val;
  getInfo();
};

const getInfo = async () => {
  const param = { page: page.value };
  dataLoading.value = true;
  try {
    await pageInfo(param)
      .then(data => {
        dataLoading.value = false;
        if (data.code === 200) {
          table.value = data.data.records.map(decode);
          total.value = data.data.total;
          if (page.value >= total.value) {
            page.value = total.value;
            disabled.value = true;
          }
          return;
        }
        message.error(data.message);
        console.log(data);
      })
      .catch(error => {
        message.error(error.message);
        console.log(error);
      });
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      dataLoading.value = false;
    }, 500);
  }
};

const handleCurrentChange = (val: any) => {
  preview.value = val;
};

const updateInfo = () => {
  page.value = 1;
  total.value = 0;
  disabled.value = false;
  table.value = [];
  getInfo();
};
const ok = () => {
  getInfo();
};
//
// const handleDownload = id => {
//   axios
//     .get("https://api.cupk.club/file/download?infoId=" + id, {
//       responseType: "blob"
//     })
//     .then(res => {
//       const { data } = res;
//       const reader = new FileReader();
//       reader.readAsDataURL(data);
//       reader.onload = ev => {
//         const img = new Image();
//         img.src = ev.target.result.toString();
//         document.body.appendChild(img);
//       };
//     })
//     .catch(err => {
//       message.error(err);
//       console.log(err);
//     });
// };

onMounted(() => {
  getInfo();
});
</script>

<template>
  <el-container>
    <el-main>
      <el-row class="top-content" align="middle" justify="center">
        <el-col class="right-mark" :span="23">
          <el-input
            style="width: 300px"
            v-model="searchValue"
            placeholder="搜索功能暂不可用"
            @input="updateInfo"
            @keyup.enter.prevent="updateInfo"
            clearable
            disabled
          >
            <template #suffix>
              <el-icon class="el-input__icon">
                <iconify-icon-offline
                  v-show="searchValue.length === 0"
                  icon="search"
                />
              </el-icon>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <div
        class="panel"
        v-loading="dataLoading"
        :element-loading-svg="svg"
        element-loading-svg-view-box="-10, -10, 50, 50"
      >
        <el-scrollbar>
          <el-table
            :data="table"
            highlight-current-row
            :infinite-scroll-disabled="disabled"
            @current-change="handleCurrentChange"
          >
            <el-table-column prop="id" label="ID" width="120px" />
            <el-table-column label="地理位置" width="200px">
              <template #default="scope">
                <div>
                  <p>
                    <b>
                      {{ scope.row.location.province }}
                      {{ scope.row.location.city }}
                    </b>
                  </p>
                  <p>{{ scope.row.location.county }}</p>
                  <p>{{ scope.row.location.town }}</p>
                  <p>{{ scope.row.location.village }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="时间" width="100px" />
            <el-table-column label="来源" width="160px">
              <template #default="scope">
                <div>
                  <p>
                    <b>{{ scope.row.source.type }}</b>
                  </p>
                  <p>{{ scope.row.source.subType }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="carrier" label="载体" width="60px" />
            <el-table-column label="灾情信息" width="160px">
              <template #default="scope">
                <div>
                  <p>
                    <b>{{ scope.row.condition.type }}</b>
                  </p>
                  <p>{{ scope.row.condition.subType }}</p>
                  <p>{{ scope.row.condition.target }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="描述" prop="desc" width="300px" />
            <el-table-column label="操作" width="80px">
              <template #default="scope">
                <el-link
                  :icon="useRenderIcon('search')"
                  :underline="false"
                  @click="
                    imgSrc =
                      'https://api.cupk.club/file/download?infoId=' +
                      scope.row.id;
                    showImg = true;
                  "
                >
                  详情
                </el-link>
                <el-link
                  :icon="useRenderIcon('edit')"
                  :underline="false"
                  type="primary"
                  @click="handleShowEdit(scope.row, 'edit')"
                >
                  编辑
                </el-link>
                <ElPopconfirm
                  title="确定要删除吗？"
                  @confirm="handleDel(scope.row)"
                >
                  <template #reference>
                    <el-link
                      :icon="useRenderIcon('delete')"
                      :underline="false"
                      type="danger"
                    >
                      删除
                    </el-link>
                  </template>
                </ElPopconfirm>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty description="暂无信息" />
            </template>
          </el-table>
        </el-scrollbar>
        <el-pagination
          v-model:current-page="page"
          page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total"
          @current-change="handleCurrentPage"
        />
      </div>
    </el-main>
  </el-container>
  <!-- 编辑弹框 -->
  <Edit
    v-if="isShowEdit"
    @closed="isShowEdit = false"
    :init-data="editData"
    @ok="ok"
  />
  <el-dialog
    title="详情预览"
    v-model="showImg"
    @close="showImg = false"
    width="50%"
    style="height: 80vh"
  >
    <el-row justify="center" align="middle">
      <el-col>
        <img
          :src="imgSrc"
          alt="详情预览"
          style="object-fit: scale-down; object-position: center; height: 65vh"
        />
      </el-col>
    </el-row>
  </el-dialog>
</template>

<style lang="scss" scoped>
.side {
  text-align: center;
  height: 80vh;
  background-color: white;
  border-radius: 1em;

  * {
    margin: 0 auto;
    padding: 0.1em 0;
  }

  .divider {
    margin: 1em auto;
  }

  .subtitle {
    color: var(--el-color-info);
  }
}

.top-content {
  height: 60px;

  .right-mark {
    text-align: right;
  }
}

.panel {
  margin: 0 0.5em;
}
</style>
