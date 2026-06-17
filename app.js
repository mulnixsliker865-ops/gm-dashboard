const CHANNEL_OUTREACH_COLORS = {
  "线上广播": "#3b82f6",
  "线上投放类": "#e6499b",
  "回单/转介绍": "#f59f0a",
  "官网": "#06b6d4",
  "市场部": "#16b981",
  "其他": "#64748b"
};

const CHANNEL_OUTREACH_MAP = new Map([
  ["99", "线上广播"],
  ["878", "线上广播"],
  ["广播", "线上广播"],
  ["广播电视", "线上广播"],
  ["交通106.8", "线上广播"],
  ["进线", "线上广播"],
  ["经典音乐88.5", "线上广播"],
  ["客户转介绍（广播）", "线上广播"],
  ["天津广播", "线上广播"],
  ["相声92.1", "线上广播"],
  ["新闻97.2", "线上广播"],
  ["400热线", "线上投放类"],
  ["百度搜索", "线上投放类"],
  ["百度系", "线上投放类"],
  ["搜索", "线上投放类"],
  ["抖音直播", "线上投放类"],
  ["抖音直播（二）", "线上投放类"],
  ["抖音直播类", "线上投放类"],
  ["第三方平台垂直类", "线上投放类"],
  ["抖音信息流类", "线上投放类"],
  ["腾讯系", "线上投放类"],
  ["微信朋友圈推广", "线上投放类"],
  ["线上非诺云", "线上投放类"],
  ["工程回单", "回单/转介绍"],
  ["回单", "回单/转介绍"],
  ["客户转介绍（其他）", "回单/转介绍"],
  ["商务一部(中介)", "回单/转介绍"],
  ["商务一部（中介）", "回单/转介绍"],
  ["其他中介", "回单/转介绍"],
  ["21世纪", "回单/转介绍"],
  ["关系单", "回单/转介绍"],
  ["设计回单", "回单/转介绍"],
  ["官网自然流量", "官网"],
  ["官网", "官网"],
  ["市场部", "市场部"],
  ["市场商务", "市场部"],
  ["小区(非定点)", "市场部"],
  ["小区(定点)", "市场部"],
  ["运营类", "市场部"],
  ["展会", "市场部"],
  ["其他", "其他"],
  ["全包圆自然客流", "其他"],
  ["自然客流", "其他"]
]);

const CHANNEL_OUTREACH_ORDER = ["线上广播", "线上投放类", "回单/转介绍", "官网", "市场部", "其他"];

const CHANNEL_DETAIL_DISPLAY_MAP = new Map([
  ["北广", "广播"],
  ["搜索", "百度系"],
  ["百度搜索", "百度系"],
  ["官方抖音直播", "抖音直播类"],
  ["本地推直播", "抖音直播类"],
  ["抖音直播", "抖音直播类"],
  ["抖音直播（二）", "抖音直播类"],
  ["抖音信息流", "抖音信息流类"],
  ["微信朋友圈", "腾讯系"],
  ["微信朋友圈推广", "腾讯系"],
  ["点评类（大众点评、美团点评）", "第三方平台垂直类"],
  ["点评类(大众点评、美团点评)", "第三方平台垂直类"],
  ["散资源", "小区(非定点)"],
  ["小区非定点", "小区(非定点)"],
  ["小区（非定点）", "小区(非定点)"],
  ["小区定点", "小区(定点)"],
  ["小区（定点）", "小区(定点)"]
]);

const CHANNEL_DETAIL_PRIORITY_ORDER = [
  "广播",
  "腾讯系",
  "百度系",
  "抖音直播类",
  "抖音信息流类",
  "第三方平台垂直类"
];
const CHANNEL_FLOW_COLORS = ["#3b82f6", "#16b981", "#f59f0a", "#8b5cf6", "#ef4444", "#06b6d4", "#64748b"];
const PRODUCT_FLOW_COLORS = ["#3b82f6", "#16b981", "#f59f0a", "#8b5cf6", "#ef4444", "#06b6d4", "#64748b"];
const DEPARTMENT_ORDER = ["设计一部", "设计二部", "设计三部", "设计四部", "设计五部", "设计六部"];

function departmentSortIndex(name) {
  const index = DEPARTMENT_ORDER.indexOf(name);
  return index >= 0 ? index : DEPARTMENT_ORDER.length;
}

function sortDesignerByDepartment(a, b) {
  const departmentDiff = departmentSortIndex(a.department) - departmentSortIndex(b.department);
  if (departmentDiff) return departmentDiff;
  return String(a.designer || "").localeCompare(String(b.designer || ""), "zh-Hans-CN");
}

const fallbackData = {
  summary: {
    statDays: 108,
    currentOutputWan: 9357,
    currentOrders: 646,
    monthlyOutputWan: 2636,
    annualizedOutputYi: 3.16,
    yearTargetYi: 3.5,
    yearTargetWan: 35000,
    yearProgressPct: 6.4,
    yearTheoryProgressPct: 30,
    monthTargetWan: 2900,
    monthProgressPct: 90.9,
    monthGoalGapWan: 264,
    refundRatePct: 18.6,
    refundRateDeltaPp: 4.5
  },
  productSummary: {
    topProductName: "任性装",
    topProductOutputSharePct: 53.5,
    topProductOutputWan: 5011,
    topProductOrders: 245,
    softSelectedRatePct: 34,
    softPotentialWanPer10Pp: 250,
    highEndOrders: 9
  },
  channelSummary: {
    topChannelName: "广播",
    topChannelOutputWan: 2871,
    topChannelOutputSharePct: 39.07,
    topChannelOrders: 0,
    paidInfoFlowOutputWan: 3032,
    paidInfoFlowOrders: 0,
    paidInfoFlowSharePct: 42.8,
    paidInfoFlowAvgWan: 0,
    stockFlowOutputWan: 53,
    stockFlowOrders: 0,
    stockFlowSharePct: 0.75
  },
  benchmark: {
    monthlyOutputWanAvg: 2468.75,
    monthlyOrdersAvg: 166,
    avgOrderWanAvg: 14.87,
    refundRatePctAvg: 16.27
  },
  kpis: [
    { label: "转正总产值", value: "2,236", unit: "万", note: "1 个月累计 · 年化 2.68 亿", delta: "↑ 12.3%", color: "#3b82f6", progress: 88 },
    { label: "转正单数", value: "170", unit: "单", note: "月均 170 单 · 日均 5.7 单", delta: "↑ 8.7%", color: "#16b981", progress: 92 },
    { label: "均单值（剔除局改）", value: "13.16", unit: "万", note: "均单面积 75.4m² · 单位面积 1,745 元/m²", delta: "一持平", color: "#f59f0a", progress: 66 },
    { label: "本期内退率", value: "18.6", unit: "%", note: "120 / 646 单 · 损失 386.6 万", delta: "↑ 4.5pp", color: "#ef4444", progress: 45 }
  ],
  channels: [
    { name: "线上广播", value: 39.07, color: "#3b82f6" },
    { name: "线上投放类", value: 53.41, color: "#e6499b" },
    { name: "市场部", value: 5.05, color: "#16b981" },
    { name: "回单/转介绍", value: 2.17, color: "#f59f0a" },
    { name: "官网", value: 0, color: "#06b6d4" },
    { name: "其他", value: 0, color: "#64748b" }
  ],
  products: [
    { name: "任性装", value: 38.0, color: "#3b82f6" },
    { name: "轻松装", value: 20.0, color: "#16b981" },
    { name: "T1-2.0", value: 14.0, color: "#f59f0a" },
    { name: "新Q3", value: 10.0, color: "#8b5cf6" },
    { name: "Q5", value: 8.0, color: "#ef4444" },
    { name: "89900", value: 6.0, color: "#06b6d4" },
    { name: "基装", value: 4.0, color: "#64748b" }
  ],
  multiMetrics: [
    ["转正总产值(至今)", "10,873.12", "万元"],
    ["转正总单数", "740", "单"],
    ["转正均单值(剔除局改)", "14.69", "万元/单"],
    ["均单面积(剔除局改)", "78.81", "m²"],
    ["月均产值(推算)", "2,718", "万元/月"],
    ["月均转正", "185", "单/月"],
    ["日均产值", "90.6", "万元/天"],
    ["年化产值(线性外推)", "3.26", "亿元"]
  ],
  productContribution: [
    { name: "任性装", output: 38.0, orders: 32.0 },
    { name: "轻松装", output: 20.0, orders: 24.0 },
    { name: "T1-2.0", output: 14.0, orders: 13.0 },
    { name: "新Q3", output: 10.0, orders: 11.0 },
    { name: "Q5", output: 8.0, orders: 6.0 },
    { name: "89900", output: 6.0, orders: 12.0 },
    { name: "基装", output: 4.0, orders: 7.0 }
  ],
  productValue: [
    { name: "任性装", value: 18.24, color: "#3b82f6" },
    { name: "轻松装", value: 12.4, color: "#16b981" },
    { name: "T1-2.0", value: 16.8, color: "#f59f0a" },
    { name: "新Q3", value: 15.6, color: "#8b5cf6" },
    { name: "Q5", value: 22.8, color: "#ef4444" },
    { name: "89900", value: 8.99, color: "#06b6d4" },
    { name: "基装", value: 7.6, color: "#64748b" }
  ],
  productArea: [
    { name: "任性装", value: 97.94, color: "#3b82f6" },
    { name: "轻松装", value: 68.2, color: "#16b981" },
    { name: "T1-2.0", value: 88.5, color: "#f59f0a" },
    { name: "新Q3", value: 82.4, color: "#8b5cf6" },
    { name: "Q5", value: 118.6, color: "#ef4444" },
    { name: "89900", value: 62.8, color: "#06b6d4" },
    { name: "基装", value: 70.5, color: "#64748b" }
  ],
  soft: [
    { name: "任性装整体", count: 278, selectedRatePct: 38.9, noSoft: 15.7, soft: 21.77, lift: "+38.7%" },
    { name: "轻松装整体", count: 142, selectedRatePct: 24.6, noSoft: 10.8, soft: 14.15, lift: "+31.0%" },
    { name: "加权总计", count: 420, selectedRatePct: 34, noSoft: 14.65, soft: 20.55, lift: "+40.3%" }
  ],
  productInsights: [
    ["经营节奏：年化 3.16 亿，需警惕季节性", "108 天内实现产值 9,357 万、转正 646 单、月均 2,636 万。线性外推全年约 3.16 亿，但装修业 Q1 偏淡、Q3/Q4 才是旺季，建议按月滚动追踪产值 / 单数 / 均单值。"],
    ["任性装是当前第一主力，风险与机会并存", "任性装贡献最高，主力集中带来高交付效率，也意味着产品风险敞口更集中。建议锁定任性装标准化交付，同时培育轻松装、T1-2.0 等第二梯队产品。"],
    ["高客单产品要沉淀成交样板", "优先复盘均单最高的产品线，拆解客户来源、户型面积、报价完整度和设计师成交动作，把高客单路径沉淀成可复制话术。"],
    ["89900 与基装偏走量低客单，战略定位要厘清", "89900、基装更适合承担入口和转化功能。若作为引流产品，要重点追踪后续升级率；若作为独立利润中心，需要核查毛利率和交付成本。"]
  ],
  channelRanking: [
    { name: "广播", value: 2871, orders: null, sharePct: 39.07, color: "#e9a6e8" },
    { name: "抖音直播类", value: 1367, orders: null, sharePct: 18.6, color: "#ddef89" },
    { name: "百度系", value: 1151, orders: null, sharePct: 15.66, color: "#a7e6df" },
    { name: "第三方平台垂直类", value: 628, orders: null, sharePct: 8.55, color: "#b9efb3" },
    { name: "抖音信息流类", value: 487, orders: null, sharePct: 6.63, color: "#a9dbf2" },
    { name: "腾讯系", value: 292, orders: null, sharePct: 3.97, color: "#cfd4ff" },
    { name: "小区(非定点)", value: 172, orders: null, sharePct: 2.34, color: "#dcefff" },
    { name: "运营类", value: 140, orders: null, sharePct: 1.91, color: "#e0f6dd" },
    { name: "其他中介", value: 98, orders: null, sharePct: 1.33, color: "#f0e7a8" },
    { name: "设计回单", value: 51, orders: null, sharePct: 0.7, color: "#b7e7f0" },
    { name: "小区(定点)", value: 36, orders: null, sharePct: 0.49, color: "#d9d6ff" },
    { name: "展会", value: 23, orders: null, sharePct: 0.31, color: "#f4d7a4" },
    { name: "21世纪", value: 5, orders: null, sharePct: 0.07, color: "#edf3bd" },
    { name: "关系单", value: 3, orders: null, sharePct: 0.04, color: "#efe8bd" },
    { name: "工程回单", value: 2, orders: null, sharePct: 0.03, color: "#d9f2c4" }
  ],
  channelInsights: [
    ["广播仍是第一渠道，依赖度需要单独看", "广播贡献 <strong>2,871 万（占 39.07%）</strong>，是当前最重要的单一渠道。建议保住广播基本盘，同时观察抖音直播类、百度系能否承接第二增长盘。"],
    ["线上投放类已经是最大渠道组", "抖音直播类、百度系、第三方平台垂直类、抖音信息流类、腾讯系合计约 3,925 万，占比约 53.41%。建议分别看成本、转正率和均单，不要只用“线上”一个大类粗放判断。"],
    ["社区/线下类贡献不高，但适合做精细化试点", "小区(非定点)、运营类、小区(定点)、展会、21世纪合计约 376 万，占比约 5.12%。建议重点验证小区打法和活动转化，不建议平均铺资源。"],
    ["低占比渠道先排口径，再决定保留方式", "设计回单、工程回单、关系单、其他中介等渠道占比较低。建议先确认 CRM 分类是否完整，再决定是作为机会渠道观察，还是合并到转介绍/回单类管理。"]
  ],
  departments: [
    { name: "设计一部", output: 1820.6, orders: 116, avg: 15.7, people: 10, monthly: 182.1, refund: 17, refundRate: 14.7, perCapita: 182.1, risk: "关注" },
    { name: "设计二部", output: 1658.4, orders: 108, avg: 15.36, people: 9, monthly: 165.8, refund: 24, refundRate: 22.2, perCapita: 184.3, risk: "警戒" },
    { name: "设计三部", output: 1536.7, orders: 95, avg: 16.18, people: 8, monthly: 153.7, refund: 10, refundRate: 10.5, perCapita: 192.1, risk: "稳健" },
    { name: "设计四部", output: 1428.3, orders: 98, avg: 14.57, people: 8, monthly: 142.8, refund: 13, refundRate: 13.3, perCapita: 178.5, risk: "良好" },
    { name: "设计五部", output: 1218.9, orders: 89, avg: 13.7, people: 7, monthly: 121.9, refund: 18, refundRate: 20.2, perCapita: 174.1, risk: "警戒" },
    { name: "设计六部", output: 1094.2, orders: 72, avg: 15.2, people: 7, monthly: 109.4, refund: 23, refundRate: 31.9, perCapita: 156.3, risk: "高危" }
  ],
  scenarios: [
    { name: "当前", value: 9357, delta: "", color: "#94a3b8" },
    { name: "六部控退", value: 9776, delta: "+419 万", color: "#ef4444" },
    { name: "五部提均单", value: 9854, delta: "+497 万", color: "#f59f0a" },
    { name: "二六部双向补课", value: 10312, delta: "+955 万", color: "#8b5cf6" }
  ]
};

