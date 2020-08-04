<template>
  <s-card :title="$t('migrate.title')">
    <p
      style="text-align:right;padding: 15px 0;color:#330867;cursor:pointer;"
      @click="goDoc"
    >{{$t("migrate.doc")}}</p>
    <span style="display:block;padding-top:15px;">{{$t('migrate.enterArea')}}</span>
    <el-form
      :model="txForm"
      ref="txForm"
      :rules="txFormRules"
      style="margin-top: 15px;"
    >
      <el-form-item prop="ethTxHash">
        <el-input
          :placeholder="$t('migrate.ethTxHash')"
          v-model="txForm.ethTxHash"
        ></el-input>
      </el-form-item>
      <el-form-item prop="erc20TxHash">
        <el-input
          :placeholder="$t('migrate.erc20TxHash')"
          v-model="txForm.erc20TxHash"
        ></el-input>
      </el-form-item>
    </el-form>
    <span>{{$t('migrate.calibrationArea')}}</span>
    <el-form style="margin-top: 15px;">
      <el-form-item>
        <el-input
          :placeholder="$t('migrate.erc20Address')"
          :value="migrateForm.erc20Address"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          :placeholder="$t('migrate.gardADdress')"
          :value="migrateForm.gardAddress"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          :placeholder="$t('migrate.amount')"
          :value="migrateForm.amount"
          disabled
        ></el-input>
      </el-form-item>
      <p style="padding-bottom:15px;">
        <span>{{amountInfo}}</span>
        <span v-if="isRewards"> ,{{rewardInfo}}</span>
      </p>
      <el-button
        class="ok-btn"
        @click="migrate"
      >{{$t('migrate.exchange')}}</el-button>
    </el-form>
  </s-card>
