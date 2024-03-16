<script setup>
import { shallowRef, ref, computed, onMounted } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { useResizeObserver } from '@vueuse/core'
import * as allSteps from './steps'
import * as _ from 'lodash-es'

// 实际的牌, 主要操作这个
const realCards = shallowRef({ row1: [], row2: [], hasGap: 0, title: '', option: 0 })
// 主界面宽度,为了适配界面
const containerWidth = ref(1200)
// 为了有动画效果,需要将实际牌的两个数组全并为一个.
const renderCards = computed(() => {
  const result = []
  // 图片宽度250
  const row1Count = realCards.value.row1.length
  const gaptotal = containerWidth.value - 20 - row1Count * 250
  let gap = 0
  if (gaptotal > 0) {
    gap = gaptotal / (row1Count + 1)
  } else {
    if (row1Count > 1) {
      gap = gaptotal / (row1Count - 1)
    }
  }
  for (let i = 0; i < row1Count; i++) {
    result.push({
      ...realCards.value.row1[i],
      left: i * 250 + 10 + gap * (gap > 0 ? i + 1 : i),
      top: 0,
      zIndex: i
    })
  }
  for (let i = 0; i < realCards.value.row2.length; i++) {
    result.push({
      ...realCards.value.row2[i],
      left: i * 250 + 10 + gap * (gap > 0 ? i + 1 : i),
      top: 182 + realCards.value.hasGap * 80,
      zIndex: i
    })
  }
  return result
})
// 所有的操作步骤.可以自由组合.
const steps = [
  new allSteps.Step10(),
  new allSteps.Step20(),
  new allSteps.Step30(),
  new allSteps.Step40(),
  new allSteps.Step50(),
  new allSteps.Step60(),
  new allSteps.Step70(),
  new allSteps.Step80(),
  new allSteps.Step90(),
  new allSteps.Step100(),
  new allSteps.Step110(),
  new allSteps.Step120()
]
// 初始化,先进行第一步.
onMounted(() => {
  containerWidth.value = document.querySelector('.container').clientWidth
  realCards.value = steps[0].play()
})

const dialogShow = ref(false)
const curStepIndex = ref(0)
const btnOptions = shallowRef({ title: '', btns: [] })
const nextBtnDisabled = ref(false)

const _runNextStep = () => {
  const result = steps[curStepIndex.value].play(realCards.value)
  if (_.isArray(result)) {
    let i = 0
    const timeid = setInterval(() => {
      realCards.value = result[i]
      i++
      if (i == result.length) {
        clearInterval(timeid)
        nextBtnDisabled.value = false
      }
    }, 500)
  } else {
    realCards.value = result
    nextBtnDisabled.value = false
  }
}
const preStep = () => {
  nextBtnDisabled.value = false
  if (curStepIndex.value <= 0) return
  curStepIndex.value = curStepIndex.value - 1
  realCards.value = steps[curStepIndex.value].getLastResult()
}

const nextStep = () => {
  nextBtnDisabled.value = true
  if (curStepIndex.value == steps.length - 1) return
  curStepIndex.value = curStepIndex.value + 1
  btnOptions.value = steps[curStepIndex.value].getSetting()
  if (btnOptions.value) {
    // 需要交互
    dialogShow.value = true
  } else {
    // 不需要交互
    _runNextStep()
  }
}
const dialogNext = (option) => {
  realCards.value.option = option
  _runNextStep()
  dialogShow.value = false
}
const getAssetsFile = (url) => {
  return new URL(`./assets/${url}`, import.meta.url).href
}
// 监听元素尺寸,调整界面
const el = ref(null)
useResizeObserver(el, (entries) => {
  const entry = entries[0]
  const { width } = entry.contentRect
  containerWidth.value = width
})
</script>

<template>
  <div class="header">
    <div>
      <el-button @click="preStep()" type="primary" :icon="ArrowLeft">上一步</el-button>
      <text class="stepText">{{ curStepIndex + 1 }} / {{ steps.length }}</text>
      <el-button @click="nextStep()" type="primary" :disabled="nextBtnDisabled">
        下一步<el-icon class="el-icon--right"><ArrowRight /></el-icon>
      </el-button>
    </div>
    <div class="title">
      {{ realCards.title }}
    </div>
  </div>
  <TransitionGroup name="list" tag="div" class="container" ref="el">
    <div
      v-for="card in renderCards"
      class="card"
      :key="card.id + card.part"
      :style="{
        left: card.left + 'px',
        top: card.top + 'px',
        zIndex: card.zIndex,
        backgroundImage: 'url(' + getAssetsFile(card.id) + ')',
        backgroundPosition: card.part == 'up' ? '0 0' : '0 -182px'
      }"
    ></div>
  </TransitionGroup>
  <el-dialog
    v-model="dialogShow"
    :title="btnOptions.title"
    width="600"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    draggable
  >
    <el-button v-for="btn in btnOptions.btns" :key="btn.text" @click="dialogNext(btn.option)">{{
      btn.text
    }}</el-button>
  </el-dialog>
</template>

<style scoped>
.header {
  width: 100%;
  height: 15vh;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 50px auto;
  align-items: center;
}
.title {
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  margin-top: 15px;
}
.stepText {
  margin: 5px 20px;
  font-size: 20px;
}
.container {
  margin: 0 auto;
  width: 100%;
  height: 70vh;
  position: relative;
}
.card {
  /* border-radius: 5px; */
  position: absolute;
  width: 250px;
  height: 182px;
  background-size: 250px 363px;
  background-repeat: no-repeat;
}
.rotate180 {
  transform: rotate(180deg);
}
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-60px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}
</style>
