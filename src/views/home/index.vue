<template>
  <div class="home-container">
    <!-- 头部导航 -->
    <!--    <header class="header bg-white shadow-md">-->
    <!--      <div class="container mx-auto flex items-center justify-between px-4 py-2">-->
    <!--        <div class="logo text-2xl font-bold text-blue-500">Elysian Nest 悦巢酒店</div>-->
    <!--        <nav class="nav">-->
    <!--          <ul class="flex items-center space-x-6 text-gray-600">-->
    <!--            <li><a href="#" class="hover:text-blue-500">首页</a></li>-->
    <!--            <li><a href="#" class="hover:text-blue-500">关于我们</a></li>-->
    <!--            <li><a href="#" class="hover:text-blue-500">联系方式</a></li>-->
    <!--            <li><a href="#" class="hover:text-blue-500">会员中心</a></li>-->
    <!--          </ul>-->
    <!--        </nav>-->
    <!--      </div>-->
    <!--    </header>-->

    <!-- 酒店简介 -->
    <section class="hotel-intro relative">
      <!--轮播图-->
      <div class="intro-carousel absolute inset-0">
        <el-carousel ref="carousel" :interval="5000" indicator-position="outside" arrow="hover" trigger="click"
                     height="auto" :autoplay="true" motion-blur>
          <el-carousel-item v-for="(image, index) in hotelInfo.images" :key="index" style="height: 580px">
            <div class="carousel-image" :style="{ backgroundImage: `url(${image})` }"></div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="intro-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
        <div class="intro-text inline-block p-8 rounded-lg shadow-lg">
          <h2 class="intro-title text-4xl font-bold text-white mb-4">{{ hotelInfo.name }}</h2>
          <p class="intro-description text-xl text-white mb-8">{{ hotelInfo.description }}</p>
          <div class="intro-features flex justify-center space-x-4">
            <div v-for="feature in hotelInfo.features" :key="feature" class="feature-item flex items-center">
              <i class="feature-icon fas fa-check-circle text-blue-500 mr-2"></i>
              <span class="feature-text text-white">{{ feature }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 全幅自动播放视频 -->
    <section class="video-show">
      <h2 class="preview-title text-3xl font-bold text-center text-blue-500 mb-8">动态展示</h2>
      <video autoplay loop muted>
        <source src="https://yorha-chq-picture.oss-cn-shanghai.aliyuncs.com/elysian-nest/gallery/home-show.mp4"
                type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </section>

    <!-- 房型预览 -->
    <section class="room-preview py-16">
      <div class="container mx-auto px-4">
        <h2 class="preview-title text-3xl font-bold text-center text-blue-500 mb-8">房型预览</h2>
        <div class="room-list grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="room in roomList" :key="room.roomTypeId"
               class="room-item bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-lg"
               @click="openImageDialog(room.image)">
            <div class="room-image-wrapper overflow-hidden">
              <img :src="room.image" :alt="room.typeName" draggable="false"
                   class="room-image w-full h-48 object-cover transition-all duration-300 ease-in-out transform hover:scale-110">
            </div>
            <div class="room-info p-4">
              <h3 class="room-name text-xl font-bold mb-2">{{ room.typeName }}</h3>
              <p class="room-description text-gray-600 mb-4">{{ room.description }}</p>
              <div class="room-price flex justify-between items-center">
                <span class="price-text text-blue-500 text-xl font-bold">¥{{ room.price }}</span>
                <span class="price-unit text-gray-500">元/晚</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 大图弹窗 -->
      <el-dialog v-model="imageDialogVisible" :show-close="false" :destroy-on-close="true"
                 class="image-dialog">
        <img :src="currentImage" class="w-full" @load="handleImageLoad" draggable="false"
             :style="{ width: '736px', height: '466px', }" style="object-fit: cover">
      </el-dialog>
    </section>

    <!-- 预订入口 -->
    <!--    <section class="booking-entry bg-blue-500 py-16">-->
    <!--      <div class="container mx-auto px-4">-->
    <!--        <h2 class="entry-title text-3xl font-bold text-center text-white mb-8">立即预订</h2>-->
    <!--        <div class="entry-form max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">-->
    <!--          <el-form :model="bookingForm" label-width="80px">-->
    <!--            <el-form-item label="入住日期">-->
    <!--              <el-date-picker-->
    <!--                v-model="bookingForm.checkInDate"-->
    <!--                type="date"-->
    <!--                placeholder="请选择入住日期"-->
    <!--                :disabled-date="disabledDate"-->
    <!--                value-format="YYYY-MM-DD"-->
    <!--                class="w-full"-->
    <!--              />-->
    <!--            </el-form-item>-->
    <!--            <el-form-item label="离店日期">-->
    <!--              <el-date-picker-->
    <!--                v-model="bookingForm.checkOutDate"-->
    <!--                type="date"-->
    <!--                placeholder="请选择离店日期"-->
    <!--                :disabled-date="disabledDate"-->
    <!--                value-format="YYYY-MM-DD"-->
    <!--                class="w-full"-->
    <!--              />-->
    <!--            </el-form-item>-->
    <!--            <el-form-item>-->
    <!--              <el-button type="primary" @click="handleBooking" class="w-full">立即预订</el-button>-->
    <!--            </el-form-item>-->
    <!--          </el-form>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </section>-->

    <!-- 联系方式 -->
    <section class="contact-info bg-gray-100 py-16">
      <div class="container mx-auto px-4">
        <h2 class="contact-title text-3xl font-bold text-center text-white mb-12">联系我们</h2>
        <div class="contact-content grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="contact-item bg-white p-8 rounded-lg shadow-md">
            <div class="contact-text">
              <h3 class="text-xl font-bold mb-2">酒店地址</h3>
              <p class="text-gray-600">{{ hotelInfo.address }}</p>
            </div>
          </div>
          <div class="contact-item bg-white p-8 rounded-lg shadow-md">
            <div class="contact-text">
              <h3 class="text-xl font-bold mb-2">联系电话</h3>
              <p class="text-gray-600">{{ hotelInfo.phone }}</p>
            </div>
          </div>
          <div class="contact-item bg-white p-8 rounded-lg shadow-md">
            <div class="contact-text">
              <h3 class="text-xl font-bold mb-2">电子邮箱</h3>
              <p class="text-gray-600">{{ hotelInfo.email }}</p>
            </div>
          </div>
          <div class="contact-item bg-white p-8 rounded-lg shadow-md">
            <div class="contact-text">
              <h3 class="text-xl font-bold mb-2">微信客服</h3>
              <p class="text-gray-600">{{ hotelInfo.wechat }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 页脚 -->
    <!--    <footer class="footer bg-white shadow-md mt-8 py-4">-->
    <!--      <div class="container mx-auto px-4 text-center text-gray-600">-->
    <!--        <p>&copy; 2024 Elysian Nest 悦巢™酒店. All rights reserved.</p>-->
    <!--      </div>-->
    <!--    </footer>-->
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {getHotelInfo} from '@/api/home'
import {getRoomTypeList} from '@/api/roomType'
import {ElMessage} from "element-plus";

const router = useRouter()

const carousel = ref()
const hotelInfo = ref({
  name: '',
  description: '',
  features: [],
  images: [],
  address: '',
  phone: '',
  email: '',
  wechat: ''
})

const roomList = ref([])
const imageDialogVisible = ref(false)
const currentImage = ref('')
const imageWidth = ref(0)
const imageHeight = ref(0)
const openImageDialog = (image: string) => {
  currentImage.value = image
  imageDialogVisible.value = true
}

const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  imageWidth.value = img.naturalWidth * 0.75
  imageHeight.value = img.naturalHeight * 0.75
}
const bookingForm = reactive({
  checkInDate: '',
  checkOutDate: ''
})

// 禁用今天之前的日期
const disabledDate = (date: Date) => {
  return date.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

// 处理预订按钮点击事件
const handleBooking = () => {
  if (!bookingForm.checkInDate || !bookingForm.checkOutDate) {
    ElMessage.warning('请选择入住日期和离店日期')
    return
  }
  router.push({
    path: '/booking',
    query: {
      checkInDate: bookingForm.checkInDate,
      checkOutDate: bookingForm.checkOutDate
    }
  })
}

onMounted(async () => {
  const res1 = await getHotelInfo()
  hotelInfo.value = res1.data

  const res2 = await getRoomTypeList()
  roomList.value = res2.data.items
})
</script>

<style scoped>
.home-container {
  border: 1px solid #e5e7eb;
  border-radius: 10.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.room-preview {
  background-image: linear-gradient(to bottom, #fff, #f0f9ff);
}

.booking-entry {
  background-image: linear-gradient(to right, #3b82f6, #2563eb);
}

.contact-info {
  background-image: linear-gradient(to right, #3b82f6, #2563eb);
}

.video-show {
  padding-top: 40px;
  width: 100%;
  height: 85vh;
  background-image: linear-gradient(to bottom, #fff, #f0f9ff);
  overflow: hidden;
  position: relative;
}

.video-show video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hotel-intro {
  height: 620px;
  overflow: hidden;
  background-color: #ffffff;
}

.intro-carousel {
  height: 100vh;
}

.carousel-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: blur(4px);
  transform: scale(1.1);
  transition: all 0.5s ease-in-out;
}

.el-carousel__item.is-active .carousel-image {
  filter: blur(0);
  transform: scale(1);
}

.intro-content {
  position: relative;
  width: 80%;
  max-width: 800px;
}

/* 使用伪元素实现背景色的变化 */
.intro-content::before {
  content: ""; /* 伪元素需要内容，即使它是空的 */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent; /* 默认透明 */
  transition: all 0.3s ease-in-out; /* 添加过渡效果 */
  border-radius: 12px; /* rounded-lg 效果 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), inset 0 0 10px rgba(0, 0, 0, 0.1); /* shadow-lg 效果 */
  z-index: -1; /* 确保伪元素在内容下方 */
}

.intro-content:hover::before {
  background-color: rgba(31, 31, 31, 0.6); /* 鼠标悬停时的背景色 */
}

.room-item {
  cursor: pointer;
}

.image-dialog .el-dialog__header {
  display: none;
}
</style>
