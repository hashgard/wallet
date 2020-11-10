<template>
  <div class="balance-container">
    <div>
      <div class="table-header table-header-nav">
        <div class="header-id">Issue ID</div>
        <div class="header-denom">Begin Height</div>
        <div class="header-amount">Status</div>
        <div class="header-action">Action</div>
      </div>
      <div
        class="table-header table-header-hover"
        v-for="(item, index) in dappIssueList"
        :key="index"
      >
        <div class="header-id">{{item.id}}</div>
        <div class="header-denom">{{item.height}}</div>
        <div class="header-amount"></div>
        <div class="header-action">
          <el-button
            v-if="pageWidth > 414"
            size="small"
            @click="goIssue(item.id)"
          >进 入</el-button>
          <el-button
            v-else
            size="small"
            @click="goIssue(item.id)"
          >→</el-button>
        </div>
      </div>
      <div
        class="table-header"
        v-if="dappIssueList.length == 0"
      >{{$t("global.null2")}}</div>
    </div>
    <div class="action-div">
      <el-button class="ok-btn">How to play</el-button>
      <el-button
        class="ok-btn"
        @click="buy"
      >Buy</el-button>
    </div>
    <!-- buy -->
    <el-dialog
      title="Please buy a mine"
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
          <el-input
            :value="form.amount"
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
          <p>手续费: 1GARD</p>
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
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getViewToken, handleTxReturn } from "@/utils/helpers";
import BigNumber from "bignumber.js";
import { get, isEmpty, throttle, findLast } from "lodash";
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
      dialogVisible1: false
    };
  },
  computed: {
    ...mapState("account", ["tokenMap", "balance", "mathAccount"]),
    ...mapState("grid", ["dappIssueList", "dappDetail"]),
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
    }
  },
  mounted() {
    this.$store.dispatch("grid/fetchDappIssueList", {
      dappId: this.$route.query.dappId
    });
    this.$store.dispatch("grid/fetchDappDetail", {
      dappId: this.$route.query.dappId
    });
    this.$store.dispatch("account/fetchBalance");
  },
  methods: {
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
    buy() {
      const ggt = getViewToken(
        this.dappDetail.owner_min_deposit,
        this.tokenMap
      );
      this.form.amount = ggt.amount;
      if (this.GARDBalance.amount < 1) {
        this.$message.error("手续费不足");
        return;
      }
      // use math wallet
      if (!isEmpty(this.mathAccount)) {
        this.onSend(true);
        return;
      }
      // else use local wallet
      this.form.pass = "";
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
              message: `恭喜你成功抢占第${grid.value}期的一个格子`,
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
            center: true
          });
        }
        loading.close();
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
    }
    > .header-id {
      flex-basis: 10%;
    }
    > .header-denom {
      flex-basis: 20%;
    }
    > .header-amount {
      flex-basis: 35%;
    }
    > .header-freeze {
      flex-basis: 35%;
    }
    > .header-action {
      flex-basis: 10%;
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
.input-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  span:last-child {
    color: blue;
    cursor: pointer;
  }
}
</style>

