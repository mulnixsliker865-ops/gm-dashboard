const { execFileSync } = require("child_process");
const fs = require("fs");
const https = require("https");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = process.env.DASHBOARD_OUTPUT_DIR
  ? path.resolve(process.env.DASHBOARD_OUTPUT_DIR)
  : REPO_ROOT;
const DATA_DIR = path.join(OUTPUT_DIR, "data");
const LARK = process.env.LARK_CLI_PATH || path.join(REPO_ROOT, "../../2026-06-02/5/work/lark-cli/node_modules/.bin/lark-cli");
const USE_FEISHU_DIRECT_API = Boolean(process.env.FEISHU_APP_ID && process.env.FEISHU_APP_SECRET);
let cachedAppAccessToken = "";

const SYSTEM_OUTPUT_APP = "HjAmbZsf5a5rSGsbI18cMAwynve";
const CHANNEL_MAPPING_TABLE_ID = "tblvc7xCMNzeqHQz";

const ORDER_APP = "Ia49bPOm0audLdsx0TZcIIqInMe";

const TARGET_APP = "NMqIbgKAgaAQkWsTln5chVcfnef";

const DESIGNER_ROSTER_APP = "IBQubk0ADaPIaJsFt3WcMbtLnYg";
const DASHBOARD_YEAR = Number(process.env.DASHBOARD_YEAR) || new Date().getFullYear();
const DEFAULT_YEAR_TARGET_WAN = 15000;
const DEFAULT_MONTH_TARGET_WAN = 1000;
const UNKNOWN_CHANNEL = "不详，待人工确认";
const CHANNEL_MAPPING_TOP_FIELD = "对应TOP 细分渠道产值排行 净产值";
const CHANNEL_MAPPING_SYSTEM_FIELD = "对应渠道系统净产值 净产值";
fs.mkdirSync(DATA_DIR, { recursive: true });

const PRODUCT_COLORS = {
  "任性装": "#3b82f6",
  "轻松装": "#16b981",
  "T1-2.0": "#f59f0a",
  "新Q3": "#8b5cf6",
  "Q5": "#ef4444",
  "89900": "#06b6d4",
  "基装": "#64748b",
  "未标注": "#94a3b8",
  "未映射": "#94a3b8"
};

const PRODUCT_COLOR_PALETTE = [
  "#3b82f6",
  "#16b981",
  "#f59f0a",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#64748b",
  "#22c55e",
  "#f97316",
  "#0ea5e9",
  "#d946ef",
  "#84cc16"
];

const CHANNEL_COLORS = [
  "#e9a6e8",
  "#ddef89",
  "#a7e6df",
  "#b9efb3",
  "#a9dbf2",
  "#cfd4ff",
  "#dcefff",
  "#e0f6dd",
  "#f0e7a8",
  "#b7e7f0",
  "#d9d6ff",
  "#f4d7a4",
  "#edf3bd",
  "#efe8bd",
  "#ffd8a8",
  "#bae6fd"
];

const CHANNEL_DETAIL_FALLBACK_MAP = new Map([
  ["99", "广播"],
  ["878", "广播"],
  ["北广", "广播"],
  ["广播电视", "广播"],
  ["交通106.8", "广播"],
  ["进线", "广播"],
  ["经典音乐88.5", "广播"],
  ["客户转介绍（广播）", "广播"],
  ["天津广播", "广播"],
  ["相声92.1", "广播"],
  ["新闻97.2", "广播"],
  ["百度搜索", "百度系"],
  ["搜索", "百度系"],
  ["400热线", "400热线"],
  ["抖音直播", "抖音直播类"],
  ["抖音直播（二）", "抖音直播类"],
  ["官方抖音直播", "抖音直播类"],
  ["本地推直播", "抖音直播类"],
  ["抖音信息流", "抖音信息流类"],
  ["抖音信息流类", "抖音信息流类"],
  ["微信朋友圈推广", "腾讯系"],
  ["微信朋友圈", "腾讯系"],
  ["点评类（大众点评、美团点评）", "第三方平台垂直类"],
  ["点评类(大众点评、美团点评)", "第三方平台垂直类"],
  ["工程回单", "工程回单"],
  ["设计回单", "设计回单"],
  ["客户转介绍（其他）", "客户转介绍"],
  ["官网自然流量", "官网自然流量"],
  ["全包圆自然客流", "自然客流"],
  ["散资源", "小区(非定点)"],
  ["小区非定点", "小区(非定点)"],
  ["小区（非定点）", "小区(非定点)"],
  ["小区(非定点)", "小区(非定点)"],
  ["小区定点", "小区(定点)"],
  ["小区（定点）", "小区(定点)"],
  ["小区(定点)", "小区(定点)"]
]);

const CHANNEL_DETAIL_PRIORITY_ORDER = [
  "广播",
  "腾讯系",
  "百度系",
  "抖音直播类",
  "抖音信息流类",
  "第三方平台垂直类"
];

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
  ["客户转介绍", "回单/转介绍"],
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

const validDepartments = [
  "设计一部",
  "设计二部",
  "设计三部",
  "设计四部",
  "设计五部",
  "设计六部"
];

const DESIGNER_ROSTER_PATH = path.join(DATA_DIR, "designer_roster_2026.json");
const MONTH_NAME_TO_ID = new Map([
  ["一月", "01"],
  ["二月", "02"],
  ["三月", "03"],
  ["四月", "04"],
  ["五月", "05"],
  ["六月", "06"],
  ["七月", "07"],
  ["八月", "08"],
  ["九月", "09"],
  ["十月", "10"],
  ["十一月", "11"],
  ["十二月", "12"]
]);
const DEPARTMENT_NORMALIZE_MAP = new Map([
  ["设计一组", "设计一部"],
  ["设计一部", "设计一部"],
  ["设计二组", "设计二部"],
  ["设计二部", "设计二部"],
  ["设计三组", "设计三部"],
  ["设计三部", "设计三部"],
  ["设计四组", "设计四部"],
  ["设计四部", "设计四部"],
  ["设计五组", "设计五部"],
  ["设计五部", "设计五部"],
  ["设计六组", "设计六部"],
  ["设计六部", "设计六部"]
]);

function loadDesignerRosterFromFile() {
  if (!fs.existsSync(DESIGNER_ROSTER_PATH)) return new Map();
  const raw = JSON.parse(fs.readFileSync(DESIGNER_ROSTER_PATH, "utf8"));
  return normalizeDesignerRosterPayload(raw);
}

function normalizeDesignerRosterPayload(raw) {
  const rosterByMonth = new Map();
  Object.entries(raw.months || {}).forEach(([month, monthPayload]) => {
    const byDepartment = new Map();
    (monthPayload.departments || []).forEach(row => {
      const name = atom(row.name);
      if (!validDepartments.includes(name)) return;
      const designers = Array.isArray(row.designers) ? row.designers.map(atom).filter(Boolean) : [];
      byDepartment.set(name, {
        people: Number(row.people) || designers.length,
        designers
      });
    });
    rosterByMonth.set(month, byDepartment);
  });
  return rosterByMonth;
}

function extractYearFromText(text) {
  const match = String(text || "").match(/20\d{2}/);
  return match ? Number(match[0]) : 0;
}

function tableMatchesYear(table, year = DASHBOARD_YEAR) {
  return extractYearFromText(table.name) === year;
}

function pickYearTable(tables, roleName, year = DASHBOARD_YEAR) {
  const candidates = tables.filter(table => tableMatchesYear(table, year) && table.name.includes(roleName));
  if (candidates.length === 1) return candidates[0];
  if (candidates.length > 1) {
    return candidates.sort((a, b) => a.name.length - b.name.length)[0];
  }
  const available = tables.map(table => table.name).join("、");
  throw new Error(`未找到 ${year} 年的「${roleName}」子表。当前可用子表：${available}`);
}

function pickYearTablesByRoles(appToken, roles, year = DASHBOARD_YEAR) {
  const tables = larkListTables(appToken);
  const selected = {};
  Object.entries(roles).forEach(([key, roleName]) => {
    selected[key] = pickYearTable(tables, roleName, year);
  });
  return selected;
}

