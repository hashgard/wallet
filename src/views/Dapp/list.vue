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
              src="https://wallet.hashgard.com/WechatIMG777.png"
              alt=""
            >
            <p v-if="i.name== 'Mysterious MIne'">{{$t('Mine.MysteriousMIne')}}</p>
            <p v-else>{{(i.name)}}</p>
          </div>
        </div>
      </s-card>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import minePng from "@/assets/WechatIMG777.png";
export default {
  name: "DappList",
  data() {
    return {
      minePng
    };
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
      width: 42.5%;
      text-align: center;
      display: inline-block;
      cursor: pointer;
      padding: 30px 0;
      border-radius: 6px;
      background: antiquewhite;
      margin-bottom: 10px;
      margin-left: 5%;
      vertical-align: middle;
      &:hover {
        transition: 0.2s ease-out;
        box-shadow: 0px 0px 10px 0.1px rosybrown;
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