fallbackData.months = [
  { id: "01", label: "01月" },
  { id: "02", label: "02月" },
  { id: "03", label: "03月" },
  { id: "04", label: "04月" }
];

fallbackData.monthlyData = {
  "01": createMonthSnapshot({
    month: "01",
    outputWan: 2104,
    orders: 152,
    refundRatePct: 13.4,
    refundOrders: 20,
    refundLossWan: 216,
    channelShares: [35.8, 55.2, 5.9, 3.1],
    productShares: [36, 21, 14, 10, 8, 7, 4],
    productOrderShares: [31, 25, 13, 11, 6, 14, 8],
    softLiftRate: 34
  }),
  "02": createMonthSnapshot({
    month: "02",
    outputWan: 2387,
    orders: 161,
    refundRatePct: 15.2,
    refundOrders: 25,
    refundLossWan: 264,
    channelShares: [37.6, 54.4, 5.3, 2.7],
    productShares: [38, 20, 15, 10, 8, 6, 3],
    productOrderShares: [32, 24, 13, 11, 6, 13, 7],
    softLiftRate: 37
  }),
  "03": createMonthSnapshot({
    month: "03",
    outputWan: 2748,
    orders: 181,
    refundRatePct: 17.1,
    refundOrders: 31,
    refundLossWan: 318,
    channelShares: [40.2, 51.1, 5.0, 3.7],
    productShares: [40, 20, 14, 9, 9, 5, 3],
    productOrderShares: [33, 24, 12, 10, 7, 12, 6],
    softLiftRate: 39
  }),
  "04": createMonthSnapshot({
    month: "04",
    outputWan: 2636,
    orders: 170,
    refundRatePct: 18.6,
    refundOrders: 32,
    refundLossWan: 386.6,
    channelShares: [39.07, 53.41, 5.12, 2.1],
    productShares: [38, 20, 14, 10, 8, 6, 4],
    productOrderShares: [32, 24, 13, 11, 6, 12, 7],
    softLiftRate: 40.3
  })
};

let dashboardData = fallbackData;
let selectedMonths = new Set(["04"]);

async function loadData() {
  if (window.GM_DASHBOARD_DATA) {
    dashboardData = window.GM_DASHBOARD_DATA;
    initializeMonthSelection(dashboardData);
    renderDashboard(getFilteredDashboardData());
    return;
  }

  if (location.protocol === "file:") {
    dashboardData = fallbackData;
    initializeMonthSelection(dashboardData);
    renderDashboard(getFilteredDashboardData());
    return;
  }

  try {
    const response = await fetch("./dashboard.json", { cache: "no-store" });
    if (!response.ok) throw new Error("No local JSON yet");
    dashboardData = await response.json();
  } catch {
    dashboardData = fallbackData;
  }
  initializeMonthSelection(dashboardData);
  renderDashboard(getFilteredDashboardData());
}

let monthSelectionInitialized = false;

function initializeMonthSelection(data) {
  const months = getAvailableMonths(data);
  renderMonthFilters(getMonthFilterOptions(data));

  if (!monthSelectionInitialized && months.length) {
    selectedMonths = new Set([months[months.length - 1].id]);
    monthSelectionInitialized = true;
  }

  const availableIds = new Set(months.map(month => month.id));
  selectedMonths = new Set([...selectedMonths].filter(month => availableIds.has(month)));

  if (!selectedMonths.size && months.length && monthSelectionInitialized) {
    selectedMonths = new Set([months[months.length - 1].id]);
  }

  syncMonthButtonState();
  updateMonthLabel();
}

function renderMonthFilters(months) {
  const root = document.getElementById("monthFilters");
  root.innerHTML = `<span>月份</span>` + months.map(month => `
    <button type="button" data-month="${month.id}"${month.hasData ? "" : " disabled"} title="${month.hasData ? "点击筛选该月份数据" : "暂无该月份数据，飞书补数后自动可选"}">${month.label}</button>
  `).join("");
}

function getMonthFilterOptions(data) {
  const availableByMonth = new Map();
  getAvailableMonths(data).forEach(month => {
    const normalized = normalizeMonth(month.id);
    if (normalized) availableByMonth.set(normalized, month);
  });

  return Array.from({ length: 12 }, (_, index) => {
    const monthId = String(index + 1).padStart(2, "0");
    const availableMonth = availableByMonth.get(monthId);
    return {
      id: availableMonth?.id || monthId,
      label: `${monthId}月`,
      hasData: Boolean(availableMonth)
    };
  });
}

function getAvailableMonths(data) {
  const monthlyKeysByMonth = new Map();
  if (data.monthlyData && typeof data.monthlyData === "object") {
    Object.keys(data.monthlyData).forEach(key => {
      const normalized = normalizeMonth(key);
      if (normalized) monthlyKeysByMonth.set(normalized, key);
    });
  }

  const monthsById = new Map();
  const addMonth = (rawId, rawLabel) => {
    const normalized = normalizeMonth(rawId);
    if (!normalized) return;
    const id = monthlyKeysByMonth.get(normalized) || String(rawId);
    monthsById.set(id, {
      id,
      label: rawLabel || formatMonthLabel(id),
      sortKey: normalized
    });
  };

  if (Array.isArray(data.months) && data.months.length) {
    data.months.forEach(month => {
      if (typeof month === "string") {
        addMonth(month);
      } else {
        addMonth(month.id || month.month || month.value, month.label || month.name);
      }
    });
  }

  monthlyKeysByMonth.forEach(key => addMonth(key));

  if (Array.isArray(data.orders)) {
    data.orders.forEach(order => {
      addMonth(order.month || order.signed_date || order.signedDate || order.date || order.createdAt);
    });
  }

  if (monthsById.size) {
    return [...monthsById.values()]
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map(({ id, label }) => ({ id, label }));
  }

  return fallbackData.months;
}

function getFilteredDashboardData() {
  const months = getAvailableMonths(dashboardData);
  const monthIds = selectedMonths.size ? [...selectedMonths] : months.map(month => month.id);
  const benchmark = getKpiBenchmark(dashboardData);
  const snapshots = monthIds
    .map(month => dashboardData.monthlyData?.[month])
    .filter(Boolean);

  if (!dashboardData.monthlyData || !snapshots.length) {
    return rebuildKpisForView(cloneData(dashboardData), benchmark);
  }

  const viewData = snapshots.length === 1 ? cloneData(snapshots[0]) : aggregateMonthSnapshots(snapshots);
  viewData.scenarios = buildDepartmentControlRows(viewData.departments || []);
  viewData.months = months;
  viewData.monthlyData = dashboardData.monthlyData;
  viewData.summary.periodLabel = getPeriodLabel(months, monthIds);
  return rebuildKpisForView(viewData, benchmark);
}

function rebuildKpisForView(data, benchmark) {
  const avgOrder = safeDivide(data.summary?.positiveOutputWan ?? data.summary?.currentOutputWan, data.summary?.currentOrders);
  data.benchmark = benchmark;
  data.kpis = buildKpisFromSummary(data.summary || {}, avgOrder, benchmark);
  return data;
}

function getKpiBenchmark(data) {
  const input = data.benchmark || data.kpiBenchmark || {};
  const explicitBenchmark = {
    monthlyOutputWanAvg: pickNumber(input, ["monthlyOutputWanAvg", "monthly_output_wan_avg"]),
    monthlyOrdersAvg: pickNumber(input, ["monthlyOrdersAvg", "monthly_orders_avg"]),
    avgOrderWanAvg: pickNumber(input, ["avgOrderWanAvg", "avg_order_wan_avg"]),
    refundRatePctAvg: pickNumber(input, ["refundRatePctAvg", "refund_rate_pct_avg"])
  };
  if (Object.values(explicitBenchmark).every(value => value > 0)) return explicitBenchmark;

  const snapshots = data.monthlyData && typeof data.monthlyData === "object" ? Object.values(data.monthlyData) : [];
  if (!snapshots.length) {
    const summary = data.summary || {};
    const monthCount = getSummaryMonthCount(summary);
    return {
      monthlyOutputWanAvg: explicitBenchmark.monthlyOutputWanAvg || summary.monthlyOutputWan || safeDivide(summary.currentOutputWan, monthCount),
      monthlyOrdersAvg: explicitBenchmark.monthlyOrdersAvg || safeDivide(summary.currentOrders, monthCount),
      avgOrderWanAvg: explicitBenchmark.avgOrderWanAvg || safeDivide(summary.currentOutputWan, summary.currentOrders),
      refundRatePctAvg: explicitBenchmark.refundRatePctAvg || summary.refundRatePct || 0
    };
  }

  const monthlyOutputs = snapshots.map(snapshot => snapshot.summary?.monthlyPositiveOutputWan || snapshot.summary?.positiveOutputWan || 0);
  const monthlyOrders = snapshots.map(snapshot => safeDivide(snapshot.summary?.currentOrders || 0, getSummaryMonthCount(snapshot.summary || {})));
  const totalOutput = sum(snapshots, snapshot => snapshot.summary?.positiveOutputWan || 0);
  const totalOrders = sum(snapshots, snapshot => snapshot.summary?.currentOrders || 0);
  const totalRefundOrders = sum(snapshots, snapshot => snapshot.summary?.refundOrders || 0);
  const avgRefundRate = safeDivide(sum(snapshots, snapshot => snapshot.summary?.refundRatePct || 0), snapshots.length);

  return {
    monthlyOutputWanAvg: explicitBenchmark.monthlyOutputWanAvg || round(safeDivide(sum(monthlyOutputs, value => value), monthlyOutputs.length)),
    monthlyOrdersAvg: explicitBenchmark.monthlyOrdersAvg || round(safeDivide(sum(monthlyOrders, value => value), monthlyOrders.length)),
    avgOrderWanAvg: explicitBenchmark.avgOrderWanAvg || round(safeDivide(totalOutput, totalOrders)),
    refundRatePctAvg: explicitBenchmark.refundRatePctAvg || round(totalRefundOrders ? safeDivide(totalRefundOrders * 100, totalOrders) : avgRefundRate)
  };
}

