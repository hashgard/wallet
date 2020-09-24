<template>
  <div
    class="vote-detail"
    v-if="!isEmpty(detailData)"
  >
    <p class="title">{{get(detailData, 'content.value.title') || ''}}</p>
    <div class="content">
      <div class="content-top">
        <span>ID: <span
            class="detail-info"
            style="color: #330867;font-weight:bolder;cursor:pointer;"
            @click="goExplorer(detailData.id)"
          >{{detailData.id}}</span></span>
      </div>
      <div class="status">{{$t("lockInput.status")}}: <span class="detail-info">{{getStatus}}</span></div>
      <div class="status">{{$t("vote.type")}}: <span class="detail-info">{{contentType(detailData.content.type)}}</span></div>
      <div class="submit-time">{{$t("lockInput.creatTime")}}: <span class="detail-info">{{detailData.submit_time | formatTime}}</span></div>
      <div class="submit-time">{{$t("vote.depositEndTime")}}: <span class="detail-info">{{detailData.deposit_end_time | formatTime}}</span></div>
      <div class="deposit">{{$t("vote.totalDeposit")}}: <span class="detail-info">{{totalDeposit.amount}} {{totalDeposit.denom}}</span></div>
      <div
        class="status"
        v-if="contentType(detailData.content.type) == 'StakeIssueLockedSpendProposal'"
      >{{$t("vote.proDenom")}}: {{handleDenom(get(detailData, "content.value.denom"))}}</div>
      <div
        class="status"
        v-if="contentType(detailData.content.type) == 'StakeIssueLockedSpendProposal'"
      >{{$t("vote.proAmount")}}: <data-amount :list="get(detailData,'content.value.amount')"></data-amount>
      </div>
      <div
        class="status"
        v-if="contentType(detailData.content.type) == 'StakeIssueLockedSpendProposal'"
      >{{$t("vote.proRecipient")}}: {{get(detailData,"content.value.recipient")}}</div>
      <div
        class="changes"
        v-if="get(detailData, 'content.value.changes')"
      >
        <p>{{$t("vote.parameter")}}:</p>
        <div
          v-for="(item, index) in get(detailData, 'content.value.changes')"
          :key="index"
          class="params"
        >
          <span>{{index}}. {{item.subspace}}/{{item.key}}</span>
          <span>{{$t("vote.adjusted")}}: {{item.value}}</span>
        </div>
      </div>

      <div class="des">
        <p>{{$t("vote.des")}}:</p>
        <p class="des-info">{{get(detailData, "content.value.description") || ""}}</p>
      </div>
      <div
        class="click-option"
        v-if="detailData.proposal_status === 'VotingPeriod'"
      >
        <el-button
          class="btn"
          v-for="(item,index) in options"
          :key="index"
          @click="clickOption(item.val)"
        >{{item.label}}</el-button>
      </div>
    </div>
    <div
      v-if="detailData.proposal_status === 'DepositPeriod'"
      class="content"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
      >
        <el-form-item prop="amount">
          <el-progress
            style="width: 100%;"
            :percentage="depositPercent"
            color="#330867"
          ></el-progress>
          <p>
            <span><span>{{$t("vote.needMortgage")}}</span><span> {{needDeposit}} GARD </span><span>{{$t("vote.activation")}}</span></span>
            <span></span>
          </p>
          <el-input v-model.number.trim="form.amount"></el-input>
          <p class="balance">
            <!-- <span>{{$t("send.fee")}}: 100GARD</span> -->
            <span v-if="!isEmpty(gardBalance)">{{$t("send.balance")}}: {{gardBalance.amount | formatNumber}}{{gardBalance.denom}}</span>
          </p>
        </el-form-item>
        <el-form-item>
          <el-button
            round
            class="ok-btn"
            @click="onSubmit('form')"
          >{{$t("vote.mortgage")}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 投票结果 -->
    <div class="content">
      <div
        class="voting-time"
        v-if="detailData.proposal_status === 'VotingPeriod'"
      >
        <p class="title"><span style="color: #000;">{{$t("vote.distanceTime")}}</span> <span>{{countTimeData}}</span></p>
      </div>
      <div class="status">{{$t("vote.voteStartTime")}}: <span class="detail-info">{{detailData.voting_start_time | formatTime}}</span></div>
      <div class="status">{{$t("vote.voteEndTime")}}: <span class="detail-info">{{detailData.voting_end_time | formatTime}}</span></div>
      <div
        class="status"
        style="color: green;"
      >{{$t("vote.yes")}}: <span
          class="detail-info"
          style="color: green;"
        >{{detailData.final_tally_result.yes}}</span></div>
      <div
        class="status"
        style="color: orange;"
      >{{$t("vote.no")}}: <span
          class="detail-info"
          style="color: orange;"
        ></span>{{detailData.final_tally_result.no}}</div>
      <div
        class="status"
        style="color: red;"
      >{{$t("vote.noWithVeto")}}: <span
          class="detail-info"
          style="color: red;"
        >{{detailData.final_tally_result.no_with_veto}}</span></div>
      <div class="status">{{$t("vote.abstain")}}: <span class="detail-info">{{detailData.final_tally_result.abstain}}</span></div>
      <div
        class="status"
        v-if="detailData.proposal_status === 'VotingPeriod'"
      >{{$t("vote.myVote")}}: <span v-if="!isEmpty(addressVotes)">{{addressVotes.option}}</span>
        <span v-else>{{$t("vote.null")}}</span>
      </div>
    </div>
    <!-- 投票列表 -->
    <!-- <div class="vote-list">
      <div class="table-header && nav">
        <div class="address">{{$t("vote.voter")}}</div>
        <div class="option">{{$t("vote.voteOption")}}</div>
      </div>
      <div
        class="table-header && hover"
        v-for="(item,index) in votes"
        :key="index"
      >
        <div class="address">
          <span
            v-if="isValidator(item.voter) != ''"
            @click="goValidator(isValidator(item.voter).address)"
          >{{isValidator(item.voter).name}}</span>
          <span v-else>{{item.voter}}</span>
        </div>
        <div class="option">{{item.option}}</div>
      </div>
      <div
        class="table-header"
        v-if="votes && votes.length == 0"
      >{{$t("global.null2")}}</div>
    </div> -->
    <el-dialog
      :title="$t('create.pass')"
      :visible.sync="dialogVisible"
      width="360px"
    >
      <el-input
        type="password"
        v-model="form.pass"
        :placeholder="$t('create.pass')"
        @keyup.enter.native="handle(false)"
      ></el-input>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="handle(false)"
          class="dia-ok-btn"
        >{{$t('global.ok')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { isEmpty, get } from "lodash";
import { getViewToken, handleTxReturn } from "@/utils/helpers";
import BigNumber from "bignumber.js";
import axios from "axios";
import { baseURL } from "@/constants";
export default {
  name: "voteDetail",
  data() {
    return {
      type: null,
      dialogVisible: false,
      form: {
        amount: null,
        pass: null
      },
      voted: "",
      countTimeData: "",
      addressVotes: {}
    };
  },
  computed: {
    ...mapState("gov", ["proposalMap", "votes", "minDeposit", "validators"]),
    ...mapState("account", ["balance", "tokenMap", "mathAccount", "keyStore"]),
    handleDenom() {
      return function(val) {
        return val.slice(1).toUpperCase();
      };
    },
    options() {
      return [
        { label: this.$t("vote.yes"), val: "yes" },
        { label: this.$t("vote.no"), val: "no" },
        { label: this.$t("vote.noWithVeto"), val: "no_with_veto" },
        { label: this.$t("vote.abstain"), val: "abstain" }
      ];
    },
    rules() {
      const validatorNumber = (rule, value, callback) => {
        if (!Number.isInteger(value) || value <= 0) {
          callback(new Error(this.$t("deposit.PositiveNumber")));
          return;
        }
        callback();
      };
      const rules = {
        amount: [
          {
            validator: validatorNumber,
            trigger: "blur"
          }
        ]
      };
      return rules;
    },
    detailData() {
      return this.proposalMap[this.$route.params.id];
    },
    gardBalance() {
      if (!isEmpty(this.balance)) {
        let token = this.balance.filter(i => {
          return i.denom === "ugard";
        });
        return getViewToken(token[0], this.tokenMap);
      } else {
        return { denom: "GARD", amount: 0 };
      }
    },
    totalDeposit() {
      const token = get(this.detailData, "total_deposit");
      return getViewToken(token[0], this.tokenMap) || {};
    },
    minAmount() {
      let token;
      if (!isEmpty(this.minDeposit)) {
        token = get(this.minDeposit, "min_deposit");
        return getViewToken(token[0], this.tokenMap) || {};
      }
    },
    needDeposit() {
      if (!isEmpty(this.totalDeposit) && !isEmpty(this.minAmount)) {
        if (
          parseInt(this.totalDeposit.amount) >= parseInt(this.minAmount.amount)
        ) {
          return 0;
        } else {
          return (
            parseInt(this.minAmount.amount) - parseInt(this.totalDeposit.amount)
          );
        }
      }
    },
    depositPercent() {
      if (!isEmpty(this.totalDeposit) && !isEmpty(this.minAmount)) {
        return (
          (parseInt(this.totalDeposit.amount) /
            parseInt(this.minAmount.amount)) *
          100
        );
      }
    },
    totalDeposit() {
      return getViewToken(this.detailData.total_deposit[0], this.tokenMap);
    },
    getStatus() {
      switch (this.detailData.proposal_status) {
        case "DepositPeriod":
          return this.$t("deposit.toBeActivated");
          break;
        case "VotingPeriod":
          return this.$t("vote.voting");
          break;
        case "Passed":
          return this.$t("vote.passed");
          break;
        case "Rejected":
          return this.$t("vote.reject");
          break;
      }
    },
    isValidator() {
      return function(address) {
        const result = this.validators.filter(i => {
          return i.owner == address;
        });
        if (result.length > 0) {
          return result[0];
        } else {
          return "";
        }
      };
    }
  },
  methods: {
    isEmpty,
    get,
    goExplorer(id) {
      window.open(`https://explorer.hashgard.com/#/proposal/${id}`);
    },
    clickOption(val) {
      this.voted = val;
      this.type = false;
      this.dialogVisible = true;
      this.form.pass = "";
    },
    contentType(val) {
      return val.split("/")[1];
    },
    addZero(i) {
      return i < 10 ? "0" + i : i + "";
    },
    countTime() {
      var nowtime = new Date();
      var endtime = new Date(this.detailData.voting_end_time);
      var lefttime = parseInt((endtime.getTime() - nowtime.getTime()) / 1000);
      var d = parseInt(lefttime / (24 * 60 * 60));
      var h = parseInt((lefttime / (60 * 60)) % 24);
      var m = parseInt((lefttime / 60) % 60);
      var s = parseInt(lefttime % 60);
      d = d < 10 ? "0" + d : d + "";
      h = h < 10 ? "0" + h : h + "";
      m = m < 10 ? "0" + m : m + "";
      s = s < 10 ? "0" + s : s + "";
      if (lefttime <= 0) {
        window.location.reload();
        return;
      }
      this.countTimeData = `${d}${this.$t("vote.d")} ${h} ${this.$t(
        "vote.h"
      )} ${m} ${this.$t("vote.m")} ${s} ${this.$t("vote.s")}`;
      setTimeout(this.countTime, 1000);
    },
    getSeconds() {},
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.type = true;
          // use math wallet
          if (!isEmpty(this.mathAccount)) {
            this.handle(true);
            return;
          }
          // else use local wallet
          this.form.pass = "";
          this.dialogVisible = true;
        } else {
          return false;
        }
      });
    },
    handle: async function(useMathWallet) {
      if (!useMathWallet && !this.form.pass) {
        this.$message({
          type: "error",
          message: this.$t("global.required", { name: this.$t("create.pass") }),
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
      let params;
      if (this.type) {
        params = { ...this.form };
        params.id = this.$route.params.id;
        params.denom = get(this.detailData, "total_deposit.0.denom");
        let decimals;
        if (params.denom === "ugard") {
          decimals = 6;
        } else {
          decimals = this.tokenMap[params.denom].decimals;
        }
        params.amount = BigNumber(params.amount)
          .times(BigNumber(10).pow(decimals))
          .toFixed();
      } else {
        let option;
        switch (this.voted) {
          case "yes":
            option = "Yes";
            break;
          case "abstain":
            option = "Abstain";
            break;
          case "no":
            option = "No";
            break;
          case "no_with_veto":
            option = "NoWithVeto";
            break;
        }
        params = {
          pass: this.form.pass,
          id: this.$route.params.id,
          option
        };
      }
      let res = "";
      try {
        const action = this.type ? "gov/deposit" : "gov/vote";
        res = await this.$store.dispatch(action, params);
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
          this.dialogVisible = false;
          this.$message({
            type: "success",
            message: this.$t("global.success", {
              name: this.type ? this.$t("vote.mortgage") : this.$t("vote.vote")
            }),
            center: true,
            duration: 1500,
            onClose: () => {
              window.location.reload();
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
    }
  },
  async mounted() {
    await this.$store.dispatch("gov/list", {});
    await this.$store.dispatch("gov/fetchValidators");
    if (
      !isEmpty(this.detailData) &&
      this.detailData.proposal_status === "VotingPeriod"
    ) {
      this.countTime();
      axios
        .get(
          `${baseURL}/gov/proposals/${this.$route.params.id}/votes/${this.keyStore.address}`
        )
        .then(res => {
          this.addressVotes = res.data.result;
        })
        .catch(error => {
          this.addressVotes = {};
        });
    }
    this.$store.dispatch("account/fetchBalance");
    // this.$store.dispatch("gov/fetchVotes", this.$route.params.id);
    this.$store.dispatch("gov/fetchMinDeposit");
  }
};
</script>
<style lang="scss" scoped>
.vote-detail {
  color: #000;
  margin-top: 20px;
  .voting-time {
    padding: $padding-basic;
    background: #fff;
    border-radius: 6px;
    color: #000;
    .time {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-progress {
        flex-basis: 60%;
      }
      /deep/.el-progress__text {
        display: none;
      }
      /deep/.el-progress-bar {
        padding-right: 0;
      }
    }
  }
  .title {
    text-align: center;
    font-size: 24px;
    color: #fff;
    span {
      color: red;
    }
  }
  .content {
    padding: $padding-basic;
    background: #fff;
    border-radius: 6px;
    margin-top: 20px;
    > .content-top {
      margin-top: 15px;
    }
    > .status {
      margin-top: 20px;
    }
    > .deposit {
      margin-top: 20px;
    }
    > .des {
      margin-top: 20px;
      color: rgba(0, 0, 0, 1);
      .des-info {
        word-break: break-all;
      }
    }
    > .changes {
      margin-top: 20px;
      .params {
        color: rgba(0, 0, 0, 0.7);
        span {
          margin-right: 15px;
        }
      }
    }
    > .submit-time {
      margin-top: 20px;
    }
    .detail-info {
      color: rgba(0, 0, 0, 0.7);
    }
    .click-option {
      margin-top: 10px;
      > .btn {
        background: $main-btn;
        color: #fff;
      }
    }
  }
  .form-content {
    margin: 60px auto 0;
    border-radius: 4px;
    max-width: 470px;
    color: rgba(0, 0, 0, 0.8);
    /deep/.el-progress__text {
      display: none;
    }
    /deep/.el-progress-bar {
      padding-right: 0;
    }
  }
  .vote-list {
    margin-top: 20px;
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
      &.nav {
        font-weight: bolder;
      }
      &.hover {
        &:hover {
          cursor: pointer;
          background-color: rgba(230, 230, 230, 1);
        }
      }
      > div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-indent: 1em;
      }
      > .address {
        flex-basis: 70%;
      }
      > .option {
        flex-basis: 30%;
      }
    }
  }
  .balance {
    display: flex;
    justify-content: space-between;
  }
  .ok-btn {
    background-color: $main-btn;
    border-color: transparent;
    color: #fff;
    width: 100%;
    height: 48px;
    margin-top: 10px;
  }
}
.dialog-footer {
  .dia-ok-btn {
    background-color: $main-btn;
    color: #fff;
  }
}
@include responsive($sm) {
  .vote-detail {
    .vote-content {
      .table-header {
        .radio {
          flex-basis: 20%;
        }
      }
    }
    .voting-time {
      .time {
        flex-direction: column;
        /deep/ .el-progress {
          width: 100% !important;
        }
      }
    }
  }
}
</style>