function buildDesignerRosterPayload(monthRows, source = "feishu_bitable") {
  const months = {};
  Object.entries(monthRows).forEach(([month, records]) => {
    const byDepartment = new Map(validDepartments.map(name => [name, new Set()]));
    records.forEach(fields => {
      const rawDepartment = atom(fields["部门"]);
      const designer = atom(fields["设计师"]);
      const statusKey = Object.keys(fields).find(key => key.includes("行程"));
      const status = atom(fields[statusKey]);
      if (!designer || designer === "已离职" || status === "离职") return;
      const department = DEPARTMENT_NORMALIZE_MAP.get(rawDepartment);
      if (!validDepartments.includes(department)) return;
      byDepartment.get(department).add(designer);
    });

    months[month] = {
      label: `${month}月`,
      departments: validDepartments.map(name => {
        const designers = [...(byDepartment.get(name) || [])].sort();
        return {
          name,
          people: designers.length,
          designers
        };
      })
    };
  });

  return {
    source,
    generatedAt: new Date().toISOString(),
    activeRule: "读取含 2026 行程字段的月表；行程不等于“离职”的设计师计入；同一部门同名设计师去重",
    departmentNormalizeMap: Object.fromEntries(DEPARTMENT_NORMALIZE_MAP),
    months
  };
}

function loadDesignerRosterFromFeishu() {
  const tables = larkListTables(DESIGNER_ROSTER_APP);
  const monthRows = {};

  tables.forEach(table => {
    if (!tableMatchesYear(table)) return;
    const monthName = [...MONTH_NAME_TO_ID.keys()].find(name => table.name.includes(name));
    const month = MONTH_NAME_TO_ID.get(monthName);
    if (!month) return;
    const fields = larkGetFields(DESIGNER_ROSTER_APP, table.table_id);
    const hasSchedule = fields.some(field => field.field_name.includes("行程"));
    if (!hasSchedule) return;
    monthRows[month] = larkGet(DESIGNER_ROSTER_APP, table.table_id).map(record => record.fields || {});
  });

  const payload = buildDesignerRosterPayload(monthRows);
  fs.writeFileSync(DESIGNER_ROSTER_PATH, JSON.stringify(payload, null, 2), "utf8");
  return normalizeDesignerRosterPayload(payload);
}

function loadDesignerRoster() {
  try {
    return loadDesignerRosterFromFeishu();
  } catch (error) {
    console.warn(`Designer roster Feishu load failed, fallback to local file: ${error.message}`);
    return loadDesignerRosterFromFile();
  }
}

function requestJson(method, apiPath, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : "";
    const request = https.request({
      hostname: "open.feishu.cn",
      path: apiPath,
      method,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
        ...headers
      }
    }, response => {
      let raw = "";
      response.setEncoding("utf8");
      response.on("data", chunk => {
        raw += chunk;
      });
      response.on("end", () => {
        try {
          const parsed = JSON.parse(raw);
          if (response.statusCode >= 400) {
            reject(new Error(`Feishu HTTP ${response.statusCode}: ${raw}`));
            return;
          }
          resolve(parsed);
        } catch (error) {
          reject(new Error(`Feishu JSON parse failed: ${error.message}; raw=${raw.slice(0, 300)}`));
        }
      });
    });
    request.on("error", reject);
    if (payload) request.write(payload);
    request.end();
  });
}

async function getAppAccessToken() {
  if (cachedAppAccessToken) return cachedAppAccessToken;
  const payload = await requestJson("POST", "/open-apis/auth/v3/app_access_token/internal", {
    app_id: process.env.FEISHU_APP_ID,
    app_secret: process.env.FEISHU_APP_SECRET
  });
  if (payload.code !== 0 || !payload.app_access_token) {
    throw new Error(`Feishu token failed: ${payload.msg || JSON.stringify(payload)}`);
  }
  cachedAppAccessToken = payload.app_access_token;
  return cachedAppAccessToken;
}

async function feishuApiGet(pathname, params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") query.set(key, String(value));
  });
  const token = await getAppAccessToken();
  const apiPath = `${pathname}${query.toString() ? `?${query.toString()}` : ""}`;
  const payload = await requestJson("GET", apiPath, null, {
    Authorization: `Bearer ${token}`
  });
  if (payload.code !== 0) {
    throw new Error(`Feishu API failed: ${payload.msg || JSON.stringify(payload)}`);
  }
  return payload;
}

function larkApiGet(path, params = {}) {
  if (USE_FEISHU_DIRECT_API) {
    return feishuApiGetSync(path, params);
  }
  const args = [
    "--profile", "gm-dashboard",
    "api", "GET",
    path
  ];
  if (Object.keys(params).length) {
    args.push("--params", JSON.stringify(params));
  }
  args.push("--as", "bot");
  const output = execFileSync(LARK, args, { encoding: "utf8", cwd: REPO_ROOT });
  const payload = JSON.parse(output);
  if (payload.code !== 0) {
    throw new Error(`Feishu API failed: ${payload.msg || payload.error?.message || output}`);
  }
  return payload;
}

function getAppAccessTokenSync() {
  if (cachedAppAccessToken) return cachedAppAccessToken;
  const output = execFileSync("curl", [
    "-sS",
    "-X",
    "POST",
    "https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal",
    "-H",
    "Content-Type: application/json; charset=utf-8",
    "-d",
    JSON.stringify({
      app_id: process.env.FEISHU_APP_ID,
      app_secret: process.env.FEISHU_APP_SECRET
    })
  ], { encoding: "utf8" });
  const payload = JSON.parse(output);
  if (payload.code !== 0 || !payload.app_access_token) {
    throw new Error(`Feishu token failed: ${payload.msg || output}`);
  }
  cachedAppAccessToken = payload.app_access_token;
  return cachedAppAccessToken;
}

function feishuApiGetSync(pathname, params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") query.set(key, String(value));
  });
  const url = `https://open.feishu.cn${pathname}${query.toString() ? `?${query.toString()}` : ""}`;
  const output = execFileSync("curl", [
    "-sS",
    url,
    "-H",
    `Authorization: Bearer ${getAppAccessTokenSync()}`
  ], { encoding: "utf8" });
  const payload = JSON.parse(output);
  if (payload.code !== 0) {
    throw new Error(`Feishu API failed: ${payload.msg || output}`);
  }
  return payload;
}

function larkListTables(appToken) {
  return larkApiGet(`/open-apis/bitable/v1/apps/${appToken}/tables`).data.items || [];
}

function larkGetFields(appToken, tableId) {
  return larkApiGet(`/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/fields`).data.items || [];
}

function larkGet(appToken, tableId) {
  const items = [];
  let pageToken = "";
  do {
    const params = { page_size: 500 };
    if (pageToken) params.page_token = pageToken;
    const payload = larkApiGet(`/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`, params);
    items.push(...(payload.data.items || []));
    pageToken = payload.data.has_more ? payload.data.page_token : "";
  } while (pageToken);
  return items;
}

function atom(value) {
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) return value.map(atom).filter(Boolean).join("、");
  if (typeof value === "object") return String(value.text ?? value.name ?? value.value ?? "").trim();
  return String(value).trim();
}