function aggregateMonthSnapshots(snapshots) {
  const totalOutput = sum(snapshots, item => item.summary.currentOutputWan);
  const totalNetOutput = sum(snapshots, item => item.summary.netOutputWan ?? item.summary.currentOutputWan);
  const totalPositiveOutput = sum(snapshots, item => item.summary.positiveOutputWan ?? item.summary.currentOutputWan);
  const totalQuoteOutput = sum(snapshots, item => item.summary.quoteOutputWan || 0);
  const totalSystemOutput = sum(snapshots, item => item.summary.systemOutputWan ?? item.summary.currentOutputWan);
  const totalSignSystemOutput = sum(snapshots, item => item.summary.signSystemOutputWan || 0);
  const totalOrders = sum(snapshots, item => item.summary.currentOrders);
  const totalRefundOrders = sum(snapshots, item => item.summary.refundOrders || 0);
  const totalRefundLoss = sum(snapshots, item => item.summary.refundLossWan || 0);
  const count = snapshots.length;
  const yearTargetWan = snapshots.find(item => item.summary.yearTargetWan)?.summary.yearTargetWan || 35000;
  const monthTargetWan = round(safeDivide(sum(snapshots, item => item.summary.monthTargetWan || 0), count)) || 2900;
  const theoryProgressPct = Math.max(...snapshots.map(item => item.summary.yearTheoryProgressPct || 0));
  const avgOrder = safeDivide(totalPositiveOutput, totalOrders);
  const monthlyOutput = safeDivide(totalNetOutput, count);
  const monthlyPositiveOutput = safeDivide(totalPositiveOutput, count);
  const monthlyQuoteOutput = safeDivide(totalQuoteOutput, count);
  const monthlySystemOutput = safeDivide(totalSystemOutput, count);
  const refundRate = safeDivide(totalRefundOrders * 100, totalOrders);
  const summary = {
    statDays: count * 30,
    currentOutputWan: round(totalNetOutput),
    netOutputWan: round(totalNetOutput),
    positiveOutputWan: round(totalPositiveOutput),
    quoteOutputWan: round(totalQuoteOutput),
    systemOutputWan: round(totalSystemOutput),
    signSystemOutputWan: round(totalSignSystemOutput),
    currentOrders: Math.round(totalOrders),
    monthlyOutputWan: round(monthlyOutput),
    monthlyNetOutputWan: round(monthlyOutput),
    monthlyPositiveOutputWan: round(monthlyPositiveOutput),
    monthlyQuoteOutputWan: round(monthlyQuoteOutput),
    monthlySystemOutputWan: round(monthlySystemOutput),
    annualizedOutputYi: round((monthlyOutput * 12) / 10000),
    positiveAnnualizedOutputYi: round((monthlyPositiveOutput * 12) / 10000),
    systemAnnualizedOutputYi: round((monthlySystemOutput * 12) / 10000),
    yearTargetYi: round(yearTargetWan / 10000),
    yearTargetWan,
    yearProgressPct: round((totalNetOutput / yearTargetWan) * 100),
    positiveYearProgressPct: round((totalPositiveOutput / yearTargetWan) * 100),
    systemYearProgressPct: round((totalSystemOutput / yearTargetWan) * 100),
    yearTheoryProgressPct: theoryProgressPct || round((count / 12) * 100),
    monthTargetWan,
    monthProgressPct: round(safeDivide(monthlyOutput * 100, monthTargetWan)),
    positiveMonthProgressPct: round(safeDivide(monthlyPositiveOutput * 100, monthTargetWan)),
    systemMonthProgressPct: round(safeDivide(monthlySystemOutput * 100, monthTargetWan)),
    monthGoalGapWan: round(Math.max(0, monthTargetWan - monthlyOutput)),
    positiveMonthGoalGapWan: round(Math.max(0, monthTargetWan - monthlyPositiveOutput)),
    systemMonthGoalGapWan: round(Math.max(0, monthTargetWan - monthlySystemOutput)),
    refundRatePct: round(refundRate),
    refundRateDeltaPp: round(refundRate - 14),
    refundOrders: Math.round(totalRefundOrders),
    refundLossWan: round(totalRefundLoss)
  };

  const products = aggregateNetFlowRows(snapshots, "products", PRODUCT_FLOW_COLORS);
  const productContribution = aggregateProductContribution(snapshots);
  const productValue = aggregateAverageRows(snapshots, "productValue", item => item.summary.currentOrders);
  const productArea = aggregateAverageRows(snapshots, "productArea", item => item.summary.currentOrders);
  const soft = aggregateSoftRows(snapshots);
  const channelRanking = aggregateChannelRanking(snapshots, totalSystemOutput);
  const channels = aggregateChannelSystemRows(snapshots);
  const departments = aggregateDepartments(snapshots);
  const designerHeatmap = aggregateDesignerHeatmap(snapshots);

  return {
    ...cloneData(fallbackData),
    summary,
    productSummary: {
      topProductName: products[0]?.name || "主力产品线",
      topProductOutputSharePct: products[0]?.value || 0,
      topProductOutputWan: round(products[0]?.netValueWan || totalNetOutput * ((products[0]?.value || 0) / 100)),
      topProductOrders: Math.round(totalOrders * ((productContribution[0]?.orders || 0) / 100)),
      softSelectedRatePct: 34,
      softPotentialWanPer10Pp: 250,
      highEndOrders: 9
    },
    channelSummary: {
      topChannelName: channelRanking[0]?.name || "主力渠道",
      topChannelOutputWan: round(channelRanking[0]?.value || 0),
      topChannelOutputSharePct: channelRanking[0]?.sharePct || 0,
      topChannelOrders: channelRanking[0]?.orders || 0,
      paidInfoFlowOutputWan: round(totalSystemOutput * 0.315),
      paidInfoFlowOrders: Math.round(totalOrders * 0.296),
      paidInfoFlowSharePct: 31.5,
      paidInfoFlowAvgWan: 16.42,
      stockFlowOutputWan: round(totalSystemOutput * 0.296),
      stockFlowOrders: Math.round(totalOrders * 0.307),
      stockFlowSharePct: 29.6
    },
    kpis: buildKpisFromSummary(summary, avgOrder),
    multiMetrics: buildMultiMetricsFromSummary(summary, avgOrder),
    channels,
    products,
    productContribution,
    productValue,
    productArea,
    soft,
    channelRanking,
    departments,
    designerHeatmap,
    scenarios: buildDepartmentControlRows(departments),
    heatmapCategories: [],
    heatmap: []
  };
}

function createMonthSnapshot(config) {
  const avgOrder = safeDivide(config.outputWan, config.orders);
  const summary = {
    statDays: 30,
    currentOutputWan: config.outputWan,
    currentOrders: config.orders,
    monthlyOutputWan: config.outputWan,
    annualizedOutputYi: round((config.outputWan * 12) / 10000),
    yearTargetYi: 3.5,
    yearTargetWan: 35000,
    yearProgressPct: round((config.outputWan / 35000) * 100),
    yearTheoryProgressPct: 8.3,
    monthTargetWan: 2900,
    monthProgressPct: round((config.outputWan / 2900) * 100),
    monthGoalGapWan: round(Math.max(0, 2900 - config.outputWan)),
    refundRatePct: config.refundRatePct,
    refundRateDeltaPp: round(config.refundRatePct - 14),
    refundOrders: config.refundOrders,
    refundLossWan: config.refundLossWan
  };

  const products = fallbackData.products.map((row, index) => ({ ...row, value: config.productShares[index] ?? row.value }));
  const channelRanking = scaleChannelRanking(config.outputWan, config.orders);
  const channels = aggregateChannelOutreachRows(channelRanking, config.outputWan);
  const productContribution = fallbackData.productContribution.map((row, index) => ({
    ...row,
    output: config.productShares[index] ?? row.output,
    orders: config.productOrderShares[index] ?? row.orders
  }));
  const productValue = fallbackData.productValue.map((row, index) => ({
    ...row,
    value: round(row.value * (0.95 + index * 0.015 + config.outputWan / 80000))
  }));
  const soft = fallbackData.soft.map(row => ({
    ...row,
    soft: round(row.noSoft * (1 + config.softLiftRate / 100)),
    lift: `+${config.softLiftRate}%`
  }));

  return {
    ...cloneData(fallbackData),
    summary,
    productSummary: {
      topProductName: products[0].name,
      topProductOutputSharePct: products[0].value,
      topProductOutputWan: round(config.outputWan * products[0].value / 100),
      topProductOrders: Math.round(config.orders * productContribution[0].orders / 100),
      softSelectedRatePct: 34,
      softPotentialWanPer10Pp: 250,
      highEndOrders: 9
    },
    channelSummary: {
      topChannelName: channels[0]?.name || "线上广播",
      topChannelOutputWan: round(config.outputWan * (channels[0]?.value || 0) / 100),
      topChannelOutputSharePct: channels[0]?.value || 0,
      topChannelOrders: Math.round(config.orders * 0.325),
      paidInfoFlowOutputWan: round(config.outputWan * 0.315),
      paidInfoFlowOrders: Math.round(config.orders * 0.296),
      paidInfoFlowSharePct: 31.5,
      paidInfoFlowAvgWan: 16.42,
      stockFlowOutputWan: round(config.outputWan * 0.296),
      stockFlowOrders: Math.round(config.orders * 0.307),
      stockFlowSharePct: 29.6
    },
    kpis: buildKpisFromSummary(summary, avgOrder),
    multiMetrics: buildMultiMetricsFromSummary(summary, avgOrder),
    channels,
    products,
    productContribution,
    productValue,
    productArea: fallbackData.productArea,
    soft,
    channelRanking,
    departments: scaleDepartments(config.outputWan, config.orders, config.refundRatePct),
    designerHeatmap: [],
    scenarios: scaleScenarios(config.outputWan),
    heatmapCategories: [],
    heatmap: []
  };
}

function buildKpisFromSummary(summary, avgOrder, benchmark = fallbackData.benchmark) {
  const monthCount = getSummaryMonthCount(summary);
  const monthlyOrders = safeDivide(summary.currentOrders, monthCount);
  const positiveOutput = summary.positiveOutputWan ?? summary.currentOutputWan;
  const monthlyPositiveOutput = summary.monthlyPositiveOutputWan ?? summary.monthlyOutputWan;
  const positiveAvgOrder = safeDivide(positiveOutput, summary.currentOrders);
  return [
    {
      label: "转正总产值",
      value: formatNumber(positiveOutput),
      unit: "万",
      note: `${summary.currentOrders} 单累计 · 月均 ${formatNumber(monthlyPositiveOutput)} 万`,
      delta: getKpiBadgeLabel("monthlyOutputWan", monthlyPositiveOutput, benchmark.monthlyOutputWanAvg),
      color: "#3b82f6",
      progress: getKpiProgress("monthlyOutputWan", monthlyPositiveOutput, benchmark.monthlyOutputWanAvg)
    },
    {
      label: "转正单数",
      value: formatNumber(summary.currentOrders),
      unit: "单",
      note: `月均 ${formatNumber(monthlyOrders)} 单 · 日均 ${formatNumber(summary.currentOrders / Math.max(1, summary.statDays))} 单`,
      delta: getKpiBadgeLabel("monthlyOrders", monthlyOrders, benchmark.monthlyOrdersAvg),
      color: "#16b981",
      progress: getKpiProgress("monthlyOrders", monthlyOrders, benchmark.monthlyOrdersAvg)
    },
    {
      label: "均单值（剔除局改）",
      value: formatNumber(positiveAvgOrder || avgOrder),
      unit: "万",
      note: "按当前筛选月份有效订单计算",
      delta: getKpiBadgeLabel("avgOrderWan", positiveAvgOrder || avgOrder, benchmark.avgOrderWanAvg),
      color: "#f59f0a",
      progress: getKpiProgress("avgOrderWan", positiveAvgOrder || avgOrder, benchmark.avgOrderWanAvg)
    },
    {
      label: "本期内退率",
      value: formatNumber(summary.refundRatePct),
      unit: "%",
      note: `${summary.refundOrders || 0} 单内退 · 损失 ${formatNumber(summary.refundLossWan || 0)} 万`,
      delta: getKpiBadgeLabel("refundRatePct", summary.refundRatePct, benchmark.refundRatePctAvg),
      color: "#ef4444",
      progress: getKpiProgress("refundRatePct", summary.refundRatePct, benchmark.refundRatePctAvg)
    }
  ];
}

