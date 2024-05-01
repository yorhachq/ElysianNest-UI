<template>
  <div class="flex flex-col gap-4">
    <div class="personal-space-container">
      <el-row :gutter="20">
        <!-- 左侧个人信息 -->
        <el-col :span="6">
          <el-card class="user-info">
            <div class="avatar">
              <el-avatar :size="100" :src="userInfo.avatar"/>
            </div>
            <div class="username">{{ userInfo.username }}</div>
            <div class="gender">{{ gender }}</div>
            <div class="role">{{ role }}</div>
            <div class="email">{{ userInfo.email }}</div>
            <div class="phone">{{ userInfo.phone }}</div>
            <div class="actions">
              <el-button type="primary" @click="openEditDialog">编辑资料</el-button>
              <el-button type="primary" @click="openDialog">修改密码</el-button>
              <!-- 修改密码对话框 -->
              <UpdatePwd ref="updatePwdRef"/>
              <!-- 编辑资料对话框 -->
              <el-dialog v-model="editDialogVisible" title="编辑资料">
                <el-form
                  :model="editUserInfo"
                  :rules="rules"
                  ref="editUserForm"
                  label-width="80px"
                >
                  <el-form-item label="头像">
                    <el-upload
                      class="avatar-uploader"
                      action="/api/client/upload"
                      :headers="{ Authorization: getToken().accessToken }"
                      :auto-upload="true"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload"
                    >
                      <img
                        v-if="editUserInfo.avatar"
                        :src="editUserInfo.avatar"
                        class="avatar"
                      />
                      <el-icon v-else class="avatar-uploader-icon">
                        <Plus/>
                      </el-icon>
                    </el-upload>
                  </el-form-item>

                  <el-form-item label="用户名">
                    <el-input v-model="userInfo.username" disabled/>
                  </el-form-item>
                  <el-form-item label="性别">
                    <el-radio-group v-model="gender">
                      <el-radio label="男">男</el-radio>
                      <el-radio label="女">女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="手机号" prop="phone">
                    <el-input v-model="editUserInfo.phone"/>
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editUserInfo.email"/>
                  </el-form-item>
                </el-form>
                <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEdit">确定</el-button>
        </span>
                </template>
              </el-dialog>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧内容 -->
        <el-col :span="18">
          <el-row :gutter="20">
            <!-- 会员账户 -->
            <el-col :span="12">
              <el-card class="member-account">
                <template #header>
                  <div class="card-header">
                    <span>会员账户</span>
                  </div>
                </template>
                <div class="account-info">
                  <!-- 会员等级,使用大字号居中显示 -->
                  <div class="member-level">
                    <div class="label">会员等级</div>
                    <div class="value">{{ memberInfo.memberLevel }}</div>
                  </div>
                  <!-- 分割线 -->
                  <el-divider/>
                  <!-- 会员积分 -->
                  <el-row :gutter="20" class="justify-center">
                    <el-col :span="10">
                      <div class="member-points">
                        <div class="label">会员积分</div>
                        <div class="value">{{ memberInfo.memberPoints }}</div>
                      </div>
                    </el-col>
                    <!-- 分割线 -->
                    <el-divider direction="vertical" style="height: 90px;margin-top: -10px;"/>
                    <el-col :span="10">
                      <!-- 账户余额 -->
                      <div class="account-balance">
                        <div class="label">账户余额</div>
                        <div class="value">¥ {{ memberInfo.balance }}</div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <!-- 充值按钮 -->
                <div class="recharge-action">
                  <el-button type="primary" @click="openRechargeDialog">账户充值</el-button>
                </div>
              </el-card>
            </el-col>

            <!-- 天气模块 -->
            <el-col :span="12">
              <el-card class="weather-card">
                <template #header>
                  <div class="card-header">
                    <span>天气信息</span>
                  </div>
                </template>
                <div class="weather-info">
                  <!-- 左侧天气图标和温度 -->
                  <div class="weather-left">
                    <div class="weather-icon">
                      <i :class="'qi-' + weatherData.icon"/>
                    </div>
                    <div class="temperature">{{ weatherData.temperature }}°C</div>
                  </div>
                  <!-- 右侧天气详情 -->
                  <div class="weather-right">
                    <div class="location">{{ weatherData.location }}</div>
                    <div class="weather-details">
                      <div class="weather-item">
                        <span class="label">天气:</span>
                        <span class="value">{{ weatherData.weather }}</span>
                      </div>
                      <div class="weather-item">
                        <span class="label">体感温度:</span>
                        <span class="value">{{ weatherData.feelsLike }}°C</span>
                      </div>
                      <div class="weather-item">
                        <span class="label">风向:</span>
                        <span class="value">{{ weatherData.windDirection }}</span>
                      </div>
                      <div class="weather-item">
                        <span class="label">空气质量:</span>
                        <span class="value">{{ weatherData.air }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <!-- 会员等级进度条 -->
      <el-card class="member-level-progress">
        <template #header>
          <div class="card-header">
            <span>会员成长体系</span>
            <span
              class="text-gray-400 text-sm ml-4">通过充值获取会员积分，累计积分可提高会员等级，转换比例：1RMB = 1点会员积分</span>
          </div>
        </template>
        <div class="progress-container">
          <div class="progress-bar">
            <div
              class="progress"
              :style="{ width: progressWidth, backgroundColor: progressColor }"
            ></div>
            <div class="level-container mt-2 mb-2">
              <div
                v-for="(level, index) in levels"
                :key="index"
                class="level-mark"
                :style="{ left: level.position }"
              >
                <div class="level-info">
                  <div class="level-label">{{ level.name }}</div>
                  <div class="level-points">{{ level.points }}分</div>
                  <div class="level-description">{{ level.description }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="current-level">
            当前等级: {{ memberInfo.memberLevel }} ({{ memberInfo.memberPoints }}分)
          </div>
        </div>
      </el-card>

      <!-- 充值对话框 -->
      <el-dialog v-model="rechargeDialogVisible" title="会员充值">
        <el-form
          :model="rechargeForm"
          :rules="rechargeRules"
          ref="rechargeFormRef"
          label-width="100px"
        >
          <el-form-item label="充值金额" prop="amount">
            <el-input-number v-model="rechargeForm.amount" :min="10"/>
          </el-form-item>
          <el-form-item label="支付方式" prop="paymentMethod">
            <el-select v-model="rechargeForm.paymentMethod">
              <el-option label="支付宝" value="支付宝"/>
              <el-option label="微信" value="微信"/>
              <el-option label="现金" value="现金"/>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
          <el-button @click="rechargeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitRecharge">确定</el-button>
        </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref, onMounted, computed} from "vue";
import {
  getWeather,
  getUserInfo,
  updateUserInfo,
  updateAvatar
} from "@/api/user";
// 本地引入天气图标
import "@/assets/weatherfont/qweather-icons.css";

import {
  Plus
} from "@element-plus/icons-vue";
import {useUserStoreHook} from "@/store/modules/user";
import {message} from "@/utils/message";
import {getToken} from "@/utils/auth";
import UpdatePwd from "@/views/space/components/updatePwd.vue";
import {storageLocal} from "@pureadmin/utils";
import {getMemberInfo, rechargeMember} from "@/api/hotelMember";

const editUserForm = ref(null);

const rules = reactive({
  phone: [
    {required: true, message: "请输入手机号", trigger: "blur"},
    {pattern: /^1\d{10}$/, message: "手机号格式不正确", trigger: "blur"}
  ],
  email: [
    {required: true, message: "请输入邮箱", trigger: "blur"},
    {type: "email", message: "邮箱格式不正确", trigger: "blur"}
  ]
});

const updatePwdRef = ref();
const openDialog = () => {
  updatePwdRef.value.open();
};

const size = ref("default");
const iconStyle = computed(() => {
  const marginMap = {
    large: "8px",
    default: "6px",
    small: "4px"
  };
  return {
    marginRight: marginMap[size.value] || marginMap.default
  };
});
const blockMargin = computed(() => {
  const marginMap = {
    large: "32px",
    default: "28px",
    small: "24px"
  };
  return {
    marginTop: marginMap[size.value] || marginMap.default
  };
});

interface WeatherData {
  location: string;
  weather: string;
  temperature: string;
  feelsLike: string;
  windDirection: string;
  air: string;
}

const roleCode = ref(useUserStoreHook()?.roles[0]);
const role = ref();

const userInfo = reactive({
  username: "username",
  email: "username@example.com",
  avatar: "",
  gender: "",
  phone: "",
  createTime: ""
});
const weatherData = reactive<WeatherData>({
  location: "赣州市",
  weather: "多云",
  temperature: "26",
  feelsLike: "29",
  windDirection: "西南风",
  air: "优"
});
const memberInfo = reactive({
  memberLevel: '',
  memberPoints: 0,
  balance: 0.0
})

// 会员等级配置
const levels = [
  {
    name: 'Lv.1',
    points: 0,
    position: '0%',
    color: '#ffcdd2',
    description: '注册会员'
  },
  {
    name: 'Lv.2',
    points: 500,
    position: '16.67%',
    color: '#f8bbd0',
    description: '银卡会员'
  },
  {
    name: 'Lv.3',
    points: 1500,
    position: '33.33%',
    color: '#e1bee7',
    description: '金卡会员'
  },
  {
    name: 'Lv.4',
    points: 3000,
    position: '50%',
    color: '#c5cae9',
    description: '白金会员'
  },
  {
    name: 'Lv.5',
    points: 5000,
    position: '66.67%',
    color: '#bbdefb',
    description: '钻石会员'
  },
  {
    name: 'Lv.6',
    points: 10000,
    position: '100%',
    color: '#b2ebf2',
    description: '至尊VIP'
  }
]

// 计算进度条宽度和颜色
const progressWidth = computed(() => {
  const points = memberInfo.memberPoints
  const level = levels.find(item => item.points > points)
  if (!level) {
    // 如果已经达到最高等级,直接返回100%
    return '100%'
  }
  const index = levels.indexOf(level)
  if (index === 0) {
    return '0%'
  } else {
    const prevLevel = levels[index - 1]
    const progress = (points - prevLevel.points) / (level.points - prevLevel.points)
    return `${(index - 1) * 16.67 + progress * 16.67}%`
  }
})

const progressColor = computed(() => {
  const points = memberInfo.memberPoints
  return levels.find(item => item.points > points)?.color || '#b2ebf2'
})

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
let createTime = ref("");
let gender = ref("");
const fetchUserInfo = async () => {
  try {
    const result = await getUserInfo();
    Object.assign(userInfo, result.data);
    switch (roleCode.value) {
      case "admin":
        role.value = "超级管理员";
        break;
      case "common":
        role.value = "酒店前台";
        break;
      case "guest":
        role.value = "酒店顾客";
        break;
      default:
        role.value = "未知";
        break;
    }
    switch (userInfo.gender) {
      case "male":
        gender.value = "男";
        break;
      case "female":
        gender.value = "女";
        break;
      default:
        gender.value = "未知";
    }
    // 把2024-03-26T11:02:12的格式转换为2024/3/26日
    createTime.value = new Date(userInfo.createTime).toLocaleDateString();
  } catch (error) {
    console.error("获取用户信息失败:", error);
  }
};
const editDialogVisible = ref(false);
const editUserInfo = reactive({
  email: "",
  avatar: "",
  gender: "",
  phone: ""
});

const openEditDialog = () => {
  // 打开编辑对话框时,将当前用户信息填入表单
  Object.assign(editUserInfo, userInfo);
  editDialogVisible.value = true;
};

const handleAvatarSuccess = response => {
  // 上传头像成功后的回调
  editUserInfo.avatar = response.data;
};

const beforeAvatarUpload = rawFile => {
  // 上传头像前的校验
  if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
    message("上传头像图片只能是 JPG 或 PNG 格式!", {type: "error"});
    return false;
  } else if (rawFile.size / 1024 / 1024 > 5) {
    message("上传头像图片大小不能超过 5MB!", {type: "error"});
    return false;
  }
  return true;
};