function num(value) {
  const parsed = Number(String(atom(value)).replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function firstNum(fields, names) {
  for (const name of names) {
    const value = num(fields[name]);
    if (value) return value;
  }
  return 0;
}

function firstAtom(fields, names) {
  for (const name of names) {
    const value = atom(fields[name]);
    if (value) return value;
  }
  return "";
}

function getFormalPositiveOutputYuan(row) {
  return firstNum(row, ["转正式差额产值", "转正差额产值"]) + firstNum(row, ["转正\n设计费", "转正设计费"]);
}

function getFormalQuoteOutputYuan(row) {
  return firstNum(row, [
    "报价单产值（含设计费）",
    "报价单产值(含设计费)",
    "报价单产值",
    "转正业绩总产值"
  ]);
}

function getSignSystemOutputYuan(row) {
  return firstNum(row, ["系统产值", "草签系统产值", "草签业绩产值"]);
}

function getRefundOutputYuan(row) {
  return firstNum(row, ["退单产值", "退款产值", "退单金额"]);
}

function getOrderKey(row, names = ["客户编号", "合同|预售编号", "预售协议编号", "姓名", "客户姓名"]) {
  return firstAtom(row, names);
}

function round(value, digits = 2) {
  return Number((Number(value) || 0).toFixed(digits));
}

function safeDivide(a, b) {
  return b ? a / b : 0;
}

function normalizeMonth(value) {
  const text = atom(value);
  if (!text) return "";
  if (/^\d{4}-\d{2}/.test(text)) return text.slice(5, 7);
  const match = text.match(/\d{1,2}/);
  return match ? String(Number(match[0])).padStart(2, "0") : "";
}

function getDetailChannel(fields) {
  const level2 = atom(fields["来源渠道二级"]);
  if (level2) return CHANNEL_DETAIL_FALLBACK_MAP.get(level2) || level2;
  const source = atom(fields["来源渠道"]);
  return CHANNEL_DETAIL_FALLBACK_MAP.get(source) || source || "未识别渠道";
}

function getOutreachGroup(name) {
  const text = String(name || "").trim();
  if (!text) return "其他";
  if (CHANNEL_OUTREACH_MAP.has(text)) return CHANNEL_OUTREACH_MAP.get(text);
  const normalized = text.replace(/\s+/g, "");
  for (const [source, group] of CHANNEL_OUTREACH_MAP.entries()) {
    const sourceText = source.replace(/\s+/g, "");
    if (normalized === sourceText || normalized.includes(sourceText) || sourceText.includes(normalized)) return group;
  }
  return "其他";
}

function normalizeProductText(value) {
  return String(value || "")
    .replace(/\s+/g, "")
    .replace(/（/g, "(")
    .replace(/）/g, ")")
    .trim();
}

function foldProductArea(value) {
  return normalizeProductText(value)
    .replace(/\d+(?:\.\d+)?平米/g, "#平米")
    .replace(/\d+(?:\.\d+)?㎡/g, "#㎡");
}

function dropProductArea(value) {
  return normalizeProductText(value)
    .replace(/\d+(?:\.\d+)?平米/g, "")
    .replace(/\d+(?:\.\d+)?㎡/g, "");
}

function buildProductMapper(records) {
  const exact = new Map();
  const folded = new Map();
  const coreRules = [];
  const conflicts = [];

  records.forEach(fields => {
    const raw = atom(fields["产品套系"]);
    const level1 = atom(fields["一级映射"]);
    const level2 = atom(fields["二级映射"]);
    if (!raw || !level1 || !level2) return;

    const normalized = normalizeProductText(raw);
    const foldedKey = foldProductArea(raw);
    const core = dropProductArea(raw);
    const rule = { raw, level1, level2, source: "product-mapping-table" };
    const previous = exact.get(normalized);

    if (previous && (previous.level1 !== level1 || previous.level2 !== level2)) {
      conflicts.push({ raw, previous, current: rule });
    }

    exact.set(normalized, rule);
    folded.set(foldedKey, rule);
    if (core.length >= 2) coreRules.push({ ...rule, core, length: core.length });
  });

  coreRules.sort((a, b) => b.length - a.length);

  return {
    resolve(rawText) {
      const normalized = normalizeProductText(rawText);
      if (!normalized) return { level1: "未标注", level2: "未标注", source: "empty-product" };
      if (exact.has(normalized)) return exact.get(normalized);

      const foldedKey = foldProductArea(rawText);
      if (folded.has(foldedKey)) return folded.get(foldedKey);

      const coreText = dropProductArea(rawText);
      const matched = coreRules.find(rule => coreText.includes(rule.core) || rule.core.includes(coreText));
      if (matched) return { ...matched, source: "product-mapping-core-match" };

      return { level1: "未映射", level2: "未映射", source: "unmatched-product", raw: rawText };
    },
    summary() {
      return {
        exactRules: exact.size,
        foldedRules: folded.size,
        coreRules: coreRules.length,
        conflicts
      };
    }
  };
}

function buildFormalProductLookup(records, productMapper) {
  const byCustomerId = new Map();
  const byContractId = new Map();

  function push(map, key, row) {
    if (!key) return;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(row);
  }

  records.forEach(row => {
    const rawProduct = atom(row["产品套系"]) || atom(row["套系"]);
    const mapped = productMapper.resolve(rawProduct);
    const item = {
      rawProduct,
      level1: mapped.level1 || "未映射",
      level2: mapped.level2 || mapped.level1 || "未映射",
      customerId: atom(row["客户编号"]),
      contractId: atom(row["合同|预售编号"]),
      customerName: atom(row["姓名"]) || atom(row["客户姓名"])
    };
    push(byCustomerId, item.customerId, item);
    push(byContractId, item.contractId, item);
  });

  return {
    resolveRefund(row) {
      const customerId = atom(row["客户编号"]);
      const contractId = atom(row["合同|预售编号"]);
      const customerName = atom(row["客户姓名"]) || atom(row["姓名"]);

      const direct = byCustomerId.get(customerId)?.[0] || byContractId.get(contractId)?.[0];
      if (direct) return { ...direct, matchBy: customerId ? "customer_id" : "contract_id" };

      return {
        level1: "未映射",
        level2: "未映射",
        rawProduct: "",
        customerId,
        contractId,
        customerName,
        matchBy: "unmatched_refund"
      };
    }
  };
}

function buildChannelMapper(records) {
  const byLevel2 = new Map();
  const bySource = new Map();

  function normalizeKey(value) {
    return atom(value).replace(/\s+/g, "");
  }

  function buildMapping(row) {
    return {
      top: atom(row[CHANNEL_MAPPING_TOP_FIELD]) || UNKNOWN_CHANNEL,
      system: atom(row[CHANNEL_MAPPING_SYSTEM_FIELD]) || UNKNOWN_CHANNEL
    };
  }

  records.forEach(row => {
    const mapping = buildMapping(row);
    const level2Key = normalizeKey(row["来源渠道二级"]);
    const sourceKey = normalizeKey(row["来源渠道"]);
    if (level2Key) byLevel2.set(level2Key, mapping);
    if (!level2Key && sourceKey) bySource.set(sourceKey, mapping);
  });

  function resolve(fields) {
    const level2 = atom(fields["来源渠道二级"]);
    const source = atom(fields["来源渠道"]);
    if (level2) return byLevel2.get(normalizeKey(level2)) || { top: UNKNOWN_CHANNEL, system: UNKNOWN_CHANNEL };
    if (source) return bySource.get(normalizeKey(source)) || { top: UNKNOWN_CHANNEL, system: UNKNOWN_CHANNEL };
    return { top: UNKNOWN_CHANNEL, system: UNKNOWN_CHANNEL };
  }

  return {
    resolveTop(fields) {
      return resolve(fields).top;
    },
    resolveSystem(fields) {
      return resolve(fields).system;
    },
    summary() {
      return {
        records: records.length,
        level2Rules: byLevel2.size,
        sourceFallbackRules: bySource.size
      };
    }
  };
}

function pickDepartment(fields, names = ["设计部门", "设计师现属部门"]) {
  const raw = names.map(name => atom(fields[name])).find(Boolean) || "";
  return validDepartments.find(department => raw.includes(department)) || "未识别";
}

function uniqueCount(rows, keyGetter) {
  return new Set(rows.map(keyGetter).filter(Boolean)).size;
}

function addMetric(map, key, patch) {
  const current = map.get(key) || {};
  map.set(key, { ...current, ...patch });
}

function groupByMonth(records, monthGetter) {
  const grouped = new Map();
  records.forEach(record => {
    const month = monthGetter(record);
    if (!month) return;
    if (!grouped.has(month)) grouped.set(month, []);
    grouped.get(month).push(record);
  });
  return grouped;
}

function getDaysInMonth(year, monthNumber) {
  return new Date(year, monthNumber, 0).getDate();
}

function getElapsedDaysByCurrentDate(year, monthId, now = new Date()) {
  const monthNumber = Number(monthId);
  if (!year || !monthNumber) return 0;
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const monthDays = getDaysInMonth(year, monthNumber);
  if (year < currentYear || (year === currentYear && monthNumber < currentMonth)) return monthDays;
  if (year > currentYear || (year === currentYear && monthNumber > currentMonth)) return 0;
  return Math.min(now.getDate(), monthDays);
}

function buildTargetLookup(records) {
  const validRows = records
    .map(row => {
      const year = Number(atom(row.year));
      const monthId = normalizeMonth(row.month);
      const monthDays = num(row.month_days) || getDaysInMonth(year, Number(monthId));
      return {
        year: String(year || ""),
        month: atom(row.month),
        monthId,
        monthLabel: atom(row.month_label),
        yearTargetWan: num(row.year_target_wan),
        monthTargetWan: num(row.month_target_wan),
        theoryProgressPct: num(row.theory_progress_pct),
        monthDays,
        elapsedDays: getElapsedDaysByCurrentDate(year, monthId),
        elapsedDaysSource: "system_current_date"
      };
    })
    .filter(row => /^\d{4}$/.test(row.year) && /^\d{4}-\d{2}$/.test(row.month) && row.monthTargetWan > 0);

  const byMonth = new Map(validRows.map(row => [row.monthId, row]));
  const totalYearDays = validRows.reduce((total, row) => total + (row.monthDays || 0), 0) || 365;
  let cumulativeElapsedDays = 0;

  validRows
    .sort((a, b) => a.monthId.localeCompare(b.monthId))
    .forEach(row => {
      cumulativeElapsedDays += Number.isFinite(row.elapsedDays) ? row.elapsedDays : (row.monthDays || 0);
      row.computedTheoryProgressPct = row.theoryProgressPct || round(safeDivide(cumulativeElapsedDays * 100, totalYearDays));
      row.totalYearDays = totalYearDays;
      byMonth.set(row.monthId, row);
    });

  return {
    byMonth,
    months: validRows.sort((a, b) => a.monthId.localeCompare(b.monthId)),
    defaultYearTargetWan: validRows.find(row => row.yearTargetWan > 0)?.yearTargetWan || DEFAULT_YEAR_TARGET_WAN
  };
}

function toRanking(rows, totalWan) {
  const normalizedRows = rows.map(row => {
    const orders = row.orderKeys instanceof Set ? row.orderKeys.size : row.orders;
    return {
      ...row,
      orders: Number.isFinite(orders) ? orders : null
    };
  });
  const orderDenominator = normalizedRows.reduce((total, row) => total + (Number(row.orders) || 0), 0);
  const valueDenominator = normalizedRows.reduce((total, row) => total + Math.abs(row.value || 0), 0) || Math.abs(totalWan) || 1;
  return rows
    .filter(row => row.value !== 0)
    .sort((a, b) => {
      const priorityA = CHANNEL_DETAIL_PRIORITY_ORDER.indexOf(a.name);
      const priorityB = CHANNEL_DETAIL_PRIORITY_ORDER.indexOf(b.name);
      const hasPriorityA = priorityA >= 0;
      const hasPriorityB = priorityB >= 0;
      if (hasPriorityA || hasPriorityB) {
        if (!hasPriorityA) return 1;
        if (!hasPriorityB) return -1;
        return priorityA - priorityB;
      }
      return b.value - a.value;
    })
    .map((row, index) => {
      const orders = row.orderKeys instanceof Set ? row.orderKeys.size : row.orders;
      const orderSharePct = Number.isFinite(orders) && orderDenominator
        ? safeDivide(orders * 100, orderDenominator)
        : safeDivide(Math.abs(row.value || 0) * 100, valueDenominator);
      return {
        name: row.name,
        value: round(row.value),
        orders: Number.isFinite(orders) ? orders : null,
        sharePct: round(orderSharePct),
        color: CHANNEL_COLORS[index % CHANNEL_COLORS.length],
        label: `${round(row.value)} 万${Number.isFinite(orders) ? ` / ${orders} 单` : ""} / 订单占比 ${round(orderSharePct)}%`
      };
    });
}

function toChannelShareRows(rows) {
  const denominator = rows.reduce((total, row) => total + Math.abs(row.value || 0), 0);
  return rows
    .filter(row => row.value !== 0)
    .sort((a, b) => Math.abs(b.value || 0) - Math.abs(a.value || 0))
    .map((row, index) => ({
      name: row.name,
      netValueWan: round(row.value),
      value: round(safeDivide(Math.abs(row.value || 0) * 100, denominator)),
      color: CHANNEL_COLORS[index % CHANNEL_COLORS.length]
    }));
}

function toProductNetRows(rows) {
  const denominator = rows.reduce((total, row) => total + Math.abs(row.value || 0), 0);
  return rows
    .filter(row => row.value !== 0 && !["未标注", "未映射"].includes(row.name))
    .sort((a, b) => Math.abs(b.value || 0) - Math.abs(a.value || 0))
    .map((row, index) => ({
      name: row.name,
      netValueWan: round(row.value),
      value: round(safeDivide(Math.abs(row.value || 0) * 100, denominator)),
      color: productColor(row.name, index)
    }));
}

function productColor(name, index = 0) {
  return PRODUCT_COLORS[name] || PRODUCT_COLOR_PALETTE[index % PRODUCT_COLOR_PALETTE.length] || "#94a3b8";
}

function departmentSortIndex(name) {
  const index = validDepartments.indexOf(name);
  return index >= 0 ? index : validDepartments.length;
}

function sortDesignerByDepartment(a, b) {
  const departmentDiff = departmentSortIndex(a.department) - departmentSortIndex(b.department);
  if (departmentDiff) return departmentDiff;
  return String(a.designer || "").localeCompare(String(b.designer || ""), "zh-Hans-CN");
}

function toShareRows(rows, totalWan) {
  return rows
    .filter(row => row.value > 0)
    .sort((a, b) => b.value - a.value)
    .map((row, index) => ({
      name: row.name,
      value: round(safeDivide(row.value * 100, totalWan)),
      color: productColor(row.name, index)
    }));
}

function channelOutreachRows(channelRanking, totalWan) {
  const grouped = new Map(CHANNEL_OUTREACH_ORDER.map(name => [
    name,
    { name, value: 0, color: CHANNEL_OUTREACH_COLORS[name] || "#64748b" }
  ]));
  channelRanking.forEach(row => {
    const groupName = getOutreachGroup(row.name);
    const current = grouped.get(groupName) || { name: groupName, value: 0, color: CHANNEL_OUTREACH_COLORS[groupName] || "#64748b" };
    current.value += Number(row.value) || 0;
    grouped.set(groupName, current);
  });
  return [...grouped.values()]
    .map(row => ({ ...row, value: round(safeDivide(row.value * 100, totalWan)) }))
    .filter(row => row.value > 0)
    .sort((a, b) => CHANNEL_OUTREACH_ORDER.indexOf(a.name) - CHANNEL_OUTREACH_ORDER.indexOf(b.name));
}

function buildMonthSnapshot(month, systemRows, signRows, formalRows, refundRows, targetLookup, productMapper, channelMapper, formalProductLookup, designerRosterByMonth) {
  const target = targetLookup.byMonth.get(month) || {};
  const rosterByDepartment = designerRosterByMonth.get(month) || new Map();
  const yearTargetWan = target.yearTargetWan || targetLookup.defaultYearTargetWan || DEFAULT_YEAR_TARGET_WAN;
  const monthTargetWan = target.monthTargetWan || DEFAULT_MONTH_TARGET_WAN;
  const systemOutputWan = round(systemRows.reduce((total, row) => total + num(row["合计产值"]) / 10000, 0));
  const positiveOutputWan = round(formalRows.reduce((total, row) => total + getFormalPositiveOutputYuan(row) / 10000, 0));
  const quoteOutputWan = round(formalRows.reduce((total, row) => total + getFormalQuoteOutputYuan(row) / 10000, 0));
  const draftOrderCount = uniqueCount(signRows.filter(row => atom(row["是否有效订单"]) !== "否"), row => atom(row["客户编号"]) || atom(row["合同|预售编号"]) || atom(row["预售协议编号"]) || atom(row["姓名"]));
  const orderCount = uniqueCount(formalRows.filter(row => atom(row["是否有效订单"]) !== "否"), row => atom(row["客户编号"]) || atom(row["合同|预售编号"]) || atom(row["姓名"]));
  const refundCount = uniqueCount(refundRows.filter(row => atom(row["是否退款"]) !== "否"), row => atom(row["客户编号"]) || atom(row["客户姓名"]));
  const refundLossWan = round(refundRows.reduce((total, row) => total + getRefundOutputYuan(row) / 10000, 0));
  const signSystemOutputWan = round(signRows
    .filter(row => atom(row["是否有效订单"]) !== "否")
    .reduce((total, row) => total + getSignSystemOutputYuan(row) / 10000, 0));
  const netOutputWan = round(signSystemOutputWan + positiveOutputWan - refundLossWan);
  const avgOrder = safeDivide(quoteOutputWan || positiveOutputWan, orderCount);
  const refundRate = safeDivide(refundCount * 100, draftOrderCount);

  const channelMap = new Map();
  const channelSystemMap = new Map();
  systemRows.forEach((row, index) => {
    const orderKey = getOrderKey(row, ["客户编号", "合同|预售编号", "预售协议编号", "合同编号", "客户姓名", "姓名"]) || `system-row-${month}-${index}`;
    const name = channelMapper.resolveTop(row);
    const current = channelMap.get(name) || { name, value: 0, orderKeys: new Set() };
    current.value += num(row["合计产值"]) / 10000;
    current.orderKeys.add(orderKey);
    channelMap.set(name, current);

    const systemName = channelMapper.resolveSystem(row);
    const systemCurrent = channelSystemMap.get(systemName) || { name: systemName, value: 0, orderKeys: new Set() };
    systemCurrent.value += num(row["合计产值"]) / 10000;
    systemCurrent.orderKeys.add(orderKey);
    channelSystemMap.set(systemName, systemCurrent);
  });
  const channelRanking = toRanking([...channelMap.values()], systemOutputWan);
  const channels = toChannelShareRows([...channelSystemMap.values()]);

  const productOutputLevel1 = new Map();
  const productOrdersLevel1 = new Map();
  const productOutputLevel2 = new Map();
  const productOrdersLevel2 = new Map();
  const productQuoteLevel2 = new Map();
  const productQuoteOrdersLevel2 = new Map();
  const productAreaLevel2 = new Map();
  const productOrderKeys = new Set();

  function resolveProductForRow(row, names) {
    const rawProduct = names.map(name => atom(row[name])).find(Boolean);
    const mapped = productMapper.resolve(rawProduct);
    if (!["未标注", "未映射"].includes(mapped.level1) && !["未标注", "未映射"].includes(mapped.level2)) return mapped;
    const matched = formalProductLookup.resolveRefund(row);
    if (!["未标注", "未映射"].includes(matched.level1) || !["未标注", "未映射"].includes(matched.level2)) {
      return {
        level1: matched.level1,
        level2: matched.level2 || matched.level1,
        source: `product-lookup-${matched.matchBy}`
      };
    }
    return mapped;
  }

  function addProductOutput(row, mapped, output, key) {
    const level1Name = mapped.level1 || "未映射";
    const level2Name = mapped.level2 || level1Name || "未映射";
    if (!output) return;

    productOutputLevel1.set(level1Name, (productOutputLevel1.get(level1Name) || 0) + output);
    if (!productOrdersLevel1.has(level1Name)) productOrdersLevel1.set(level1Name, new Set());
    if (key) {
      productOrdersLevel1.get(level1Name).add(key);
      productOrderKeys.add(key);
    }

    productOutputLevel2.set(level2Name, (productOutputLevel2.get(level2Name) || 0) + output);
    if (!productOrdersLevel2.has(level2Name)) productOrdersLevel2.set(level2Name, new Set());
    if (key) productOrdersLevel2.get(level2Name).add(key);
  }

  signRows
    .filter(row => atom(row["是否有效订单"]) !== "否")
    .forEach(row => {
      const mapped = resolveProductForRow(row, ["套系", "产品套系"]);
      const output = getSignSystemOutputYuan(row) / 10000;
      const key = getOrderKey(row, ["客户编号", "合同|预售编号", "预售协议编号", "客户姓名"]);
      addProductOutput(row, mapped, output, key);
    });

  formalRows.forEach(row => {
    const mapped = resolveProductForRow(row, ["产品套系", "套系"]);
    const output = getFormalPositiveOutputYuan(row) / 10000;
    const quoteOutput = getFormalQuoteOutputYuan(row) / 10000;
    const key = getOrderKey(row, ["客户编号", "合同|预售编号", "姓名"]);
    addProductOutput(row, mapped, output, key);

    const area = num(row["计价面积"]) || num(row["签约面积"]);
    const level2Name = mapped.level2 || mapped.level1 || "未映射";
    if (!["未标注", "未映射"].includes(level2Name)) {
      productQuoteLevel2.set(level2Name, (productQuoteLevel2.get(level2Name) || 0) + quoteOutput);
      if (!productQuoteOrdersLevel2.has(level2Name)) productQuoteOrdersLevel2.set(level2Name, new Set());
      if (key) productQuoteOrdersLevel2.get(level2Name).add(key);
    }
    if (!productAreaLevel2.has(level2Name)) productAreaLevel2.set(level2Name, { area: 0, count: 0 });
    if (area) {
      const areaRow = productAreaLevel2.get(level2Name);
      areaRow.area += area;
      areaRow.count += 1;
    }
  });
  const unmatchedRefundProducts = {};
  let matchedProductRefundWan = 0;
  let unmatchedProductRefundWan = 0;
  refundRows
    .filter(row => atom(row["是否退款"]) !== "否")
    .forEach(row => {
      const matched = formalProductLookup.resolveRefund(row);
      const refundOutput = getRefundOutputYuan(row) / 10000;
      if (matched.level1 === "未映射" || matched.level2 === "未映射") {
        const key = `${matched.matchBy}:${matched.customerId || matched.customerName || "未知客户"}`;
        unmatchedRefundProducts[key] = (unmatchedRefundProducts[key] || 0) + 1;
        unmatchedProductRefundWan += refundOutput;
        return;
      }
      productOutputLevel1.set(matched.level1, (productOutputLevel1.get(matched.level1) || 0) - refundOutput);
      productOutputLevel2.set(matched.level2, (productOutputLevel2.get(matched.level2) || 0) - refundOutput);
      matchedProductRefundWan += refundOutput;
    });
  const productRowsLevel1 = [...productOutputLevel1.entries()].map(([name, value]) => ({ name, value }));
  const productRowsLevel2 = [...productOutputLevel2.entries()].map(([name, value]) => ({ name, value }));
  const validProductRowsLevel1 = productRowsLevel1.filter(row => row.value > 0 && !["未标注", "未映射"].includes(row.name));
  const validProductRowsLevel2 = productRowsLevel2.filter(row => row.value > 0 && !["未标注", "未映射"].includes(row.name));
  const sortedProductRowsLevel1 = [...validProductRowsLevel1].sort((a, b) => b.value - a.value);
  const unclassifiedProductOutputWan = round(productRowsLevel1
    .filter(row => ["未标注", "未映射"].includes(row.name))
    .reduce((total, row) => total + Math.max(0, row.value), 0));
  const productOutputWanRaw = validProductRowsLevel1.reduce((total, row) => total + Math.max(0, row.value), 0);
  const productOutputLevel2WanRaw = validProductRowsLevel2.reduce((total, row) => total + Math.max(0, row.value), 0);
  const productOutputWan = round(productOutputWanRaw);
  const productOutputLevel2Wan = round(productOutputLevel2WanRaw);
  const productLevel1ShareDenominator = productOutputWanRaw || positiveOutputWan;
  const productLevel2ShareDenominator = productOutputLevel2WanRaw || productLevel1ShareDenominator;
  const productOrderDenominator = productOrderKeys.size || orderCount;
  const products = toProductNetRows(productRowsLevel1);
  const productContribution = validProductRowsLevel2
    .sort((a, b) => b.value - a.value)
    .map(row => ({
      name: row.name,
      output: round(safeDivide(row.value * 100, productLevel2ShareDenominator)),
      orders: round(safeDivide((productOrdersLevel2.get(row.name)?.size || 0) * 100, productOrderDenominator))
    }));
  const productValue = [...productQuoteLevel2.entries()]
    .filter(([name, value]) => value > 0 && !["未标注", "未映射"].includes(name))
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], index) => ({
      name,
      value: round(safeDivide(value, productQuoteOrdersLevel2.get(name)?.size || 0)),
      color: productColor(name, index)
    }));
  const productAreaRows = [...productAreaLevel2.entries()]
    .filter(([name]) => !["未标注", "未映射"].includes(name))
    .map(([name, row], index) => ({
      name,
      value: round(safeDivide(row.area, row.count)),
      color: productColor(name, index)
    }));

  const departmentMap = new Map();
  const designerMap = new Map();
  const orderLedger = new Map();

  function getCustomerLedgerKey(row, names = ["客户编号", "合同|预售编号", "预售协议编号"]) {
    return firstAtom(row, names);
  }

  function getLedgerRow(key) {
    const current = orderLedger.get(key) || {
      key,
      ownerDepartment: "",
      ownerDesigner: "",
      ownerPriority: 0,
      signWan: 0,
      formalWan: 0,
      quoteOutputWan: 0,
      refundWan: 0,
      draftOrders: new Set(),
      formalOrders: new Set(),
      refundOrders: new Set()
    };
    orderLedger.set(key, current);
    return current;
  }

  function updateLedgerOwner(ledger, row, priority, departmentFields = ["设计部门", "设计师现属部门"]) {
    const department = pickDepartment(row, departmentFields);
    const designer = atom(row["设计师"]);
    const hasUsefulOwner = validDepartments.includes(department) || designer;
    if (!hasUsefulOwner || priority < ledger.ownerPriority) return;
    ledger.ownerDepartment = validDepartments.includes(department) ? department : ledger.ownerDepartment;
    ledger.ownerDesigner = designer || ledger.ownerDesigner;
    ledger.ownerPriority = priority;
  }

  function getDesignerRow(designer, department) {
    const designerName = designer || "未标注设计师";
    const departmentName = validDepartments.includes(department) ? department : "未识别";
    const key = `${departmentName}::${designerName}`;
    const current = designerMap.get(key) || {
      designer: designerName,
      department: departmentName,
      draftWan: 0,
      formalWan: 0,
      refundWan: 0,
      draftOrders: new Set(),
      formalOrders: new Set(),
      refundOrders: new Set()
    };
    designerMap.set(key, current);
    return current;
  }

  signRows
    .filter(row => atom(row["是否有效订单"]) !== "否")
    .forEach((row, index) => {
      const key = getCustomerLedgerKey(row) || `unmatched-sign-${month}-${index}`;
      const ledger = getLedgerRow(key);
      updateLedgerOwner(ledger, row, 2, ["设计部门", "设计师现属部门"]);
      ledger.signWan += getSignSystemOutputYuan(row) / 10000;
      ledger.draftOrders.add(key);
    });

  formalRows.forEach((row, index) => {
    const key = getCustomerLedgerKey(row, ["客户编号", "合同|预售编号"]) || `unmatched-formal-${month}-${index}`;
    const ledger = getLedgerRow(key);
    updateLedgerOwner(ledger, row, 3, ["设计部门", "设计师现属部门"]);
    ledger.formalWan += getFormalPositiveOutputYuan(row) / 10000;
    ledger.quoteOutputWan += getFormalQuoteOutputYuan(row) / 10000;
    ledger.formalOrders.add(key);
  });
  refundRows.forEach((row, index) => {
    const key = getCustomerLedgerKey(row, ["客户编号", "合同|预售编号"]) || `unmatched-refund-${month}-${index}`;
    const ledger = getLedgerRow(key);
    updateLedgerOwner(ledger, row, 1, ["设计部门", "设计师现属部门"]);
    ledger.refundWan += getRefundOutputYuan(row) / 10000;
    ledger.refundOrders.add(key);
  });

  orderLedger.forEach(ledger => {
    const name = validDepartments.includes(ledger.ownerDepartment) ? ledger.ownerDepartment : "未识别";
    const designer = ledger.ownerDesigner || "未标注设计师";
    const current = departmentMap.get(name) || { name, output: 0, quoteOutput: 0, designerNames: new Set(), draftOrders: new Set(), orders: new Set(), refund: new Set(), refundWan: 0 };
    current.output += ledger.signWan + ledger.formalWan - ledger.refundWan;
    current.quoteOutput += ledger.quoteOutputWan;
    current.refundWan += ledger.refundWan;
    if (ledger.draftOrders.size) ledger.draftOrders.forEach(key => current.draftOrders.add(key));
    if (ledger.formalOrders.size) ledger.formalOrders.forEach(key => current.orders.add(key));
    if (ledger.refundOrders.size) ledger.refundOrders.forEach(key => current.refund.add(key));
    if (designer !== "未标注设计师") current.designerNames.add(designer);
    departmentMap.set(name, current);

    const designerRow = getDesignerRow(designer, name);
    designerRow.draftWan += ledger.signWan;
    designerRow.formalWan += ledger.formalWan;
    designerRow.refundWan += ledger.refundWan;
    ledger.draftOrders.forEach(key => designerRow.draftOrders.add(key));
    ledger.formalOrders.forEach(key => designerRow.formalOrders.add(key));
    ledger.refundOrders.forEach(key => designerRow.refundOrders.add(key));
  });
  const departments = [...departmentMap.values()]
    .filter(row => validDepartments.includes(row.name))
    .map(row => {
      const orders = row.orders.size;
      const draftOrders = row.draftOrders.size;
      const roster = rosterByDepartment.get(row.name);
      const hasRosterPeople = Boolean(roster && roster.people > 0);
      const designerNames = hasRosterPeople ? roster.designers : [...row.designerNames].sort();
      const people = Math.max(1, hasRosterPeople ? roster.people : (designerNames.length || row.designerNames.size));
      const refund = row.refund.size;
      const refundRate = draftOrders ? safeDivide(refund * 100, draftOrders) : (refund > 0 ? 100 : 0);
      const refundWan = round(row.refundWan);
      const controlRecoverWan = round(refundWan * 0.2);
      return {
        name: row.name,
        output: round(row.output),
        draftOrders,
        orders,
        avg: round(safeDivide(row.quoteOutput, orders)),
        quoteOutputWan: round(row.quoteOutput),
        netOutputWan: round(row.output),
        people,
        designerNames,
        peopleSource: hasRosterPeople ? "designer_roster" : "performance_records",
        monthly: round(row.output),
        refund,
        refundWan,
        controlRecoverWan,
        controlledOutput: round(row.output + controlRecoverWan),
        refundRate: round(refundRate),
        perCapita: round(safeDivide(row.output, people)),
        risk: getRiskLabel(refundRate)
      };
    })
    .sort((a, b) => b.output - a.output);

  const designerHeatmap = [...designerMap.values()]
    .filter(row => validDepartments.includes(row.department) && row.designer !== "未标注设计师")
    .map(row => ({
      designer: row.designer,
      department: row.department,
      draftWan: round(row.draftWan),
      formalWan: round(row.formalWan),
      refundWan: round(row.refundWan),
      draftOrders: row.draftOrders.size,
      formalOrders: row.formalOrders.size,
      refundOrders: row.refundOrders.size
    }))
    .sort(sortDesignerByDepartment);

  return {
    summary: {
      statDays: 30,
      currentOutputWan: netOutputWan,
      netOutputWan,
      positiveOutputWan,
      quoteOutputWan,
      systemOutputWan,
      signSystemOutputWan,
      productNetOutputWan: productOutputWan,
      currentOrders: orderCount,
      draftOrderCount,
      monthlyOutputWan: netOutputWan,
      monthlyNetOutputWan: netOutputWan,
      monthlyPositiveOutputWan: positiveOutputWan,
      monthlyQuoteOutputWan: quoteOutputWan,
      monthlySystemOutputWan: systemOutputWan,
      annualizedOutputYi: round((netOutputWan * 12) / 10000),
      positiveAnnualizedOutputYi: round((positiveOutputWan * 12) / 10000),
      systemAnnualizedOutputYi: round((systemOutputWan * 12) / 10000),
      yearTargetYi: round(yearTargetWan / 10000),
      yearTargetWan,
      yearProgressPct: round(safeDivide(netOutputWan * 100, yearTargetWan)),
      positiveYearProgressPct: round(safeDivide(positiveOutputWan * 100, yearTargetWan)),
      systemYearProgressPct: round(safeDivide(systemOutputWan * 100, yearTargetWan)),
      yearTheoryProgressPct: target.computedTheoryProgressPct || round((Number(month) / 12) * 100),
      monthTargetWan,
      monthProgressPct: round(safeDivide(netOutputWan * 100, monthTargetWan)),
      positiveMonthProgressPct: round(safeDivide(positiveOutputWan * 100, monthTargetWan)),
      systemMonthProgressPct: round(safeDivide(systemOutputWan * 100, monthTargetWan)),
      monthGoalGapWan: round(Math.max(0, monthTargetWan - netOutputWan)),
      positiveMonthGoalGapWan: round(Math.max(0, monthTargetWan - positiveOutputWan)),
      systemMonthGoalGapWan: round(Math.max(0, monthTargetWan - systemOutputWan)),
      monthDays: target.monthDays || 30,
      elapsedDays: Number.isFinite(target.elapsedDays) ? target.elapsedDays : (target.monthDays || 30),
      elapsedDaysSource: target.elapsedDaysSource || "system_current_date",
      refundRatePct: round(refundRate),
      refundRateDeltaPp: round(refundRate - 14),
      refundOrders: refundCount,
      refundLossWan
    },
    productSummary: {
      topProductName: sortedProductRowsLevel1[0]?.name || products[0]?.name || "未映射",
      topProductOutputSharePct: products.find(row => row.name === sortedProductRowsLevel1[0]?.name)?.value || products[0]?.value || 0,
      topProductOutputWan: round((sortedProductRowsLevel1[0]?.value || 0)),
      topProductOrders: productOrdersLevel1.get(sortedProductRowsLevel1[0]?.name || products[0]?.name)?.size || 0,
      softSelectedRatePct: 0,
      softPotentialWanPer10Pp: 0,
      highEndOrders: 0
    },
    productDataQuality: {
      productOutputSource: "净产值 = 签单表.系统产值 + 转正式表.转正式差额产值 + 转正式表.转正设计费 - 退单表.退单产值",
      productAvgSource: "均单/面积类 = 转正式表.报价单产值（含设计费）/ 转正式单数；不扣退单产值",
      refundDeductionSource: "退单表.退单产值",
      productOutputWan,
      productOutputLevel2Wan,
      productOrderCount: productOrderDenominator,
      unclassifiedProductOutputWan,
      matchedProductRefundWan: round(matchedProductRefundWan),
      unmatchedProductRefundWan: round(unmatchedProductRefundWan),
      unmatchedRefundProducts
    },
    channelSummary: {
      topChannelName: channelRanking[0]?.name || "未识别渠道",
      topChannelOutputWan: channelRanking[0]?.value || 0,
      topChannelOutputSharePct: channelRanking[0]?.sharePct || 0,
      topChannelOrders: channelRanking[0]?.orders || 0
    },
    benchmark: {},
    channels,
    products,
    productContribution,
    productValue,
    productArea: productAreaRows,
    soft: [],
    productInsights: [],
    channelRanking,
    channelInsights: [],
    departments,
    designerHeatmap,
    scenarios: [
      { name: "当前", current: netOutputWan, value: netOutputWan, delta: 0, color: "#94a3b8" },
      { name: "控退后", current: netOutputWan, value: round(netOutputWan + refundLossWan * 0.2), delta: round(refundLossWan * 0.2), color: "#ef4444" }
    ],
    multiMetrics: [],
    heatmapCategories: [],
    heatmap: []
  };
}

