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
              <p class="name">POOL</p>
            </div>
            <div class="top-item">
              <p class="value">{{$route.query.index}}</p>
              <p class="name">NUMBER</p>
            </div>
            <div class="top-item">
              <p class="value">{{totalNumber}}</p>
              <p class="name">HEALTH</p>
            </div>
            <div class="top-item">
              <p class="value">{{depositAmount.amount | formatNumber}}</p>
              <p class="name">DEPOST AMOUNT</p>
            </div>
          </div>
          <div class="top-right-bottom">
            <p>OWNER: </p>
            <s-address
              :address="indexOwner"
              :ellipsis="true"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="table-content"
      v-if="!isEmpty(dappIssueDetail)"
    >
      <el-checkbox
        v-model="isMy"
        style="margin-bottom: 10px;"
      >只显示我的Deposit</el-checkbox>
      <div class="table-header table-header-nav">
        <div class="header-operator">Operator</div>
        <div class="header-action">Action</div>
        <div class="header-consume">Consume</div>
        <div class="header-pool">Luck Pool</div>
        <div class="header-value">Cultivation Value</div>
      </div>
      <div
        class="table-header table-header-hover"
        style="background: blanchedalmond;"
      >
        <div
          class="header-operator"
          @click="goAddress(indexOwner)"
        >{{handleAddress(indexOwner)}}</div>
        <div class="header-action">Create</div>
        <div class="header-consume">{{ownerDeposit.amount | formatNumber}}{{ownerDeposit.denom}}</div>
        <div class="header-pool">-</div>
        <div
          class="header-value"
          :class="[ownerNumber > 0 ? 'green' : 'red']"
        >{{ownerNumber}}</div>
      </div>
      <div
        class="table-header table-header-hover"
        v-for="(i, index) in depositList"
        :key="index"
      >
        <div
          class="header-operator"
          @click="goAddress(i.address)"
        >{{handleAddress(i.address)}}</div>
        <div class="header-action">Deposit</div>
        <div class="header-consume">{{handleDeposit(i.deposit_amount, i.pool_amount) | formatNumber}} GGT</div>
        <div class="header-pool">{{handlePool(i.pool_amount).amount | formatNumber}}{{handlePool(i.pool_amount).denom}}</div>
        <div
          class="header-value"
          :class="[i.number > 0 ? 'green' : 'red']"
        >{{i.number}}</div>
      </div>
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
  padding: 20px;
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
        display: flex;
        align-items: center;
        > p {
          margin-right: 10px;
          color: #777777;
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
}
</style>
