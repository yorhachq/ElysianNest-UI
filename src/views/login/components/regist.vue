<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {ref, reactive} from "vue";
import Motion from "../utils/motion";
import {message} from "@/utils/message";
import {updateRules} from "../utils/rule";
import type {FormInstance} from "element-plus";
import {useVerifyCode} from "../utils/verifyCode";
import {$t, transformI18n} from "@/plugins/i18n";
import {useUserStoreHook} from "@/store/modules/user";
import {useRenderIcon} from "@/components/ReIcon/src/hooks";
import Lock from "@iconify-icons/ri/lock-fill";
import {register, sendEmailCodeServiceForRegister} from "@/api/user";

const {t} = useI18n();
const loading = ref(false);
const ruleForm = reactive({
  username: "",
  email: "",
  verifyCode: "",
  password: "",
  repeatPassword: ""
});
const ruleFormRef = ref<FormInstance>();
const {isDisabled, text} = useVerifyCode();
// 检查两次密码是否一致
const repeatPasswordRule = [
  {
    validator: (rule, value, callback) => {
      if (value === "") {
        callback(new Error(transformI18n($t("login.passwordSureReg"))));
      } else if (ruleForm.password !== value) {
        callback(new Error(transformI18n($t("login.passwordDifferentReg"))));
      } else {
        callback();
      }
    },
    trigger: "blur"
  }
];

// 返回登录页
function onBack() {
  useVerifyCode().end();
  useUserStoreHook().SET_CURRENTPAGE(0);
}

// 发送验证码
const sendVerifyCode = async formEl => {
  // 使发送按钮进入倒计时冷却
  await useVerifyCode().start(formEl, "email");
  // 调用api发送请求
  const result = await sendEmailCodeServiceForRegister(ruleForm);
  if (result.success === true) {
    message(transformI18n($t("login.emailSendSuccess")), {
      type: "success"
    });
  }
};

// 提交注册
const handleRegister = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    try {
      if (valid) {
        const result = await register(ruleForm);
        if (result.success === true) {
          message("注册成功，请登录", {
            type: "success"
          });
          loading.value = false;
          useUserStoreHook().SET_CURRENTPAGE(0);
        }
      } else {
        loading.value = false;
        return fields;
      }
    } finally {
      loading.value = false;
    }
  });
};
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="updateRules"
    size="large"
  >
    <!--用户名-->
    <Motion>
      <el-form-item prop="username">
        <el-input
          v-model="ruleForm.username"
          clearable
          :placeholder="transformI18n($t('login.username'))"
          :prefix-icon="useRenderIcon('ic:baseline-account-circle')"
        />
      </el-form-item>
    </Motion>

    <!--邮箱-->
    <Motion>
      <el-form-item prop="email">
        <el-input
          v-model="ruleForm.email"
          clearable
          :placeholder="transformI18n($t('login.email'))"
          :prefix-icon="useRenderIcon('ic:baseline-email')"
        />
      </el-form-item>
    </Motion>

    <!--验证码-->
    <Motion :delay="100">
      <el-form-item prop="verifyCode">
        <div class="w-full flex justify-between">
          <el-input
            v-model="ruleForm.verifyCode"
            clearable
            :placeholder="transformI18n($t('login.emailVerifyCode'))"
            :prefix-icon="useRenderIcon('ri:shield-keyhole-line')"
          />
          <!--发送验证码-->
          <el-button
            :disabled="isDisabled"
            class="ml-2"
            @click="sendVerifyCode(ruleFormRef)"
          >
            {{
              text.length > 0
                ? text + transformI18n($t("login.info"))
                : transformI18n($t("login.getVerifyCode"))
            }}
          </el-button>
        </div>
      </el-form-item>
    </Motion>

    <!--密码-->
    <Motion :delay="150">
      <el-form-item prop="password">
        <el-input
          v-model="ruleForm.password"
          autocomplete="new-password"
          clearable
          show-password
          :placeholder="t('login.password')"
          :prefix-icon="useRenderIcon(Lock)"
        />
      </el-form-item>
    </Motion>

    <!--确认密码-->
    <Motion :delay="200">
      <el-form-item :rules="repeatPasswordRule" prop="repeatPassword">
        <el-input
          v-model="ruleForm.repeatPassword"
          clearable
          show-password
          :placeholder="transformI18n($t('login.sure'))"
          :prefix-icon="useRenderIcon('ic:sharp-lock-reset')"
        />
      </el-form-item>
    </Motion>

    <!--注册按钮-->
    <Motion :delay="250">
      <el-form-item>
        <el-button
          class="w-full"
          size="default"
          type="primary"
          :loading="loading"
          @click="handleRegister(ruleFormRef)"
        >
          注册
        </el-button>
      </el-form-item>
    </Motion>

    <Motion :delay="300">
      <el-form-item>
        <el-button class="w-full" size="default" @click="onBack">
          {{ transformI18n($t("login.back")) }}
        </el-button>
      </el-form-item>
    </Motion>
  </el-form>
</template>