function getRiskLabel(rate) {
  if (rate >= 30) return "高危";
  if (rate >= 18) return "警戒";
  if (rate >= 14) return "关注";
  if (rate >= 8) return "良好";
  return "稳健";
}

const systemTables = pickYearTablesByRoles(SYSTEM_OUTPUT_APP, {
  systemOutput: "产值"
});
const orderTables = pickYearTablesByRoles(ORDER_APP, {
  sign: "签单",
  formal: "转正式",
  refund: "退单",
  productMapping: "产品映射"
});
const targetTables = pickYearTablesByRoles(TARGET_APP, {
  target: "monthly_targets"
});

const systemRecords = larkGet(SYSTEM_OUTPUT_APP, systemTables.systemOutput.table_id).map(record => record.fields || {});
const signRecords = larkGet(ORDER_APP, orderTables.sign.table_id).map(record => record.fields || {});
const formalRecords = larkGet(ORDER_APP, orderTables.formal.table_id).map(record => record.fields || {});
const refundRecords = larkGet(ORDER_APP, orderTables.refund.table_id).map(record => record.fields || {});
const productMappingRecords = larkGet(ORDER_APP, orderTables.productMapping.table_id).map(record => record.fields || {});
const channelMappingRecords = larkGet(SYSTEM_OUTPUT_APP, CHANNEL_MAPPING_TABLE_ID).map(record => record.fields || {});
const targetRecords = larkGet(TARGET_APP, targetTables.target.table_id).map(record => record.fields || {});
const targetLookup = buildTargetLookup(targetRecords);
const productMapper = buildProductMapper(productMappingRecords);
const channelMapper = buildChannelMapper(channelMappingRecords);
const formalProductLookup = buildFormalProductLookup([...formalRecords, ...signRecords], productMapper);
const designerRosterByMonth = loadDesignerRoster();

