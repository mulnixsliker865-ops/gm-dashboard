const crypto = require("crypto");
const fs = require("fs");
const https = require("https");

const webhook = process.env.FEISHU_BOT_WEBHOOK;
const signingSecret = process.env.FEISHU_BOT_SECRET || "";

if (!webhook) {
  console.log("FEISHU_BOT_WEBHOOK is empty, skip Feishu notification.");
  process.exit(0);
}

function readDashboardMeta() {
  try {
    const dashboard = JSON.parse(fs.readFileSync("dashboard.json", "utf8"));
    return {
      generatedAt: dashboard.generatedAt || "未知",
      year: dashboard.dashboardYear || "未知",
      months: (dashboard.months || []).map(month => month.label || month.id).join("、") || "无",
      selectedTables: dashboard.selectedTables || {}
    };
  } catch (error) {
    return {
      generatedAt: "读取失败",
      year: "未知",
      months: "读取失败",
      selectedTables: {},
      error: error.message
    };
  }
}

function sign(timestamp, secret) {
  const stringToSign = `${timestamp}\n${secret}`;
  return crypto.createHmac("sha256", stringToSign).update("").digest("base64");
}

function postJson(url, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const request = https.request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": Buffer.byteLength(body)
      }
    }, response => {
      let raw = "";
      response.setEncoding("utf8");
      response.on("data", chunk => {
        raw += chunk;
      });
      response.on("end", () => {
        if (response.statusCode >= 400) {
          reject(new Error(`Feishu bot HTTP ${response.statusCode}: ${raw}`));
          return;
        }
        resolve(raw);
      });
    });
    request.on("error", reject);
    request.write(body);
    request.end();
  });
}

async function main() {
  const meta = readDashboardMeta();
  const status = process.env.DASHBOARD_REFRESH_STATUS || "unknown";
  const statusText = status === "success" ? "成功" : "失败";
  const runUrl = `${process.env.GITHUB_SERVER_URL || "https://github.com"}/${process.env.GITHUB_REPOSITORY || ""}/actions/runs/${process.env.GITHUB_RUN_ID || ""}`;
  const pageUrl = "https://mulnixsliker865-ops.github.io/gm-dashboard/";
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = {
    msg_type: "text",
    content: {
      text: [
        `总经理经营看盘自动刷新：${statusText}`,
        `生成时间：${meta.generatedAt}`,
        `数据年份：${meta.year}`,
        `已接入月份：${meta.months}`,
        `产值表：${meta.selectedTables.systemOutput || "未知"}`,
        `订单表：${[meta.selectedTables.sign, meta.selectedTables.formal, meta.selectedTables.refund].filter(Boolean).join(" / ") || "未知"}`,
        `线上看板：${pageUrl}`,
        `运行记录：${runUrl}`
      ].join("\n")
    }
  };

  if (signingSecret) {
    payload.timestamp = timestamp;
    payload.sign = sign(timestamp, signingSecret);
  }

  const result = await postJson(webhook, payload);
  console.log(result);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
