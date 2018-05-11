<template>
  <div class="why-table-ext">
    <div class="table-ext-box">
      <slot></slot>
      <ul class="table-ext-tab" v-show="tabVisiable">
        <li v-for="(col, i) in colArr" :key="'tab_' + i" @click="tabClick(col, i)" :style="{'width': col.tabWidth ? col.tabWidth + 'px' : 'auto', 'text-indent': i === 0 ? fixedLeft + 'px' : '0'}">
          <span v-if="fixedRight && i === colArr.length - 1" :style="{ 'width': fixedRight - 1 + 'px'}" class="right-place">&nbsp;</span>
          <span>{{col.text}}</span>
        </li>
      </ul>
      <template v-for="(col, i) in colArr">
        <el-table :ref="'table_' + i" :key="'table_' + i" :data="data" border stripe :class="'table-ext-fixed table-ext-fixed-' + i + ' table-ext-fixed-' + col.fixed"
          v-show="col.fixedVisiable && tabVisiable" :style="{'width': col.fixedWidth + 1 + 'px', 'left': col.fixedLeft + 'px'}">
          <el-table-column-plus v-bind="col.propsData"></el-table-column-plus>
        </el-table>
      </template>
    </div>
  </div>
</template>

<script>
import { TableColumn } from 'element-ui'
// renderCell 函数，类型可扩展
const renderCell = {
  slots: function (h, data) {
    // 接受传入的renderCell函数
    let renderCell = () => {
      return this.renderCell ? this.renderCell(data) : ''
    }
    return <div class="cell">{ renderCell(h, data) }</div>
  }
}
let elTableColumnPlus = {
  extends: TableColumn, // 继承el-table-column
  props: {
    prop: {
      type: [String, Number]
    },
    cellType: {
      type: String,
      validator: function (value) {
        let valid = ['text', 'input', 'slots'].includes(value)
        !valid && console.error(`columnPlus组件不适配 ${value} 类型`)
        return valid
      }
    },
    renderCell: {
      type: Function
    }
  },
  // el-table-column 先调用再调用本身的
  created () {
    if (renderCell[this.cellType]) {
      this.columnConfig.renderCell = renderCell[this.cellType].bind(this)
    }
  }
}