function getKpiBadgeLabel(metricKey, currentValue, benchmarkValue) {
  const ruleEngine = typeof window !== "undefined" ? window.RuleTalkEngine : null;
  if (ruleEngine?.getKpiBadge) {
    return ruleEngine.getKpiBadge(metricKey, currentValue, benchmarkValue).label;
  }
  return getFallbackKpiBadgeLabel(metricKey, currentValue, benchmarkValue);
}

function getKpiProgress(metricKey, currentValue, benchmarkValue) {
  if (!benchmarkValue) return 0;
  if (metricKey === "refundRatePct") {
    if (!currentValue) return 100;
    return clampPercent(safeDivide(benchmarkValue * 100, currentValue));
  }
  return clampPercent(safeDivide(currentValue * 100, benchmarkValue));
}

function getFallbackKpiBadgeLabel(metricKey, currentValue, benchmarkValue) {
  const ratio = safeDivide(currentValue, benchmarkValue);
  const diffPp = currentValue - benchmarkValue;
  if (!benchmarkValue) return "稳定";

  if (metricKey === "refundRatePct") {
    if (diffPp <= -3) return "风险良好";
    if (diffPp <= -1) return "有所改善";
    if (diffPp <= 1) return "稳定";
    if (diffPp <= 3) return "需关注";
    return "↑ 警戒";
  }

  if (metricKey === "avgOrderWan") {
    if (ratio >= 1.08) return "显著高于均值";
    if (ratio >= 1.03) return "高于均值";
    if (ratio >= 0.97) return "接近均值";
    if (ratio >= 0.92) return "低于均值";
    return "客单偏低";
  }

  if (ratio >= 1.1) return "↑ 优秀";
  if (ratio >= 1.03) return "↑ 良好";
  if (ratio >= 0.97) return "稳定";
  if (ratio >= 0.9) return "↓ 关注";
  return metricKey === "monthlyOrders" ? "需补单" : "需追赶";
}

function getSummaryMonthCount(summary = {}) {
  return Math.max(1, Math.round((summary.statDays || 30) / 30));
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

function buildMultiMetricsFromSummary(summary, avgOrder) {
  const monthCount = getSummaryMonthCount(summary);
  const positiveOutput = summary.positiveOutputWan ?? summary.currentOutputWan;
  const monthlyPositiveOutput = summary.monthlyPositiveOutputWan ?? summary.monthlyOutputWan;
  const positiveAvgOrder = safeDivide(positiveOutput, summary.currentOrders) || avgOrder;
  return [
    ["转正总产值(至今)", formatNumber(positiveOutput), "万元"],
    ["转正总单数", formatNumber(summary.currentOrders), "单"],
    ["转正均单值(剔除局改)", formatNumber(positiveAvgOrder), "万元/单"],
    ["均单面积(剔除局改)", "78.81", "m²"],
    ["月均产值(推算)", formatNumber(monthlyPositiveOutput), "万元/月"],
    ["月均转正", formatNumber(summary.currentOrders / monthCount), "单/月"],
    ["日均产值", formatNumber(positiveOutput / Math.max(1, summary.statDays)), "万元/天"],
    ["年化产值(线性外推)", formatNumber(summary.annualizedOutputYi), "亿元"]
  ];
}

function aggregateShareRows(snapshots, key, weightGetter) {
  const totals = new Map();
  let totalWeight = 0;
  snapshots.forEach(snapshot => {
    const weight = weightGetter(snapshot);
    totalWeight += weight;
    (snapshot[key] || []).forEach(row => {
      const current = totals.get(row.name) || { ...row, weighted: 0 };
      current.weighted += row.value * weight;
      current.color = row.color;
      totals.set(row.name, current);
    });
  });
  return [...totals.values()].map(row => ({
    name: row.name,
    value: round(safeDivide(row.weighted, totalWeight)),
    color: row.color
  })).sort((a, b) => b.value - a.value);
}

function aggregateNetFlowRows(snapshots, key, palette) {
  const totals = new Map();
  snapshots.forEach(snapshot => {
    (snapshot[key] || []).forEach(row => {
      const current = totals.get(row.name) || { ...row, name: row.name, netValueWan: 0 };
      const rowNetValue = Number(row.netValueWan);
      const rowPctValue = Number(row.value);
      const baseValue = Number(snapshot.summary?.productNetOutputWan ?? snapshot.summary?.netOutputWan ?? snapshot.summary?.currentOutputWan) || 0;
      current.netValueWan += Number.isFinite(rowNetValue)
        ? rowNetValue
        : safeDivide(rowPctValue * baseValue, 100);
      current.color = row.color;
      totals.set(row.name, current);
    });
  });

  const denominator = sum([...totals.values()], row => Math.abs(row.netValueWan || 0));
  return [...totals.values()]
    .filter(row => row.netValueWan !== 0)
    .sort((a, b) => Math.abs(b.netValueWan || 0) - Math.abs(a.netValueWan || 0))
    .map((row, index) => ({
      ...row,
      netValueWan: round(row.netValueWan),
      value: round(safeDivide(Math.abs(row.netValueWan || 0) * 100, denominator)),
      color: row.color || palette[index % palette.length] || "#3b82f6"
    }));
}

function aggregateProductContribution(snapshots) {
  const totals = new Map();
  let outputWeight = 0;
  let orderWeight = 0;

  snapshots.forEach(snapshot => {
    const outputBase = Number(snapshot.summary?.productNetOutputWan ?? snapshot.summary?.netOutputWan ?? snapshot.summary?.currentOutputWan) || 0;
    const orderBase = Number(snapshot.summary?.currentOrders) || 0;
    outputWeight += outputBase;
    orderWeight += orderBase;

    (snapshot.productContribution || []).forEach(row => {
      const current = totals.get(row.name) || { name: row.name, outputWeighted: 0, orderWeighted: 0 };
      current.outputWeighted += (Number(row.output) || 0) * outputBase;
      current.orderWeighted += (Number(row.orders) || 0) * orderBase;
      totals.set(row.name, current);
    });
  });

  return [...totals.values()]
    .map(row => ({
      name: row.name,
      output: round(safeDivide(row.outputWeighted, outputWeight)),
      orders: round(safeDivide(row.orderWeighted, orderWeight))
    }))
    .sort((a, b) => b.output - a.output);
}

function aggregateChannelSystemRows(snapshots) {
  const totals = new Map();
  snapshots.forEach(snapshot => {
    (snapshot.channels || []).forEach(row => {
      const current = totals.get(row.name) || { ...row, netValueWan: 0 };
      const netValue = Number(row.netValueWan);
      current.netValueWan += Number.isFinite(netValue) ? netValue : 0;
      current.color = row.color;
      totals.set(row.name, current);
    });
  });

  const denominator = sum([...totals.values()], row => Math.abs(row.netValueWan || 0));
  return [...totals.values()]
    .filter(row => row.netValueWan !== 0)
    .sort((a, b) => Math.abs(b.netValueWan || 0) - Math.abs(a.netValueWan || 0))
    .map((row, index) => ({
      ...row,
      netValueWan: round(row.netValueWan),
      value: round(safeDivide(Math.abs(row.netValueWan || 0) * 100, denominator)),
      color: row.color || CHANNEL_FLOW_COLORS[index % CHANNEL_FLOW_COLORS.length] || "#3b82f6"
    }));
}

function aggregateAverageRows(snapshots, key, weightGetter) {
  const totals = new Map();
  let totalWeight = 0;
  snapshots.forEach(snapshot => {
    const weight = weightGetter(snapshot);
    totalWeight += weight;
    (snapshot[key] || []).forEach(row => {
      const current = totals.get(row.name) || { ...row, weighted: 0 };
      current.weighted += row.value * weight;
      current.color = row.color;
      totals.set(row.name, current);
    });
  });
  return [...totals.values()].map(row => ({
    name: row.name,
    value: round(safeDivide(row.weighted, totalWeight)),
    color: row.color
  }));
}

function aggregateSoftRows(snapshots) {
  const names = fallbackData.soft.map(row => row.name);
  return names.map(name => {
    const rows = snapshots.map(snapshot => snapshot.soft.find(row => row.name === name)).filter(Boolean);
    const count = sum(rows, row => row.count || 0);
    const noSoft = safeDivide(sum(rows, row => row.noSoft * (row.count || 1)), sum(rows, row => row.count || 1));
    const soft = safeDivide(sum(rows, row => row.soft * (row.count || 1)), sum(rows, row => row.count || 1));
    const selectedRatePct = safeDivide(sum(rows, row => (row.selectedRatePct || 0) * (row.count || 1)), sum(rows, row => row.count || 1));
    const lift = noSoft ? `+${round(((soft - noSoft) / noSoft) * 100)}%` : "+0%";
    return { name, count, selectedRatePct: round(selectedRatePct), noSoft: round(noSoft), soft: round(soft), lift };
  });
}

function aggregateChannelRanking(snapshots, totalOutput) {
  const rowsByName = new Map();
  snapshots.forEach(snapshot => {
    (snapshot.channelRanking || []).forEach(row => {
      const name = String(row.name || "").trim();
      const current = rowsByName.get(name) || { ...row, name, value: 0, orders: null };
      current.value += row.value || 0;
      current.orders = row.orders === null || row.orders === undefined
        ? null
        : (current.orders || 0) + row.orders;
      current.color = row.color;
      rowsByName.set(name, current);
    });
  });

  const totalOrders = sum([...rowsByName.values()], row => Number(row.orders) || 0);
  const valueDenominator = sum([...rowsByName.values()], row => Math.abs(row.value || 0)) || Math.abs(totalOutput) || 1;
  return [...rowsByName.values()]
    .sort(sortChannelRankingRows)
    .map(row => {
      const orders = row.orders === null ? null : Math.round(row.orders);
      const sharePct = orders && totalOrders
        ? safeDivide(orders * 100, totalOrders)
        : safeDivide(Math.abs(row.value || 0) * 100, valueDenominator);
      const normalized = {
        ...row,
        value: round(row.value),
        orders,
        sharePct: round(sharePct)
      };
      return {
        ...normalized,
        label: formatChannelRankingLabel(normalized, totalOutput)
      };
    });
}

function normalizeChannelDetailName(name) {
  const text = String(name || "").trim();
  return CHANNEL_DETAIL_DISPLAY_MAP.get(text) || text;
}

function sortChannelRankingRows(a, b) {
  const priorityA = CHANNEL_DETAIL_PRIORITY_ORDER.indexOf(a.name);
  const priorityB = CHANNEL_DETAIL_PRIORITY_ORDER.indexOf(b.name);
  const hasPriorityA = priorityA >= 0;
  const hasPriorityB = priorityB >= 0;
  if (hasPriorityA || hasPriorityB) {
    if (!hasPriorityA) return 1;
    if (!hasPriorityB) return -1;
    return priorityA - priorityB;
  }
  return (b.value || 0) - (a.value || 0);
}

function getChannelOutreachGroup(name) {
  const text = String(name || "").trim();
  if (!text) return "其他";
  if (CHANNEL_OUTREACH_MAP.has(text)) return CHANNEL_OUTREACH_MAP.get(text);
  const normalized = text.replace(/\s+/g, "");
  for (const [source, group] of CHANNEL_OUTREACH_MAP.entries()) {
    const sourceText = source.replace(/\s+/g, "");
    if (normalized === sourceText || normalized.includes(sourceText) || sourceText.includes(normalized)) {
      return group;
    }
  }
  return "其他";
}

function aggregateChannelOutreachRows(channelRanking, totalOutput) {
  const grouped = new Map(CHANNEL_OUTREACH_ORDER.map(name => [
    name,
    { name, value: 0, color: CHANNEL_OUTREACH_COLORS[name] || "#64748b" }
  ]));

  (channelRanking || []).forEach(row => {
    const groupName = getChannelOutreachGroup(row.name);
    const current = grouped.get(groupName) || { name: groupName, value: 0, color: CHANNEL_OUTREACH_COLORS[groupName] || "#64748b" };
    current.value += Number(row.value) || 0;
    grouped.set(groupName, current);
  });

  return [...grouped.values()]
    .map(row => ({
      ...row,
      value: round(safeDivide(row.value * 100, totalOutput))
    }))
    .filter(row => row.value > 0)
    .sort((a, b) => CHANNEL_OUTREACH_ORDER.indexOf(a.name) - CHANNEL_OUTREACH_ORDER.indexOf(b.name));
}

function formatChannelRankingLabel(row, totalOutput) {
  const share = row.sharePct ?? Math.abs(safeDivide((row.value || 0) * 100, totalOutput));
  const orderText = Number.isFinite(row.orders) && row.orders > 0 ? ` / ${row.orders} 单` : "";
  const shareLabel = Number.isFinite(row.orders) && row.orders > 0 ? "订单占比" : "占比";
  return `${formatNumber(row.value)} 万${orderText} / ${shareLabel} ${formatNumber(share)}%`;
}

function aggregateDepartments(snapshots) {
  const byName = new Map();
  snapshots.forEach(snapshot => {
    (snapshot.departments || []).forEach(row => {
      const current = byName.get(row.name) || { ...row, output: 0, quoteOutputWan: 0, netOutputWan: 0, orders: 0, refund: 0, refundWan: 0, controlRecoverWan: 0 };
      current.output += row.output || 0;
      current.netOutputWan += row.netOutputWan ?? row.output ?? 0;
      current.quoteOutputWan += row.quoteOutputWan || 0;
      current.orders += row.orders || 0;
      current.refund += row.refund || 0;
      current.refundWan += row.refundWan || 0;
      current.controlRecoverWan += row.controlRecoverWan || 0;
      current.people = row.people;
      current.designerNames = row.designerNames;
      current.peopleSource = row.peopleSource;
      byName.set(row.name, current);
    });
  });

  return [...byName.values()].map(row => {
    const avg = safeDivide(row.quoteOutputWan, row.orders);
    const refundRate = row.orders ? safeDivide(row.refund * 100, row.orders) : (row.refund > 0 ? 100 : 0);
    return {
      ...row,
      output: round(row.output),
      netOutputWan: round(row.netOutputWan || row.output),
      quoteOutputWan: round(row.quoteOutputWan),
      orders: Math.round(row.orders),
      avg: round(avg),
      monthly: round(safeDivide(row.output, snapshots.length)),
      refund: Math.round(row.refund),
      refundWan: round(row.refundWan),
      controlRecoverWan: round(row.controlRecoverWan || (row.refundWan * 0.2)),
      controlledOutput: round(row.output + (row.controlRecoverWan || row.refundWan * 0.2)),
      refundRate: round(refundRate),
      perCapita: round(safeDivide(row.output, row.people)),
      risk: getRiskLabel(refundRate)
    };
  }).sort((a, b) => b.output - a.output);
}

function aggregateDesignerHeatmap(snapshots) {
  const byDesigner = new Map();
  snapshots.forEach(snapshot => {
    (snapshot.designerHeatmap || []).forEach(row => {
      const designer = row.designer || "未标注设计师";
      const department = row.department || "未识别设计部";
      const key = `${department}::${designer}`;
      const current = byDesigner.get(key) || {
        designer,
        department,
        draftWan: 0,
        formalWan: 0,
        refundWan: 0,
        draftOrders: 0,
        formalOrders: 0,
        refundOrders: 0
      };
      current.draftWan += Number(row.draftWan) || 0;
      current.formalWan += Number(row.formalWan) || 0;
      current.refundWan += Number(row.refundWan) || 0;
      current.draftOrders += Number(row.draftOrders) || 0;
      current.formalOrders += Number(row.formalOrders) || 0;
      current.refundOrders += Number(row.refundOrders) || 0;
      byDesigner.set(key, current);
    });
  });

  return [...byDesigner.values()]
    .map(row => ({
      ...row,
      draftWan: round(row.draftWan),
      formalWan: round(row.formalWan),
      refundWan: round(row.refundWan)
    }))
    .sort(sortDesignerByDepartment);
}

function scaleChannelRanking(outputWan, orderCount) {
  const baseTotal = sum(fallbackData.channelRanking, row => row.value || 0);
  const rowsWithOrders = fallbackData.channelRanking.filter(row => Number.isFinite(row.orders) && row.orders > 0);
  const baseOrders = sum(rowsWithOrders, row => row.orders || 0);
  return fallbackData.channelRanking.map(row => {
    const value = round(row.value * outputWan / baseTotal);
    const orders = Number.isFinite(row.orders) && row.orders > 0 && baseOrders
      ? Math.round(row.orders * orderCount / baseOrders)
      : null;
    const normalized = {
      ...row,
      value,
      orders,
      sharePct: row.sharePct
    };
    return {
      ...normalized,
      label: formatChannelRankingLabel(normalized, outputWan)
    };
  }).sort((a, b) => b.value - a.value);
}

function scaleDepartments(outputWan, orderCount, refundRatePct) {
  const baseOutput = sum(fallbackData.departments, row => row.output);
  const baseOrders = sum(fallbackData.departments, row => row.orders);
  return fallbackData.departments.map((row, index) => {
    const output = round(row.output * outputWan / baseOutput);
    const orders = Math.max(1, Math.round(row.orders * orderCount / baseOrders));
    const refundRate = round(Math.max(4, refundRatePct + (row.refundRate - 18.6) * 0.45 + index * 0.15));
    const refund = Math.round(orders * refundRate / 100);
    return {
      ...row,
      output,
      orders,
      avg: round(safeDivide(output, orders)),
      monthly: output,
      refund,
      refundWan: round(output * refundRate / 100),
      controlRecoverWan: round((output * refundRate / 100) * 0.2),
      controlledOutput: round(output + (output * refundRate / 100) * 0.2),
      refundRate,
      perCapita: round(safeDivide(output, row.people)),
      risk: getRiskLabel(refundRate)
    };
  }).sort((a, b) => b.output - a.output);
}

function scaleScenarios(outputWan) {
  const base = 9357;
  return fallbackData.scenarios.map(row => ({
    ...row,
    value: round(row.value * outputWan / base),
    delta: row.delta ? row.delta : ""
  }));
}

function buildControlScenarioRows(summary) {
  const current = Number(summary.systemOutputWan) || Number(summary.currentOutputWan) || 0;
  const recoverWan = round((Number(summary.refundLossWan) || 0) * 0.2);
  return [
    { name: "当前", value: round(current), delta: "", color: "#94a3b8" },
    { name: "控退后", value: round(current + recoverWan), delta: recoverWan ? `+${formatNumber(recoverWan)} 万` : "", color: "#ef4444" }
  ];
}

function buildDepartmentControlRows(departments) {
  return [...(departments || [])]
    .map(row => {
      const current = Number(row.output) || 0;
      const recoverWan = Number(row.controlRecoverWan) || (Number(row.refundWan) || 0) * 0.2;
      return {
        name: row.name,
        current: round(current),
        value: round(current + recoverWan),
        delta: round(recoverWan),
        refundRate: row.refundRate,
        color: departmentRiskColor(row.refundRate)
      };
    })
    .sort((a, b) => b.delta - a.delta);
}

function syncMonthButtonState() {
  document.querySelectorAll("#monthFilters button[data-month]").forEach(button => {
    button.classList.toggle("selected", selectedMonths.has(button.dataset.month));
  });
}

function getPeriodLabel(months, monthIds) {
  if (!selectedMonths.size) return `全部 ${months.length} 个月口径，`;
  const selectedLabels = months
    .filter(month => monthIds.includes(month.id))
    .map(month => month.label);
  if (selectedLabels.length === 1) return `${selectedLabels[0]}口径，`;
  return `已选 ${selectedLabels.length} 个月口径，`;
}

function formatMonthLabel(id) {
  const month = normalizeMonth(id);
  return month ? `${month}月` : `${id}月`;
}

function normalizeMonth(value) {
  if (!value) return "";
  const text = String(value);
  if (/^\d{4}-\d{2}/.test(text)) return text.slice(5, 7);
  const match = text.match(/\d{1,2}/);
  return match ? String(Number(match[0])).padStart(2, "0") : "";
}

function extractOrderCount(label = "") {
  const match = String(label).match(/\/\s*(-?\d+)\s*单/);
  return match ? Number(match[1]) : 0;
}

function extractPercent(label = "") {
  const match = String(label).match(/(-?\d+(?:\.\d+)?)%/);
  return match ? Number(match[1]) : 0;
}

function getRiskLabel(rate) {
  return getRiskInfo(rate).label;
}

function sum(rows, getter) {
  return rows.reduce((total, row) => total + (Number(getter(row)) || 0), 0);
}

function pickNumber(source = {}, keys = []) {
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null && source[key] !== "") {
      return Number(source[key]) || 0;
    }
  }
  return 0;
}