const systemByMonth = groupByMonth(systemRecords, row => normalizeMonth(row["月份"]));
const signByMonth = groupByMonth(signRecords, row => normalizeMonth(row["月份month"]));
const formalByMonth = groupByMonth(formalRecords, row => normalizeMonth(row["月份month"]));
const refundByMonth = groupByMonth(refundRecords, row => normalizeMonth(row["月份month"]));

const monthIds = [...new Set([
  ...systemByMonth.keys(),
  ...signByMonth.keys(),
  ...formalByMonth.keys(),
  ...refundByMonth.keys()
])].filter(Boolean).sort();

const monthlyData = {};
monthIds.forEach(month => {
  monthlyData[month] = buildMonthSnapshot(
    month,
    systemByMonth.get(month) || [],
    signByMonth.get(month) || [],
    formalByMonth.get(month) || [],
    refundByMonth.get(month) || [],
    targetLookup,
    productMapper,
    channelMapper,
    formalProductLookup,
    designerRosterByMonth
  );
});

const snapshots = Object.values(monthlyData);
const totalSystemOutput = snapshots.reduce((total, item) => total + (item.summary.systemOutputWan || 0), 0);
const totalPositiveOutput = snapshots.reduce((total, item) => total + (item.summary.positiveOutputWan || 0), 0);
const totalQuoteOutput = snapshots.reduce((total, item) => total + (item.summary.quoteOutputWan || 0), 0);
const totalOrders = snapshots.reduce((total, item) => total + (item.summary.currentOrders || 0), 0);
const totalDraftOrders = snapshots.reduce((total, item) => total + (item.summary.draftOrderCount || item.summary.currentOrders || 0), 0);
const totalRefundOrders = snapshots.reduce((total, item) => total + (item.summary.refundOrders || 0), 0);
const selectedTables = {
  systemOutput: systemTables.systemOutput.name,
  sign: orderTables.sign.name,
  formal: orderTables.formal.name,
  refund: orderTables.refund.name,
  productMapping: orderTables.productMapping.name,
  channelMapping: "渠道映射表",
  target: targetTables.target.name
};

