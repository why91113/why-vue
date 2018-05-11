<template>
  <div class="table-ext-view">
    <div class="title">table扩展显示</div>
    <div>
      <p>适合字段非常多的情况使用</p>
      <p>二级表头分类，每个类别的第一列固定显示</p>
      <p>拖动滚动条时分类tab宽度会跟随变化</p>
      <p>分类tab可点击</p>
    </div>
    <br>
    <my-table ref="tableExt" :data="list" :fixedLeft="80">
      <el-table :data="list" border stripe>
        <el-table-column align="center" :resizable="false" type="selection" width="80" fixed></el-table-column>
        <el-table-column label="tab1" align="center">
          <el-table-column align="center" :resizable="false" label="数据编号" prop="num" width="100"></el-table-column>
          <el-table-column align="center" :resizable="false" label="数据1" prop="f1" width="200"></el-table-column>
          <el-table-column align="center" :resizable="false" label="数据2" prop="f2" width="150"></el-table-column>
          <el-table-column align="center" :resizable="false" label="数据3" prop="f3" width="180"></el-table-column>
        </el-table-column>
        <el-table-column label="tab2" align="center">
          <el-table-column align="center" :resizable="false" label="数据4" prop="f4" width="160"></el-table-column>
          <el-table-column align="center" :resizable="false" label="数据5" prop="f5" width="170"></el-table-column>
          <el-table-column align="center" :resizable="false" label="数据6" prop="f6" width="150"></el-table-column>
          <el-table-column align="center" :resizable="false" label="数据7" prop="f7" width="200"></el-table-column>
        </el-table-column>
        <el-table-column label="tab3" align="center">
          <el-table-column align="center" :resizable="false" label="数据8" prop="f8" width="100"></el-table-column>
          <el-table-column align="center" :resizable="false" label="数据9" prop="f9" width="200"></el-table-column>
        </el-table-column>
        <el-table-column label="tab4" align="center">
          <el-table-column align="center" :resizable="false" label="数据10" prop="f10" width="200"></el-table-column>
          <el-table-column align="center" :resizable="false" label="数据11" prop="f11" width="150"></el-table-column>
          <el-table-column align="center" :resizable="false" label="数据12" prop="f12" width="200"></el-table-column>
        </el-table-column>
        <div slot="empty">抱歉，暂无数据！</div>
      </el-table>
    </my-table>
  </div>
</template>

<script>
import myTable from '@/components/why-table-ext'
export default {
  name: 'table-ext',
  components: { myTable },
  data () {
    return {
      list: []
    }
  },
  mounted () {
    for (let i = 0; i < 8; i++) {
      this.list.push({
        num: i + 1,
        f1: '王小虎',
        f2: '2016-05-02',
        f3: '上海',
        f4: '普陀区',
        f5: '金沙江路 1518 弄',
        f6: 200333,
        f7: 'ef发哦i敌法',
        f8: 'esdfadfasfw',
        f9: 'kj092sdjfd92',
        f10: 'y823hasdf',
        f11: '范文芳地方',
        f12: '3本人的说法'
      })
    }
  }
}
</script>

<style lang="scss">
.table-ext-view {

}
</style>
