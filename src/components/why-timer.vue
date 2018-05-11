<template>
  <div class="why-timer">
    <template v-if="hour > 0">
      <span class="digit">
        <time :class="'next-d ' + (hourTenAmt ? 'fadein' : '')">{{hourTen + 1}}</time>
        <time :class="hourTenAmt ? 'fadeout' : ''">{{hourTen}}</time>
      </span>
      <span class="digit">
        <time :class="'next-d ' + (hourUnitAmt ? 'fadein' : '')">{{hourUnit === 9 ? 0 : hourUnit + 1}}</time>
        <time :class="hourUnitAmt ? 'fadeout' : ''">{{hourUnit}}</time>
      </span>
      <span class="spliter">:</span>
    </template>
    <template>
      <span class="digit">
        <time :class="'next-d ' + (minTenAmt ? 'fadein' : '')">{{minuteTen === 5 ? 0 : minuteTen + 1}}</time>
        <time :class="minTenAmt ? 'fadeout' : ''">{{minuteTen}}</time>
      </span>
      <span class="digit">
        <time :class="'next-d ' + (minUnitAmt ? 'fadein' : '')">{{minuteUnit === 9 ? 0 : minuteUnit + 1}}</time>
        <time :class="minUnitAmt ? 'fadeout' : ''">{{minuteUnit}}</time>
      </span>
      <span class="spliter">:</span>
    </template>
    <template>
      <span class="digit">
        <time :class="'next-d ' + (secTenAmt ? 'fadein' : '')">{{secondTen === 5 ? 0 : secondTen + 1}}</time>
        <time :class="secTenAmt ? 'fadeout' : ''">{{secondTen}}</time>
      </span>
      <span class="digit">
        <time :class="'next-d ' + (secUnitAmt ? 'fadein' : '')">{{secondUnit === 9 ? 0 : secondUnit + 1}}</time>
        <time :class="secUnitAmt ? 'fadeout' : ''">{{secondUnit}}</time>
      </span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'why-timer',
  data () {
    return {
      interval: null,
      time: 0,
      delayTime: 0,
      secTenAmt: false,
      secUnitAmt: false,
      minTenAmt: false,
      minUnitAmt: false,
      hourTenAmt: false,
      hourUnitAmt: false
    }
  },
  computed: {
    hour () {
      return parseInt(this.delayTime / 3600)
    },
    hourUnit () {
      return this.hour % 10
    },
    hourTen () {
      return parseInt(this.hour / 10)
    },
    minute () {
      return parseInt((this.delayTime % 3600) / 60)
    },
    minuteUnit () {
      return this.minute % 10
    },
    minuteTen () {
      return parseInt(this.minute / 10)
    },
    second () {
      return this.delayTime % 60
    },
    secondUnit () {
      return this.second % 10
    },
    secondTen () {
      return parseInt(this.second / 10)
    }
  },
  mounted () {

  },
  methods: {
    // 开始/继续计时
    start () {
      if (!this.interval) {
        this.interval = setInterval(() => {
          this.intervalFun()
        }, 1000)
        this.intervalFun()
      }
    },
    // 停止计时
    stop () {
      clearInterval(this.interval)
      this.interval = null
    },
    // 重新开始计时
    reStart () {
      this.stop()
      this.time = 0
      this.delayTime = 0
      this.start()
    },
    intervalFun () {
      if (this.time >= 3600 * 24) {
        // 超过1天，自动停止
        this.stop()
      }
      this.triggerAnimation()
      this.time++
      setTimeout(() => {
        this.delayTime = this.time
        this.secUnitAmt = false
        this.secTenAmt && (this.secTenAmt = false)
        this.minUnitAmt && (this.minUnitAmt = false)
        this.minTenAmt && (this.minTenAmt = false)
        this.hourUnitAmt && (this.hourUnitAmt = false)
        this.hourTenAmt && (this.hourTenAmt = false)
      }, 500)
    },
    triggerAnimation () {
      // 秒 个位动画
      this.secUnitAmt = true
      if (this.time % 10 === 9) {
        // 秒 个位为9，触发十位动画
        this.secTenAmt = true
        if (this.time % 60 === 59) {
          // 分 59秒，触发分个位动画
          this.minUnitAmt = true
          if (parseInt(this.time / 60) % 10 === 9) {
            // 分 个位为9，触发十位动画
            this.minTenAmt = true
            if (parseInt(this.time / 60) === 59) {
              // 时 59分，触发时个位动画
              this.hourUnitAmt = true
              if (parseInt(this.time / 3600) % 10 === 9) {
                // 时 个位为9，触发十位动画
                this.hourTenAmt = true
              }
            }
          }
        }
      }
    },
    getTime () {
      return this.time
    }
  }
}
</script>

<style lang="scss">
.why-timer {
  display: inline-block;
  font-size: 0px;
  color: #FFF;
  padding: 2px;
  overflow: hidden;
  span {
    font-size: 32px;
    position: relative;
    display: inline-block;
    height: 1.5em;
    line-height: 1.5em;
  }
  .digit {
    width: 1.05em;
  }
  .digit + .digit {
    margin-left: 5px;
  }
  time {
    position: absolute;
    display: inline-block;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
    background: linear-gradient(bottom, #3A3A3A 50%, #444444 50%);
    background: -webkit-gradient(linear, left bottom, left top, color-stop(50%, #3A3A3A), color-stop(50%, #444444));
    box-shadow: 1px 1px 1px rgba(4, 4, 4, 0.35);
    border-radius: 8px;
  }
  .spliter {
    vertical-align: top;
    color: #444;
    padding: 0 3px;
    text-shadow: 1px 1px 1px rgba(4, 4, 4, 0.35);
  }
  .next-d {
    top: -110;
  }
  .fadeout {
    animation: fadeout .5s ease;
  }
  .fadein {
    animation: fadein .5s ease;
  }

  @keyframes fadeout {
    0% {
      top: 0;
    }
    100% {
      top: 110%;
    }
  }
  @keyframes fadein {
    0% {
      top: -110%;
    }
    100% {
      top: 0%;
    }
  }
}
</style>