const dashboard = {
  generatedAt: new Date().toISOString(),
  dashboardYear: DASHBOARD_YEAR,
  selectedTables,
  months: monthIds.map(id => ({ id, label: `${id}月` })),
  monthlyData,
  benchmark: {
    monthlyOutputWanAvg: round(safeDivide(totalPositiveOutput, snapshots.length)),
    monthlyOrdersAvg: round(safeDivide(totalOrders, snapshots.length)),
    avgOrderWanAvg: round(safeDivide(totalQuoteOutput || totalPositiveOutput, totalOrders)),
    refundRatePctAvg: round(safeDivide(totalRefundOrders * 100, totalDraftOrders))
  },
  summary: snapshots.at(-1)?.summary || {},
  dataSourceNotes: {
    systemOutput: `年度/月度目标卡和渠道系统净产值来自 ${selectedTables.systemOutput}.合计产值`,
    netOutput: `产品线产值、走量型 vs 高客单、6 个设计部产值总榜、部门控退潜力测算、部门产值×设计师人数、部门视角产值排名使用净产值：以客户编号/合同编号为订单指纹，汇总 ${selectedTables.sign}.系统产值 + ${selectedTables.formal}.转正式差额产值 + 转正设计费 - ${selectedTables.refund}.退单产值；部门/设计师归属优先取转正式表，其次签单表，最后退单表兜底`,
    quoteAverage: `各产品线均单值、均单面积、部门均单值排行使用 ${selectedTables.formal}.报价单产值（含设计费）和转正式单数，不扣退单产值`,
    positiveAndRefund: `转正 KPI 使用 ${selectedTables.formal}.转正式差额产值 + 转正设计费；退单风险来自 ${selectedTables.refund}.退单产值/退单单数`,
    targets: `年度目标、月度目标来自 ${selectedTables.target} 子表`,
    channelDetail: `渠道系统净产值和 TOP 细分渠道均来自 ${selectedTables.systemOutput}.合计产值，并通过 ${selectedTables.channelMapping} 映射；优先用 来源渠道二级 匹配，来源渠道二级为空时才用 来源渠道 兜底，永不参考 来源渠道三级；TOP 细分渠道使用 ${CHANNEL_MAPPING_TOP_FIELD}，渠道系统净产值使用 ${CHANNEL_MAPPING_SYSTEM_FIELD}；映射表未命中时统一展示 ${UNKNOWN_CHANNEL}；TOP 细分渠道金额展示净产值正负，百分比按渠道订单数 / 全部渠道订单数计算`,
    productMapping: "产品映射表只负责把原始产品套系归类，不提供产值；产品线产值分布按 产品映射.一级映射，走量型 vs 高客单型按 产品映射.二级映射；产品净产值取签单系统产值 + 转正式差额产值 + 转正设计费 - 退单产值；退单找产品只按客户编号/合同编号匹配转正式表和签单表，不再用姓名单独匹配，避免同名客户误扣；产品映射支持完全匹配、面积泛化匹配、核心词匹配"
  }
};

