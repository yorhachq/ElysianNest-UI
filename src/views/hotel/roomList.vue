<template>
  <div class="room-list-container">
    <!-- 筛选面板 -->
    <div class="filter-panel bg-white rounded-lg shadow-md p-6">
      <div class="filter-header mb-4">
        <h2 class="text-xl font-bold mb-4">筛选条件</h2>
      </div>
      <div class="filter-body">
        <div class="date-picker mb-4">
          <span class="filter-label mr-2">入住日期:</span>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="入住日期"
            end-placeholder="离店日期"
            :disabled-date="disabledDate"
            :clearable="false"
            @change="handleDateChange"
            class="w-full"
          />
        </div>
        <div class="filter-item mb-4">
          <span class="filter-label mr-2">房型:</span>
          <div class="filter-options">
            <div
              class="filter-option"
              :class="{ 'filter-option-active': selectedRoomType === '' }"
              @click="handleFilterChange('roomType', '')"
            >
              全部
            </div>
            <div
              v-for="type in roomTypes"
              :key="type"
              class="filter-option"
              :class="{ 'filter-option-active': selectedRoomType === type }"
              @click="handleFilterChange('roomType', type)"
            >
              {{ type }}
            </div>
          </div>
        </div>
        <div class="filter-item">
          <span class="filter-label mr-2">楼层:</span>
          <div class="filter-options">
            <div
              class="filter-option"
              :class="{ 'filter-option-active': selectedFloor === '' }"
              @click="handleFilterChange('floor', '')"
            >
              全部
            </div>
            <div
              v-for="floor in sortedFloors"
              :key="floor"
              class="filter-option"
              :class="{ 'filter-option-active': selectedFloor === floor }"
              @click="handleFilterChange('floor', floor)"
            >
              {{ floor }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 房间列表 -->
    <div v-if="paginatedRoomList.length === 0" class="empty-list">
      <p>暂无可用房间,请选择其他日期或房型</p>
    </div>
    <div v-else class="room-list">
      <div v-for="room in paginatedRoomList" :key="room.roomId" class="room-item">
        <div class="room-image">
          <img :src="room.roomType.image" :alt="room.roomType.typeName">
        </div>
        <div class="room-info">
          <h3 class="room-name">No.{{ room.roomNumber }} - {{ room.roomType.typeName }}</h3>
          <p class="room-description">{{ room.roomType.description }}</p>
          <div class="room-price">
            <span class="price-label">价格:</span>
            <span class="price-value">¥{{ room.roomType.price }}/晚</span>
          </div>
          <div class="room-actions">
            <el-button type="primary" @click="handleBooking(room)">预订</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 翻页组件 -->
    <div class="pagination-container">
      <div class="pagination-info">
        共 {{ totalPages }} 页
      </div>
      <div class="pagination-buttons">
        <button
          class="pagination-button"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          上一页
        </button>
        <div class="pagination-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            class="pagination-number"
            :class="{ 'pagination-number-active': page === currentPage }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </div>
        <button
          class="pagination-button"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>

    <!-- 预订对话框 -->
    <el-dialog v-model="bookingDialogVisible" title="预订房间" width="400px">
      <div class="booking-info">
        <p><strong>房间号:</strong> {{ selectedRoom.roomNumber }}</p>
        <p><strong>房型:</strong> {{ selectedRoom.roomType.typeName }}</p>
        <p><strong>入住日期:</strong> {{ formatDate(dateRange[0]) }}</p>
        <p><strong>离店日期:</strong> {{ formatDate(dateRange[1]) }}</p>
        <p><strong>价格:</strong> ¥{{ selectedRoom.roomType.price }}/晚</p>
      </div>
      <div class="booking-actions">
        <el-button type="primary" @click="handleConfirmBooking">确认预订</el-button>
        <el-button @click="bookingDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
defineOptions({
  name: 'RoomList'
})
import {ref, computed, onMounted} from 'vue'
import {getAvailableRooms, reserveRoom} from '@/api/roomCalendar'
import {ElMessage, ElMessageBox} from 'element-plus'
import dayjs from 'dayjs'
import {getUserInfo} from "@/api/user";

// 定义响应式数据
const dateRange = ref([])
const roomList = ref([])
const selectedRoomType = ref('')
const selectedFloor = ref('')
const bookingDialogVisible = ref(false)
const selectedRoom = ref(null)

// 计算属性
const roomTypes = computed(() => {
  const types = new Set()
  roomList.value.forEach(room => {
    types.add(room.roomType.typeName)
  })
  return Array.from(types)
})

const floors = computed(() => {
  const floorSet = new Set()
  roomList.value.forEach(room => {
    floorSet.add(room.floorNumber)
  })
  return Array.from(floorSet)
})

const sortedFloors = computed(() => {
  return floors.value.sort((a, b) => a - b)
})

const filteredRoomList = computed(() => {
  return roomList.value.filter(room => {
    if (selectedRoomType.value && room.roomType.typeName !== selectedRoomType.value) {
      return false
    }
    if (selectedFloor.value && room.floorNumber !== selectedFloor.value) {
      return false
    }
    return true
  })
})

// 分页相关计算属性
const itemsPerPage = 12 // 每页显示的房间数量
const totalPages = computed(() => Math.ceil(filteredRoomList.value.length / itemsPerPage))
const currentPage = ref(1)
const visiblePages = computed(() => {
  const pages = []
  const maxPages = 5 // 最多显示5个页码
  const startPage = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
  const endPage = Math.min(totalPages.value, startPage + maxPages - 1)

  for (let page = startPage; page <= endPage; page++) {
    pages.push(page)
  }

  return pages
})

const paginatedRoomList = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filteredRoomList.value.slice(startIndex, endIndex)
})

