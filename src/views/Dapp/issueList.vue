<template>
  <div class="balance-container issueList-container">
    <div>
      <div class="help">
        <el-button class="withdraw" @click="goPlayDoc">{{$t("Mine.HowtoPlay")}}</el-button>
        <el-button class="withdraw" @click="goRewardsDoc">{{$t("Mine.AboutInvestmentRewards")}}</el-button>
      </div>
      <div class="table-header table-header-nav">
        <div class="header-id">{{$t("Mine.MineID")}}</div>
        <div class="header-denom" v-if="pageWidth > 768">{{$t("Mine.StartingHeight")}}</div>
        <div class="header-amount">{{$t("Mine.Status")}}</div>
        <div class="header-action"></div>
      </div>
      <div
        v-if="currentPage == 1 && dappIssueList.length > 0 && status(dappIssueList[0].height) != $t('Mine.OccupationPeriod') "
        class="table-header table-header-hover"
      >
        <div class="header-id">{{parseInt(dappIssueList[0].id) + 1}}</div>
        <div class="header-denom" v-if="pageWidth > 768">-</div>
        <div class="header-amount">
          <span class="green">{{$t("Mine.OccupationPeriod")}}</span>
        </div>
        <div class="header-action">
          <p
            class="action-span"
            @click="buyNew"
          >{{$t("Mine.Occupy")}}</p>
        </div>
      </div>
      <div
        v-if="dappIssueList.length == 0"
        class="table-header table-header-hover"
      >
        <div class="header-id">1</div>
        <div class="header-denom" v-if="pageWidth > 768">-</div>
        <div class="header-amount">
          <span class="green">{{$t("Mine.OccupationPeriod")}}</span>
        </div>
        <div class="header-action">
          <p
            class="action-span"
            @click="buyNew"
          >{{$t("Mine.Occupy")}}</p>
        </div>
      </div>
      <div
        class="table-header table-header-hover"
        v-for="(item, index) in dappIssueList"
        :key="index"
      >
        <div class="header-id">{{item.id}}</div>
        <div class="header-denom" v-if="pageWidth > 768">{{item.height}}</div>
        <div
          class="header-amount"
          v-if="lastBlock"
        >
          <span :class="status(item.height) == $t('Mine.OccupationPeriod') ? 'green' : (status(item.height) == $t('Mine.HarvestPeriod') ? 'gold' : 'blue')">{{status(item.height)}}</span>
        </div>
        <div
          class="header-action"
          v-if="lastBlock"
        >
          <p
            class="action-span"
            @click="goIssue(item.id)"
          >{{$t("Mine.Enter")}}</p>
          <p
            class="action-span"
            v-if="status(item.height) == $t('Mine.OccupationPeriod')"
            @click="buy(item.height)"
          >{{$t("Mine.Occupy")}}</p>
          <p
            class="action-span"
            v-if="status(item.height) == $t('Mine.HarvestPeriod')"
            @click="judgeWithdraw(item)"
          >{{$t("Mine.Harvest")}}</p>
          <p
            class="action-span"
            v-if="status(item.height) == $t('Mine.HarvestPeriod')"
            @click="goReward(item.id)"
          >{{$t("Mine.Harvesthistory")}}</p>
        </div>
      </div>
      <!-- <div
        class="table-header"
        v-if="dappIssueList.length == 0"
      >{{$t("Mine.None")}}</div> -->
      <div class="page-div">
        <span>{{$t("Mine.tableTotal", {name:dappIssueList.length == 0 ? 1 : dappIssueAccount})}}</span>
        <el-pagination
          background
          :pager-count="5"
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="dappIssueAccount"
          @prev-click="onPageChange"
          @next-click="onPageChange"
          @current-change="onPageChange"
        />
      </div>
    </div>
    <!-- <div class="action-div">
      <el-button class="ok-btn">How to play</el-button>
      <el-button
        class="ok-btn"
        @click="buy"
      >Buy</el-button>
    </div> -->
    <!-- buy -->
    <el-dialog
      :title="$t('Mine.Occupytheminingpool')"
      :visible.sync="dialogVisible1"
      width="360px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
      >
        <el-form-item prop="amount">
          <p class="input-info">
            <span>{{$t("Mine.Balance")}}: {{GGTBalance.amount | formatNumber}}GGT</span>
            <!-- <span @click="delegateAll">All</span> -->
          </p>
          <el-input
            :value="form.amount"
            placeholder="Amount"
            @keyup.enter.native="onSendValidate('form')"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isEmpty(this.mathAccount)">
          <el-input
            type="password"
            v-model="form.pass"
            :placeholder="$t('create.pass')"
            @keyup.enter.native="onSendValidate('form')"
          ></el-input>
          <!-- <p>应用费: {{getViewToken(dappFees.create_grid_fee,tokenMap).amount}}GARD</p> -->
          <p>gas: 1GARD</p>
        </el-form-item>
      </el-form>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="onSendValidate('form')"
          class="ok-btn"
        >{{$t('global.ok')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="$t('Mine.Harvest')"
      :visible.sync="dialogVisible"
      width="360px"
      :close-on-click-modal="false"
    >
      <el-input
        type="password"
        v-model="pass"
        :placeholder="$t('create.pass')"
        @keyup.enter.native="onWithdraw(false)"
      ></el-input>
      <!-- <p>应用费: {{getViewToken(dappFees.withdraw_rewards_fee, tokenMap).amount}}GARD</p> -->
      <p style="margin-top:10px;">gas: 1GARD</p>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="onWithdraw(false)"
          class="ok-btn"
        >{{$t('global.ok')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getViewToken, handleTxReturn } from "@/utils/helpers";
import BigNumber from "bignumber.js";
import { get, isEmpty, throttle, findLast,find } from "lodash";
export default {
  data() {
    const validateAmount = (rule, value, callback) => {
      const input = value - 0;
      const ggtBalance = this.GGTBalance.amount - 0;
      if (input > ggtBalance) {
        callback(new Error(this.$t("send.amountWarn")));
        return;
      }
      callback();
    };
    return {
      pageWidth: document.documentElement.clientWidth,
      form: {
        amount: "",
        pass: ""
      },
      rules: {
        amount: [{ validator: validateAmount, trigger: "blur" }]
      },
      dialogVisible1: false,
      currentPage: 1,
      pageSize: 10,
      dialogVisible: false,
      pass: ""
    };
  },
  computed: {
    ...mapState("account", ["tokenMap", "balance", "mathAccount","keyStore"]),
    ...mapState("grid", [
      "dappIssueList",
      "dappDetail",
      "dappFees",
      "dappIssueAccount",
      "lastBlock",
      "dappIssueListAll"
    ]),
    viewBalance() {
      if (sessionStorage.getItem("boxAmount")) {
        return [JSON.parse(sessionStorage.getItem("boxAmount"))];
      }
      const coins = this.balance.filter(
        i => !i.denom.match(/^box.{11}$/) && !i.denom.match(/^box.{13}$/)
      );
      return coins.map(i => {
        const token = { ...i };
        if (token.denom.match(/^coin.{10}$/)) {
          const detail = this.tokenMap[token.denom];
          if (!isEmpty(detail)) {
            token.label = `${detail.symbol} (${detail.issue_id})`;
            token.amount = BigNumber(token.amount)
              .dividedBy(Math.pow(10, detail.decimals))
              .toString();
          }
        } else {
          if (token.denom === "ugard") {
            token.amount = BigNumber(token.amount)
              .dividedBy(Math.pow(10, 6))
              .toString();
            token.label = "GARD";
          } else if (token.denom === "uggt") {
            token.amount = BigNumber(token.amount)
              .dividedBy(Math.pow(10, 6))
              .toString();
            token.label = "GGT";
          } else {
            token.amount = BigNumber(token.amount)
              .dividedBy(Math.pow(10, 6))
              .toString();
            token.label = token.denom.slice(1).toUpperCase();
          }
        }
        return token;
      });
    },
    GGTBalance() {

const ggt = { amount: "0", denom: "uggt", label: "GGT" };
      return this.viewBalance.find(i => i.denom === "uggt") || ggt;
    },
    GARDBalance() {
      const gard = { amount: "0", denom: "ugard", label: "GARD" };
      return this.viewBalance.find(i => i.denom === "ugard") || gard;
    },
    maxBlocksGridCreate() {
      return this.dappDetail.max_blocks_grid_create;
    },
    maxBlocksGridDeposit() {
      return this.dappDetail.max_blocks_grid_deposit;
    },
    lastIssueStartHeight() {
      return this.dappIssueList[0].height;
    },
    status() {
      return function(startHeight) {
        const creat_end =
          parseInt(this.maxBlocksGridCreate) + parseInt(startHeight);
        const deposit_end = parseInt(this.maxBlocksGridDeposit) + creat_end;
        if (parseInt(this.lastBlock) >= deposit_end) {
          return this.$t("Mine.HarvestPeriod");
        } else if (parseInt(this.lastBlock) <= creat_end) {
          return this.$t("Mine.OccupationPeriod");
        } else {
          return this.$t("Mine.MiningPeriod");
        }
      };
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    isEmpty,
    getViewToken,
    goPlayDoc() {
      if (this.$i18n.locale == "zh") {
        window.open("https://wallet.hashgard.com/%E7%A5%9E%E7%A7%98%E7%9F%BF%E5%B1%B1%E7%8E%A9%E6%B3%95%E8%AF%B4%E6%98%8E.pdf")
      } else {
        window.open("https://wallet.hashgard.com/About%20Gold%20Rush%20Age.pdf")
      }

},
    goRewardsDoc(){
      if (this.$i18n.locale == "zh") {
        window.open("https://wallet.hashgard.com/GGT%E6%94%B6%E7%9B%8A%E8%AF%B4%E6%98%8E.pdf")
      } else {
        window.open("https://wallet.hashgard.com/About%20Gold%20Rush%20Age%20Rewards.pdf")
      }
    },
    async getData() {
      await this.$store.dispatch("grid/fetchDappIssueListAll", {
        dappId: this.$route.query.dappId
      });
      this.$store.dispatch("grid/fetchDappIssueList", {
        dappId: this.$route.query.dappId,
        startId: 0
      });
      this.$store.dispatch("grid/fetchLastBlock");
      this.$store.dispatch("grid/fetchDappDetail", {
        dappId: this.$route.query.dappId
      });
      this.$store.dispatch("account/fetchBalance");
      this.$store.dispatch("grid/fetchDappFees");
    },
    goIssue(id) {
      this.$router.push({
        path: `/dapp/issueDetail?dappId=${this.$route.query.dappId}&gridId=${id}`
      });
    },
    handleResize(event) {
      this.pageWidth = document.documentElement.clientWidth;
    },
    delegateAll() {
      this.form.amount = this.GGTBalance.amount;
    },
    async onPageChange(page) {
      this.currentPage = page;
      if (page == 1) {
        await this.$store.dispatch("grid/fetchDappIssueListAll", {
          dappId: this.$route.query.dappId
        });
        this.$store.dispatch("grid/fetchDappIssueList", {
          dappId: this.$route.query.dappId,
          startId: 0
        });
        return;
      }
      const startId = this.dappIssueListAll[(page - 1) * 10].id;
      this.$store.dispatch("grid/fetchDappIssueList", {
        dappId: this.$route.query.dappId,
        startId
      });
    },
    goReward(gridId) {
      this.$router.push({
        path: `/dapp/rewards?dappId=${this.$route.query.dappId}&gridId=${gridId}`
      });
    },
    buyNew() {
      const ggt = getViewToken(
        this.dappDetail.owner_min_deposit,
        this.tokenMap
      );
      this.form.amount = ggt.amount;
      if (
        this.GARDBalance.amount <
        parseInt(
          getViewToken(this.dappFees.create_grid_fee, this.tokenMap).amount
        ) +
          1
      ) {
        this.$message.error(this.$t("Mine.feeNo"));
        return;
      }
      this.form.pass = "";
      this.dialogVisible1 = true;
    },
    async buy(startHeight) {
      if (this.dappIssueList.length != 0) {
        const currentHeight = await this.$store.dispatch("grid/fetchLastBlock");
        const blockStatus =
          parseInt(currentHeight) <
          parseInt(startHeight) + parseInt(this.maxBlocksGridCreate)
            ? true
            : false;
        const gridStatus =
          this.dappIssueList[0].items.length < 9 ? true : false;
        if (!gridStatus && blockStatus) {
          this.$message.error(this.$t("Mine.wait"));
          return;
        }
        //
      }
      //
      const ggt = getViewToken(
        this.dappDetail.owner_min_deposit,
        this.tokenMap
      );
      this.form.amount = ggt.amount;
      if (
        this.GARDBalance.amount <
        parseInt(
          getViewToken(this.dappFees.create_grid_fee, this.tokenMap).amount
        ) +
          1
      ) {
        this.$message.error(this.$t("Mine.feeNo"));
        return;
      }
      this.form.pass = "";
      this.dialogVisible1 = true;
    },
    onSendValidate: throttle(
     function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!isEmpty(this.mathAccount)) {
            this.onSend(true);
          } else {
            this.onSend(false)
          }
        }
      });
    },
      1500,
      { trailing: false }
    ),
    async onSend(useMathWallet) {
      if (!useMathWallet && !this.form.pass) {
        this.$message({
          type: "error",
          message: this.$t("global.required", {
            name: this.$t("create.pass")
          }),
          center: true
        });
        return false;
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const params = {
        dappId: this.$route.query.dappId,
        denom: "uggt",
        amount: BigNumber(this.form.amount)
          .times(BigNumber(10).pow(6))
          .toFixed(),
        pass: this.form.pass
      };
      let res = "";
      try {
        res = await this.$store.dispatch("grid/createGrid", params);
      } catch (e) {
        this.$message({
          type: "error",
          message: this.$t(`send.error`),
          center: true
        });
      }
      if (res.txhash) {
        const txStatus = await handleTxReturn(res);
        if (txStatus) {
          const raw_log = get(
            JSON.parse(res.raw_log)[0],
            "events",
            []
          ).filter(item => item.type === "grid_create");
          const dapp =
            findLast(get(raw_log[0], "attributes"), {
              key: "dapp_id"
            }) || {};
          const grid =
            findLast(get(raw_log[0], "attributes"), {
              key: "grid_id"
            }) || {};
          this.$message({
            type: "success",
            message:this.$t("Mine.SuccessfullyOccupied",{name:grid.value}),
            center: true,
            duration: 1000,
            onClose: () => {
              this.$router.push({
                path: `/dapp/issueDetail?dappId=${this.$route.query.dappId}&gridId=${grid.value}`
              });
            }
          });
        } else {

        }
        this.dialogVisible1 = false;
      } else {
        this.$message({
          type: "error",
          message: this.$t(`send.${res}`),
          center: true,
          onClose:()=> {
            this.getData()
          }
        });
      }
      loading.close();
    },
    // 判断收获操作
    async judgeWithdraw(issueDetail) {
      const depositStatus = await this.judgeDeposits(issueDetail)
      const acceptStatus = await this.judgeAccept(issueDetail)
      // 有开采，没收获过
      if (depositStatus && !acceptStatus) {
        this.widthdraw(issueDetail.id)
        return
      }
      // 有开采，收获过
      if (depositStatus && acceptStatus) {
        this.$message.error(this.$t("Mine.haveClaimed"))
        return
      }
      const ownerGrid = issueDetail.items.filter(i=> {
        return i.owner == this.keyStore.address
      })
      // 是矿主
      if (ownerGrid.length > 0) {
        // 没开采，收获过
        if (!depositStatus && acceptStatus) {
          this.$message.error(this.$t("Mine.haveClaimed"))
          return
        }
        // 没开采，没收获过
        if (!depositStatus && !acceptStatus) {
          this.widthdraw(issueDetail.id)
          return
        }
      }
      // 不是矿主
      else {
        // 没开采
        if (!depositStatus) {
          this.$message.error(this.$t("Mine.notParticipated"))
          return
        }
      }
    },
    // 判断有无存款
    async judgeDeposits(issueDetail) {
      let deposits = []
      issueDetail.items.forEach(i=> {
        if (!isEmpty(i.deposits)) {
          deposits.push(...i.deposits)
        }
      })
      if (isEmpty(deposits)) {
        return Promise.resolve(false)
      }
      const myDeposits = find(deposits, i=> {
        return i.split("_")[0] == this.keyStore.address
      })
      if (!isEmpty(myDeposits)) {
        return Promise.resolve(true)
      } else {
        return Promise.resolve(false)
      }
    },
    // 判断有无收获过
    async judgeAccept(issueDetail) {
      const backs = !isEmpty(issueDetail.backs) ? issueDetail.backs : []
      const deposits = !isEmpty(issueDetail.deposits) ? issueDetail.deposits : []
      const fees = !isEmpty(issueDetail.fees) ? issueDetail.fees : []
      const rewards = !isEmpty(issueDetail.rewards) ? issueDetail.rewards : []
      const lucky = !isEmpty(issueDetail.lucky) ? issueDetail.lucky : []
      let result = [...backs,...deposits,...rewards,...lucky,...fees]
      const myReward = find(result, i=> {
        return i.split("_")[0] == this.keyStore.address
      })
      if (!isEmpty(myReward)) {
        return Promise.resolve(true)
      } else {
        return Promise.resolve(false)
      }
    },
    widthdraw(gridId) {
      this.gridId = gridId;
      if (
        this.GARDBalance.amount <
        parseInt(
          getViewToken(this.dappFees.withdraw_rewards_fee, this.tokenMap).amount
        ) +
          1
      ) {
        this.$message.error(this.$t("Mine.feeNo"));
        return;
      }
      // use math wallet
      if (!isEmpty(this.mathAccount)) {
        this.onWithdraw(true);
        return;
      }
      // else use local wallet
      this.dialogVisible = true;
      this.pass = "";
    },
    onWithdraw: throttle(
      async function(useMathWallet) {
        if (!useMathWallet && !this.pass) {
          this.$message({
            type: "error",
            message: this.$t("global.required", {
              name: this.$t("create.pass")
            }),
            center: true
          });
          return false;
        }
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        const params = {
          dappId: this.$route.query.dappId,
          pass: this.pass,
          gridId: this.gridId
        };
        let res = "";
        try {
          res = await this.$store.dispatch("grid/dappWithdraw", params);
        } catch (e) {
          this.$message({
            type: "error",
            message: this.$t(`send.error`),
            center: true
          });
        }
        if (res.txhash) {
          const txStatus = await handleTxReturn(res);
          if (txStatus) {
            this.$message({
              type: "success",
              message: this.$t("Mine.Harvest"),
              center: true,
              duration: 1000,
              onClose: () => {
                this.dialogVisible = false;
                this.getData();
              }
            });
          } else {
          }
          this.dialogVisible = false;
        } else {
          this.$message({
            type: "error",
            message: this.$t(`send.${res}`),
            center: true
          });
        }
        loading.close();
        this.gridId = "";
      },
      1500,
      { trailing: false }
    )
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  }
};
</script>