export default {
  name: 'why-table-ext',
  components: { elTableColumnPlus },
  data () {
    let elTable = null
    let extensible = false
    let colArr = []
    try {
      // 获取el-table，并判断是否可用扩展组件
      elTable = this.$slots.default[0]
      extensible = elTable.componentOptions.tag === 'el-table' && elTable.componentOptions.children && elTable.componentOptions.children.length > 0
    } catch (ex) { }
    if (extensible) {
      let index = 0
      elTable.componentOptions.children.map(node => {
        // node 一级表头
        if (node.componentOptions && node.componentOptions.tag === 'el-table-column' &&
            node.componentOptions.children && node.componentOptions.children.length > 0) {
          if (node.componentOptions.propsData.labelClassName) {
            node.componentOptions.propsData.labelClassName += ' tab-color'
          } else {
            node.componentOptions.propsData.labelClassName = 'tab-color'
          }
          // col 固定的列
          let col = node.componentOptions.children[0]
          let fCol = {
            propsData: Object.assign({}, col.componentOptions.propsData),
            text: node.componentOptions.propsData.label,
            tabLeft: 0,
            tabWidth: 0,
            offsetLeft: 0,
            fixedWidth: Number(col.componentOptions.propsData.width || '0'),
            fixedLeft: 0,
            fixedVisiable: false,
            fixed: 'none'
          }
          if (col.data.scopedSlots && col.data.scopedSlots.default) {
            fCol.propsData.cellType = 'slots'
            fCol.propsData.renderCell = col.data.scopedSlots.default
          }
          colArr.push(fCol)
          if (index === 0) {
            // index
            if (col.componentOptions.propsData.className) {
              col.componentOptions.propsData.className += ' for-row-h'
            } else {
              col.componentOptions.propsData.className = 'for-row-h'
            }
          }
          if (col.componentOptions.propsData.labelClassName) {
            col.componentOptions.propsData.labelClassName += ' fixed-col-' + index
          } else {
            col.componentOptions.propsData.labelClassName = 'fixed-col-' + index
          }
          index++
        }
      })
    }
    return {
      extensible,
      elTable,
      colArr,
      tabVisiable: false,
      container: null
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    fixedLeft: {
      type: Number,
      default: 0
    },
    fixedRight: {
      type: Number,
      default: 0
    }
  },
  mounted () {
    if (!this.extensible) {
      console.warn('WARN: tableExt error.')
      return null
    }
    var self = this
    window.tbExt = self
    // 获取表格容器
    self.container = self.$el.getElementsByClassName('el-table__body-wrapper')[0]
    if (self.container) {
      // 注册滚动事件
      var scrollTimeout
      self.container.addEventListener('scroll', function () {
        if (scrollTimeout) {
          clearTimeout(scrollTimeout)
        }
        scrollTimeout = setTimeout(self.tableScroll, 10)
      })
      window.addEventListener('resize', function () {
        self.setTable()
      })
    }
  },
  methods: {
    setTable () {
      if (this.extensible) {
        // 初始化固定的表格行高、位置
        this.initFixedTable()
        // 设置固定的表格出现/隐藏
        this.tableScroll()
      }
    },
    initFixedTable () {
      var self = this
      let rows = self.container.getElementsByClassName('for-row-h')
      if (rows && rows.length > 0) {
        self.colArr.forEach((col, i) => {
          col.offsetLeft = self.$el.getElementsByClassName('fixed-col-' + i)[0].offsetLeft
          let tds = self.$el.getElementsByClassName('table-ext-fixed-' + i)[0].getElementsByTagName('td')
          for (var j = 0; j < rows.length; j++) {
            tds[j].style.height = rows[j].clientHeight + 1 + 'px'
          }
        })
      }
    },
    tableScroll () {
      var self = this
      let cW = self.container.clientWidth
      if (self.container.scrollWidth <= cW || self.data.length === 0) {
        // 没有滚动条
        self.tabVisiable = false
        return
      }
      let count = self.colArr.length
      // 循环处理固定的表格
      self.colArr.forEach((current, i) => {
        let scrollLeft = self.container.scrollLeft
        if (i === 0) {
          current.fixedLeft = self.fixedLeft
          if (scrollLeft === 0) {
            current.fixedVisiable = false
            current.fixed = 'none'
          } else {
            current.fixedVisiable = true
            current.fixed = 'left'
          }
          return true // 第一个跳过
        }
        // 右侧固定出现和隐藏
        let nextW = self.getNextFixedWidth(count - i)
        let rangeR = current.offsetLeft - cW + nextW - scrollLeft
        current.fixedVisiable = rangeR >= 0
        if (current.fixedVisiable) {
          current.fixed = 'right'
          // 右侧固定，则它自己的tab宽度是固定的
          current.fixedLeft = current.tabLeft = cW - nextW
          current.tabRight = nextW - current.fixedWidth
        } else {
          // 左侧固定出现和隐藏
          let prevW = self.getPrevFixedWidth(i)
          let rangeL = current.offsetLeft - prevW - scrollLeft
          current.fixedVisiable = rangeL <= 0
          if (current.fixedVisiable) {
            current.fixed = 'left'
            current.fixedLeft = current.tabLeft = prevW
          } else {
            current.fixed = 'none'
            current.tabLeft = current.offsetLeft - scrollLeft
          }
        }
        // 获取上一个tab
        let prev = self.colArr[i - 1]
        // 上一个tab宽度等于当前tab左边距减去上一个tab的左边距
        prev.tabWidth = current.tabLeft - prev.tabLeft - 1
        if (i === count - 1) {
          // 最后一个宽度等于容器宽度减去上一个tab的左边距
          current.tabWidth = cW - current.tabLeft - 1
        }
      })
      self.tabVisiable = true
    },
    tabClick (col, index) {
      var self = this
      if (index === 0) {
        self.scrollAnimate(0)
      } else {
        let prevW = self.getPrevFixedWidth(index)
        self.scrollAnimate(col.offsetLeft - prevW)
      }
    },
    scrollAnimate (offset) {
      var self = this
      let scrollCount = 30
      let distance = offset - self.container.scrollLeft
      let scrollStep = parseInt(distance / scrollCount)
      let remainder = distance % scrollCount
      let sign = distance > 0 ? 1 : -1
      var scrollInterval = setInterval(function () {
        if (distance !== 0) {
          let s = scrollStep
          if (remainder !== 0) {
            s += sign
            remainder -= sign
          }
          self.container.scrollLeft += s
          distance -= s
        } else {
          clearInterval(scrollInterval)
        }
      }, 3)
    },
    getNextFixedWidth (count) {
      var self = this
      let w = self.fixedRight
      let revColArr = self.colArr.slice().reverse()
      revColArr.forEach((col, i) => {
        if (count <= i) {
          return false
        }
        w += col.fixedWidth
      })
      return w
    },
    getPrevFixedWidth (count) {
      var self = this
      let w = self.fixedLeft
      self.colArr.forEach((col, i) => {
        if (count <= i) {
          return false
        }
        w += col.fixedWidth
      })
      return w
    }
  },
  watch: {
    'data': function (newV) {
      if (newV !== undefined) {
        var self = this
        // 列表数据变化时重新设置浮动的table
        setTimeout(function () {
          self.setTable()
        }, 10)
        if (!newV || newV.length === 0) {
          let l = self.container.scrollWidth - self.container.clientWidth
          if (l > 0) {
            self.container.scrollLeft = l / 2
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
$splitW: 25px;
.why-table-ext {
  .tab-color {
    color: #2c3e50;
  }
  .table-ext-box {
    position: relative;
  }
  .table-ext-tab {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    border-top: 1px solid #e6ebf5;
    border-bottom: 1px solid #e6ebf5;
    &::after {
      content: "";
      clear: both;
      display: block;
    }
    li {
      &:last-child {
        border-right: 1px solid #e6ebf5;
      }
      float: left;
      display: block;
      cursor: pointer;
      background: #F5F7FA;
      border-left: 1px solid #e6ebf5;
      line-height: 47px;
      text-align: center;
      font-weight: bold;
      .right-place {
        display: block;
        float: right;
        height: 100%;
        border-left: 1px solid #e6ebf5;
      }
    }
  }
  .table-ext-fixed {
    position: absolute;
    top: 48px;
    table {
      width: 100% !important;
    }
    th {
      background: #F5F7FA;
      border-right: 1px solid #e6ebf5 !important;
    }
  }
  .table-ext-fixed-left {
    box-shadow: 5px 0 8px -3px rgba(0, 0, 0, 0.12);
  }
  .table-ext-fixed-right + .table-ext-fixed-right {
    box-shadow: none;
  }
  .table-ext-fixed-right {
    box-shadow: -5px 0 8px -3px rgba(0, 0, 0, 0.12);
  }
  .table-ext-fixed-right + .table-ext-fixed-right {
    box-shadow: none;
  }
  .hover-row td {
    background: #F5F7FA !important;
  }
}
</style>