const disabledDate = (date) => {
  return date.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

const handleDateChange = () => {
  if (dateRange.value.length === 2) {
    fetchRooms()
  }
}

const handleFilterChange = (type, value) => {
  if (type === 'roomType') {
    selectedRoomType.value = value
  } else if (type === 'floor') {
    selectedFloor.value = value
  }
}

const handleBooking = (room) => {
  selectedRoom.value = room
  bookingDialogVisible.value = true
}

const handleConfirmBooking = async () => {
  const userRes = await getUserInfo();
  const id = userRes.data.userId;
  const res = await reserveRoom({
    userId: id,
    roomId: selectedRoom.value.roomId,
    checkinDate: dateRange.value[0],
    checkoutDate: dateRange.value[1]
  });
  if (res.success) {
    ElMessage.success("预订成功,请关注订单信息");
  }
  bookingDialogVisible.value = false
}

const fetchRooms = async () => {
  const [startDate, endDate] = dateRange.value
  const res = await getAvailableRooms({
    checkinDate: dayjs(startDate).format('YYYY-MM-DD'),
    checkoutDate: dayjs(endDate).format('YYYY-MM-DD')
  })
  if (res.success) {
    roomList.value = res.data
  }
}

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

const changePage = (page) => {
  // 切换页码
  currentPage.value = page
}

// 页面加载时,如果没有选择日期范围,显示一个提示
onMounted(() => {
  if (dateRange.value.length === 0) {
    ElMessageBox.alert('请先选择入住日期和离店日期', '提示', {
      confirmButtonText: '确定',
      callback: () => {
        // 用户点击确定后,自动弹出日期选择器
        const datePicker = document.querySelector('.el-date-editor')
        datePicker.click()
      }
    })
  }
})
</script>

<style scoped>
.room-list-container {
  max-width: 100vw;
  margin: 20px;
}

.filter-panel {
  margin-bottom: 20px;
}

.filter-header {
  border-bottom: 1px solid #ddd;
}

.filter-body {
  display: grid;
  flex-direction: column;
  gap: 20px;
}

.filter-item {
  display: flex;
  align-items: center;
}

.filter-label {
  font-weight: bold;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
}

.filter-option {
  padding: 0;
  margin-left: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  background-color: transparent;
  font-weight: bold;
}

.filter-option:hover {
  color: #005ffd;
}

.filter-option-active {
  color: #409eff;
  text-decoration: underline;
}

.empty-list {
  text-align: center;
  padding: 50px 0;
  font-size: 18px;
  color: #999;
}

.room-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 20px;
}

.room-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.room-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.room-image {
  height: 200px;
  overflow: hidden;
}

.room-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.room-item:hover .room-image img {
  transform: scale(1.1);
}

.room-info {
  padding: 20px;
}

.room-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.room-description {
  color: #666;
  margin-bottom: 10px;
}

.room-price {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.price-label {
  font-weight: bold;
  margin-right: 10px;
}

.price-value {
  font-size: 24px;
  color: #ff6700;
}

.booking-info {
  margin-bottom: 20px;
}

.booking-info p {
  margin-bottom: 10px;
}

.booking-actions {
  text-align: right;
}

/* 翻页组件样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-info {
  margin-right: 20px;
}

.pagination-buttons {
  display: flex;
  align-items: center;
}

.pagination-button {
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  color: #333;
  padding: 6px 12px;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination-button:hover {
  background-color: #e7e7e7;
}

.pagination-button:disabled {
  background-color: #f4f4f4;
  color: #bbb;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
}

.pagination-number {
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  color: #333;
  padding: 6px 12px;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination-number:hover {
  background-color: #e7e7e7;
}

.pagination-number-active {
  background-color: #409eff;
  color: #fff;
  border-color: #409eff;
}
</style>