<style lang="scss" scoped>
.balance-container {
  width: 100%;
  .table-header {
    background-color: rgba(245, 247, 250, 1);
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
      // flex-basis: 33%;
    }
    > .header-id {
      flex-basis: 25%;
    }
    > .header-denom {
      flex-basis: 25%;
    }
    > .header-amount {
      flex-basis: 20%;
    }
    > .header-action {
      flex-basis: 30%;
    }
  }
  .table-header-nav {
    font-weight: bolder;
  }
  .table-header-hover {
    cursor: pointer;
    &:hover {
      background-color: rgba(242, 246, 252, 1);
    }
    .header-action {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .action-span {
        font-size: 14px;
        color: $main-btn;
        text-align: center;
        cursor: pointer;
        font-weight: bolder;
      }
    }
  }
  .action-div {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    .ok-btn {
      margin: 0 80px;
      width: 200px;
    }
  }
}
.ok-btn {
  border: none;
  background-color: $main-btn !important;
  color: #fff;
  height: 48px;
}
.page-div {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.gold {
  color: #ff8c00;
}
.green {
  color: green;
}
.blue {
  color: blue;
}
.input-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  span:last-child {
    color: blue;
    cursor: pointer;
  }
}
.help {
  margin-bottom: 15px;
  .withdraw {
    height: 48px;
    font-size: 16px;
    color: #406096;
    background: #fff;
    box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.1);
    border: none;
    &:hover {
      color: #fff;
      background: linear-gradient(90deg, #38b5c2 0%, #406096 100%);
      box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.1);
    }
  }
}
@include responsive($sm) {
  .balance-container {
    .table-header {
      > .header-id {
      flex-basis: 25%;
    }
    > .header-amount {
      flex-basis: 20%;
    }
    > .header-action {
      flex-basis: 55%;
    }
    }
  }
}
</style>

