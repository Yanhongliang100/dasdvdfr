<template>
  <div class="app-container">
    <div align="right" style="margin-bottom:5px">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">详情</el-button>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="需求详情" name="first">
        <ul>
          <li>需求id:safdsafdsfsd</li>
        </ul>
      </el-tab-pane>
      <el-tab-pane label="帮扶记录" name="second">帮扶记录</el-tab-pane>
      <el-tab-pane label="爱心动态" name="third">爱心动态</el-tab-pane>
      <el-tab-pane label="需求证明" name="fourth">需求证明</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: 'second'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
