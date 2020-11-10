import {
  isEmpty
} from 'lodash';
import ajax from '@/utils/ajax.js';
import {
  sendTx
} from '@/utils/helpers';
export default {
  namespaced: true,
  state: {
    dappList: [],
    dappDetail: {},
    dappIssueList: [],
    dappIssueDetail: {}
  },
  getters: {

  },
  mutations: {
    setDappList(state, data) {
      state.dappList = data
    },
    setDappDetail(state, data) {
      state.dappDetail = data
    },
    setDappIssueList(state, data) {
      state.dappIssueList = data
    },
    setDappIssueDetail(state, data) {
      state.dappIssueDetail = data
    }
  },
  actions: {
    // 获取grid999的dapp列表
    async fetchDappList(context) {
      const {
        data
      } = await ajax.get(`/grid999/dapp/list/0/10`);
      if (!isEmpty(data)) {
        context.commit("setDappList", data.result);
      }
      return Promise.resolve(data);
    },
    // 获取dapp详情
    async fetchDappDetail(context, params) {
      const {
        data
      } = await ajax.get(`/grid999/dapp/detail/${params.dappId}`);
      if (!isEmpty(data)) {
        context.commit("setDappDetail", data.result);
      }
      return Promise.resolve(data);
    },
    // 获取dapp所有期数
    async fetchDappIssueList(context, params) {
      const {
        data
      } = await ajax.get(`/grid999/grid/list/${params.dappId}/0/10 `);
      if (!isEmpty(data)) {
        context.commit("setDappIssueList", data.result);
      }
      return Promise.resolve(data);
    },
    //获取某一期信息
    async fetchDappIssueDetail(context, params) {
      const {
        data
      } = await ajax.get(`/grid999/grid/detail/${params.dappId}/${params.gridId} `);
      if (!isEmpty(data)) {
        context.commit("setDappIssueDetail", data.result);
      }
      return Promise.resolve(data);
    },
    //抢占格子
    async createGrid(context, params) {
      const address = context.rootGetters['account/currentAddress'];
      const msg = {
        type: "cosmos-sdk/MsgDappCreateGrid",
        sender: address,
        dapp_id: params.dappId,
        deposit: {
          denom: params.denom,
          amount: params.amount
        },
        grid_type: "open",
        zero_valued: false,
        prepaid: ""
      }
      const {
        data
      } = await sendTx(context, params.pass, 'hg-custom', msg);
      return Promise.resolve(data);
    },
    //格子质押币
    async dappDeposit(context, params) {
      const address = context.rootGetters['account/currentAddress'];
      const msg = {
        type: "cosmos-sdk/MsgDappDeposit",
        dapp_id: params.dappId,
        sender: address,
        deposit: {
          denom: params.denom,
          amount: params.amount
        },
        grid_id: params.gridId,
        index: params.index
      };
      const {
        data
      } = await sendTx(context, params.pass, 'hg-custom', msg);
      return Promise.resolve(data);
    },
    //取回格子
    async dappWithdraw(context, params) {
      const address = context.rootGetters['account/currentAddress'];
      const msg = {
        type: "cosmos-sdk/MsgDappWithdraw",
        dapp_id: params.dappId,
        sender: address,
        grid_id: params.gridId
      }
      const {
        data
      } = await sendTx(context, params.pass, 'hg-custom', msg);
      return Promise.resolve(data);
    }
  }
}