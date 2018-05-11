<template>
  <div class="timer-view">
    <div class="title">正向计时器</div>
    <div>
      <p>提供 start、stop、reStart 方法</p>
      <p>getTime 获取当前已计时时间，单位为秒</p>
      <p>最大计时不超过1天</p>
    </div>
    <br>
    <my-timer ref="timer"></my-timer>
    <br>
    <div>
      <el-button @click="$refs.timer.start()" type="success">开始/继续</el-button>
      <el-button @click="$refs.timer.stop()" type="danger">停止</el-button>
      <el-button @click="$refs.timer.reStart()">重新开始</el-button>
    </div>
    <div>
      <el-button @click="time = $refs.timer.getTime()" type="primary">已用时</el-button>
      <span>{{time}} 秒</span>
    </div>
  </div>
</template>

<script>
import myTimer from '@/components/why-timer'
export default {
  name: 'timer',
  components: { myTimer },
  data () {
    return {
      time: 0
    }
  }
}
</script>

<style lang="scss">
.timer-view {
  .el-button {
    margin: 10px 20px 0 0;
  }
}
</style>
