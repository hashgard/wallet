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
            @click="enterDepositDapp"
          >
            <img
              :src="housePng"
              alt=""
            >
            <p>建房子</p>
          </div>
        </div>
      </s-card>
    </div>
  </div>
</template>
<script>
import minePng from "@/assets/WechatIMG777.png";
import housePng from "@/assets/181607483315_.pic_hd.jpg";
export default {
  name: "DappList",
  data() {
    return {
      minePng,
      housePng
    };
  },
  computed: {
  },
  methods: {
    enterDepositDapp() {
      this.$router.push({
        path: `/lockDapp/home`
      })
    }
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
