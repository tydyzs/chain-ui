<template>
  <div class="top-menu">
    <el-menu :default-active="activeIndex" mode="horizontal" text-color="#333">
      <el-menu-item index="0" @click.native="openMenu(itemHome)" key="0+1">
        <template slot="title">
          <h2 class="main-title">统一授信系统</h2>
          <i :class="itemHome.source" style="color:#fff"></i>
          <span style="color:#fff">{{generateTitle(itemHome)}}</span>
        </template>
      </el-menu-item>
      <template v-for="(item,index) in items">
        <el-menu-item :index="item.id+''" @click.native="openMenu(item)" :key="index">
          <template slot="title">
            <i :class="item.source" style="padding-right: 5px;color:#fff"></i>
            <span style="color:#fff">{{generateTitle(item)}}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { generateTitle, formatRoutes } from "@/store/modules/permission"
export default {
  name: "top-menu",
  data () {
    return {
      itemHome: {
        name: '首页',
        source: 'el-icon-menu'
      },
      activeIndex: "0",
      items: [],
    };
  },
  created () {
    this.getMenu();
  },
  methods: {
    getMenu () {
      this.$store.dispatch("permission/GetTopMenu").then(res => {
        this.items = res;
      });
    },
    generateTitle (item) {
      return generateTitle(
        item.name,
        (item.meta || {}).i18n
      );
    },
    openMenu (item) {
      this.$store.dispatch("permission/GetMenu", item.id).then(res => {
        // console.log('res:', res);
        let accessRoutes = [];
        if (data.length !== 0) {
          accessRoutes = formatRoutes(res.data);
        }
        let itemActive,
          childItemActive = 0;
        if (item.path) {
          itemActive = item;
        } else {
          if (this.menu[childItemActive].length == 0) {
            itemActive = this.menu[childItemActive];
          } else {
            itemActive = this.menu[childItemActive].children[childItemActive];
          }
        }
        this.$route.addRoutes(accessRoutes)
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.top-menu {
  .main-title {
    padding: 0;
    display: inline-block;
    margin: 0 30px 0 0;
    cursor: auto;
    color: #fff;
    font-weight: 400;
    font-size: 18px;
  }
}
</style>