</template>
<script>
import axios from "axios";
import { handleTxReturn } from "@/utils/helpers.js";
import BigNumber from "bignumber.js";
import { throttle } from "lodash";
export default {
  data() {
    return {
      amount: 0,
      reward: 0,
      isRewards: false,
      txForm: {
        erc20TxHash: "",
        ethTxHash: ""
      },
      migrateForm: {
        erc20TxHash: "",
        ethTxHash: "",
        erc20Address: "",
        gardAddress: "",
        amount: ""
      }
    };
  },
  computed: {
    amountInfo() {
      return this.$t("migrate.correspondingExchangeTo", {
        name: this.amount
      });
    },
    rewardInfo() {
      return this.$t("migrate.reward", {
        name: this.reward
      });
    },
    txFormRules() {
      const validatorErc20To0xTx = (rule, value, callback) => {
        const txPattern = /^[0-9a-f]{64}$/;
        if (value.substr(0, 2) != "0x" || !txPattern.test(value.slice(2))) {
          callback(new Error(this.$t("migrate.txhashValidator")));
          return;
        }
        if (
          value ==
            "0x89800d4e31b2bd114aad023bdd2022120a174d54315491289bdaa897ec8980a1" ||
          value ==
            "0xac7243acb787b59898f3772a48f37f976070979b63c5eedf2a985ed31449283e"
        ) {
          callback(new Error(this.$t("migrate.txhashValidator")));
          return;
        }
        callback();
      };
      const validatorEtcTo0xTx = (rule, value, callback) => {
        const txPattern = /^[0-9a-f]{64}$/;
        if (value.substr(0, 2) != "0x" || !txPattern.test(value.slice(2))) {
          callback(new Error(this.$t("migrate.txhashValidator")));
          return;
        }
        callback();
      };
      const rules = {
        erc20TxHash: [
          {
            validator: validatorErc20To0xTx,
            trigger: "blur"
          }
        ],
        ethTxHash: [
          {
            validator: validatorEtcTo0xTx,
            trigger: "blur"
          }
        ]
      };
      return rules;
    }
  },
  watch: {
    txForm: {
      handler(newValue, oldValue) {
        const txPattern = /^[0-9a-f]{64}$/;
        if (
          newValue.erc20TxHash.substr(0, 2) == "0x" &&
          txPattern.test(newValue.erc20TxHash.slice(2)) &&
          newValue.ethTxHash.substr(0, 2) == "0x" &&
          txPattern.test(newValue.ethTxHash.slice(2)) &&
          newValue.erc20TxHash !=
            "0x89800d4e31b2bd114aad023bdd2022120a174d54315491289bdaa897ec8980a1" &&
          newValue.erc20TxHash !=
            "0xac7243acb787b59898f3772a48f37f976070979b63c5eedf2a985ed31449283e"
        ) {
          this.fetchTxInfo();
        } else {
          this.amount = 0;
          this.migrateForm.erc20TxHash = "";
          this.migrateForm.ethTxHash = "";
          this.migrateForm.erc20Address = "";
          this.migrateForm.gardAddress = "";
          this.migrateForm.amount = "";
        }
      },
      deep: true
    }
  },
  methods: {
    goDoc() {
      const lang =
        localStorage.getItem("lang") ||
        window.navigator.language ||
        window.navigator.userLanguage;
      if (lang.match("zh")) {
        window.open("https://mp.weixin.qq.com/s/1ankeLIGNYNp9GPwhqv7WQ");
      } else {
        window.open(
          "https://medium.com/@hashgard/how-to-convert-erc-20-gard-to-mainnet-gard-5e1b9f7229e5"
        );
      }
    },
    async fetchTxInfo() {
      axios
        .get(
          `https://rest.hashgard.com/migrate/api/v1/info?erc20TxHash=${this.txForm.erc20TxHash}&ethTxHash=${this.txForm.ethTxHash}`
        )
        .then(async res => {
          this.amount = BigNumber(res.data.data.gardAmount)
            .dividedBy(Math.pow(10, 6))
            .toString();
          this.migrateForm.erc20TxHash = res.data.data.erc20TxHash;
          this.migrateForm.ethTxHash = res.data.data.ethTxhash;
          this.migrateForm.erc20Address = res.data.data.erc20Address;
          this.migrateForm.gardAddress = res.data.data.gardAddress;
          this.migrateForm.amount = res.data.data.erc20Amount;
          const rewardsPool = await this.$store.dispatch(
            "account/fetchRewardsPool"
          );
          if (!rewardsPool.result || rewardsPool.result.length == 0) {
            this.isRewards = false;
          } else {
            const pool = BigNumber(rewardsPool.result[0].amount)
              .dividedBy(Math.pow(10, 6))
              .toString();
            const reward = parseFloat(this.amount / 10);
            if (parseFloat(pool) >= reward) {
              this.isRewards = true;
              this.reward = reward;
            } else {
              this.isRewards = false;
            }
          }
        })
        .catch(error => {
          this.$message.error(this.$t("send.netError"));
        });
    },
    migrate: throttle(
      function() {
        if (
          this.migrateForm.erc20Address == "" ||
          this.migrateForm.gardAddress == "" ||
          this.migrateForm.amount == ""
        ) {
          this.$message.error(this.$t("migrate.read"));
          return;
        }
        axios
          .post("https://rest.hashgard.com/migrate/api/v1/exchange", {
            ...this.migrateForm,
            channel: this.$route.query.channel || ""
          })
          .then(async res => {
            if (res.data.data) {
              const txStatus = await handleTxReturn(res.data.data);
              if (txStatus) {
                this.isShow = false;
                this.$message({
                  type: "success",
                  message: this.$t("global.success", {
                    name: this.$t("migrate.exchange")
                  }),
                  center: true,
                  duration: 1000,
                  onClose: () => {
                    this.txForm.erc20TxHash = "";
                    this.txForm.ethTxHash = "";
                    this.amount = 0;
                    this.migrateForm.erc20TxHash = "";
                    this.migrateForm.ethTxHash = "";
                    this.migrateForm.erc20Address = "";
                    this.migrateForm.gardAddress = "";
                    this.migrateForm.amount = "";
                    window.open(
                      `https://explorer.hashgard.com/#/tx/${res.data.data.txhash}`
                    );
                  }
                });
              } else {
              }
            } else {
              if (res.data.msg) {
                this.$message.error(res.data.msg);
              } else {
                this.$message.error(this.$t("send.netError"));
              }
            }
          })
          .catch(error => {
            this.$message.error(this.$t("send.netError"));
          });
      },
      1500,
      { trailing: false }
    )
  }
};
</script>
<style lang="scss" scoped>
.ok-btn {
  background-color: $main-btn !important;
  color: #fff;
  width: 100%;
  height: 48px;
}
</style>