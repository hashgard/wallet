<template>
  <div class="staking-container">
    <div class="valid-list">
      <div class="table-header && nav">
        <div class="header-name">{{$t("myNode.name")}}</div>
        <div class="header-address" v-if="pageWidth > 414">收益地址</div>
        <div class="view">{{$t("main.operation")}}</div>
      </div>
      <div v-if="!isEmpty(communityNode)">
        <div
          class="table-header"
          v-for="(v,index) in communityNode"
          :key="index"
        >
          <div class="header-name">{{get(v, 'description.moniker')}}</div>
          <div class="header-address" v-if="pageWidth > 414">
            <span v-if="!isEmpty(validatorRewardsAddress)">{{validatorRewardsAddress[v.operator_address]}}</span>
          </div>
          <div class="view">
            <span @click="withDraw(v.operator_address)">领取收益</span>
            <span @click="editName(v.operator_address)">修改名称</span>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="节点名称"
      :visible.sync="dialogVisible"
      width="360px"
      :close-on-click-modal="false"
    >
      <el-input
        v-model.trim="name"
        placeholder="名称只限长度为20位的大小写字母 - _"
        @keyup.enter.native="onSend"
      ></el-input>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="onSend"
          class="ok-btn"
        >{{$t('global.ok')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import {isEmpty, get} from "lodash"
import axios from "axios"
export default {
  data() {
    return {
      validator:'',
      dialogVisible:false,
      name:'',
      pageWidth: document.documentElement.clientWidth,
      nodeArr:[
        "gardvaloper1yzjvrpj8v24w0yxdx3y0yraj8d7x4w08gtcguj",
        "gardvaloper1khvm3tm9xtqzt76ayml9ru97grlks5jssdr7fq",
        "gardvaloper1f200hhsfnm8twa2q2qgjmmgkhql62whjxlv2my",
        "gardvaloper1d2tkv822plz3734vjwlzzrqvhmr702345tktag",
        "gardvaloper1cpqdny8x5su64z6v6cflam9z7jt7d6hz2wrhvl",
        "gardvaloper18xq5f0rj225et2fg4xdtf204fqtygdkefx3f7c"
      ],
      nodeRewardsAddress:{
        "gardvaloper1yzjvrpj8v24w0yxdx3y0yraj8d7x4w08gtcguj":'',
        "gardvaloper1khvm3tm9xtqzt76ayml9ru97grlks5jssdr7fq":'',
        "gardvaloper1f200hhsfnm8twa2q2qgjmmgkhql62whjxlv2my":'',
        "gardvaloper1d2tkv822plz3734vjwlzzrqvhmr702345tktag":'',
        "gardvaloper1cpqdny8x5su64z6v6cflam9z7jt7d6hz2wrhvl":'',
        "gardvaloper18xq5f0rj225et2fg4xdtf204fqtygdkefx3f7c":''
      }
    }
  },
  computed:{
    ...mapState("account", ["tokenMap", "keyStore"]),
    ...mapState("staking", ["validators","validatorRewardsAddress"]),
    communityNode() {
      let result = []
      this.validators.forEach(i=> {
        if (this.nodeArr.indexOf(i.operator_address) > -1) {
          result.push(i)
        }
      })
      return result
    }
  },
  methods: {
    isEmpty,
    get,
    async judegeTime() {
      const res = await axios.get("http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp")
      if (res.status == 200) {
        const date = new Date(Date(res.data.data.t))
        if (date.getDay() == 5 && date.getHours() >= 16 && date.getHours() <= 20) {
          return Promise.resolve(true)
        } else {
          return Promise.resolve(false)
        }
      } else {
        const date = new Date()
        if (date.getDay() == 5 && date.getHours() >= 16 && date.getHours() <= 20) {
          return Promise.resolve(true)
        } else {
          return Promise.resolve(false)
        }
      }
    },
    async withDraw(address) {
      const timeStatus = await this.judegeTime()
      if (timeStatus) {
        this.sendWithDraw(address)
      } else {
        this.$message.error("当前时间不可操作，请节点质押第一名每周五18:00左右领取")
      }
    },
    async sendWithDraw(address) {
      if (this.validatorRewardsAddress[address] != this.keyStore.address) {
        this.$message.error("本账户非该节点质押第一名，无法领取收益！")
        return
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let res;
      try{
        res = await this.$store.dispatch("staking/withdrawValidator", {'validator':address,'address':this.keyStore.address})
      } catch{

      }
      if (!isEmpty(res)) {
        if (res.result == 1) {
          this.$message({
              type:'success',
              message: this.$t("global.success", {name: this.$t("staking.withdraw")}),
              center: true,
              duration: 1000,
              onClose: () => {
                window.location.reload()
              }
            })
        }
      } else {
        this.$message.error(this.$t("send.netError"));
      }
      loading.close()
    },
    async editName(address) {
      const timeStatus = await this.judegeTime()
      if (timeStatus) {
        this.sendeditName(address)
      } else {
        this.$message.error("当前时间不可操作，请节点质押第一名每周五18:00左右操作")
      }
    },
    sendeditName(address) {
      this.dialogVisible = true
      this.name = ''
      this.validator = address
    },
    async onSend() {
      const regex=/^[A-Za-z_\-]+$/ig;
      if (regex.test(this.name) && this.name.length <= 20) {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        let res;
        try {
          res = await this.$store.dispatch("staking/editNodeName", {'validator':this.validator,'address':this.keyStore.address,name: this.name})
        } catch {

        }
        if (!isEmpty(res)) {
          if (res.result == 1) {
            this.$message({
              type:'success',
              message: this.$t("global.success", {name: '名称修改'}),
              center: true,
              duration: 1000,
              onClose: () => {
                window.location.reload()
              }
            })
          }
        } else {
          this.$message.error(this.$t("send.netError"));
        }
        loading.close()
      } else {
        this.$message.error("名称只限长度为20位的大小写字母 - _")
      }
    },

  },
  async mounted() {
    this.$store.dispatch("staking/fetchValidatorsDelegations")
  }
}
</script>
<style lang="scss" scoped>
.staking-container {
  max-width: $max-width;
  margin: 0 auto $padding-large;
  padding: $padding-large 0;
  .valid-list {
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
      >.header-name {
        flex-basis: 20%;
      }
      >.header-address {
        flex-basis: 50%;
      }
      >.view {
        flex-basis: 30%;
        span {
          cursor:pointer;
          color:#330867;
          margin-right: 15px;
        }
      }
    }
    .nav {
      font-weight: bolder;
    }
  }
}
@include responsive($sm) {
  .staking-container {
    .valid-list {
      .table-header {
        >.header-name {
          flex-basis: 50%;
        }
        .view {
          flex-basis: 50%;
        }
      }
    }
  }
}
</style>