function safeDivide(a, b) {
  return b ? a / b : 0;
}

function round(value) {
  return Number((Number(value) || 0).toFixed(2));
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function renderDashboard(data) {
  renderDailyBrief(data);
  renderGoalCards(data);
  renderKpis(data.kpis);
  renderStructureTalks(data);
  renderChannelFlow(data);
  renderProductFlow(data);
  renderMultiMetrics(data.multiMetrics);
  renderProductContribution(data.productContribution);
  renderHorizontalBars("avgOrderBars", data.productValue, "万", 30);
  renderHorizontalBars("areaBars", data.productArea, "m²", 120);
  renderInsights("productInsights", generateRuleInsights(data, "product", data.productInsights, 7));
  renderChannelWarning(data.channelRanking);
  renderRanking(data.channelRanking);
  renderInsights("channelInsights", generateRuleInsights(data, "channel", data.channelInsights, 7));
  renderDepartmentRanking(data.departments);
  renderScenarios(data.scenarios);
  renderPeopleChart(data.departments);
  renderDesignerHeatmap(data.designerHeatmap || []);
  renderVerticalBars("monthlyBars", data.departments.map(d => ({ name: d.name, value: d.monthly, color: riskColorByValue(d.monthly, 80, 100) })), "万", 110);
  renderVerticalBars("departmentAvgBars", data.departments.map(d => ({ name: d.name, value: d.avg, color: d.avg >= 15 ? "#16b981" : d.avg >= 13.5 ? "#3b82f6" : "#f59f0a" })), "万", 18);
  renderRiskTable(data.departments);
  renderInsights("departmentInsights", generateRuleInsights(data, "department", [], 6));
}

function renderStructureTalks(data) {
  const talks = getStructureTalks(data);
  setText("channelStructureTalk", talks.channel);
  setText("productStructureTalk", talks.product);
}

function getStructureTalks(data) {
  if (window.RuleTalkEngine) {
    const rows = window.RuleTalkEngine.generate(data, { module: "structure", limit: 8 });
    return {
      channel: buildChannelStructureFallback(data),
      product: rows.find(row => row.id.startsWith("structure_product_"))?.body || buildProductStructureFallback(data)
    };
  }

  return {
    channel: buildChannelStructureFallback(data),
    product: buildProductStructureFallback(data)
  };
}

function buildChannelStructureFallback(data) {
  return "看渠道净额、正值渠道和受退单影响渠道，避免负数被结构占比掩盖";
}

function buildProductStructureFallback(data) {
  const products = [...(data.products || [])].filter(row => (row.netValueWan ?? row.value) > 0).sort((a, b) => (b.netValueWan ?? b.value) - (a.netValueWan ?? a.value));
  const top = products[0];
  const second = products[1];
  if (top && second) return `${top.name}+${second.name}为当前主力产品组合，建议观察产品集中度`;
  return top ? `${top.name}贡献最高，建议观察主力产品结构` : "产品结构待接入数据后自动生成";
}

function normalizeGoalSummary(data) {
  const context = window.RuleTalkEngine ? window.RuleTalkEngine.buildContext(data) : { summary: data.summary || {} };
  const rawSummary = { ...(context.summary || {}), ...(data.summary || {}) };
  const summary = {
    ...rawSummary,
    currentOutputWan: rawSummary.netOutputWan ?? rawSummary.currentOutputWan,
    monthlyOutputWan: rawSummary.monthlyNetOutputWan ?? rawSummary.monthlyOutputWan,
    annualizedOutputYi: rawSummary.annualizedOutputYi,
    yearProgressPct: rawSummary.yearProgressPct,
    monthProgressPct: rawSummary.monthProgressPct,
    monthGoalGapWan: rawSummary.monthGoalGapWan
  };
  summary.monthGapText = summary.monthlyOutputWan >= summary.monthTargetWan
    ? `已超过月度目标 ${formatNumber(Math.abs(summary.monthlyOutputWan - summary.monthTargetWan))} 万`
    : `差 ${formatNumber(summary.monthGoalGapWan)} 万追平月度目标`;
  return summary;
}

function getAnnualGoalSummary(fallbackSummary) {
  const snapshots = dashboardData?.monthlyData && typeof dashboardData.monthlyData === "object"
    ? Object.values(dashboardData.monthlyData)
    : [];
  if (!snapshots.length) return fallbackSummary;

  const netOutputWan = round(sum(snapshots, item => item.summary?.netOutputWan ?? item.summary?.currentOutputWan ?? 0));
  const yearTargetWan = snapshots.find(item => item.summary?.yearTargetWan)?.summary.yearTargetWan || fallbackSummary.yearTargetWan || 35000;
  const latestTheoryProgress = Math.max(...snapshots.map(item => item.summary?.yearTheoryProgressPct || 0));
  const monthCount = snapshots.length;
  return {
    ...fallbackSummary,
    currentOutputWan: netOutputWan,
    netOutputWan,
    monthlyOutputWan: round(safeDivide(netOutputWan, monthCount)),
    monthlyNetOutputWan: round(safeDivide(netOutputWan, monthCount)),
    annualizedOutputYi: round((safeDivide(netOutputWan, monthCount) * 12) / 10000),
    yearTargetWan,
    yearTargetYi: round(yearTargetWan / 10000),
    yearProgressPct: round(safeDivide(netOutputWan * 100, yearTargetWan)),
    yearTheoryProgressPct: latestTheoryProgress || fallbackSummary.yearTheoryProgressPct,
    periodLabel: "当前累计，"
  };
}

function renderGoalCards(data) {
  const summary = normalizeGoalSummary(data);
  const annualSummary = getAnnualGoalSummary(summary);
  const yearGoalTalks = getGoalTalks({ ...data, summary: annualSummary }, annualSummary);
  const monthGoalTalks = getGoalTalks({ ...data, summary }, summary);
  const yearTargetWan = annualSummary.yearTargetWan || 35000;
  const monthTargetWan = summary.monthTargetWan || 2900;

  setText("yearGoalValue", `${formatNumber(annualSummary.currentOutputWan)}万`);
  setText("yearGoalTarget", `/ ${formatNumber(yearTargetWan)} 万`);
  setText("yearGoalPct", `${formatNumber(annualSummary.yearProgressPct)}%`);
  setGoalProgress("yearGoalBar", annualSummary.yearProgressPct);
  document.getElementById("yearTheoryMarker").style.left = `${Math.min(100, Math.max(0, annualSummary.yearTheoryProgressPct || 0))}%`;
  setText("yearGoalTalk", yearGoalTalks.year);

  setText("monthGoalValue", `${formatNumber(summary.monthlyOutputWan)}万`);
  setText("monthGoalTarget", `/ ${formatNumber(monthTargetWan)} 万`);
  setText("monthGoalPct", `${formatNumber(summary.monthProgressPct)}%`);
  setGoalProgress("monthGoalBar", summary.monthProgressPct);
  setText("monthGoalTalk", monthGoalTalks.month);
}

function getGoalTalks(data, summary) {
  if (window.RuleTalkEngine) {
    const rows = window.RuleTalkEngine.generate(data, { module: "goal", limit: 2 });
    return {
      year: rows.find(row => row.id === "goal_year_pace")?.body || buildYearGoalFallback(summary),
      month: rows.find(row => row.id === "goal_month_pace")?.body || buildMonthGoalFallback(summary)
    };
  }

  return {
    year: buildYearGoalFallback(summary),
    month: buildMonthGoalFallback(summary)
  };
}

function buildYearGoalFallback(summary) {
  const direction = (summary.yearProgressPct || 0) >= (summary.yearTheoryProgressPct || 0) ? "领先" : "落后";
  const gap = Math.abs((summary.yearProgressPct || 0) - (summary.yearTheoryProgressPct || 0));
  return `按理论进度 ${formatNumber(summary.yearTheoryProgressPct)}%，实际完成 ${formatNumber(summary.yearProgressPct)}%，${direction} ${formatNumber(gap)}pp`;
}

function buildMonthGoalFallback(summary) {
  const gapText = summary.monthGapText || `差 ${formatNumber(summary.monthGoalGapWan)} 万追平月度目标`;
  return `${summary.periodLabel || "当前筛选月份，"}月均推算达成 ${formatNumber(summary.monthProgressPct)}%，${gapText}`;
}

function setGoalProgress(elementId, value) {
  document.getElementById(elementId).style.setProperty("--value", `${Math.min(100, Math.max(0, value || 0))}%`);
}

function setText(elementId, value) {
  document.getElementById(elementId).textContent = value;
}

function renderKpis(kpis) {
  const root = document.getElementById("kpiCards");
  root.innerHTML = kpis.map(item => `
    <article class="kpi-card" style="--accent:${item.color}">
      <h3>${item.label}</h3>
      <div class="delta">${item.delta}</div>
      <div class="kpi-value">${item.value}<span>${item.unit}</span></div>
      <p>${item.note}</p>
      <div class="mini-track"><i style="--value:${item.progress}%"></i></div>
    </article>
  `).join("");
}

function generateRuleInsights(data, moduleName, fallbackRows, limit) {
  if (!window.RuleTalkEngine) return fallbackRows;
  const rows = window.RuleTalkEngine.generate(data, { module: moduleName, limit });
  if (!rows.length) return fallbackRows;
  return rows.map(row => [row.title, row.body]);
}

function renderChannelFlow(data) {
  const root = document.getElementById("channelFlow");
  if (!root) return;

  const rows = (data.channels || [])
    .map((row, index) => ({
      ...row,
      netValueWan: Number(row.netValueWan) || 0,
      color: row.color || CHANNEL_FLOW_COLORS[index % CHANNEL_FLOW_COLORS.length]
    }))
    .filter(row => row.netValueWan !== 0);

  const netWan = round(sum(rows, row => row.netValueWan));
  const positiveWan = round(sum(rows.filter(row => row.netValueWan > 0), row => row.netValueWan));
  const dragWan = round(sum(rows.filter(row => row.netValueWan < 0), row => row.netValueWan));
  const totalAbsWan = round(positiveWan + Math.abs(dragWan));
  const maxAbs = Math.max(...rows.map(row => Math.abs(row.netValueWan)), 1);
  const positiveRows = rows.filter(row => row.netValueWan > 0).sort((a, b) => b.netValueWan - a.netValueWan);
  const negativeRows = rows.filter(row => row.netValueWan < 0).sort((a, b) => Math.abs(b.netValueWan) - Math.abs(a.netValueWan));
  const status = netWan >= 0 ? "正向净贡献" : "退单负向影响";

  const renderRows = (items, type) => {
    if (!items.length) return `<div class="channel-empty">暂无${type === "positive" ? "正值" : "受退单影响"}渠道</div>`;
    return items.map(row => {
      const absValue = Math.abs(row.netValueWan);
      return `
        <div class="channel-flow-row ${type}" tabindex="0" data-chart-item data-chart-tip="${row.name}｜净产值 ${formatNumber(row.netValueWan)} 万｜贡献 ${formatNumber(safeDivide(absValue * 100, totalAbsWan))}%">
          <div class="channel-flow-label">
            <span>${row.name}</span>
            <strong>${row.netValueWan > 0 ? "+" : ""}${formatNumber(row.netValueWan)} 万</strong>
          </div>
          <div class="channel-flow-track"><i style="--w:${pct(absValue, maxAbs)}%; --color:${row.netValueWan > 0 ? "#16b981" : "#ef4444"}"></i></div>
        </div>
      `;
    }).join("");
  };

  root.innerHTML = `
    <div class="channel-flow-summary">
      <article class="channel-flow-card ${netWan >= 0 ? "positive" : "negative"}">
        <span>净产值合计</span>
        <strong>${formatNumber(netWan)} 万</strong>
        <small>${status}</small>
      </article>
      <article class="channel-flow-card positive">
        <span>正值渠道</span>
        <strong>+${formatNumber(positiveWan)} 万</strong>
        <small>占绝对贡献 ${formatNumber(safeDivide(positiveWan * 100, totalAbsWan))}%</small>
      </article>
      <article class="channel-flow-card negative">
        <span>退单负向影响</span>
        <strong>${formatNumber(dragWan)} 万</strong>
        <small>占绝对贡献 ${formatNumber(safeDivide(Math.abs(dragWan) * 100, totalAbsWan))}%</small>
      </article>
    </div>
    <div class="channel-flow-columns">
      <section>
        <h4>正值渠道</h4>
        ${renderRows(positiveRows, "positive")}
      </section>
      <section>
        <h4>受退单影响渠道</h4>
        ${renderRows(negativeRows, "negative")}
      </section>
    </div>
  `;
}

function renderProductFlow(data) {
  const root = document.getElementById("productFlow");
  if (!root) return;

  const productBaseValue = Number(data.summary?.productNetOutputWan ?? data.summary?.netOutputWan ?? data.summary?.currentOutputWan) || 0;
  const rows = (data.products || [])
    .map((row, index) => {
      const rowNetValue = Number(row.netValueWan);
      return {
        ...row,
        netValueWan: Number.isFinite(rowNetValue) ? rowNetValue : safeDivide((Number(row.value) || 0) * productBaseValue, 100),
        color: row.color || PRODUCT_FLOW_COLORS[index % PRODUCT_FLOW_COLORS.length]
      };
    })
    .filter(row => row.netValueWan !== 0);

  const netWan = round(sum(rows, row => row.netValueWan));
  const positiveWan = round(sum(rows.filter(row => row.netValueWan > 0), row => row.netValueWan));
  const impactWan = round(sum(rows.filter(row => row.netValueWan < 0), row => row.netValueWan));
  const totalAbsWan = round(positiveWan + Math.abs(impactWan));
  const maxAbs = Math.max(...rows.map(row => Math.abs(row.netValueWan)), 1);
  const positiveRows = rows.filter(row => row.netValueWan > 0).sort((a, b) => b.netValueWan - a.netValueWan);
  const negativeRows = rows.filter(row => row.netValueWan < 0).sort((a, b) => Math.abs(b.netValueWan) - Math.abs(a.netValueWan));

  const renderRows = (items, type) => {
    if (!items.length) return `<div class="channel-empty">暂无${type === "positive" ? "正值" : "受退单影响"}产品线</div>`;
    return items.map(row => {
      const absValue = Math.abs(row.netValueWan);
      return `
        <div class="channel-flow-row ${type}" tabindex="0" data-chart-item data-chart-tip="${row.name}｜净产值 ${formatNumber(row.netValueWan)} 万｜贡献 ${formatNumber(safeDivide(absValue * 100, totalAbsWan))}%">
          <div class="channel-flow-label">
            <span>${row.name}</span>
            <strong>${row.netValueWan > 0 ? "+" : ""}${formatNumber(row.netValueWan)} 万</strong>
          </div>
          <div class="channel-flow-track"><i style="--w:${pct(absValue, maxAbs)}%; --color:${row.netValueWan > 0 ? "#3b82f6" : "#ef4444"}"></i></div>
        </div>
      `;
    }).join("");
  };

  root.innerHTML = `
    <div class="channel-flow-summary">
      <article class="channel-flow-card ${netWan >= 0 ? "positive" : "negative"}">
        <span>产品净产值合计</span>
        <strong>${formatNumber(netWan)} 万</strong>
        <small>${netWan >= 0 ? "正向净贡献" : "退单负向影响"}</small>
      </article>
      <article class="channel-flow-card positive">
        <span>正值产品线</span>
        <strong>+${formatNumber(positiveWan)} 万</strong>
        <small>占绝对贡献 ${formatNumber(safeDivide(positiveWan * 100, totalAbsWan))}%</small>
      </article>
      <article class="channel-flow-card negative">
        <span>退单负向影响</span>
        <strong>${formatNumber(impactWan)} 万</strong>
        <small>占绝对贡献 ${formatNumber(safeDivide(Math.abs(impactWan) * 100, totalAbsWan))}%</small>
      </article>
    </div>
    <div class="channel-flow-columns">
      <section>
        <h4>正值产品线</h4>
        ${renderRows(positiveRows, "positive")}
      </section>
      <section>
        <h4>受退单影响产品线</h4>
        ${renderRows(negativeRows, "negative")}
      </section>
    </div>
  `;
}

function renderDonut(donutId, legendId, rows) {
  const root = document.getElementById(donutId);
  const legend = document.getElementById(legendId);
  const total = sum(rows, row => row.value) || 100;
  let start = 0;
  const segments = rows.map((row, index) => {
    const valuePct = safeDivide(row.value * 100, total);
    const end = start + valuePct;
    const segment = {
      ...row,
      index,
      start,
      end,
      path: describeDonutSegment(start, end),
      tip: getDonutTipPosition(start, end)
    };
    start = end;
    return segment;
  });
  const first = segments[0] || { name: "", value: 0, color: "#3b82f6", tip: { x: 78, y: 22 } };

  root.style.setProperty("--active-color", first.color);
  root.style.setProperty("--tip-x", `${first.tip.x}%`);
  root.style.setProperty("--tip-y", `${first.tip.y}%`);
  root.innerHTML = `
    <svg class="donut-svg" viewBox="0 0 220 220" role="img" aria-label="点击查看占比明细">
      ${segments.map((row, index) => `
        <path
          class="donut-segment ${index === 0 ? "is-active" : ""}"
          data-donut-index="${index}"
          d="${row.path}"
          fill="${row.color}"
          style="--delay:${index * 70}ms"
        >
          <title>${row.name} ${formatNumber(row.value)}%</title>
        </path>
      `).join("")}
    </svg>
    <div class="donut-center">
      <span>当前聚焦</span>
      <strong>${first.name}</strong>
      <b>${formatNumber(first.value)}%</b>
    </div>
    <div class="donut-popover">
      <strong>${first.name}</strong>
      <span>占比：${formatNumber(first.value)}%</span>
      <small>点击色块或图例切换</small>
    </div>
  `;

  legend.innerHTML = segments.map(row => `
    <button class="legend-item ${row.index === 0 ? "is-active" : ""}" type="button" data-donut-index="${row.index}" style="--color:${row.color}">
      <i class="swatch"></i>
      <span>${row.name}</span>
      <strong>${formatNumber(row.value)}%</strong>
    </button>
  `).join("");

  const activate = index => {
    const active = segments[index];
    if (!active) return;
    root.style.setProperty("--active-color", active.color);
    root.style.setProperty("--tip-x", `${active.tip.x}%`);
    root.style.setProperty("--tip-y", `${active.tip.y}%`);
    root.querySelectorAll(".donut-segment").forEach(item => {
      item.classList.toggle("is-active", Number(item.dataset.donutIndex) === index);
    });
    legend.querySelectorAll(".legend-item").forEach(item => {
      item.classList.toggle("is-active", Number(item.dataset.donutIndex) === index);
    });
    root.querySelector(".donut-center strong").textContent = active.name;
    root.querySelector(".donut-center b").textContent = `${formatNumber(active.value)}%`;
    root.querySelector(".donut-popover strong").textContent = active.name;
    root.querySelector(".donut-popover span").textContent = `占比：${formatNumber(active.value)}%`;
  };

  const onActivate = event => {
    const target = event.target.closest("[data-donut-index]");
    if (!target) return;
    activate(Number(target.dataset.donutIndex));
  };
  root.onclick = onActivate;
  legend.onclick = onActivate;
}

function describeDonutSegment(startPct, endPct) {
  const outerRadius = 100;
  const innerRadius = 43;
  const center = 110;
  const startAngle = startPct * 3.6 - 90;
  const endAngle = endPct * 3.6 - 90;
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  const outerStart = polarToCartesian(center, center, outerRadius, startAngle);
  const outerEnd = polarToCartesian(center, center, outerRadius, endAngle);
  const innerEnd = polarToCartesian(center, center, innerRadius, endAngle);
  const innerStart = polarToCartesian(center, center, innerRadius, startAngle);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z"
  ].join(" ");
}

