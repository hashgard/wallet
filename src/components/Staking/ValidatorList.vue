<template>
  <div class="va-container">
    <s-card :title="$t('staking.validators')">
      <div
        v-for="(v, i) in validators"
        :key="i"
        class="item"
      >
        <div class="info">
          <h3>{{ i + 1 }}. {{ get(v, 'description.moniker') }} <span :class="v.jailed ? 'jailed' : ''">{{ v.jailed ? 'Jailed' : 'Active' }}</span></h3>

        </div>
        <div class="info">
          <h3>{{ getViewToken({denom: 'ugard', amount: v.tokens}).amount | formatNumber }} <span>{{ $t('staking.tokens') }}</span></h3>
        </div>
        <div
          class="info"
          v-if="get(v, 'description.details')"
        >
          <p class="details">{{get(v, 'description.details')}}</p>
        </div>
        <div class="info info-flex">
          <p>{{ $t('staking.commission') }}: {{ numeral(get(v, 'commission.commission_rates.rate')).format('(0.[00]%)') }} / {{ $t('staking.max') }}: {{ numeral(get(v, 'commission.commission_rates.max_rate')).format('(0.[00]%)') }}</p>
          <p
            class="btn"
            @click="() => onSelect(v)"
          >{{$t("main.delegate")}}</p>
        </div>

        <el-collapse
          accordion
          v-if="!isEmpty(issueList(v.operator_address))"
        >
          <el-collapse-item>
            <template slot="title">
              <span>{{$t("validator.coinInfo")}}</span>
            </template>
            <el-collapse accordion>
              <el-collapse-item
                v-for="(item,index) in validatorIssue[v.operator_address]"
                :key="index"
              >
                <template slot="title">
                  <span>{{handleDenom(item.denom)}}</span>
                </template>
                <div>
                  <s-item :label="$t('validator.coinType')">{{handleDenom(item.denom) || "-"}}</s-item>
                  <s-item :label="$t('validator.totalAmount')">{{handleAmount(item.total_supply) || "-"}}</s-item>
                  <s-item :label="$t('validator.preMintAddress')">{{item.pre_mint_address || "-"}}</s-item>
                  <s-item :label="$t('validator.preMintAmount')">{{handleAmount(item.pre_mint_amount) || "-"}}</s-item>
                  <s-item :label="$t('validator.website')">{{item.description.website || "-"}}</s-item>
                  <s-item :label="$t('validator.icon')">{{item.description.icon || "-"}}<img
                      v-if="item.description.icon"
                      class="icon"
                      :src="item.description.icon"
                    /></s-item>
                  <s-item :label="$t('validator.describe')">{{item.description.details || "-"}}</s-item>
                  <s-item :label="$t('validator.zeroBlockHeight')">{{item.genesis_height || "-"}}</s-item>
                  <el-table :data="item.per_block_mint">
                    <el-table-column
                      :label="$t('validator.startHeight')"
                      prop="start_height"
                      width="80"
                    >
                    </el-table-column>
                    <el-table-column
                      :label="$t('validator.proposerNodeAmount')"
                      prop="proposer_node_amount"
                    >
                      <template slot-scope="scope">
                        <span>{{handleAmount(scope.row.proposer_node_amount)}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="$t('validator.voterNodeAmount')"
                      prop="voter_node_amount"
                    >
                      <template slot-scope="scope">
                        <span>{{handleAmount(scope.row.voter_node_amount)}}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <s-item :label="$t('lockInput.period')">{{item.rule.lock_period_height || "-"}}</s-item>
                  <s-item :label="$t('validator.minSelfDelegation')">{{handleAmount(item.rule.min_self_delegation) || "-"}}</s-item>
                  <s-item :label="$t('lockInput.title')"></s-item>
                  <el-table :data="item.rule.lock_coins">
                    <el-table-column :label="$t('lockInput.lockCurrency')">
                      <template slot-scope="scope">
                        <span>{{handleDenom(scope.row.denom)}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('lockInput.lockNumber')">
                      <template slot-scope="scope">
                        <span>{{handleAmount(scope.row.amount)}}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-collapse-item>
            </el-collapse>

          </el-collapse-item>
        </el-collapse>
      </div>
    </s-card>
  </div>

</template>

<script>
import { mapState, mapGetters } from "vuex";
import numeral from "numeral";
import BigNumber from "bignumber.js";
import { get, isEmpty } from "lodash";
import { getViewToken } from "@/utils/helpers";

export default {
  name: "ValidatorList",
  data() {
    return {
      detail: [
        {
          owner: "gard1rns8r0rzs629avtajcttkydjhcfy3n7na0cjge",
          val: "gardvaloper1rns8r0rzs629avtajcttkydjhcfy3n7n0d46c5",
          denom: "uexp",
          total_supply: "100000000000000",
          pre_mint_address: "gard1cam9w4pk8g2mdl7hakwlmyctj2xhjp282aa55p",
          pre_mint_amount: "0",
          genesis_height: "600000",
          per_block_mint: [
            {
              start_height: "600000",
              proposer_node_amount: "0",
              voter_node_amount: "0"
            },
            {
              start_height: "820000",
              proposer_node_amount: "0",
              voter_node_amount: "0"
            }
          ],
          locked_addr: "gard1dwxudejz3cgskrg8zcfm8yn5u946p6pwq8cx4u",
          description: {
            whole_name: "Experience",
            website: "https://www.exp.top/",
            icon: "https://www.exp.top/img/icon.png",
            details: "exp"
          },
          height: "12",
          rule: {
            lock_coins: [
              {
                denom: "uggt",
                amount: "10"
              }
            ],
            lock_period_height: "10512000",
            min_self_delegation: "1"
          }
        }
      ]
    };
  },
  computed: {
    ...mapState("staking", ["validators", "validatorIssue"]),
    handleDenom() {
      return function(val) {
        return val.slice(1).toUpperCase();
      };
    },
    handleAmount() {
      return function(val) {
        return BigNumber(val)
          .dividedBy(BigNumber(10).pow(6))
          .toFixed();
      };
    },
    issueList() {
      return function(valAddress) {
        return this.validatorIssue[valAddress];
      };
    }
  },
  methods: {
    get,
    numeral,
    isEmpty,
    getViewToken,
    onSelect(v) {
      this.$store.dispatch("staking/setToValidator", v);
      this.$router.back();
    }
  },
  async mounted() {
    await this.$store.dispatch("staking/fetchValidatorIssue");
    this.$store.dispatch("staking/fetchValidators");
  }
};
</script>

<style lang="scss" scoped>
.item {
  background: white;
  box-shadow: $shadow;
  padding: 16px $padding-basic;
  border-radius: 4px;
  margin-bottom: 12px;
  cursor: pointer;
  .data-item {
    margin: 10px 0;
  }
  .info {
    height: 30px;
    .details {
      line-height: 15px;
    }
  }
  .info-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    > .btn {
      font-weight: bolder;
      color: #fff;
      background: #330867;
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      padding: 0 10px;
      border-radius: 4px;
    }
  }
  h3 {
    color: rgba(0, 0, 0, 0.8);
    font-size: 18px;

    span {
      font-size: 14px;
      color: $color-success;

      &.jailed {
        color: $color-error;
      }
    }
  }
  p {
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
  }
  .icon {
    height: 40px;
  }
}
</style>