fs.writeFileSync(
  path.join(OUTPUT_DIR, "dashboard.json"),
  JSON.stringify(dashboard, null, 2)
);

fs.writeFileSync(
  path.join(OUTPUT_DIR, "dashboard.js"),
  `window.GM_DASHBOARD_DATA = ${JSON.stringify(dashboard, null, 2)};\n`
);

const emptyLevel2Sources = {};
systemRecords.forEach(row => {
  if (atom(row["来源渠道二级"])) return;
  const source = atom(row["来源渠道"]) || "未填写来源渠道";
  emptyLevel2Sources[source] = {
    top: channelMapper.resolveTop(row),
    system: channelMapper.resolveSystem(row)
  };
});

const channelDisplayNames = [...new Set(systemRecords.map(row => channelMapper.resolveTop(row)))]
  .filter(Boolean)
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const channelSystemDisplayNames = [...new Set(systemRecords.map(row => channelMapper.resolveSystem(row)))]
  .filter(Boolean)
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const unmatchedProducts = {};
formalRecords.forEach(row => {
  const raw = atom(row["产品套系"]);
  const mapped = productMapper.resolve(raw);
  if (mapped.source !== "unmatched-product") return;
  unmatchedProducts[raw || "未填写产品套系"] = (unmatchedProducts[raw || "未填写产品套系"] || 0) + 1;
});