const submitEdit = async () => {
  editUserForm.value.validate(async valid => {
    if (valid) {
      try {
        // 将中文的性别值转换为后端需要的格式
        editUserInfo.gender = gender.value === "男" ? "male" : "female";
        await updateUserInfo(editUserInfo);
        await updateAvatar(editUserInfo);
        // 修改pinia中的数据
        useUserStoreHook().SET_AVATAR(editUserInfo.avatar);
        storageLocal().setItem("avatar", editUserInfo.avatar);
        // 更新页面上显示的用户信息
        Object.assign(userInfo, editUserInfo);
        message("资料修改成功", {type: "success"});
        editDialogVisible.value = false;
      } catch (error) {
        console.error("修改用户信息失败:", error);
        message("修改失败,请稍后重试", {type: "error"});
      }
    }
  });
};

// 获取会员信息
const fetchMemberInfo = async () => {
  try {
    const result = await getMemberInfo(userInfo.userId)
    Object.assign(memberInfo, result.data)
  } catch (error) {
    console.error('获取会员信息失败:', error)
  }
}
// 充值
const rechargeFormRef = ref<FormInstance>();
const rechargeDialogVisible = ref(false)
const rechargeForm = reactive({
  memberId: 0,
  amount: 0,
  paymentMethod: ''
})
const rechargeRules = reactive({
  amount: [
    {required: true, message: '请输入充值金额', trigger: 'blur'},
    {type: 'number', min: 0, message: '充值金额不能为负数', trigger: 'blur'}
  ],
  paymentMethod: [{required: true, message: '请选择支付方式', trigger: 'change'}]
})
const openRechargeDialog = () => {
  rechargeDialogVisible.value = true
}
const submitRecharge = async () => {
  await rechargeFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        rechargeForm.memberId = memberInfo.memberId;
        const res = await rechargeMember(rechargeForm)
        if (res.success) {
          message('充值成功', {type: 'success'})
          rechargeDialogVisible.value = false
          // 更新会员账户信息
          await fetchMemberInfo()
        } else {
          message(res.message, {type: 'error'})
        }
      } catch (error) {
        console.error('充值失败:', error)
        message('充值失败,请稍后重试', {type: 'error'})
      }
    }
  })
}
onMounted(async () => {
  await fetchUserInfo();
  await fetchMemberInfo();
  await fetchWeatherData();
});
</script>

