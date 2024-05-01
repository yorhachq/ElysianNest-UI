<script setup lang="ts">
import Search from "../search/index.vue";
import Notice from "../notice/index.vue";
import FullScreen from "./fullScreen.vue";
import SidebarItem from "./sidebarItem.vue";
import {isAllEmpty} from "@pureadmin/utils";
import {ref, nextTick, computed, onMounted, reactive} from "vue";
import {useNav} from "@/layout/hooks/useNav";
import {useTranslationLang} from "../../hooks/useTranslationLang";
import {usePermissionStoreHook} from "@/store/modules/permission";
import globalization from "@/assets/svg/globalization.svg?component";
import LogoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";
import Setting from "@iconify-icons/ri/settings-3-line";
import Check from "@iconify-icons/ep/check";
import {useUserStoreHook} from "@/store/modules/user";
import {getWeather} from "@/api/user";
import {message} from "@/utils/message";
// 本地引入天气图标
import "@/assets/weatherfont/qweather-icons.css";

const menuRef = ref();

const {t, route, locale, translationCh, translationEn} =
  useTranslationLang(menuRef);
const {
  title,
  logout,
  backTopMenu,
  onPanel,
  getLogo,
  username,
  avatarsStyle,
  getDropdownItemStyle,
  getDropdownItemClass
} = useNav();

let userAvatar;

interface WeatherData {
  location: string;
  weather: string;
  temperature: string;
  feelsLike: string;
  windDirection: string;
  air: string;
}

const weatherData = reactive<WeatherData>({
  location: "赣州市",
  weather: "多云",
  temperature: "26",
  feelsLike: "29",
  windDirection: "西南风",
  air: "优"
});
const fetchWeatherData = async () => {
  try {
    const result = await getWeather();
    if (result.data === null) {
      message("获取到空的天气数据，请检查后端地址是否正确", {type: "error"});
    }
    Object.assign(weatherData, result.data);
  } catch (error) {
    console.error("获取天气数据失败:", error);
  }
};

onMounted(() => {
  userAvatar = computed(() => {
    return useUserStoreHook().avatar;
  });
  fetchWeatherData();
});

const defaultActive = computed(() =>
  !isAllEmpty(route.meta?.activePath) ? route.meta.activePath : route.path
);

nextTick(() => {
  menuRef.value?.handleResize();
});
</script>

<template>
  <div
    v-loading="usePermissionStoreHook().wholeMenus.length === 0"
    class="horizontal-header"
  >
    <div class="horizontal-header-left" @click="backTopMenu">
      <img :src="getLogo()" alt="logo"/>
      <span>{{ title }}</span>
    </div>
    <el-menu
      ref="menuRef"
      router
      mode="horizontal"
      popper-class="pure-scrollbar"
      class="horizontal-header-menu"
      :default-active="defaultActive"
    >
      <sidebar-item
        v-for="route in usePermissionStoreHook().wholeMenus"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
    <div class="horizontal-header-right">
        <!-- 天气模块 -->
        <p class="text-gray-100 text-center mr-5">
          {{ weatherData.location }}&emsp;
          <i :class="'qi-' + weatherData.icon"/>
          {{ weatherData.weather }}&emsp;{{
            weatherData.temperature
          }}°C&emsp;{{
            weatherData.windDirection
          }}&emsp;空气质量：{{ weatherData.air }}
        </p>
        <!-- 菜单搜索 -->
        <Search id="header-search"/>
        <!-- 国际化 -->
        <!--      <el-dropdown id="header-translation" trigger="click">
                <globalization
                  class="navbar-bg-hover w-[40px] h-[48px] p-[11px] cursor-pointer outline-none"
                />
                <template #dropdown>
                  <el-dropdown-menu class="translation">
                    <el-dropdown-item
                      :style="getDropdownItemStyle(locale, 'zh')"
                      :class="['dark:!text-white', getDropdownItemClass(locale, 'zh')]"
                      @click="translationCh"
                    >
                      <span v-show="locale === 'zh'" class="check-zh">
                        <IconifyIconOffline :icon="Check" />
                      </span>
                      简体中文
                    </el-dropdown-item>
                    <el-dropdown-item
                      :style="getDropdownItemStyle(locale, 'en')"
                      :class="['dark:!text-white', getDropdownItemClass(locale, 'en')]"
                      @click="translationEn"
                    >
                      <span v-show="locale === 'en'" class="check-en">
                        <IconifyIconOffline :icon="Check" />
                      </span>
                      English
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>-->
        <!-- 全屏 -->
        <FullScreen id="full-screen"/>
        <!-- 消息通知 -->
        <!--      <Notice id="header-notice" />-->
        <!-- 退出登录 -->
        <el-dropdown trigger="click">
        <span class="el-dropdown-link navbar-bg-hover">
          <img :src="userAvatar" :style="avatarsStyle"/>
          <p v-if="username" class="dark:text-white">{{ username }}</p>
        </span>
          <template #dropdown>
            <el-dropdown-menu class="logout">
              <el-dropdown-item @click="logout">
                <IconifyIconOffline
                  :icon="LogoutCircleRLine"
                  style="margin: 5px"
                />
                {{ t("buttons.hsLoginOut") }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span
          class="set-icon navbar-bg-hover"
          :title="t('buttons.hssystemSet')"
          @click="onPanel"
        >
        <IconifyIconOffline :icon="Setting"/>
      </span>
      </div>
    </div>
</template>

<style lang="scss" scoped>
:deep(.el-loading-mask) {
  opacity: 0.45;
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}

.logout {
  max-width: 120px;

  ::v-deep(.el-dropdown-menu__item) {
    display: inline-flex;
    flex-wrap: wrap;
    min-width: 100%;
  }
}
</style>