function polarToCartesian(cx, cy, radius, angleDegrees) {
  const angleRadians = (angleDegrees * Math.PI) / 180;
  return {
    x: round(cx + radius * Math.cos(angleRadians)),
    y: round(cy + radius * Math.sin(angleRadians))
  };
}

function getDonutTipPosition(startPct, endPct) {
  const middleAngle = ((startPct + endPct) / 2) * 3.6 - 90;
  const angleRadians = (middleAngle * Math.PI) / 180;
  return {
    x: 50 + Math.cos(angleRadians) * 30,
    y: 50 + Math.sin(angleRadians) * 30
  };
}

function renderMultiMetrics(rows) {
  document.getElementById("multiMetrics").innerHTML = rows.map(([label, value, unit]) => `
    <article class="metric-card">
      <span>${label}</span>
      <strong>${value} <small>${unit}</small></strong>
    </article>
  `).join("");
}

function renderProductContribution(rows) {
  const max = Math.max(...rows.map(row => Math.max(row.output, row.orders)));
  document.getElementById("productContribution").innerHTML = rows.map((row, index) => `
    <div class="pair-row" style="--delay:${index * 55}ms">
      <label>${row.name}</label>
      <div class="pair-track">
        <div class="bar-line ${pct(row.output, max) < 24 ? "is-short" : ""}" tabindex="0" role="button" data-chart-item data-chart-tip="${row.name}｜产值占比 ${row.output}%" style="--w:${pct(row.output, max)}%; --bar-color:#3b82f6"><i></i><span>产值 ${row.output}%</span></div>
        <div class="bar-line ${pct(row.orders, max) < 24 ? "is-short" : ""}" tabindex="0" role="button" data-chart-item data-chart-tip="${row.name}｜单数占比 ${row.orders}%" style="--w:${pct(row.orders, max)}%; --bar-color:#a8b5c4"><i></i><span>单数 ${row.orders}%</span></div>
      </div>
    </div>
  `).join("");
}

