<template>
  <div class="page-container action-container">
    <div class="content">
      <div
        class="demo-item"
        v-for="(i,index) in mineList"
        :key="index"
      >
        <!-- 未被抢占 -->
        <div
          v-if="i.disabled"
          class="disabled"
        >
          <div class="img-div">
            <img
              :src="minePng"
              alt=""
            >
          </div>

          <p class="number">矿池健康值: <br>暂无</p>
          <p
            class="owner"
            style="color: gray;"
          >未被占领</p>
          <div class="action">
            <el-button
              class="btn"
              size="small"
              disabled
            >开 采</el-button>
          </div>
        </div>
        <!-- 已抢占 -->
        <div
          v-else
          class="disabled-no"
          @click="enterDapp(i.index)"
        >
          <div class="img-div">
            <img
              :src="imgType[i.index]"
              alt=""
            >
            <img
              v-if="myDepositJudge(i.index)"
              class="tag"
              :src="tagSvg"
              alt=""
            >
          </div>

          <p class="number">矿池健康值: <br>{{(i.total_number)}}</p>
          <p
            class="owner"
            v-if="keyStore.address == i.owner"
            style="color: blue;"
          >矿主: {{i.owner | gardAddr}}</p>
          <p
            class="owner"
            v-else
          >矿主: {{i.owner | gardAddr}}</p>
          <div class="action">
            <el-button
              class="btn"
              size="small"
              @click.stop="deposit(i.index)"
            >开 采</el-button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="bottom-btn-div"
      v-if="!isDisabled"
    >
      <el-button
        class="withdraw"
        @click="widthdraw"
      >一键收获</el-button>
      <el-button
        class="withdraw"
        @click="goReward"
      >收获历史</el-button>
    </div>

    <el-dialog
      title="开采"
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
            <span>Balance: {{GGTBalance.amount | formatNumber}}GGT</span>
            <!-- <span @click="delegateAll">All</span> -->
          </p>
          <p class="input-info">
            <span>Area: {{this.minDeposit.amount}}-{{this.maxDeposit.amount}}GGT</span>
          </p>
          <el-input
            v-model="form.amount"
            placeholder="Amount"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            type="password"
            v-model="form.pass"
            :placeholder="$t('create.pass')"
            @keyup.enter.native="onSend(false)"
          ></el-input>
          <!-- <p>应用费: {{getViewToken(dappFees.deposit_fee, tokenMap).amount}}GARD</p> -->
          <p>gas费: 1GARD</p>
        </el-form-item>
      </el-form>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="onSend(false)"
          class="ok-btn"
        >{{$t('global.ok')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="收获"
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
      <p>gas费: 1GARD</p>
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
import { get, isEmpty, throttle } from "lodash";
import minePng from "@/assets/mine.png";
import mine9Png from "@/assets/mine-9.png";
import mine8Png from "@/assets/mine-8.png";
import mine7Png from "@/assets/mine-7.png";
import mine6Png from "@/assets/mine-6.png";
import mine5Png from "@/assets/mine-5.png";
import mine4Png from "@/assets/mine-4.png";
import mine3Png from "@/assets/mine-3.png";
import mine2Png from "@/assets/mine-2.png";
import mine1Png from "@/assets/mine-1.png";
import tagSvg from "@/assets/tag.svg";
export default {
  name: "issueDetail",
  data() {
    const validateAmount = (rule, value, callback) => {
      const input = value - 0;
      const ggtBalance = this.GGTBalance.amount - 0;
      const minDeposit = this.minDeposit.amount - 0;
      const maxDeposit = this.maxDeposit.amount - 0;
      if (input > ggtBalance) {
        callback(new Error(this.$t("send.amountWarn")));
        return;
      }
      if (input < minDeposit || input > maxDeposit) {
        callback(new Error("抵押数量超出限制"));
        return;
      }
      callback();
    };
    return {
      tagSvg,
      minePng,
      imgType: {
        "1": mine1Png,
        "2": mine2Png,
        "3": mine3Png,
        "4": mine4Png,
        "5": mine5Png,
        "6": mine6Png,
        "7": mine7Png,
        "8": mine8Png,
        "0": mine9Png
      },
      form: {
        amount: "",
        pass: ""
      },
      rules: {
        amount: [{ validator: validateAmount, trigger: "blur" }]
      },
      dialogVisible1: false,
      dialogVisible: false,
      pass: ""
    };
  },
  computed: {
    ...mapState("account", ["tokenMap", "balance", "mathAccount", "keyStore"]),
    ...mapState("grid", [
      "dappIssueDetail",
      "dappDetail",
      "lastBlock",
      "dappFees"
    ]),
    mineList() {
      if (!isEmpty(this.dappIssueDetail.items)) {
        let result = [].concat(this.dappIssueDetail.items);
        for (let i = 0; i < 9 - this.dappIssueDetail.items.length; i++) {
          result.push({ disabled: true });
        }
        return result;
      } else {
        let result = [];
        for (let i = 0; i < 9; i++) {
          result.push({ disabled: true });
        }
        return result;
      }
    },
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
    minDeposit() {
      return getViewToken(this.dappDetail.member_min_deposit, this.tokenMap);
    },
    maxDeposit() {
      return getViewToken(this.dappDetail.max_per_deposit, this.tokenMap);
    },
    isDisabled() {
      if (
        parseInt(this.lastBlock) >=
        parseInt(this.dappIssueDetail.height) +
          parseInt(this.maxBlocksGridCreate) +
          parseInt(this.maxBlocksGridDeposit)
      ) {
        return false;
      } else {
        return true;
      }
    },
    maxBlocksGridCreate() {
      return this.dappDetail.max_blocks_grid_create;
    },
    maxBlocksGridDeposit() {
      return this.dappDetail.max_blocks_grid_deposit;
    },
    myDepositJudge() {
      return function(index) {
        const result = this.dappIssueDetail.items.filter(i => {
          return i.index == index;
        });
        if (!isEmpty(result[0].deposits)) {
          const myDeposit = result[0].deposits.filter(k => {
            return this.keyStore.address == k.split("_")[0];
          });
          if (myDeposit.length > 0) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      };
    }
  },
  methods: {
    getViewToken,
    enterDapp(index) {
      this.$router.push({
        path: `/dapp/gridDetail?dappId=${this.$route.query.dappId}&gridId=${this.$route.query.gridId}&index=${index}`
      });
    },
    async deposit(index) {
      const currentBlock = await this.$store.dispatch("grid/fetchLastBlock");
      this.index = index;
      // 如果抢占期不能质押
      if (!this.dappDetail.grid_create_can_deposit) {
        if (
          parseInt(currentBlock) <
          parseInt(this.dappIssueDetail.height) +
            parseInt(this.maxBlocksGridCreate)
        ) {
          this.$message.error("抢占期未结束不能开采");
          return;
        }
      }
      if (
        parseInt(currentBlock) >=
        parseInt(this.dappIssueDetail.height) +
          parseInt(this.maxBlocksGridCreate) +
          parseInt(this.maxBlocksGridDeposit)
      ) {
        this.$message.error("采矿期已过，无法继续开采");
        return;
      }
      if (this.dappIssueDetail.items.length <= 1) {
        this.$message.error("当前格子数不足，请等待其他人抢占");
        return;
      }
      const maxNum = parseInt(this.dappDetail.per_grid_max_deposits);
      const indexInfo = this.dappIssueDetail.items.filter(i => {
        return i.index == index;
      });
      if (!isEmpty(indexInfo[0].deposits)) {
        if (indexInfo[0].deposits.length >= maxNum) {
          this.$message.error("当前格子存款次数已达上限");
          return;
        }
      }
      if (
        this.GARDBalance.amount <
        parseInt(
          getViewToken(this.dappFees.deposit_fee, this.tokenMap).amount
        ) +
          1
      ) {
        this.$message.error("应用费不足");
        return;
      }
      // use math wallet
      if (!isEmpty(this.mathAccount)) {
        this.onSend(true);
        return;
      }
      // else use local wallet
      this.form.pass = "";
      this.form.amount = "";
      this.dialogVisible1 = true;
    },
    onSend: throttle(
      async function(useMathWallet) {
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
          pass: this.form.pass,
          gridId: this.$route.query.gridId,
          index: this.index
        };
        let res = "";
        try {
          res = await this.$store.dispatch("grid/dappDeposit", params);
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
              message: `质押成功！`,
              center: true,
              duration: 1000,
              onClose: () => {
                this.dialogVisible1 = false;
                this.getData();
              }
            });
          } else {
          }
          this.dialogVisible1 = false;
        } else {
          this.$message({
            type: "error",
            message: this.$t(`send.${res}`),
            center: true
          });
        }
        loading.close();
      },
      1500,
      { trailing: false }
    ),
    widthdraw() {
      if (
        this.GARDBalance.amount <
        parseInt(
          getViewToken(this.dappFees.withdraw_rewards_fee, this.tokenMap).amount
        ) +
          1
      ) {
        this.$message.error("应用费不足");
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
          gridId: this.$route.query.gridId
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
              message: `操作成功！`,
              center: true,
              duration: 1000,
              onClose: () => {
                this.dialogVisible = false;
                this.getData();
              }
            });
          } else {
          }
          this.dialogVisible1 = false;
        } else {
          this.$message({
            type: "error",
            message: this.$t(`send.${res}`),
            center: true
          });
        }
        loading.close();
      },
      1500,
      { trailing: false }
    ),
    goReward() {
      this.$router.push({
        path: `/dapp/rewards?dappId=${this.$route.query.dappId}&gridId=${this.$route.query.gridId}`
      });
    },
    getData() {
      this.$store.dispatch("grid/fetchDappIssueDetail", {
        dappId: this.$route.query.dappId,
        gridId: this.$route.query.gridId
      });
      this.$store.dispatch("grid/fetchDappDetail", {
        dappId: this.$route.query.dappId
      });
      this.$store.dispatch("account/fetchBalance");
      this.$store.dispatch("grid/fetchLastBlock");
      this.$store.dispatch("grid/fetchDappFees");
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
  background: #fff;
  padding: 20px;
  > .demo-item {
    width: 28%;
    display: inline-block;
    cursor: pointer;

    border-radius: 6px;
    // border: 1px solid #999;
    margin-bottom: 10px;
    vertical-align: middle;

    &:nth-child(3n-1) {
      margin: 0 8% 10px;
    }
    &:nth-child(7) {
      margin-bottom: 0;
    }
    &:nth-child(8) {
      margin-bottom: 0;
    }
    &:nth-child(9) {
      margin-bottom: 0;
    }
    .disabled {
      padding: 10px;
      filter: grayscale(1);
    }
    .disabled-no {
      padding: 10px;
      &:hover {
        transition: 0.2s ease-out;
        box-shadow: 0px 0px 10px 0.1px rosybrown;
      }
      .action {
        .btn {
          border: 1px solid #e6e6e6;
          &:hover {
            color: #fff;
            background: linear-gradient(90deg, #38b5c2 0%, #406096 100%);
            box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
    p {
      text-align: left;
    }
    .number {
      color: #444;
      font-size: 16px;
      padding-bottom: 10px;
      border-bottom: 1px dashed #f3f1ee;
    }
    .owner {
      color: #666;
      font-size: 14px;
      margin: 15px 0 15px;
    }
    .action {
      display: flex;
      justify-content: center;
      margin-top: 10px;
      .btn {
        width: 80%;
        height: 45px;
        font-size: 14px;
        text-align: center;
      }
    }
    img {
      width: 100%;
    }
    .img-div {
      position: relative;
      > .tag {
        position: absolute;
        top: 0;
        right: -5px;
        width: 26px;
      }
    }
  }
}
.bottom-btn-div {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
  .withdraw {
    height: 48px;
    font-size: 16px;
    color: #406096;
    background: #fff;
    box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.1);
    width: 200px;
    border: none;
    &:hover {
      color: #fff;
      background: linear-gradient(90deg, #38b5c2 0%, #406096 100%);
      box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.1);
    }
  }
}
.empty {
  color: #bfbfbf;
  text-align: center;
}
.ok-btn {
  width: 100%;
  background: $main-btn;
  color: #fff;
}
@include responsive($sm) {
  .page-container {
    padding: 16px;
  }
}
</style>