const unmatchedRefundProductMatches = {};
refundRecords
  .filter(row => atom(row["是否退款"]) !== "否")
  .forEach(row => {
    const matched = formalProductLookup.resolveRefund(row);
    if (!["unmatched_refund", "ambiguous_name"].includes(matched.matchBy)) return;
    const key = `${matched.matchBy}:${matched.customerId || matched.customerName || "未知客户"}`;
    unmatchedRefundProductMatches[key] = (unmatchedRefundProductMatches[key] || 0) + 1;
  });

fs.writeFileSync(
  path.join(DATA_DIR, "channel_detail_mapping_summary.json"),
  JSON.stringify({
    generatedAt: dashboard.generatedAt,
    totalSystemOutputRecords: systemRecords.length,
    mappingTableRecords: channelMappingRecords.length,
    mappingSummary: channelMapper.summary(),
    emptyLevel2Count: systemRecords.filter(row => !atom(row["来源渠道二级"])).length,
    emptyLevel2Fallback: emptyLevel2Sources,
    topDisplayChannelNames: channelDisplayNames,
    systemDisplayChannelNames: channelSystemDisplayNames
  }, null, 2)
);

fs.writeFileSync(
  path.join(DATA_DIR, "product_mapping_summary.json"),
  JSON.stringify({
    generatedAt: dashboard.generatedAt,
    mappingTableRecords: productMappingRecords.length,
    ...productMapper.summary(),
    generalizationChecks: [
      {
        input: "任性装+成品家具+套内定制10平米",
        resolved: productMapper.resolve("任性装+成品家具+套内定制10平米")
      },
      {
        input: "任性装+成品家具+套内定制60平米",
        resolved: productMapper.resolve("任性装+成品家具+套内定制60平米")
      },
      {
        input: "Q5套系定制60平米",
        resolved: productMapper.resolve("Q5套系定制60平米")
      }
    ],
    unmatchedProducts,
    unmatchedRefundProductMatches
  }, null, 2)
);

console.log(JSON.stringify({
  dashboardYear: DASHBOARD_YEAR,
  selectedTables,
  months: dashboard.months,
  totalSystemOutputWan: round(totalSystemOutput),
  totalPositiveOutputWan: round(totalPositiveOutput),
  totalOrders,
  totalRefundOrders,
  targetMonths: targetLookup.months.map(row => ({
    month: row.month,
    yearTargetWan: row.yearTargetWan,
    monthTargetWan: row.monthTargetWan,
    theoryProgressPct: row.computedTheoryProgressPct
  })),
  emptyLevel2Count: systemRecords.filter(row => !atom(row["来源渠道二级"])).length,
  displayChannelNames: channelDisplayNames,
  productMappingRecords: productMappingRecords.length,
  unmatchedProductCount: Object.values(unmatchedProducts).reduce((total, count) => total + count, 0),
  unmatchedProducts,
  unmatchedRefundProductMatchCount: Object.values(unmatchedRefundProductMatches).reduce((total, count) => total + count, 0),
  unmatchedRefundProductMatches
}, null, 2));
