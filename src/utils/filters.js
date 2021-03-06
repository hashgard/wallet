import moment from 'dayjs';
import {
  get
} from 'lodash';
import numeral from 'numeral';
import {
  gardplorerDomain
} from '@/constants';

export const upper = s => s.toUpperCase();

export const gardAddr = s => s && s.slice(0, 8) + '......' + s.slice(s.length - 8);

export const gardValidator = s => s && s.slice(0, 7) + '......' + s.slice(s.length - 4);

export const amountGard = tx => {
  const coins = get(tx, 'tx.value.msg.0.value.amount');
  let GARD = {
    denom: 'gard',
    amount: '0'
  };
  if (coins) {
    GARD = coins.find(coin => coin.denom === GARD.denom) || GARD;
  }
  return GARD.amount;
};

export const explorerUrl = s => `${gardplorerDomain}${s}`;

export const formatTime = time =>
  time && time.match(/\d{10}/) ? moment.unix(time).format('YYYY-MM-DD HH:mm:ss') : moment(time).format('YYYY-MM-DD HH:mm:ss');

export const formatNumber = v => (v ? numeral(v.toString()).format('0,0.[00]') : 0);
export const randArr = arr => {
  for (var i = 0; i < arr.length; i++) {
    var iRand = parseInt(arr.length * Math.random());
    var temp = arr[i];
    arr[i] = arr[iRand];
    arr[iRand] = temp;
  }
  return arr;
}