<template>
  <div class="page-container grid-detail-container">
    <div
      class="content"
      v-if="!isEmpty(dappDetail) && !isEmpty(dappIssueDetail)"
    >
      <div class="top">
        <div class="top-left">
          <img
            :src="minePng"
            alt=""
          >
        </div>
        <div class="top-right">
          <div class="top-right-top">
            <div class="top-item">
              <p class="value">{{$route.query.gridId}}</p>
              <p class="name">矿山ID</p>
            </div>
            <div class="top-item">
              <p class="value">{{$route.query.index}}</p>
              <p class="name">矿池ID</p>
            </div>
            <div class="top-item">
              <p class="value">{{totalNumber | formatNumber}}</p>
              <p class="name">矿池健康值</p>
            </div>
            <div class="top-item">
              <p class="value">{{depositAmount.amount | formatNumber}}</p>
              <p class="name">入股总额</p>
            </div>
          </div>
          <div class="top-right-bottom">
            <div class="owner">
              <p style="margin-right: 3px;">矿主: </p>
              <s-address
                :address="indexOwner"
                :ellipsis="true"
              />
            </div>
            <div>占领花费: {{ownerDeposit.amount | formatNumber}}{{ownerDeposit.denom}}</div>
            <div>矿池初始健康值: <span :class="[ownerNumber > 0 ? 'green' : 'red']">{{ownerNumber | formatNumber}}</span></div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="table-content"
      v-if="!isEmpty(dappIssueDetail)"
    >
      <!-- <el-checkbox
        v-model="isMy"
        style="margin-bottom: 10px;"
      >只显示我的Deposit</el-checkbox> -->
      <div class="table-header table-header-nav">
        <div class="header-operator">股东</div>
        <div class="header-action">投入资金</div>
        <div class="header-consume">保险池</div>
        <div class="header-pool">实际入股</div>
        <div class="header-value">健康值加成</div>
      </div>
      <div
        class="table-header table-header-hover"
        :class="i.address == keyStore.address ? 'myDeposit' : ''"
        v-for="(i, index) in depositList"
        :key="index"
      >
        <div
          class="header-operator"
          @click="goAddress(i.address)"
        >{{handleAddress(i.address)}}</div>
        <div class="header-action">{{handleDeposit(i.deposit_amount, i.pool_amount) | formatNumber}} GGT</div>
        <div class="header-consume">{{handlePool(i.pool_amount).amount | formatNumber}} {{handlePool(i.pool_amount).denom}}</div>
        <div class="header-pool">{{parseFloat(handleDeposit(i.deposit_amount, i.pool_amount)) - handlePool(i.pool_amount).amount}} GGT</div>
        <div
          class="header-value"
          :class="[i.number > 0 ? 'green' : 'red']"
        >{{i.number |formatNumber}}</div>
      </div>
      <div
        class="table-header"
        v-if="depositList.length == 0"
      >{{$t("global.null2")}}</div>
    </div>
    <div class="page-div">
      <el-pagination
        background
        :pager-count="5"
        layout="total,prev, pager, next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="gridDepositsListAll.length"
        @prev-click="onPageChange"
        @next-click="onPageChange"
        @current-change="onPageChange"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getViewToken } from "@/utils/helpers";