<style scoped>
.personal-space-container {
  padding: 20px;
}

.user-info {
  height: 24rem;
  text-align: center;
}

.user-info .avatar {
  margin-bottom: 20px;
}

.user-info .username {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.user-info .role {
  font-size: 16px;
  color: #999;
  margin-bottom: 10px;
}

.user-info .email,
.user-info .phone {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.user-info .actions {
  margin-top: 20px;
}

.member-account {
  height: 24rem;
  display: flex;
  flex-direction: column;

}

.member-account .account-info {
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.member-account .member-level,
.member-account .member-points,
.member-account .account-balance {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.member-account .label {
  font-size: 16px;
  color: #999;
  margin-bottom: 10px;
}

.member-account .value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.member-account .info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.member-account .member-level .label {
  font-size: 18px;
  color: #999;
}

.member-account .member-level .value {
  font-size: 32px;
  font-weight: bold;
  color: #ff5722;
}

.member-account .el-divider {
  margin: 20px 0;
  background-color: #dcdfe6;
}

.member-account .points-balance {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.member-account .info-item {
  text-align: center;
}

.member-account .info-item .label {
  font-size: 16px;
  color: #999;
  margin-bottom: 10px;
}

.member-account .info-item .value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.member-account .recharge-action {
  text-align: center;
  padding: 10px;
}

.weather-card {
  height: 24rem;
}

.weather-card .weather-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
}

.weather-card .weather-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 25px;
}

.weather-card .location {
  font-size: 32px;
  font-weight: bold;
  margin-top: 18px;
  margin-bottom: 10px;
}

.weather-card .temperature {
  font-size: 36px;
  font-weight: bold;
}

.weather-card .weather-right {
  flex: 1;
  margin-left: 80px;
}

.weather-card .weather-icon {
  font-size: 84px;
  margin-bottom: 10px;
}

.weather-card .weather-details {
  font-size: 17px;
  padding-top: 40px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.weather-card .weather-item {
  display: flex;
  align-items: center;
}

.weather-card .weather-item .label {
  font-weight: bold;
  margin-right: 5px;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.member-level-progress {
  margin-top: 20px;
}

.progress-container {
  padding: 20px;
}

.progress-bar {
  position: relative;
  height: 80px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease, background-color 0.5s ease;
}

.level-container {
  position: absolute;
  display: flex;
  margin-left: 3rem;
  width: 66vw;
}

.level-mark {
  position: relative;
  display: flex;
  transform: translateX(-50%);
  text-align: center;
}

.level-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.level-label {
  font-size: 14px;
  font-weight: bold;
}

.level-points {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

.level-description {
  font-size: 12px;
  color: #666;
}

.current-level {
  margin-top: 30px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}
</style>
