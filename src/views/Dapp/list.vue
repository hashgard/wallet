<template>
  <div class="page-container action-container">
    <!-- <div class="header">
      <a
        href="javascript:;"
        @click="$router.back()"
      >
        <i class="el-icon-back"></i>
      </a>
    </div> -->
    <div class="content">
      <s-card>
        <div class="demos">
          <div
            class="demo-item"
            v-for="(i,index) in dappList"
            :key="index"
            @click="enterDapp(i.id)"
          >
            <img
              :src="i.icon"
              alt=""
            >
            <p>{{(i.name)}}</p>
          </div>
        </div>
      </s-card>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import minePng from "@/assets/mine.png";
export default {
  name: "DappList",
  data() {
    return {};
  },
  computed: {
    ...mapState("grid", ["dappList"])
  },
  methods: {
    enterDapp(id) {
      this.$router.push({
        path: `/dapp/issueList?dappId=${id}`
      });
    }
  },
  mounted() {
    this.$store.dispatch("grid/fetchDappList");
  }
};
</script>

<style lang="scss" scoped>
.page-container {
  max-width: $max-width;
  margin: 0 auto $padding-large;
  padding: $padding-large;
  a {
    color: rgba(255, 255, 255, 0.75);
    font-size: 28px;
    transition: color $trans;
    &:hover {
      color: white;
    }
  }
}

.header {
  text-align: right;
}
.content {
  min-height: 50px;
  .action-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    margin-bottom: 15px;
    padding: 10px 0;
    box-shadow: 0px 0px 4px 0px #bfbfbf;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-select {
    margin-bottom: 15px;
  }
  .demos {
    > .demo-item {
      width: 30%;
      text-align: center;
      display: inline-block;
      cursor: pointer;
      padding: 10px;
      border-radius: 6px;
      background: antiquewhite;
      margin-bottom: 10px;
      vertical-align: middle;
      &:hover {
        transition: 0.2s ease-out;
        box-shadow: 0px 0px 10px 0.1px rosybrown;
      }
      &:nth-child(3n-1) {
        margin: 0 5% 10px;
      }
      > p {
        height: 30px;
      }
      > img {
        width: 80px;
      }
    }
  }
}
.empty {
  color: #bfbfbf;
  text-align: center;
}
@include responsive($sm) {
  .page-container {
    padding: 16px;
  }
}
</style>
