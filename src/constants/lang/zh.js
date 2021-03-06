const zh = {
  global: {
    app: 'GardBox',
    next: '下一步',
    back: '返 回',
    search: '搜 索',
    confirm: '确 认',
    finish: '完 成',
    ok: '确 认',
    cancel: '取 消',
    error: '错误',
    required: '请输入{name}',
    success: '{name}成功!',
    noData: '暂无数据',
    noData1: '暂无数据',
    no: '否',
    nothing: '-',
    yes: '是',
    errorType: '{name}格式错误',
    view: '查看',
    null: '暂无',
    null2: '暂无',
    Insufficient: '余额不足',
    entryError: '输入错误'
  },
  home: {
    title: '管理你的临界 Hashgard 资产',
    banner: '安全·稳定·开源',
    itemTitle1: '安全·可靠',
    itemText1: '您的私钥保存在您本地，并受到多重保护，我们永远不会访问您的私人信息。助记词采用业内最高24助记词进行加密。',
    itemTitle2: '稳定·开源',
    itemText2: '我们的钱包代码一直在Github上进行开源，也希望社群的开发者能够一起开发我们的钱包。您也可以下载我们的代码进行私有部署。',
    itemTitle3: '方便·易用',
    itemText3: 'Gardbox是多语言网页轻钱包，随时随地可以使用的您的钱包进行发行、支付等操作。',
    itemTitle4: '隐匿·保护',
    itemText4: 'gardbox钱包不会收集您的任何信息，使用临界Hashgard网络中token也不会透露任何您的私人信息。',
    account: '钱包账户',
    staking: '委托抵押',
    issue: 'Token发行',
    deposit: '存款盒子',
    future: '远期支付盒子',
    create: '创建您的钱包',
    wallet: '钱包',
    dapp: '应用商店'
  },
  agree: {
    title: '服务条款',
    term1: '我知道我的钱包信息存放在我的个人电脑上，不会发送至 Hashgard 服务器，所有的加密都在浏览器本地完成。',
    term2: '我知道 Hashgard 无法访问我的私人信息，也无法参与解决任何的资金损失问题。',
    term3: '我已经阅读并同意 ',
    use: '使用条款',
    and: '和',
    privacy: '隐私条款',
    confirm: '同意并继续',
    termUrl: 'http://hashgard-io.oss-cn-hongkong.aliyuncs.com/terms/HashgardTermsofService_CN.pdf',
    privacyUrl: 'http://hashgard-io.oss-cn-hongkong.aliyuncs.com/terms/GardBoxPrivacyPolicy_CN.pdf'
  },
  passport: {
    title: '创建一个新钱包或导入钱包',
    banner: 'gard钱包是一个免费的、开源的网页钱包，用户可以使用gard钱包创建或导入钱包，使用gard代币完成例如转账等一系列操作.',
    create: '创建钱包',
    createBreif: '创建全新的钱包来管理 Hashgard 的网络资产。',
    login: '钱包切换',
    loginBreif: '直接输入密码使用本地已经存在的 GARD 钱包。',
    logout: '注 销',
    backup: '导出 KeyStore',
    privateKey: '导出私钥',
    backupCopy: '复制 KeyStore 到剪贴板',
    backupFile: '下载 KeyStore 文件',
    edit: '编辑名称',
    delete: '删除钱包',
    deleteWarn: '钱包的所有信息都会被删除，只能用该钱包的助记词或 KeyStore 恢复钱包，请确保您已做好备份。',
    recover: '导入钱包',
    recoverBreif: '导入已经存在的钱包来管理 Hashgard 的网络资产。',
    math: '麦子钱包',
    useMath: '使用麦子钱包',
    switchWallet: '切换地址',
    backups: '已备份，点我验证',
    network: '切换到不同的 Hashgard 网络'
  },
  create: {
    warn1: '密码用户保护您的私钥和授权交易，请妥善保存。',
    warn2: 'Hashgard 钱包不存储密码，也无法帮您找回，请务必牢记!!',
    name: '钱包名称',
    nameLength: '钱包名称不应长于12字符',
    pass: '密码',
    passCheck: '确认密码',
    passWarn: '密码至少8位，且包含数字和字母!',
    passCheckWarn: '密码不一致!',
    exist: '钱包名称已存在!',
    mnemonic: '您的助记词',
    mnemonicWarn: '助记词错误',
    safety: '请妥善保管',
    mnemonicBreif: '抄写好您的钱包助记词，并保存在只有你知道的地方,助记词用于恢复或重置钱包密码',
    reset: '重 置',
    confirm: '确认您的助记词',
    backup: '是否从gardbox钱包中清除该助记词?',
    success: '钱包创建成功!',
    clickCopy: '点我复制',
    mnemonicConfirm: '助记词确认',
    mnemonicInfo: '请在输入框中填写“我已经抄写并保存好助记词了”',
    mnemonicInfo2: '我已经抄写并保存好助记词了'
  },
  recover: {
    key: 'KeyStore 文本',
    keyFile: 'KeyStore 文件',
    drag: '将文件拖到此处，或',
    click: '点击上传',
    phrase: '助记词',
    keyError: 'KeyStore 格式错误!'
  },
  main: {
    receive: '收款',
    deposit: '存款',
    qrcode: '二维码',
    send: '转账',
    manage: '管 理',
    copy: '已复制到剪切板',
    assets: '我的资产',
    txs: '交易记录',
    txInfo: '交易详情',
    allTxs: '查看全部',
    empty: '暂无交易记录',
    keyWarn: 'KeyStore 是用你的私钥和密码加密后的 JSON 文件, 您可以用密码从 KeyStore 中取回私钥，请妥善保管。',
    voucher: '凭证',
    takeBack: '请取回',
    transaction: '交易',
    draw: '领 币',
    AdequateBalance: '余额充足',
    seconds: '30秒后再领取',
    box: '盒子',
    delegate: '委托',
    manage: '管理',
    copy: '复制',
    coinType: '币种',
    available: '可用',
    frozen: '冻结',
    operation: '操作',
    migrate: '兑换',
  },
  send: {
    form: '转账',
    confirm: '确认交易信息',
    passError: '密码错误',
    reject: '交易签名被拒绝',
    netError: '网络错误',
    finish: '转账结果',
    denom: '转账币种',
    amount: '数量',
    amountWarn: '数量不足',
    amountWarnPositive: '数量必须大于零',
    amountWarnInvalid: '小数位数不支持',
    address: '收款地址',
    addressWarn: '地址不可用',
    sender: '转出地址',
    memo: '备注',
    txHash: 'TxHash',
    all: '全部转出',
    balance: '账户余额',
    fee: '手续费',
    error: '交易发送失败',
    again: '继续转账',
    back: '回到钱包',
    block: '区块高度',
    time: '交易时间',
    codeMessage1: '该二维码仅支持Hashgard网络资产转入,暂不支持其他虚拟货币资产',
    codeMessage2: '转入时请确认资产属性.其他虚拟货币资产冲入将无法找回'
  },
  staking: {
    delegationTotal: '所有委托',
    reward: '委托收益',
    withdraw: '取回收益',
    withdrawAll: '一键取回收益',
    delegate: '委托 GARD',
    delegations: '我的委托',
    validators: '全部验证人节点',
    tokensMax: '抵押数量优先',
    commissionMin: '佣金最低',
    fromValidator: '转出验证人节点',
    toValidator: '转入验证人节点',
    validator: '验证人节点',
    name: '节点名称',
    status: '状态',
    active: '活跃',
    candidate: '候选',
    jailed: '异常',
    minSelf: '最小自委托',
    address: '地址',
    detail: '委托详情',
    tokens: '抵押总量',
    commission: '佣金',
    max: '最高佣金',
    commissionChange: '修改佣金最大幅度',
    website: '网站',
    description: '描述',
    all: '委托全部',
    unbind: '赎回委托',
    unbindAll: '赎回全部',
    redelegate: '转移委托',
    redelegateAll: '转移全部',
    validatorDup: '验证人节点相同',
    unbinding: '解锁中',
    delegated: '已委托',
    unpaidReward: '未领取收益',
  },
  validator: {
    coinInfo: '发币信息',
    coinType: '币种',
    totalAmount: '总量',
    preMintAddress: '预挖地址',
    preMintAmount: '预挖数量',
    website: '网站地址',
    icon: 'Token 图标',
    describe: '描述信息',
    zeroBlockHeight: '从零开始块高度',
    startHeight: '开始高度',
    proposerNodeAmount: '本节点块产出',
    voterNodeAmount: '其他节点块产出',
    minSelfDelegation: '自身最小委托'
  },
  issue: {
    tokens: '我发行的Token',
    create: '发行新Token',
    fee: '服务费',
    feeInsuf: '账户余额不足',
    symbol: 'Token符号',
    name: '名称',
    id: 'ID',
    time: '发行时间',
    supply: '发行总量',
    basic: '基础信息',
    basicBrif: '必填项，Token创建后不可修改',
    decimals: '小数位数',
    nameEg: '如：Hashgard',
    symbolEg: '如：GARD',
    supplyEg: '如：21000000',
    nameInvalid: '名称长度必须是 3 到 32',
    symbolInvalid: '符号长度必须是 2 到 8',
    supplyInvalid: '发行总量超出上限',
    describe: '描述信息',
    describeBrif: '非必填，可以后期修改',
    org: '组织机构名称',
    website: '网站地址',
    logo: 'Token 图标',
    intro: 'Token 描述',
    orgEg: 'E.g. Hashgard 基金会',
    websiteEg: 'E.g. www.hashgard.io',
    logoEg: '可公开访问的图片链接地址',
    lengthInvalid: '长度超出限制',
    setting: 'Token 功能设置',
    settingBrif: '以下功能默认开启, 一旦关闭将不可再次打开。',
    mint: '管理员可增发',
    freeze: '管理员可冻结',
    burn: '管理员可销毁',
    burnHolder: '普通用户可销毁',
    burnAny: '管理员可强制销毁其他用户Token',
    detail: 'Token详情',
    modify: '修改Token描述信息',
    switchWarn: '该功能一旦关闭将不可再次打开!',
    tab1: '基础设置',
    tab2: '增发/销毁',
    tab3: '冻结/解冻',
    tab4: '转移所有权',
    closeOk: 'Token功能关闭成功!'
  },
  mint: {
    mint: '增 发',
    burn: '销 毁',
    address: '目标地址',
    action: '操作类型'
  },
  freeze: {
    freeze: '冻 结',
    unfreeze: '解 冻',
    type: '类型',
    status: '冻结状态',
    in: 'Token 转入',
    out: 'Token 转出',
    all: '转入 + 转出',
    end: '到期时间',
    none: '没有地址冻结'
  },
  singleTokenAssets: {
    available: '可 用',
    lock: '锁 定'
  },
  receiveVoucher: {
    extract: '提取'
  },
  lockInput: {
    name: '名称',
    title: '锁定列表',
    boxName: '盒子名称',
    currency: '币 种',
    lockTime: '解锁时间',
    creatTime: '创建时间',
    allOut: '全部锁定',
    currentBalance: '当前余额',
    lock: '锁 定',
    lockInfo: '锁定信息',
    lockCurrency: '锁定币种',
    lockAddress: '锁定地址',
    lockNumber: '锁定数量',
    status: '状态',
    all: '全部',
    locked: '锁定中',
    unlocked: '已解锁',
    period: '锁仓周期'
  },
  future: {
    title: '远期支付盒子',
    creat: '创建支付盒子',
    searchPlaceholder: '支付盒子名称',
    name: '名称',
    paymentPeriod: '支付期数',
    status: '状态',
    totalPayment: '支付总量',
    operation: '操作',
    paymentTitle: '支付标题',
    paymentdescribe: '盒子描述限150字',
    allow: '允许交易收款凭证',
    import: '批量导入',
    paymentTime: '支付时间',
    paymentTime1: '第一期支付时间',
    paymentTime2: '第二期支付时间',
    paymentAddress: '支付地址',
    paymentQuantity: '支付数量',
    paymentAddress: '支付地址',
    paymentQuantity: '支付数量',
    manualAddition: '手动添加',
    template: '模版',
    importTimeAndNumber: '导入时间名单和数量',
    stage: '期',
    inject: '注入',
    withdraw: '取回',
    activation: '激活',
    ReceiveCer: '收款凭证交易',
    detail: '支付详情',
    ongoing: '进行中',
    closed: '已关闭',
    fuDe: '支付盒子详情',
    confrimInfo: '确认支付信息',
    incorrectValues: '数值有误',
    addressSplit: '多个地址用“，”分隔开',
    number: '数字',
    duplication: '地址重复',
    injectNumber: '注入数量',
    expire: '已到期'
  },
  deposit: {
    deposit: '存款',
    allDeposits: '全部存款',
    myIssue: '我发行的',
    myInvolved: '我参与的',
    creatDeposit: '创建存款盒子',
    creatDepositBox: '创建存款盒子',
    all: '全部',
    toBeActivated: '待激活',
    AdsorptionPeriod: '存款吸纳期',
    DepositPeriod: '存款锁定期',
    over: '已关闭',
    completed: '已完成',
    searchPlaceholder: '发起人地址',
    name: '名称',
    type: '种类',
    status: '状态',
    Deadline: '截止时间',
    startTime: '开始时间',
    AnnualInterestRate: '年利率%',
    target: '最低目标数量',
    depositNumber: '吸纳存款总量',
    depositCurrency: '存款币种',
    depositCap: '吸纳存款总量',
    depositLimit: '最低目标数量',
    MinimumFraction: '单位数量',
    InterestCurrency: '利息币种',
    TotalInterest: '利息总量',
    IntakeDepositStartTime: '利息注入结束时间',
    IntakeDepositEndTime: '吸纳存款结束时间',
    DepositAndInterestDeliveryTime: '存款及利息交割时间',
    DepositItemDescription: '存款项目描述',
    Allow: '允许存款凭证交易',
    creat: '创 建',
    default: '如果不填写，默认为1',
    TotalPayment: '支付总额',
    depositBoxDetail: '存款盒子详情',
    Deposited: '已存入',
    Injected: '已注入',
    noReached: '未达成',
    Achieved: '已达成',
    see: '查 看',
    Retrieve: '取 回',
    CreateAddress: '创建地址',
    inject: '注 入',
    injectToken: '注入token',
    retrieveToken: '取回token',
    NeedInjected: '还需注入',
    MaximumReturn: '最多取回',
    cancelDeposit: '取消存款',
    depositQuantity: '存入数量',
    expectedInterest: '预计利息',
    depositDetail: '存入详情',
    time: '时间',
    order: '序号',
    totalInjection: '注入总额',
    timeError: '时间错误',
    enterQuantity: '请输入数量',
    notLessTime: '不能小于当前时间',
    PositiveNumber: '必须是大于0的数字',
    depositTime: '存款时间',
    multiple: '请输入{price}的倍数'
  },
  vote: {
    vote: '投票',
    myVote: '我的投票',
    myProposal: '我的提案',
    voting: '投票中',
    creat: '创建提案',
    all: '所有提案',
    mortgage: '抵押',
    passed: '已通过',
    reject: '已拒绝',
    title: '提案标题',
    describe: '提案描述',
    activation: '提案激活费用',
    status: '状态',
    option: '选项',
    numberVotes: '投票人数',
    votesCount: '投票数',
    proportion: '占比',
    distanceTime: '距离投票结束时间',
    needMortgage: '还需抵押',
    activation: '激活提案',
    parameter: '参数调节',
    adjusted: '调整为',
    totalDeposit: '总共抵押',
    governance: '链上治理',
    d: '天',
    h: '时',
    m: '分',
    s: '秒',
    type: '提案类型',
    des: '备注',
    depositEndTime: '抵押结束时间',
    voteStartTime: '投票开始时间',
    voteEndTime: '投票结束时间',
    yes: '同意',
    no: '反对',
    noWithVeto: '严重反对',
    abstain: '弃权',
    voter: '投票人',
    voteOption: '投票选项',
    null: '暂未投票',
    proDenom: '代币',
    proRecipient: '解锁资产收取地址',
    proAmount: '需解锁资产'
  },
  bet: {
    betHall: '投注大厅',
    myBet: '我的投注',
    extend: '推广活动',
    introduce: '玩法介绍',
    homeInfo: '分享活动正在进行中，可以获得活动奖励',
    system: '系统奖池',
    bettingPool: '投注奖池',
    eventPool: '活动奖池',
    first: '一等奖',
    second: '二等奖',
    third: '三等奖'
  },
  owner: {
    brif: '转移管理员权限是【非常危险】的操作，一旦转给其他地址，该Token将从你的【Token发行列表】中移除！',
    from: 'Token 所有者'
  },
  footer: {
    copyright: '© 2020 Hashgard Foundation Ltd. All Rights Reserved.'
  },
  migrate: {
    title: '兑换主网GARD币',
    exchange: '兑换',
    exchange1: '兑换',
    erc20TxHash: '请填写ERC20 GARD转入指定地址的TxHash',
    ethTxHash: '请填写0个ETH转入指定地址的TxHash',
    calibrationArea: '校验区',
    enterArea: '输入区',
    erc20Address: '系统将自动读取ERC20地址',
    gardADdress: '系统将自动读取GARD地址',
    amount: '系统将自动读取销毁ERC20 GARD数量',
    correspondingExchangeTo: '对应兑换为 {name} 主网GARD',
    txhashValidator: 'txhash校验未通过',
    read: '请先读取交易数据',
    mainNet: '主网',
    coin: '币',
    doc: '兑换流程说明',
    reward: '奖励 {name} GARD'
  },
  redelegate: {
    my: '我的转委托',
    amount: '数量',
    validatorFrom: '转出节点',
    validatorTo: '转入节点',
    completionTime: '完成时间',
    block: '区块高度',
    detail: '转移委托'
  },
  myNode: {
    myNode: '我的节点',
    name: '节点名称',
    comissionRate: '佣金',
    address: '节点地址',
    time: '更新时间',
    info: '节点信息',
    state: '状态',
    delegate: '抵押总量',
    comissionMax: '最高佣金',
    comissionMaxChange: '修改佣金最大幅度',
    website: '网站',
    details: '描述',
    withdraw: '提取收益地址',
    rewards: '收益奖励',
    commission: '佣金奖励',
    setWithdraw: '设置提取收益地址',
    set: '设置'
  }
};
export default zh;