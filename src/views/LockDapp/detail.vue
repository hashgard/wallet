<template>
  <div class="detail-container" v-if="!isEmpty(dappIssueDetail) && !isEmpty(dappDetail)">
    <div class="top">
      <div class="left">
        <img :src="weekPng" alt="">
      </div>
      <div class="right">
        <div class="right-top">
          <div class="item">
            <div class="value">{{totalDeposit | formatNumber}}</div>
            <div class="label">投入总额</div>
          </div>
          <div class="item">
            <div class="value">{{completedHeight | formatNumber}}</div>
            <div class="label">预计竣工块高
              <el-popover
                placement="top-start"
                width="200"
                trigger="click"
                content="预计竣工块高后可领取本金以及分红，可至浏览器查看当前块高！">
                <img :src="infoPng" slot="reference" alt="">
              </el-popover>
            </div>
          </div>
        </div>
        <div class="right-bottom">
          <div class="item">
            <div class="value">{{rate}}</div>
            <div class="label">当前年化收益
              <el-popover
                placement="top-start"
                width="300"
                trigger="click">
                <el-table :data="amountArea">
                  <el-table-column width="180" property="area" label="投资总额区间"></el-table-column>
                  <el-table-column width="120" property="value" label="分红率"></el-table-column>
                </el-table>
                <img :src="infoPng" slot="reference" alt="">
              </el-popover>
            </div>
          </div>
          <div class="item">
            <div class="value">{{rateReward | formatNumber}}</div>
            <div class="label">预计收益总额</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div
        class="table-content"
      >
        <div class="table-header table-header-nav">
          <div class="header-address">Address</div>
          <div class="header-amount">Amount</div>
        </div>
        <div
          class="table-header table-header-hover"
          v-for="(i, index) in depositList"
          :key="index"
        >
          <div class="header-address">
            <span v-if="keyStore.address == i.address" style="color:blue;">{{i.address}}</span>
            <span v-else>{{i.address}}</span>
          </div>
          <div class="header-amount">
            {{handleDeposit(i.deposit_amount, i.pool_amount) | formatNumber}} GGT
          </div>
        </div>
        <div
          class="table-header"
          v-if="depositList.length == 0"
        >{{$t("Mine.None")}}</div>
      </div>
      <div class="page-div">
        <span>{{$t("Mine.tableTotal", {name:gridDepositsListAll.length})}}</span>
        <el-pagination
          background
          :pager-count="5"
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="gridDepositsListAll.length"
          @prev-click="onPageChange"
          @next-click="onPageChange"
          @current-change="onPageChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from "vuex";
import BigNumber from "bignumber.js";
import {isEmpty,find} from "lodash";
import { getViewToken, handleTxReturn } from "@/utils/helpers";
import weekPng from "@/assets/week.png";
import seasonPng from "@/assets/season.png";
import halfYearPng from "@/assets/halfYear.png";
import infoPng from "@/assets/info.png";
export default {
  data() {
    return {
      weekPng,
      seasonPng,
      halfYearPng,
      infoPng,
      currentPage: 1,
      pageSize: 10,
      depositList_no_handle:[],
      amountArea:[
        {
          area: '0~100,000',
          value: '3%'
        },
        {
          area: '100,001~2,000,000',
          value: '8%'
        },
        {
          area: '2,000,001~8,000,000',
          value: '12%'
        },
        {
          area: '8,000,001~900,000,000',
          value: '20%'
        }
      ],
      rateType:{
        "3%": 0.03,
        "8%": 0.08,
        "12%": 0.12,
        "20%": 0.2
      }
    }
  },
  computed:{
    ...mapState("account", ["tokenMap", "keyStore"]),
    ...mapState("lockDapp", ["dappDetail", "dappIssueDetail", "gridDepositsListAll"]),
    depositList() {
      let result = [];
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
      return result;
    },
    handleDeposit() {
      return function(deposit, pool) {
        const amount1 = getViewToken(deposit, this.tokenMap).amount;
        const amount2 = getViewToken(pool, this.tokenMap).amount;
        return parseFloat(amount1) + parseFloat(amount2);
      };
    },
    completedHeight() {
      return parseInt(this.dappIssueDetail.height) + parseInt(this.dappDetail.max_blocks_grid_create) + parseInt(this.dappDetail.max_blocks_grid_deposit) + parseInt(this.dappDetail.max_blocks_grid_rewards_withdraw)
    },
    totalDeposit() {
      let result = 0;
      this.gridDepositsListAll.forEach(i => {
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
        const itemDeposit = this.handleDeposit(deposit_amount,pool_amount)
        result += itemDeposit
      });
      return result;
    },
    rate() {
      if (this.totalDeposit <= 100000) {
        return "3%"
      } else if (this.totalDeposit > 100000 && this.totalDeposit <= 2000000) {
        return "8%"
      } else if (this.totalDeposit > 2000000 && this.totalDeposit <= 8000000) {
        return "12%"
      } else if (this.totalDeposit > 8000001 && this.totalDeposit <= 900000000) {
        return "20%"
      }
    },
    rateReward() {
      return this.totalDeposit * this.rateType[this.rate]
    }
  },
  methods: {
    isEmpty,
    async onPageChange(page) {
      this.depositList_no_handle = await this.$store.dispatch(
        "lockDapp/fetchGridDepositsList",
        {
          page,
          pageSize: this.pageSize
        }
      );
    },
    async getData() {
      this.$store.dispatch("lockDapp/fetchDappDetail", {dappId: this.$route.query.dappId})
      await this.$store.dispatch("lockDapp/fetchDappIssueDetail", {dappId: this.$route.query.dappId})
      await this.$store.dispatch("lockDapp/fetchGridDepositsAll", {
        index: "0"
      });
      this.depositList_no_handle = await this.$store.dispatch(
        "lockDapp/fetchGridDepositsList",
        {
          page: 1,
          pageSize: this.pageSize
        }
      ); 
    }
  },
  mounted() {
    this.getData()
  }
}
</script>
<style lang="scss" scoped>
.detail-container {
  max-width: 970px;
  font-family: PingFangSC-Medium, PingFang SC;
  >.top {
    display: flex;
    justify-content: space-between;
    >.left {
      width: 210px;
      height: 260px;
      >img {
        width: 100%;
        height: 100%;
      }
    }
    >.right {
      width: 660px;
      height: 260px;
      background: rgba(255,255,255,1);
      border-radius: 8px;
      border: 1px solid #E6E6E6;
      >.right-top, .right-bottom {
        display: flex;
        align-items: center;
      }
      .item {
        align-items: center;
        text-align: center;
        width: 330px;
        height: 130px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        >.value {
          height: 33px;
          line-height: 33px;
          font-size: 24px;
          font-weight: 500;
          color: #333333;
        }
        >.label {
          height: 30px;
          font-size: 18px;
          font-weight: 500;
          color: #777777;
          line-height: 30px;
          display: flex;
          align-items: center;
          img {
            width:16px;
            height: 16px;
            margin-left: 10px;
            cursor: pointer;
          }
        }
      }
    }
  }
  >.bottom {
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
        }
        > .header-address {
          flex-basis: 65%;
        }
        > .header-amount {
          flex-basis: 35%;
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
      }
    }
    .empty {
      color: #bfbfbf;
      text-align: center;
    }
    .page-div {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
@include responsive($sm) {
  .detail-container {
    >.top {
      display: block;
      >.left {
        width: 100%;
        height: auto;
      }
      >.right {
        width: auto;
      }
    }
  }
}
</style>