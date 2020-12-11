<template>
  <div class="home-container" v-if="!isEmpty(dappList)">
    <div v-for="(i,index) in dappList" :key="index" class="lock-type">
      <div class="type-item" @click="enter(i.id)" v-if="i.id != '1000000'">
        <img class="type-img" :src="lockType[i.id].img" alt="">
        <p class="name">{{lockType[i.id].name}}</p>
        <div class="action">
          <el-button class="btn" v-if="i.id == '1000001' && status(i.id) == $t('Mine.MiningPeriod')" @click.stop="deposit(i.id)">投入</el-button>
          <el-button class="btn-disabled" v-if="i.id == '1000002' || i.id == '1000003' || status(i.id) == $t('Mine.OccupationPeriod')" disabled>暂未开放</el-button>
          <el-button class="btn" v-if="status(i.id) == $t('Mine.HarvestPeriod')" @click.stop="judgeWithdraw(i.id)">领取收益</el-button>
          <el-button class="btn" v-if="status(i.id) == $t('Mine.HarvestPeriod')" @click.stop="goReward(i.id)">历史记录</el-button>
          <el-button class="btn" v-if="status(i.id) == '锁定期'" disabled>资产锁定中</el-button>
        </div>
      </div>
    </div>
    <div class="lock-type">
      <div class="type-item" v-if="isEmpty(find(dappList, {id:'1000002'}))">
        <img class="type-img" :src="seasonPng" alt="">
        <p class="name">庄园（季）</p>
        <div class="action">
          <el-button class="btn-disabled" disabled>暂未开放</el-button>
        </div>
      </div>
      <div class="type-item" v-if="isEmpty(find(dappList, {id:'1000003'}))">
        <img class="type-img" :src="halfYearPng" alt="">
        <p class="name">城堡（半年）</p>
        <div class="action">
          <el-button class="btn-disabled" disabled>暂未开放</el-button>
        </div>
      </div>
    </div>
    <el-dialog
      title="投入"
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
          <p class="input-info">
            <span>{{$t("Mine.Investmentquota")}}: {{this.minDeposit.amount | formatNumber}}-{{this.maxDeposit.amount | formatNumber}}GGT</span>
          </p>
          <el-input
          type="number"
            v-model="form.amount"
            :placeholder="$t('Mine.Investmentamount')"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isEmpty(this.mathAccount)">
          <el-input
            type="password"
            v-model="form.pass"
            :placeholder="$t('create.pass')"
            @keyup.enter.native="onSendValidate('form')"
          ></el-input>
          <!-- <p>应用费: {{getViewToken(dappFees.deposit_fee, tokenMap).amount}}GARD</p> -->
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
      title="领取收益"
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
import {isEmpty,find,throttle} from "lodash";
import weekPng from "@/assets/week.png";
import seasonPng from "@/assets/season.png";
import halfYearPng from "@/assets/halfYear.png";
import { getViewToken, handleTxReturn } from "@/utils/helpers";
import BigNumber from "bignumber.js";
export default {
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
        callback(new Error(`Area: ${this.minDeposit.amount}-${this.maxDeposit.amount}`));
        return;
      }
      callback();
    };
    return {
      weekPng,
      seasonPng,
      halfYearPng,
      lockType:{
        "1000001":{
          name:'房屋（周）',
          img:weekPng
        },
        "1000002":{
          name:'庄园（季）',
          img:seasonPng
        },
        "1000003":{
          name:'城堡（半年）',
          img:halfYearPng
        }
      },
      gridId:1,
      dappId:"",
      dialogVisible1: false,
      form: {
        amount:"",
        pass:""
      },
      rules: {
        amount: [{ validator: validateAmount, trigger: "blur" }]
      },
      dialogVisible: false,
      pass: ""
    }
  },
  computed: {
    ...mapState("account", ["tokenMap", "balance", "mathAccount", "keyStore"]),
    ...mapState("lockDapp", ["dappList", "lastBlock","dappFirstIssue","dappFees"]),
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
      const dappDetail = find(this.dappList,{id:this.dappId}) || {};
      return getViewToken(dappDetail.member_min_deposit, this.tokenMap);
    },
    maxDeposit() {
      const dappDetail = find(this.dappList,{id:this.dappId}) || {};
      return getViewToken(dappDetail.max_per_deposit, this.tokenMap);
    },
    isDeposit() {
      return function(id) {
        const dappDetail = find(this.dappList,{id}) || {};
        const maxBlocksGridCreate = dappDetail.max_blocks_grid_create;
        const maxBlocksGridDeposit = dappDetail.max_blocks_grid_deposit;
        let startHeight;
        if (!isEmpty(this.dappFirstIssue[id])) {
          startHeight = this.dappFirstIssue[id].height;
        }
        const depositEnd = parseInt(maxBlocksGridCreate) + parseInt(startHeight) + parseInt(maxBlocksGridDeposit);
        if (parseInt(this.lastBlock) >= depositEnd) {
          return true
        } else {
          return false
        }
      }
    },
    status() {
      return function(id) {
        const dappDetail = find(this.dappList,{id}) || {};
        const maxBlocksGridCreate = dappDetail.max_blocks_grid_create;
        const maxBlocksGridDeposit = dappDetail.max_blocks_grid_deposit;
        const withdrawBlock = dappDetail.max_blocks_grid_rewards_withdraw;
        // 用户存款块时间
        const userDepositBlock = parseInt(parseInt(dappDetail.max_blocks_grid_deposit) / 2);
        let startHeight;
        if (!isEmpty(this.dappFirstIssue[id])) {
          startHeight = this.dappFirstIssue[id].height;
        }
        const creat_end =
          parseInt(maxBlocksGridCreate) + parseInt(startHeight);
        const deposit_end = parseInt(maxBlocksGridDeposit) + creat_end;
        if (parseInt(this.lastBlock) >= (deposit_end + parseInt(withdrawBlock))) {
          // 取收益
          return this.$t("Mine.HarvestPeriod");
        } else if (parseInt(this.lastBlock) <= creat_end) {
          // 抢占期
          return this.$t("Mine.OccupationPeriod");
        } else if ((parseInt(this.lastBlock) > creat_end) && (parseInt(this.lastBlock) < (creat_end + userDepositBlock))) {
          // 用户存款期
          return this.$t("Mine.MiningPeriod");
        } else if (
          (parseInt(this.lastBlock) > (creat_end + userDepositBlock)) && 
          (parseInt(this.lastBlock) < (deposit_end + parseInt(withdrawBlock)))
          ) {
            return "锁定期"
        }
      };
    }
  },
  methods: {
    isEmpty,
    find,
    enter(id){
      if (id == '1000001') {
        this.$router.push({path:`/lockDapp/detail?dappId=${id}`})
      }
    },
    goReward(id) {
      this.$router.push({
        path: `/dapp/rewards?dappId=${id}&gridId=1`
      });
    },
    async deposit(id) {
      this.dappId = id
      const dappDetail = find(this.dappList,{id}) || {};
      const maxBlocksGridCreate = dappDetail.max_blocks_grid_create;
      const maxBlocksGridDeposit = dappDetail.max_blocks_grid_deposit;
      const currentBlock = await this.$store.dispatch("lockDapp/fetchLastBlock");
      // 如果抢占期不能质押
      if (!dappDetail.grid_create_can_deposit) {
        if (
          parseInt(currentBlock) <
          parseInt(this.dappFirstIssue[id].height) +
            parseInt(maxBlocksGridCreate)
        ) {
          this.$message.error('存款期未到');
          return;
        }
      }
      if (
        parseInt(currentBlock) >=
        parseInt(this.dappFirstIssue[id].height) +
          parseInt(maxBlocksGridCreate) +
          parseInt(maxBlocksGridDeposit)
      ) {
        this.$message.error("存款期已过");
        return;
      }
      const maxNum = parseInt(dappDetail.per_grid_max_deposits);
      const indexInfo = this.dappFirstIssue[id].items.filter(i => {
        return i.index == 0;
      });
      if (!isEmpty(indexInfo[0].deposits)) {
        if (indexInfo[0].deposits.length >= maxNum) {
          this.$message.error(this.$t("Mine.maximumlimit"));
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
        this.$message.error(this.$t("Mine.feeNo"));
        return;
      }
      this.form.pass = "";
      this.form.amount = "";
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
    async onSend (useMathWallet) {
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
        dappId: this.dappId,
        denom: "uggt",
        amount: BigNumber(this.form.amount)
          .times(BigNumber(10).pow(6))
          .toFixed(),
        pass: this.form.pass,
        gridId: "1",
        index: "0"
      };
      let res = "";
      try {
        res = await this.$store.dispatch("lockDapp/dappDeposit", params);
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
            message:"您的资产已成功存入",
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
    // 判断领取收益操作
    async judgeWithdraw(id) {
      this.dappId = id
      const issueDetail = this.dappFirstIssue[id];
      const depositStatus = await this.judgeDeposits(issueDetail)
      const acceptStatus = await this.judgeAccept(issueDetail)
      // 有存款，未领取收益
      if (depositStatus && !acceptStatus) {
        this.widthdraw(issueDetail.id)
        return
      }
      // 有存款，已领取收益
      if (depositStatus && acceptStatus) {
        this.$message.error("您已经领取过收益")
        return
      }
      const ownerGrid = issueDetail.items.filter(i=> {
        return i.owner == this.keyStore.address
      })
      // 是owner
      if (ownerGrid.length > 0) {
        // 没存款，已领取收益
        if (!depositStatus && acceptStatus) {
          this.$message.error("您已经领取过收益")
          return
        }
        // 没存款，未领取收益
        if (!depositStatus && !acceptStatus) {
          this.widthdraw(issueDetail.id)
          return
        }
      }
      // 不是owner
      else {
        // 没存款
        if (!depositStatus) {
          this.$message.error('您未锁定资产')
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
          dappId: this.dappId,
          pass: this.pass,
          gridId: this.gridId
        };
        let res = "";
        try {
          res = await this.$store.dispatch("lockDapp/dappWithdraw", params);
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
              message: "领取收益",
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
    ),
    async getData() {
      await this.$store.dispatch("lockDapp/fetchLastBlock");
      this.$store.dispatch("lockDapp/fetchDappList");
      this.$store.dispatch("account/fetchBalance");
      this.$store.dispatch("lockDapp/fetchDappFees");
    }
  },
  mounted() {
    this.getData()
  }
}
</script>
<style lang="scss" scoped>
.home-container {
  max-width: 970px;
  font-family: PingFangSC-Medium, PingFang SC;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  >.lock-type {
    margin-bottom: 50px;
    >.type-item {
      cursor: pointer;
      >.type-img {
        width: 240px;
        height: 330px;
      }
      >.name {
        text-align: center;
        height: 28px;
        font-size: 20px;
        font-weight: 500;
        color: #fff;
        line-height: 28px;
        margin-top: 20px;
      }
      >.action {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 34px;
        >.btn {
          border:none;
          width: 100px;
          height: 40px;
          background: #fff;
          box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.1);
          border-radius: 2px;
          color:#38B5C2;
          &:hover {
            background: linear-gradient(90deg, #38B5C2 0%, #406096 100%);
            color: #fff;
          }
        }
        >.btn-disabled {
          border:none;
          width: 100px;
          height: 40px;
          background: #fff;
          box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.1);
          border-radius: 2px;
          color: #B6B6B6;
        }
      }
    }
  }
}
@include responsive($sm) {
  .home-container {
    display: block;
    >.lock-type {
      text-align: center;
    }
  }
}
.ok-btn {
  border: none;
  background-color: $main-btn !important;
  color: #fff;
  height: 48px;
}
</style>