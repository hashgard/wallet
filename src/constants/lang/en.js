const en = {
  global: {
    app: 'GardBox',
    next: 'Next',
    back: 'Back',
    search: 'Search',
    confirm: 'Confirm',
    finish: 'Finish',
    ok: 'Ok',
    cancel: 'Cancel',
    error: 'Error',
    required: '{name} is required',
    success: '{name} Success!',
    noData: 'No data available for the time being',
    noData1: 'No Data',
    no: 'No',
    nothing: '-',
    yes: 'Yes',
    errorType: 'Wrong {name}',
    view: 'view',
    null: 'No Rewards',
    null2: 'No Assets',
    Insufficient: 'Gas Fee Insufficient',
    entryError: 'Entry Error'
  },
  home: {
    title: 'Manage your Hashgard Assets',
    banner: 'Security, Stability and Open Source',
    itemTitle1: 'Safety and reliability',
    itemText1: 'Your private key is stored locally and protected multiple times. We will never access your private information. Auxiliaries are encrypted with up to 24 mnemonic words in the industry.',
    itemTitle2: 'Stability and Open Source',
    itemText2: 'Our wallet code has been open source on Github, and we hope that community developers can work together to develop our wallets. You can also download our code for private deployment.',
    itemTitle3: 'Convenience and ease of use',
    itemText3: 'Gardbox is a light wallet for multilingual web pages. You can use your wallet anytime, anywhere for issuance, payment and other operations.',
    itemTitle4: 'Concealment and protection',
    itemText4: 'The gardbox wallet will not collect any information about you, nor will token disclose any personal information about you using the critical Hashgard network.',
    account: 'Wallet Account',
    staking: 'Staking Delegation',
    issue: 'Token Issuances',
    deposit: 'DepositBox',
    future: 'FutureBox',
    create: 'Create Your Wallet',
    wallet: 'Wallet',
    dapp: 'Dapp Store'
  },
  agree: {
    title: 'Terms & Conditions',
    term1: 'I understand that my funds are stored securely on my personal computer. No private data is sent to Hashgard servers. All encryption is done locally in browser.',
    term2: 'I consent that Hashgard does not have access to my private information and could not participate in resolution of issues concerning money loss of any kind.',
    term3: 'I have read and accepted the ',
    use: 'Terms of Use',
    and: 'and',
    privacy: 'Privacy Policy',
    termUrl: 'http://hashgard-io.oss-cn-hongkong.aliyuncs.com/terms/HashgardTermsofService.pdf',
    privacyUrl: 'http://hashgard-io.oss-cn-hongkong.aliyuncs.com/terms/GardBoxPrivacyPolicy.pdf',
    confirm: 'Confirm and Continue'
  },
  passport: {
    title: 'Create a new key pair or import an existing wallet to get started',
    banner: 'GARDBOX is a free, open source web wallet. Users can use gard wallet to create or import wallet, and use gard token to complete a series of operations on Hashgard Blockchain.',
    create: 'Create New Wallet',
    createBreif: "Create a new wallet to manage Hashgard's network assets.",
    login: 'Wallet Switch',
    loginBreif: 'Use wallet with your password if you already have one in this browser.',
    logout: 'Log Out',
    backup: 'Export KeyStore',
    privateKey: 'Export PrivateKey',
    backupCopy: 'Copy KeyStore to clipboard',
    backupFile: 'download KeyStore file',
    edit: 'Edit Name',
    delete: 'Delete Wallet',
    deleteWarn: 'All user data, including imported or generated private keys, will be deleted. The only way to restore a deleted wallet is to use your backup phrase.',
    recover: 'Import Wallet',
    recoverBreif: "Import existing wallets to manage Hashgard's network assets.",
    math: 'Math Wallet',
    useMath: 'Use Math Wallet',
    switchWallet: 'Switch Wallet',
    backups: "Backup, click on me to verify",
    network: 'Switching to different Hashgard networks'
  },
  create: {
    warn1: 'Password Users Protect Your Private Key and Authorized Transactions. Keep it safe!!!',
    warn2: 'Hashgard does not store your password and cannot retrieve it for you!',
    name: 'Wallet Name',
    nameLength: 'Name length should not exceed 12',
    pass: 'Password',
    passCheck: 'Confirm Password',
    passWarn: 'Password must contain numbers and letters and at least 8 characters!',
    passCheckWarn: 'Inconsistent password!',
    exist: 'Account Name Exist!',
    mnemonic: 'Your Mnemonic',
    mnemonicWarn: 'Wrong Mnemonic!',
    safety: 'Backup Your Mnemonic',
    mnemonicBreif: 'Copy your wallet mnemonic and keep it where only you know it.Mnemonics are used to restore or reset wallet passwords.',
    reset: 'Reset',
    confirm: 'Confirm your Mnemonic',
    backup: 'Do you remove the mnemonic from gardbox wallet?',
    success: 'Wallet Created Successfully!',
    clickCopy: 'Copy',
    mnemonicConfirm: 'Mnemonic Confirm',
    mnemonicInfo: 'Please fill in the input with "I have copied and saved the mnemonics"',
    mnemonicInfo2: 'I have copied and saved the mnemonics'
  },
  recover: {
    key: 'KeyStore Text',
    keyFile: 'KeyStore File',
    drag: 'Drag KeyStore file here, or ',
    click: 'click to upload',
    phrase: 'Mnemonic',
    keyError: 'Wrong KeyStore!'
  },
  main: {
    receive: 'Receive',
    deposit: 'Deposit',
    qrcode: 'QRCode',
    send: 'Transfer',
    manage: 'Manage',
    copy: 'Copied to ClipBoard',
    assets: 'My Assets',
    txs: 'Transactions',
    txInfo: 'Transaction Detail',
    allTxs: 'Expolor All Txs',
    empty: 'No Data',
    keyWarn: 'KeyStore is an encrypted JSON file with your privateKey and password, you can get your privateKey with your password from it.',
    voucher: 'Voucher',
    takeBack: 'Please take it back',
    transaction: 'Send',
    draw: 'Draw GARD',
    AdequateBalance: 'Adequate Balance',
    seconds: '30 seconds later',
    box: 'Box',
    delegate: 'Delegate',
    manage: 'Manage',
    copy: 'copy',
    coinType: 'Token Type',
    available: 'Available Balance',
    frozen: 'Frozen',
    operation: 'Operation',
    migrate: 'Migrate'
  },
  send: {
    form: 'Transfer',
    confirm: 'Confirm Transaction',
    passError: 'Wrong Password!',
    reject: 'Signature Rejected',
    netError: 'Network Error',
    finish: 'Transaction Result',
    denom: 'Currency',
    amount: 'Amount',
    amountWarn: 'Insufficient Quantity',
    amountWarnPositive: 'A Positive Number is required',
    amountWarnInvalid: 'Invalid Amount',
    address: 'Address',
    addressWarn: 'Invalid Address!',
    sender: 'Sender',
    memo: 'Memo',
    txHash: 'TxHash',
    all: 'Send All',
    balance: 'Balance',
    fee: 'Gas Fee',
    error: 'Transaction Error!',
    again: 'Continue Transfer',
    back: 'Back to Wallet',
    block: 'Block',
    time: 'Time',
    codeMessage1: 'This two-dimensional code only supports Hashgard network assets transfer, but does not support other virtual currency assets for the time being.',
    codeMessage2: 'Please confirm the asset attributes when you roll in. Other virtual currency assets will not be recovered if they rush in.'
  },
  staking: {
    delegationTotal: 'Total Delegations',
    reward: 'Delegation Rewards',
    withdraw: 'Withdraw Rewards',
    withdrawAll: 'One Click Withdraw Rewards',
    delegate: 'Delegate GARD',
    delegations: 'My Stakings',
    validators: 'All Validators',
    tokensMax: 'Max Tokens',
    commissionMin: 'Lowest Commission',
    fromValidator: 'From Validator Node',
    toValidator: 'To Validator Node',
    validator: 'Validator Node',
    name: 'Validator Name',
    status: 'Status',
    active: 'Active',
    candidate: 'Candidate',
    jailed: 'Jailed',
    minSelf: 'Min Self Delegation',
    address: 'Address',
    detail: 'Delegation Detail',
    tokens: 'Tokens',
    commission: 'Commission',
    max: 'Commission Max',
    commissionChange: 'Commission Change Rate Max',
    website: 'Website',
    description: 'Description',
    all: 'Delegate All',
    unbind: 'Unbind',
    unbindAll: 'Unbind All',
    redelegate: 'Redelegate',
    redelegateAll: 'Redelegate All',
    validatorDup: 'Target Validator Invalid',
    unbinding: 'Unbindings',
    delegated: 'Delegated',
    unpaidReward: 'Unpaid Reward'
  },
  validator: {
    coinInfo: 'Coin Info',
    coinType: 'Coin Type',
    totalAmount: 'Total Amount',
    preMintAddress: 'Pre Mint Address',
    preMintAmount: 'Pre Mint Amount',
    website: 'Website',
    icon: 'Token icon',
    describe: 'Describe',
    zeroBlockHeight: 'Zero Block Start Height',
    startHeight: 'Start Height',
    proposerNodeAmount: 'Proposer Node Amount',
    voterNodeAmount: 'Voter Node Amount',
    minSelfDelegation: 'Min Self Delegation'
  },
  issue: {
    tokens: 'My Token Issuances',
    create: 'Issue New Token',
    fee: 'Service Fee',
    feeInsuf: 'Insufficient Service Fee',
    symbol: 'Symbol',
    name: 'Name',
    id: 'ID',
    time: 'Issuance Time',
    supply: 'Total Supply',
    basic: 'Basic Info',
    basicBrif: 'Required, Modifing Not Allowed After Issurance',
    decimals: 'Decimals',
    nameEg: 'E.g. Hashgard',
    symbolEg: 'E.g. GARD',
    supplyEg: 'E.g. 21000000',
    nameInvalid: 'Length of name must be 3 to 32',
    symbolInvalid: 'Length of symbol must be 2 to 8',
    supplyInvalid: 'total-supply exceeds upper limit',
    describe: 'Description Info',
    describeBrif: 'Not Required, Can Be Modified After Issuance',
    org: 'Organization',
    website: 'Website',
    logo: 'Token Logo',
    intro: 'Token Description',
    orgEg: 'E.g. Hashgard Foundation',
    websiteEg: 'E.g. www.hashgard.io',
    logoEg: 'Public Url of Online Logo Image',
    lengthInvalid: 'String length exceeds upper limit',
    setting: 'Token Settings',
    settingBrif: 'Switch of Token settings are open in default, and CAN NOT be open again once closed.',
    mint: 'Minting By Owner',
    freeze: 'Freezing By Owner',
    burn: 'Burning By Owner',
    burnHolder: 'Burning By Holder',
    burnAny: 'Burning Any By Owner',
    detail: 'Token Detail',
    modify: 'Modify Token Description',
    switchWarn: 'Token settings CAN NOT be open again once closed!',
    tab1: 'Basic Settings',
    tab2: 'Mint / Burn',
    tab3: 'Freeze / Unfreeze',
    tab4: 'Ownership Transfer',
    closeOk: 'Token Feature Closed Successfully!'
  },
  mint: {
    mint: 'Mint',
    burn: 'Burn',
    address: 'Target Address',
    action: 'Action'
  },
  freeze: {
    freeze: 'Freeze',
    unfreeze: 'Unfreeze',
    type: 'Type',
    status: 'Freeze Status',
    in: 'Transfer In',
    out: 'Transfer Out',
    all: 'In and Out',
    end: 'End Time',
    none: 'No Freezed Address'
  },
  singleTokenAssets: {
    available: 'Available',
    lock: 'Lock'
  },
  receiveVoucher: {
    extract: 'Extract'
  },
  lockInput: {
    name: 'Name',
    title: 'Lock List',
    boxName: 'Box Name',
    currency: 'Currency',
    lockTime: 'Unlocking Time',
    creatTime: 'Creat Time',
    allOut: 'All Locks',
    currentBalance: 'Current Balance',
    lock: 'Lock',
    lockInfo: 'Lock Info',
    lockCurrency: 'Lock Currency',
    lockAddress: 'Lock Address',
    lockNumber: 'Lock Number',
    status: 'Status',
    all: 'All',
    locked: 'Locked',
    unlocked: 'Unlocked',
    period: 'Lock Period Height'
  },
  future: {
    title: 'Future Payment Box',
    creat: 'Creat Payment Box',
    searchPlaceholder: 'Payment Box Name',
    name: 'Name',
    paymentPeriod: 'Payment Period',
    status: 'Status',
    totalPayment: 'Total Payment',
    operation: 'Operation',
    paymentTitle: 'Payment Title',
    paymentdescribe: 'Payment box description limit 150 words',
    allow: 'Allow trading of deposit certificates',
    import: 'Batch import',
    paymentTime: 'Payment Time',
    paymentTime1: 'First payment period',
    paymentTime2: 'Second payment period',
    paymentAddress: 'Payment address',
    paymentQuantity: 'Payment quantity',
    paymentAddress: 'Payment Address',
    paymentQuantity: 'Payment Quantity',
    manualAddition: 'Manual Addition',
    template: 'Template',
    importTimeAndNumber: 'Import Time List and Number',
    stage: 'Stage',
    inject: 'inject',
    withdraw: 'withdraw',
    activation: 'activation',
    ReceiveCer: 'Receiving Certificate',
    detail: 'Detail',
    ongoing: 'Ongoing',
    closed: 'closed',
    fuDe: 'Future Box Detail',
    confrimInfo: 'Confirmation of payment information',
    incorrectValues: 'Incorrect Values',
    addressSplit: 'Multiple addresses are separated by ","',
    number: 'Number',
    duplication: 'Address duplication',
    injectNumber: 'Number of injections',
    expire: 'Expire'
  },
  deposit: {
    deposit: 'Deposit',
    allDeposits: 'All',
    myIssue: 'My Boxes',
    myInvolved: 'My Deposits',
    creatDeposit: 'Creat Deposit Box',
    creatDepositBox: 'Creat Deposit Box',
    all: 'All',
    toBeActivated: 'To be activated',
    AdsorptionPeriod: 'Adsorption Period',
    DepositPeriod: 'Deposit Lock Period',
    over: 'Closed',
    completed: 'Completed',
    searchPlaceholder: 'Originator address',
    name: 'Name',
    type: 'Type',
    status: 'Status',
    Deadline: 'Deadline',
    startTime: 'Start Time',
    AnnualInterestRate: 'Annual Interest Rate (%)',
    target: 'Target',
    depositNumber: 'Total Amount',
    depositCurrency: 'Currency',
    depositCap: 'Total Amount',
    depositLimit: 'Minimum Deposit Amount',
    MinimumFraction: 'Minimum Fraction',
    InterestCurrency: 'Interest Currency',
    TotalInterest: 'Total Interest',
    IntakeDepositStartTime: 'Interest Injection End Time',
    IntakeDepositEndTime: 'Adsorption End Time',
    DepositAndInterestDeliveryTime: 'Deposit End And Interest Delivery Time',
    DepositItemDescription: 'Deposit Item Description',
    Allow: 'Allow trading of deposit certificates',
    creat: 'Creat',
    default: 'If not, default is 1',
    TotalPayment: 'Total Payment',
    depositBoxDetail: 'Deposit Box Detail',
    Deposited: 'Deposited',
    Injected: 'Injected',
    noReached: 'No Reached',
    Achieved: 'Achieved',
    see: 'See',
    Retrieve: 'Withdraw',
    CreateAddress: 'Creat Address',
    inject: 'Inject',
    injectToken: 'Inject Token',
    retrieveToken: 'Withdraw Token',
    NeedInjected: 'Need to be injected',
    MaximumReturn: 'Maximum Return',
    cancelDeposit: 'Cancel Deposit',
    depositQuantity: 'Deposit Quantity',
    expectedInterest: 'Expected Interest',
    depositDetail: 'Deposit Detail',
    time: 'Time',
    order: 'Order',
    totalInjection: 'Total Injection',
    timeError: 'Time Error',
    enterQuantity: 'Please enter quantity',
    notLessTime: 'Not less than the current time',
    PositiveNumber: 'Must be a number greater than 0',
    depositTime: 'Deposit Time',
    multiple: 'Must be a multiple of {price}'
  },
  vote: {
    vote: 'vote',
    myVote: 'My Vote',
    myProposal: 'My Proposal',
    voting: 'Voting',
    creat: 'Creat Proposal',
    all: 'All Proposals',
    mortgage: 'Mortgage',
    passed: 'Passed',
    reject: 'rejected',
    title: 'Proposal Title',
    describe: 'Proposal description',
    activation: 'Proposal activation costs',
    status: 'Status',
    option: 'Option',
    numberVotes: 'Number of votes',
    proportion: 'Proportion',
    distanceTime: 'Distance from the end of the vote',
    needMortgage: "Mortgage is also needed",
    activation: "Activation proposal",
    parameter: 'Parameter adjustment',
    adjusted: 'Adjusted to',
    totalDeposit: 'Total Deposit',
    governance: 'Chain Governance'
  },
  bet: {
    betHall: 'Betting Hall',
    myBet: 'My Bet',
    extend: 'Extend',
    introduce: 'Introduce',
    homeInfo: 'Sharing activities are in progress and can be rewarded',
    system: 'System award pool',
    bettingPool: 'Betting pool',
    eventPool: 'Event pool',
    first: 'The first award',
    second: 'Second award',
    third: 'Third Award'
  },
  owner: {
    brif: 'Transfer ownership to other address is DANGEROUS！You will see no more this Token in your Token Issuance List once transfered!',
    from: 'Token Owner'
  },
  footer: {
    copyright: '© 2020 Hashgard Foundation Ltd. All Rights Reserved.'
  },
  migrate: {
    title: 'Convert ERC-20 GARD to Mainnet GARD',
    exchange: 'Convert',
    exchange1: 'Convert',
    erc20TxHash: 'Enter the TxHash after you transfer ERC-20 GARD to target address',
    ethTxHash: 'Enter the TxHash after you transfer 0 ETH to target address',
    calibrationArea: 'Verification Area',
    enterArea: 'Input Area',
    erc20Address: 'The system verifies ERC-20 GARD address',
    gardADdress: 'The system verifies GARD address',
    amount: 'The system verifies the total quantity of burned ERC-20 GARD',
    correspondingExchangeTo: 'You will obtain {name} mainnet GARD',
    txhashValidator: 'txhash Verification failed',
    read: 'Please read transaction data first',
    mainNet: 'mainnet ',
    coin: 'coin',
    doc: 'Convert process description',
    reward: 'plus {name} GARD as incentive'
  },
  redelegate: {
    my: 'My Redelegations',
    amount: 'Amount',
    validatorFrom: 'Validator From',
    validatorTo: 'Validator To',
    completionTime: 'Completion Time',
    block: 'Block Height',
    detail: 'Redelegation Detail'
  },
  myNode: {
    myNode: 'My Validators',
    name: 'Validator Name',
    comissionRate: 'Comission Rate',
    address: 'Operator Address',
    time: 'Update Time',
    info: 'Validator Info',
    state: 'State',
    delegate: 'Total Delegation',
    comissionMax: 'Comission Max Rate',
    comissionMaxChange: 'Comission Max Change Rate',
    website: 'Website',
    details: 'Details',
    withdraw: 'Withdraw Address',
    rewards: 'Rewards',
    commission: 'Commission',
    setWithdraw: 'Set Withdraw Address',
    set: 'Set'
  }
};
export default en;