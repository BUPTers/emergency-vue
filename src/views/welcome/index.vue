<script setup lang="ts">

import { computed } from "vue";

defineOptions({
  name: "Welcome"
});
const date: Date = new Date();

let greetings = computed(() => {
  if (date.getHours() >= 5 && date.getHours() < 13) {
    return "上午阳光明媚，祝你薪水翻倍🌞！";
  } else if (date.getHours() >= 13 && date.getHours() < 20) {
    return "下午小风娇好，愿你青春不老😃！";
  } else {
    return "折一根天使羽毛，愿拂去您的疲惫烦恼忧伤🌛！";
  }
});

let hello = computed(() => {
  if (date.getHours() < 5) {
    return "夜深了";
  } else if (date.getHours() >= 5 && date.getHours() < 13) {
    return "上午好";
  } else if (date.getHours() >= 13 && date.getHours() < 20) {
    return "下午好";
  } else {
    return "晚上好";
  }
});

let username = "Admin";
</script>

<template>
  <div class="welcome">
    <el-card class="top-content dark:border-none">
      <div class="left-mark">
        <img
          src="https://cupk-1310078136.cos.ap-beijing.myqcloud.com/blog/icon.jpg"
          title="icy@st.cupk.edu.cn"
          alt="Icy"
        />
        <div>
          <h1>{{ hello }}，{{ username }}</h1>
          <span>{{ greetings }}</span>
        </div>
      </div>
    </el-card>
    <el-card>
      <p>因为一直是一个人全栈coding，所以进度可能有点赶不上，orz（</p>
      <p>来自CUPK的码农一枚，现交流学习于BUPT，人称Icy</p>
      <p>这块白色也不知道写啥好，先预留吧。。</p>
    </el-card>
    <el-card>
      前端基于Vue3框架使用pure-admin-thin大型SPA模板，采用vite、pnpm等流行工具，，集成element-plus、axios、pinia、iconify等多种开源库。。
    </el-card>
    <el-card>
      后端基于Spring Cloud Alibaba×Spring Boot微服务框架，集成Spring Cloud
      Gateway、Nacos等分布式组件，以及Mybatis-Plus、Druid、Slf4j等烂大街的轮子（（
      别问负载均衡，熔断器，问就是没有！！单机部署懒得弄了
    </el-card>
    <el-card>
      <p>
        不过本人资金有限，全都是单机部署的，，，域名和SSL证书也是私人的，临时申请了若干二级域名用于部署，，使用Nginx做一级网关。。
      </p>
      <p>项目简陋，不喜勿喷！服务器身板薄弱，没事别玩XSS球球了顶不住XD</p>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.welcome {
  height: 100%;
  & > * {
    margin: 2em;
  }

  .top-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    background: var(--el-bg-color);

    .left-mark {
      display: flex;
      align-items: center;

      img {
        display: block;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-right: 10px;
        cursor: pointer;
      }

      h1 {
        font-weight: bold;
        font-size: 18px;
      }

      span {
        font-size: 14px;
      }
    }
  }
}
</style>