function renderVerticalBars(id, rows, unit, maxValue) {
  const max = maxValue || Math.max(...rows.map(row => row.value));
  document.getElementById(id).innerHTML = rows.map((row, index) => `
    <div class="vertical-bar" tabindex="0" role="button" data-chart-item data-chart-tip="${row.name}｜${formatNumber(row.value)}${unit}" style="--delay:${index * 60}ms">
      <strong>${formatNumber(row.value)}${unit}</strong>
      <i style="--h:${Math.max(4, pct(row.value, max))}%; --color:${row.color || "#3b82f6"}"></i>
      <span>${row.name}</span>
    </div>
  `).join("");
}

function renderHorizontalBars(id, rows, unit, maxValue) {
  const max = maxValue || Math.max(...rows.map(row => row.value));
  const target = document.getElementById(id);
  target.classList.add("horizontal-bars");
  target.classList.remove("vertical-bars");
  target.innerHTML = rows.map(row => {
    const width = Math.max(4, pct(row.value, max));
    return `
      <div class="horizontal-bar-row" tabindex="0" role="button" data-chart-item data-chart-tip="${row.name}｜${formatNumber(row.value)}${unit}">
        <label>${row.name}</label>
        <div class="horizontal-bar-track">
          <i style="--w:${width}%; --color:${row.color || "#3b82f6"}"></i>
          <span>${formatNumber(row.value)}${unit}</span>
        </div>
      </div>
    `;
  }).join("");
}

function renderSoftBars(rows) {
  const max = 24;
  document.getElementById("softBars").innerHTML = rows.map((row, index) => `
    <div class="soft-group" tabindex="0" role="button" data-chart-item data-chart-tip="${row.name}｜未选 ${row.noSoft} 万，选配 ${row.soft} 万，${row.lift}" style="--delay:${index * 70}ms">
      <div class="soft-pair">
        <i title="未选软装均单 ${row.noSoft}万" style="--h:${pct(row.noSoft, max)}%; --color:#a8b5c4"></i>
        <i title="选配软装均单 ${row.soft}万" style="--h:${pct(row.soft, max)}%; --color:#3b82f6"></i>
      </div>
      <strong>${row.soft} 万 ${row.lift}</strong>
      <span>${row.name}<br>${row.count} 单</span>
    </div>
  `).join("");
}

function renderSoftReadout(data) {
  const readout = window.RuleTalkEngine?.getSoftReadout
    ? window.RuleTalkEngine.getSoftReadout(data)
    : buildSoftReadoutFallback(data);
  document.getElementById("softQuickRead").innerHTML = readout.quickItems.map(item => `<li>${item}</li>`).join("");
  setText("softPotentialText", readout.potentialText);
  setText("softPotentialCallout", readout.callout);
  setText("softPotentialAction", readout.action);
}

function buildSoftReadoutFallback(data) {
  const rows = data.soft || [];
  const detailRows = rows.filter(row => !row.name.includes("加权"));
  const totalRow = rows.find(row => row.name.includes("加权")) || rows[rows.length - 1] || {};
  const totalOrders = sum(detailRows, row => row.count || 0) || totalRow.count || 0;
  const liftWan = (totalRow.soft || 0) - (totalRow.noSoft || 0);
  const newSelectedOrders = Math.round(totalOrders * 0.1);
  const potentialWan = Math.round(newSelectedOrders * liftWan);
  return {
    quickItems: rows.map(row => {
      const liftRate = row.noSoft ? ((row.soft - row.noSoft) / row.noSoft) * 100 : 0;
      return `${row.name.replace("整体", "").replace("加权总计", "加权平均")}选配率 <strong>${formatNumber(row.selectedRatePct || 0)}%</strong>，溢价 <strong>+${formatNumber(liftRate)}%</strong>`;
    }),
    potentialText: `以${detailRows.map(row => row.name.replace("整体", "")).join(" + ")} ${totalOrders} 单为基数，选配率每提升 10 个百分点，约有 ${newSelectedOrders} 单从未选转为选配，单均增值约 ${formatNumber(liftWan)} 万。`,
    callout: `选配率每 +10 个百分点 ≈ +${formatNumber(potentialWan)} 万产值`,
    action: "核心抓手：样板间展示 / 组合优惠 / 销售话术三件套"
  };
}

function renderInsights(id, rows) {
  document.getElementById(id).innerHTML = rows.map((row, index) => `
    <article class="insight-row">
      <div class="insight-no">${index + 1}</div>
      <div>
        <h4>${row[0]}</h4>
        ${formatInsightBody(row[1])}
      </div>
    </article>
  `).join("");
}

function formatInsightBody(text) {
  const body = String(text || "");
  const actionIndex = body.search(/动作[:：]/);
  if (actionIndex >= 0) {
    const evidence = body.slice(0, actionIndex).trim().replace(/^证据[:：]\s*/, "");
    const action = body.slice(actionIndex).replace(/^动作[:：]\s*/, "").trim();
    return `
      <p class="insight-evidence"><span>证据</span><b>${evidence}</b></p>
      <p class="insight-action"><span>动作</span><b>${action}</b></p>
    `;
  }

  const split = body.split("建议");
  if (split.length < 2) return `<p class="insight-evidence"><b>${body.replace(/^证据[:：]\s*/, "")}</b></p>`;
  const evidence = split.shift().trim().replace(/^证据[:：]\s*/, "");
  const action = `建议${split.join("建议")}`.trim();
  return `
    <p class="insight-evidence"><span>证据</span><b>${evidence}</b></p>
    <p class="insight-action"><span>动作</span><b>${action}</b></p>
  `;
}

function renderRanking(rows) {
  const max = Math.max(...rows.map(row => Math.abs(row.value)));
  document.getElementById("channelRanking").innerHTML = rows.map((row, index) => `
    <div class="rank-row" tabindex="0" role="button" data-chart-item data-chart-tip="${row.name}｜${row.label}" style="--delay:${index * 45}ms">
      <label>${row.name}</label>
      <div class="rank-track"><i style="--w:${pct(Math.abs(row.value), max)}%; --color:${row.value < 0 ? "#ef4444" : row.color}"></i></div>
      <strong>${row.label}</strong>
    </div>
  `).join("");
}

function renderChannelWarning(rows = []) {
  if (window.RuleTalkEngine?.getChannelWarning) {
    setText("channelWarningStrip", window.RuleTalkEngine.getChannelWarning({ channelRanking: rows }));
    return;
  }

  const paidNames = ["400热线", "百度搜索", "百度系", "搜索", "抖音直播", "抖音直播（二）", "抖音直播类", "第三方平台垂直类", "抖音信息流类", "腾讯系", "微信朋友圈推广", "线上非诺云", "线上投放类"];
  const paidRows = rows.filter(row => paidNames.includes(row.name));
  const total = sum(paidRows, row => row.value || 0);
  const share = sum(paidRows, row => row.sharePct || extractPercent(row.label));
  const names = paidRows.map(row => row.name).join("、");
  const text = paidRows.length
    ? `线上投放类 ${paidRows.length} 个渠道净产值合计：${formatNumber(total)} 万 / 订单占比 ${formatNumber(share)}% / 包含 ${names}`
    : "线上投放类渠道待接入数据后自动汇总";
  setText("channelWarningStrip", text);
}