import BigNumber from "bignumber.js";
import { get, isEmpty } from "lodash";
import minePng from "@/assets/mine.png";
export default {
  name: "gridDetail",
  data() {
    return {
      minePng,
      isMy: false,
      currentPage: 1,
      pageSize: 10,
      depositList_no_handle: []
    };
  },
  computed: {
    ...mapState("account", ["tokenMap", "balance", "mathAccount", "keyStore"]),
    ...mapState("grid", [
      "dappIssueDetail",
      "dappDetail",
      "gridDepositsListAll"
    ]),
    totalNumber() {
      const indexInfo = this.dappIssueDetail.items.filter(i => {
        return i.index == this.$route.query.index;
      });
      return indexInfo[0].total_number;
    },
    depositAmount() {
      const indexInfo = this.dappIssueDetail.items.filter(i => {
        return i.index == this.$route.query.index;
      });
      return getViewToken(indexInfo[0].member_deposit, this.tokenMap);
    },
    indexOwner() {
      const indexInfo = this.dappIssueDetail.items.filter(i => {
        return i.index == this.$route.query.index;
      });
      return indexInfo[0].owner;
    },
    ownerDeposit() {
      const indexInfo = this.dappIssueDetail.items.filter(i => {
        return i.index == this.$route.query.index;
      });
      return getViewToken(indexInfo[0].owner_deposit, this.tokenMap);
    },
    ownerNumber() {
      const indexInfo = this.dappIssueDetail.items.filter(i => {
        return i.index == this.$route.query.index;
      });
      return indexInfo[0].owner_number;
    },
    handleAddress() {
      return function(address) {
        return (
          address.substring(0, 6) +
          "..." +
          address.substring(address.length - 4, address.length)
        );
      };
    },
    depositList() {
      // const indexInfo = this.dappIssueDetail.items.filter(i => {
      //   return i.index == this.$route.query.index;
      // });
      let result = [];
      // if (isEmpty(indexInfo[0].deposits)) {
      //   return [];
      // }
      this.depositList_no_handle.forEach(i => {
        const depositInfo = i.split("_");
        const address = depositInfo[0];
        const number = depositInfo[1];
        const deposit_amount = {
          denom: depositInfo[2].replace(/[^a-z]/gi, ""),
          amount: depositInfo[2].replace(/[^0-9]/gi, "")
        };
        const pool_amount = {
          denom: depositInfo[4].replace(/[^a-z]/gi, ""),
          amount: depositInfo[4].replace(/[^0-9]/gi, "")
        };
        result.push({
          address: address,
          number: number,
          deposit_amount: deposit_amount,
          pool_amount: pool_amount
        });
      });

      if (this.isMy) {
        const myDeposit = result.filter(i => {
          return i.address == this.keyStore.address;
        });
        return myDeposit;
      } else {
        return result;
      }
    },
    handleDeposit() {
      return function(deposit, pool) {
        const amount1 = getViewToken(deposit, this.tokenMap).amount;
        const amount2 = getViewToken(pool, this.tokenMap).amount;
        return parseFloat(amount1) + parseFloat(amount2);
      };
    },
    handlePool() {
      return function(pool) {
        return getViewToken(pool, this.tokenMap);
      };
    }
  },
  methods: {
    isEmpty,
    async onPageChange(page) {
      this.depositList_no_handle = await this.$store.dispatch(
        "grid/fetchGridDepositsList",
        {
          page,
          pageSize: this.pageSize
        }
      );
    },
    goAddress(address) {
      window.open(`http://172.16.7.219:8080/#/address/${address}`);
    },
    async getData() {
      await this.$store.dispatch("grid/fetchDappIssueDetail", {
        dappId: this.$route.query.dappId,
        gridId: this.$route.query.gridId
      });
      this.$store.dispatch("grid/fetchDappDetail", {
        dappId: this.$route.query.dappId
      });
      await this.$store.dispatch("grid/fetchGridDepositsAll", {
        index: this.$route.query.index
      });
      this.depositList_no_handle = await this.$store.dispatch(
        "grid/fetchGridDepositsList",
        {
          page: 1,
          pageSize: this.pageSize
        }
      );
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style lang="scss" scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto $padding-large;
  padding: $padding-large;
}

.content {
  background: #fff;
  padding: 30px 20px;
  border-radius: 6px;
  > .top {
    display: flex;
    align-items: center;
    height: 150px;
    > .top-left {
      width: 25%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      > img {
        height: 150px;
      }
    }
    > .top-right {
      width: 75%;
      color: #000;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      padding: 0 10px;
      > .top-right-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        > .top-item {
          text-align: center;
          font-family: PingFangSC-Medium, PingFang SC;
          > .name {
            font-size: 18px;
            font-weight: 500;
            color: #777777;
          }
          > .value {
            font-size: 24px;
            font-weight: 500;
            color: #333333;
          }
        }
      }
      > .top-right-bottom {
        color: #777;
        padding-top: 5px;
        > .owner {
          display: flex;
          align-items: center;
        }
        > p {
          margin-right: 10px;
          color: #777777;
        }
        > div {
          font-size: 16px;
          padding: 5px 0;
        }
      }
    }
  }
}
.table-content {
  margin-top: 20px;
  .table-header {
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    height: 50px;
    line-height: 50px;
    border-radius: 4px;
    margin-bottom: 10px;
    text-align: left;
    color: rgba(0, 0, 0, 0.7);
    > div {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-indent: 1em;
      flex-basis: 20%;
    }
  }
  .myDeposit {
    background-color: navajowhite;
  }
  .table-header-nav {
    font-weight: bolder;
  }
  .table-header-hover {
    cursor: pointer;
    &:hover {
      box-shadow: 0 0 1px 1px gray;
    }
    > .header-operator {
      cursor: pointer;
      color: blue;
    }
  }
}
.green {
  color: green;
}
.red {
  color: red;
}
.empty {
  color: #bfbfbf;
  text-align: center;
}
.page-div {
  text-align: right;
}
@include responsive($sm) {
  .page-container {
    padding: 16px;
  }
  .content {
  background: #fff;
  padding: 30px 20px;
  border-radius: 6px;
  > .top {
    height: inherit;
    display: block;
    > .top-left {
      width: 50%;
      > img {
        height: 150px;
      }
    }
    > .top-right {
      width: 100%;
      color: #000;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      padding: 0 10px;
      > .top-right-top {
        display: block;
        > .top-item {
          display: flex;
          flex-direction: row-reverse;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
          > .name {
            font-size: 16px;
          }
          > .value {
            font-size: 16px;
          }
        }
      }
    }
  }
}
}
</style>
