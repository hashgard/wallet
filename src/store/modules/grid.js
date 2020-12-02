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
    dappIssueDetail: {},
    lastBlock: '0',
    gridDepositsListAll: [],
    dappFees: {},
    dappIssueAccount: 0,
    dappIssueListAll: []
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
    },
    setLastBlock(state, data) {
      state.lastBlock = data
    },
    setGridDepositsListAll(state, data) {
      state.gridDepositsListAll = data
    },
    setDappFees(state, data) {
      state.dappFees = data
    },
    setDappIssueAccount(state, data) {
      state.dappIssueAccount = data
    },
    setDappIssueListAll(state, data) {
      state.dappIssueListAll = data
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
    async fetchDappIssueListAll(context, params) {
      const {
        data
      } = await ajax.get(`/grid999/grid/list/${params.dappId}/0/9999`);
      if (!isEmpty(data)) {
        context.commit("setDappIssueAccount", data.result ? data.result.length : 0);
        context.commit("setDappIssueListAll", data.result ? data.result : []);
      }
    },
    // 获取dapp所有期数,分页
    async fetchDappIssueList(context, params) {
      const {
        data
      } = await ajax.get(`/grid999/grid/list/${params.dappId}/${params.startId}/10`);
      if (!isEmpty(data)) {
        context.commit("setDappIssueList", data.result ? data.result : []);
      }
      return Promise.resolve(data);
    },
    //获取某一期信息
    async fetchDappIssueDetail(context, params) {
      const {
        data
      } = await ajax.get(`/grid999/grid/detail/${params.dappId}/${params.gridId}`);
      if (!isEmpty(data)) {
        context.commit("setDappIssueDetail", data.result);
      }
      return Promise.resolve(data);
    },
    //获取当前格子的deposits
    async fetchGridDepositsAll(context, params) {
      const indexInfo = context.state.dappIssueDetail.items.filter(i => {
        return i.index == params.index;
      });
      if (isEmpty(indexInfo[0].deposits)) {
        context.commit("setGridDepositsListAll", [])
      } else {
        context.commit("setGridDepositsListAll", indexInfo[0].deposits.reverse())
      }
    },
    //分页获取当前格子deposits，每次取10条
    async fetchGridDepositsList(context, params) {
      const listAll = context.state.gridDepositsListAll;
      return Promise.resolve(listAll ? listAll.slice((params.page - 1) * params.pageSize, (params.page -
        1) * params.pageSize + params.pageSize) : [])
    },
    // 获取Dapp手续费
    async fetchDappFees(context) {
      const {
        data
      } = await ajax.get(`/grid999/params`);
      if (!isEmpty(data)) {
        context.commit("setDappFees", data.result);
        sessionStorage.setItem("dappFees", JSON.stringify(data.result))
      }
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
      } = await sendTx(context, params.pass, 'MsgDappCreateGrid', msg);
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
      } = await sendTx(context, params.pass, 'MsgDappDeposit', msg);
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
      } = await sendTx(context, params.pass, 'MsgDappWithdraw', msg);
      return Promise.resolve(data);
    },
    //获取最后块
    async fetchLastBlock(context) {
      const {
        data
      } = await ajax.get(`/blocks/latest`);
      if (!isEmpty(data)) {
        context.commit("setLastBlock", data.block.header.height);
      }
      return Promise.resolve(data.block.header.height);
    }
  }
}