function renderDepartmentRanking(rows) {
  const max = Math.max(...rows.map(row => row.output));
  document.getElementById("departmentRanking").innerHTML = rows.map((row, index) => `
    <div class="dept-row" tabindex="0" role="button" data-chart-item data-chart-tip="${row.name}｜产值 ${formatNumber(row.output)} 万，${row.orders} 单，均单 ${formatNumber(row.avg)} 万" style="--delay:${index * 45}ms">
      <label>${row.name}</label>
      <div class="dept-track"><i style="--w:${pct(row.output, max)}%; --color:${departmentRiskColor(row.refundRate)}"></i></div>
      <strong>
        <span>${formatNumber(row.output)}万 · ${row.orders}单</span>
        <small>均 ${formatNumber(row.avg)}万</small>
      </strong>
    </div>
  `).join("");
}

function departmentRiskColor(refundRate) {
  if (refundRate >= 30) return "#ef4444";
  if (refundRate >= 20) return "#f97316";
  if (refundRate >= 14) return "#f59f0a";
  if (refundRate >= 8) return "#16b981";
  return "#3b82f6";
}

function renderScenarios(rows) {
  const max = Math.max(...rows.map(row => Math.max(Math.abs(row.current || 0), Math.abs(row.value || 0))), 1);
  document.getElementById("scenarioBars").innerHTML = rows.map((row, index) => `
    <div class="scenario-bar" tabindex="0" role="button" data-chart-item data-chart-tip="${row.name}｜当前 ${formatNumber(row.current)} 万，控退后 ${formatNumber(row.value)} 万，增量 ${formatNumber(row.delta)} 万" style="--delay:${index * 60}ms">
      <label>${row.name}</label>
      <div class="scenario-track">
        <i class="scenario-current" style="--w:${pct(Math.abs(row.current || 0), max)}%"></i>
        <i class="scenario-control" style="--w:${pct(Math.abs(row.value || 0), max)}%; --color:${row.color}"></i>
      </div>
      <strong>
        <span>当前 ${formatNumber(row.current)}万</span>
        <span>控退后 ${formatNumber(row.value)}万</span>
      </strong>
      <b>+${formatNumber(row.delta)}万</b>
    </div>
  `).join("");
}

function renderPeopleChart(rows) {
  const max = Math.max(...rows.map(row => row.output));
  document.getElementById("peopleChart").innerHTML = rows.map((row, index) => `
    <div class="combo-item" tabindex="0" role="button" data-chart-item data-chart-tip="${row.name}｜产值 ${formatNumber(row.output)} 万，设计师 ${row.people} 人" style="--delay:${index * 45}ms">
      <div class="people-dot" title="设计师人数 ${row.people}"></div>
      <strong>${formatNumber(row.output)}万</strong>
      <i style="--h:${pct(row.output, max)}%"></i>
      <span>${row.name}</span>
    </div>
  `).join("");
}

function renderDesignerHeatmap(rows) {
  const target = document.getElementById("designerHeatmap");
  if (!target) return;

  const visibleRows = [...(rows || [])]
    .filter(row => row.designer && row.department)
    .sort(sortDesignerByDepartment);

  if (!visibleRows.length) {
    target.innerHTML = `<div class="empty-state">暂无设计师产值数据，接入转正式/退单明细后会自动展示。</div>`;
    return;
  }

  const columns = [
    { key: "draftWan", ordersKey: "draftOrders", label: "草签产值", color: "#f59f0a" },
    { key: "formalWan", ordersKey: "formalOrders", label: "转正式产值", color: "#3b82f6" },
    { key: "refundWan", ordersKey: "refundOrders", label: "退单产值", color: "#ef4444" }
  ].map(column => ({
    ...column,
    max: Math.max(...visibleRows.map(row => Math.abs(Number(row[column.key]) || 0)), 1)
  }));

  target.innerHTML = `
    <div class="designer-heat-head designer-name-head">设计师 / 设计部</div>
    ${columns.map(column => `<div class="designer-heat-head">${column.label}</div>`).join("")}
    ${visibleRows.map(row => `
      <div class="designer-heat-name">
        <strong>${row.designer}</strong>
        <span>${row.department}</span>
      </div>
      ${columns.map(column => {
        const value = Number(row[column.key]) || 0;
        const orders = Number(row[column.ordersKey]) || 0;
        const heat = Math.max(8, Math.min(92, (Math.abs(value) / column.max) * 92));
        const label = `${row.designer}｜${row.department}｜${column.label} ${formatNumber(value)} 万｜${orders} 单`;
        return `
          <div class="designer-heat-cell" tabindex="0" role="button" data-chart-item data-chart-tip="${label}" style="--heat:${heat}%; --heat-color:${column.color}">
            <strong>${formatNumber(value)}万</strong>
            <span>${orders}单</span>
          </div>
        `;
      }).join("")}
    `).join("")}
  `;
}

function renderRiskTable(rows) {
  const body = document.querySelector("#riskTable tbody");
  body.innerHTML = rows.map((row, index) => {
    const risk = getRiskInfo(row.refundRate);
    return `
      <tr>
        <td>${index + 1}</td>
        <td>${row.name}</td>
        <td>${formatNumber(row.output)}</td>
        <td>${row.orders} 单</td>
        <td>${row.refund} 单</td>
        <td class="risk-rate" style="--rate-color:${risk.rateColor}; --rate-bg:${risk.rateBg}">${row.refundRate.toFixed(1)}%</td>
        <td>${formatNumber(row.perCapita)}</td>
        <td><span class="tag" style="--tag-color:${risk.color}; --tag-bg:${risk.bg}">${risk.label}</span></td>
      </tr>
    `;
  }).join("");
}

function bindInteractions() {
  document.querySelectorAll(".tabs a").forEach(link => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".tabs a").forEach(item => item.classList.remove("active"));
      link.classList.add("active");
    });
  });

  document.getElementById("monthFilters").addEventListener("click", event => {
    const button = event.target.closest("button[data-month]");
    if (!button) return;
    const month = button.dataset.month;
    if (selectedMonths.has(month)) {
      selectedMonths.delete(month);
      button.classList.remove("selected");
    } else {
      selectedMonths.add(month);
      button.classList.add("selected");
    }
    updateMonthLabel();
    renderDashboard(getFilteredDashboardData());
  });

  document.getElementById("selectAll").addEventListener("click", () => {
    selectedMonths = new Set(getAvailableMonths(dashboardData).map(month => month.id));
    syncMonthButtonState();
    updateMonthLabel();
    renderDashboard(getFilteredDashboardData());
  });

  document.getElementById("clearMonths").addEventListener("click", () => {
    selectedMonths = new Set();
    syncMonthButtonState();
    updateMonthLabel();
    renderDashboard(getFilteredDashboardData());
  });

  document.getElementById("generateBrief").addEventListener("click", () => {
    renderDailyBrief(getFilteredDashboardData());
    document.getElementById("aiStatus").classList.add("ready");
    document.getElementById("aiStatus").lastChild.textContent = "播报已更新";
  });

  document.getElementById("jsonBtn").addEventListener("click", () => {
    document.getElementById("dataGuide").scrollIntoView({ behavior: "smooth" });
  });

  document.addEventListener("click", event => {
    const item = event.target.closest("[data-chart-item]");
    if (!item) return;
    activateChartItem(item);
  });

  document.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const item = event.target.closest("[data-chart-item]");
    if (!item) return;
    event.preventDefault();
    activateChartItem(item);
  });
}

function updateMonthLabel() {
  const count = selectedMonths.size;
  const allCount = getAvailableMonths(dashboardData).length;
  document.getElementById("selectedMonths").textContent = count ? `已选 ${count} 个月` : `未筛选（全部 ${allCount} 个月）`;
}

function activateChartItem(item) {
  const group = item.closest(".panel, .insight-panel") || item.parentElement;
  group.querySelectorAll("[data-chart-item].is-active").forEach(active => {
    if (active !== item) active.classList.remove("is-active");
  });
  item.classList.toggle("is-active");
}

function renderDailyBrief(data) {
  document.getElementById("aiBrief").textContent = buildDailyBriefText(data);
}

function buildDailyBriefText(data) {
  const context = window.RuleTalkEngine ? window.RuleTalkEngine.buildContext(data) : null;
  if (context) {
    const lag = Math.max(0, context.summary.yearTheoryProgressPct - context.summary.yearProgressPct);
    return `月度完成率 ${context.summary.monthProgressPct}%，距目标差 ${context.summary.monthGoalGapWan} 万；年度落后 ${formatNumber(lag)}pp。${context.department.highRiskDepartmentName}退单率 ${context.department.highRiskRefundRatePct}%，${context.channel.topChannelName}渠道占比 ${context.channel.topChannelOutputSharePct}%；建议优先关注退单复盘、头部渠道依赖和高客单产品打法。`;
  }

  return "月度完成率 90.9%，距目标差 264 万；年度落后 23.6pp。高退单部门、头部渠道依赖和高客单产品打法是本期重点。";
}

function initHeroSpace() {
  const canvas = document.getElementById("heroSpace");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const stars = Array.from({ length: 90 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 0.5 + Math.random() * 1.8,
    speed: 0.18 + Math.random() * 0.55,
    alpha: 0.25 + Math.random() * 0.55
  }));
  let width = 0;
  let height = 0;
  let dpr = 1;
  let frame = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawPlanet(cx, cy, radius, time) {
    const gradient = ctx.createRadialGradient(cx - radius * 0.35, cy - radius * 0.35, radius * 0.1, cx, cy, radius);
    gradient.addColorStop(0, "rgba(190, 224, 255, 0.98)");
    gradient.addColorStop(0.38, "rgba(74, 144, 226, 0.94)");
    gradient.addColorStop(1, "rgba(23, 43, 115, 0.86)");

    ctx.save();
    ctx.shadowColor = "rgba(95, 170, 255, 0.45)";
    ctx.shadowBlur = 34;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.32 + Math.sin(time * 0.0007) * 0.06);
    ctx.strokeStyle = "rgba(210, 231, 255, 0.32)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 1.62, radius * 0.48, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 226, 122, 0.22)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 1.84, radius * 0.54, 0, Math.PI * 1.08, Math.PI * 1.92);
    ctx.stroke();
    ctx.restore();

    const moonAngle = time * 0.0006;
    const moonX = cx + Math.cos(moonAngle) * radius * 2.15;
    const moonY = cy + Math.sin(moonAngle) * radius * 0.78;
    ctx.fillStyle = "rgba(255, 226, 122, 0.78)";
    ctx.beginPath();
    ctx.arc(moonX, moonY, Math.max(3, radius * 0.07), 0, Math.PI * 2);
    ctx.fill();
  }

  function draw(time) {
    frame += 1;
    ctx.clearRect(0, 0, width, height);

    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "rgba(18, 12, 50, 1)");
    bg.addColorStop(0.56, "rgba(32, 66, 180, 0.96)");
    bg.addColorStop(1, "rgba(84, 133, 194, 0.92)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    stars.forEach(star => {
      const x = ((star.x * width) + frame * star.speed) % width;
      const y = star.y * height;
      ctx.globalAlpha = star.alpha * (0.65 + Math.sin(time * 0.001 * star.speed + star.x * 20) * 0.35);
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(x, y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    drawPlanet(width * 0.84, height * 0.42, Math.min(width, height) * 0.22, time);
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(draw);
}

function pct(value, max) {
  return Math.max(0, Math.min(100, (value / max) * 100)).toFixed(2);
}

function formatNumber(value) {
  return Number(value).toLocaleString("zh-CN", { maximumFractionDigits: 2 });
}

function getRiskInfo(rate) {
  if (window.RuleTalkEngine?.getDepartmentRiskLabel) {
    return window.RuleTalkEngine.getDepartmentRiskLabel(rate);
  }

  if (rate >= 30) return { label: "高危", color: "#be123c", bg: "#ffe4e6", rateColor: "#be123c", rateBg: "#ffe4e6" };
  if (rate >= 18) return { label: "警戒", color: "#dc2626", bg: "#fee2e2", rateColor: "#dc2626", rateBg: "#fef3c7" };
  if (rate >= 14) return { label: "关注", color: "#b45309", bg: "#fef3c7", rateColor: "#d97706", rateBg: "#fffbeb" };
  if (rate >= 8) return { label: "良好", color: "#059669", bg: "#dff9ed", rateColor: "#059669", rateBg: "#dcfce7" };
  return { label: "稳健", color: "#047857", bg: "#d1fae5", rateColor: "#059669", rateBg: "#dcfce7" };
}

function riskColorByValue(value, low, high) {
  if (value >= high) return "#16b981";
  if (value >= low) return "#3b82f6";
  return "#f59f0a";
}

bindInteractions();
initHeroSpace();
loadData();
