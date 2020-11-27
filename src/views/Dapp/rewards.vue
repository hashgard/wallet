<template>
  <div class="page-container action-container grid-detail-container">
    <div class="top">
      <div
        class="item"
        :id="i.index == clectedIndex ? 'clected' : 'clected-no'"
        v-for="(i,index) in items"
        :key="index"
        @click="changeType(i.index,i.key)"
      >{{i.name}}</div>
    </div>
    <div
      class="table-content"
      v-if="!isEmpty(dappIssueDetail)"
    >
      <div class="table-header table-header-nav">
        <div class="header-address">Address</div>
        <div class="header-amount">Amount</div>
      </div>
      <div
        class="table-header table-header-hover"
        v-for="(i, index) in tableData"
        :key="index"
      >
        <div class="header-address">{{i.address}}</div>
        <div class="header-amount">
          <data-amount :list="i.amount"></data-amount>
        </div>
      </div>
      <div
        class="table-header"
        v-if="tableData.length == 0"
      >{{$t("Mine.None")}}</div>
    </div>
    <div class="page-div">
      <span>{{$t("Mine.tableTotal", {name:total})}}</span>
      <el-pagination
        background
        :pager-count="5"
        layout="prev, pager, next"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="total"
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
  name: "rewards",
  data() {
    return {
      minePng,
      clectedIndex: 0,
      items: [
        {
          index: 0,
          name: "Deposit",
          key: "deposits"
        },
        {
          index: 1,
          name: "Rewards",
          key: "rewards"
        },
        {
          index: 2,
          name: "Lucky",
          key: "lucky"
        }
        // {
        //   index: 3,
        //   name: "Fees",
        //   key: "fees"
        // }
      ],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      typeName: "deposits",
      total:0
    };
  },
  computed: {
    ...mapState("account", ["tokenMap", "balance", "mathAccount", "keyStore"]),
    ...mapState("grid", ["dappIssueDetail", "dappDetail"]),
    handleInfo() {
      return function(amountArray) {
        let result = [];
        amountArray.forEach(i => {
          const info = i.split("_");
          const address = info[0];
          let amount = [];
          const arr1 = info[1].split(",");
          arr1.forEach(m => {
            amount.push({
              denom: m.replace(/[^a-z]/gi, ""),
              amount: m.replace(/[^0-9]/gi, "")
            });
          });
          result.push({
            address,
            amount
          });
        });
        return result;
      };
    },
    handleAmount() {
      return function(val) {
        return getViewToken(val, this.tokenMap);
      };
    }
  },
  methods: {
    isEmpty,
    changeType(value, name) {
      this.currentPage = 1;
      this.clectedIndex = value;
      this.typeName = name;
      if (isEmpty(this.dappIssueDetail[name])) {
        this.tableData = [];
        this.total = 0
      } else {
        this.tableData = this.handleInfo(
          this.dappIssueDetail[name].slice(0, this.pageSize)
        );
        this.total = this.dappIssueDetail[name].length
      }
    },
    onPageChange(page) {
      this.tableData = this.handleInfo(
        this.dappIssueDetail[this.typeName].slice(
          (page - 1) * this.pageSize,
          (page - 1) * this.pageSize + this.pageSize
        )
      );
    },
    async getData() {
      await this.$store.dispatch("grid/fetchDappIssueDetail", {
        dappId: this.$route.query.dappId,
        gridId: this.$route.query.gridId
      });
      if (!isEmpty(this.dappIssueDetail.deposits)) {
        this.tableData = this.handleInfo(
          this.dappIssueDetail.deposits.slice(0, this.pageSize)
        );
        this.total = this.dappIssueDetail.deposits.length
      } else {
        this.tableData = [];
        this.total = 0
      }
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
.top {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  > .item {
    width: 120px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background: #fff;
    color: #000;
    border-radius: 4px;
    margin-right: 15px;
    cursor: pointer;
  }
  > #clected {
    background: $main-btn;
    color: #fff;
  }
  > #clected-no {
    &:hover {
      background-color: $main-btn;
      -webkit-box-shadow: 10px 10px 99px 6px $main-btn;
      -moz-box-shadow: 10px 10px 99px 6px $main-btn;
      box-shadow: 10px 10px 99px 6px $main-btn;
      color: #fff;
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
@include responsive($sm) {
  .page-container {
    padding: 16px;
  }
}
</style>
