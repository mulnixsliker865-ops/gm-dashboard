(function initRuleTalkEngine(global) {
  const DEFAULT_RULE_TEMPLATE_LIBRARY = {
    version: "1.0.0",
    description: "总经理经营看盘规则话术模板库：不调用 AI，只按既有数据和固定规则生成播报。",
    softReadoutRules: {
      quickItemTemplate: "{name}选配率 <strong>{selectedRatePct}%</strong>，溢价 <strong>+{liftRatePct}%</strong>",
      potentialTemplate: "以{baseNames} {totalOrders} 单为基数，选配率每提升 {stepPp} 个百分点，约有 {newSelectedOrders} 单从未选转为选配，单均增值约 {liftWan} 万。",
      calloutTemplate: "选配率每 +{stepPp} 个百分点 ≈ +{potentialWan} 万产值",
      actionRules: [
        {
          id: "soft_low_rate_high_lift",
          when: [
            { op: "lt", path: "selectedRatePct", value: 30 },
            { op: "gte", path: "liftRatePct", value: 25 }
          ],
          body: "核心抓手：当前软装溢价明显但选配率偏低，优先做样板间强展示、销售首推话术和套餐组合优惠"
        },
        {
          id: "soft_high_rate_high_lift",
          when: [
            { op: "gte", path: "selectedRatePct", value: 45 },
            { op: "gte", path: "liftRatePct", value: 25 }
          ],
          body: "核心抓手：软装已经具备规模化放大能力，建议固化成交动作，同时检查交付能力和供应链稳定性"
        },
        {
          id: "soft_low_lift",
          when: [
            { op: "lt", path: "liftRatePct", value: 15 }
          ],
          body: "核心抓手：软装溢价不明显，先复盘套餐配置和报价结构，不建议只靠提高选配率硬推"
        },
        {
          id: "soft_potential_high",
          when: [{ op: "gte", path: "potentialWan", value: 300 }],
          body: "核心抓手：优先做样板间强展示 / 组合优惠 / 销售话术三件套，适合作为本月重点增收动作"
        },
        {
          id: "soft_potential_medium",
          when: [{ op: "gte", path: "potentialWan", value: 120 }],
          body: "核心抓手：样板间展示 / 组合优惠 / 销售话术三件套"
        },
        {
          id: "soft_potential_watch",
          when: { op: "default" },
          body: "核心抓手：先确认软装口径和选配率，再决定是否作为重点动作"
        }
      ]
    },
    channelWarningRules: {
      onlineNames: ["400热线", "百度搜索", "百度系", "搜索", "抖音直播", "抖音直播（二）", "抖音直播类", "第三方平台垂直类", "抖音信息流类", "腾讯系", "微信朋友圈推广", "线上非诺云", "线上投放类"],
      templates: [
        {
          id: "channel_warning_online_high",
          when: [{ path: "sharePct", op: "gte", value: 45 }],
          body: "线上投放类 {count} 个渠道净产值合计：{outputWan} 万 / 订单占比 {sharePct}% / 包含 {names}；负值金额保留展示，需结合退单负向影响单独核查"
        },
        {
          id: "channel_warning_online_medium",
          when: [{ path: "sharePct", op: "gte", value: 25 }],
          body: "线上投放类渠道净产值合计 {outputWan} 万，订单占比 {sharePct}%，建议继续拆分渠道效率：{names}；负值渠道不直接视为无效渠道，先核对退单归因"
        },
        {
          id: "channel_warning_online_low",
          when: [{ path: "sharePct", op: "default" }],
          body: "线上投放类渠道订单占比 {sharePct}%，当前更适合作为观察盘；同时核对受退单影响渠道，避免把退单归因误判为投放无效"
        }
      ]
    },
    departmentRiskLabelRules: [
      {
        id: "department_risk_critical",
        label: "高危",
        when: [{ path: "refundRatePct", op: "gte", value: 30 }],
        color: "#be123c",
        bg: "#ffe4e6",
        rateColor: "#be123c",
        rateBg: "#ffe4e6"
      },
      {
        id: "department_risk_warning",
        label: "警戒",
        when: [{ path: "refundRatePct", op: "gte", value: 18 }],
        color: "#dc2626",
        bg: "#fee2e2",
        rateColor: "#dc2626",
        rateBg: "#fef3c7"
      },
      {
        id: "department_risk_attention",
        label: "关注",
        when: [{ path: "refundRatePct", op: "gte", value: 14 }],
        color: "#b45309",
        bg: "#fef3c7",
        rateColor: "#d97706",
        rateBg: "#fffbeb"
      },
      {
        id: "department_risk_good",
        label: "良好",
        when: [{ path: "refundRatePct", op: "gte", value: 8 }],
        color: "#059669",
        bg: "#dff9ed",
        rateColor: "#059669",
        rateBg: "#dcfce7"
      },
      {
        id: "department_risk_stable",
        label: "稳健",
        when: [{ op: "default" }],
        color: "#047857",
        bg: "#d1fae5",
        rateColor: "#059669",
        rateBg: "#dcfce7"
      }
    ],
    kpiBadgeRules: {
      monthlyOutputWan: [
        { id: "kpi_output_excellent", label: "↑ 优秀", when: { op: "gteRatio", value: 1.1 } },
        { id: "kpi_output_good", label: "↑ 良好", when: { op: "gteRatio", value: 1.03 } },
        { id: "kpi_output_stable", label: "稳定", when: { op: "betweenRatio", min: 0.97, max: 1.03 } },
        { id: "kpi_output_attention", label: "↓ 关注", when: { op: "gteRatio", value: 0.9 } },
        { id: "kpi_output_chase", label: "需追赶", when: { op: "default" } }
      ],
      monthlyOrders: [
        { id: "kpi_orders_excellent", label: "↑ 优秀", when: { op: "gteRatio", value: 1.1 } },
        { id: "kpi_orders_good", label: "↑ 良好", when: { op: "gteRatio", value: 1.03 } },
        { id: "kpi_orders_stable", label: "稳定", when: { op: "betweenRatio", min: 0.97, max: 1.03 } },
        { id: "kpi_orders_attention", label: "↓ 关注", when: { op: "gteRatio", value: 0.9 } },
        { id: "kpi_orders_chase", label: "需补单", when: { op: "default" } }
      ],
      avgOrderWan: [
        { id: "kpi_avg_order_high", label: "显著高于均值", when: { op: "gteRatio", value: 1.08 } },
        { id: "kpi_avg_order_above", label: "高于均值", when: { op: "gteRatio", value: 1.03 } },
        { id: "kpi_avg_order_near", label: "接近均值", when: { op: "betweenRatio", min: 0.97, max: 1.03 } },
        { id: "kpi_avg_order_below", label: "低于均值", when: { op: "gteRatio", value: 0.92 } },
        { id: "kpi_avg_order_low", label: "客单偏低", when: { op: "default" } }
      ],
      refundRatePct: [
        { id: "kpi_refund_good", label: "风险良好", when: { op: "lteDiffPp", value: -3 } },
        { id: "kpi_refund_improved", label: "有所改善", when: { op: "lteDiffPp", value: -1 } },
        { id: "kpi_refund_stable", label: "稳定", when: { op: "betweenDiffPp", min: -1, max: 1 } },
        { id: "kpi_refund_attention", label: "需关注", when: { op: "lteDiffPp", value: 3 } },
        { id: "kpi_refund_warning", label: "↑ 警戒", when: { op: "default" } }
      ]
    },
    rules: [
      {
        id: "daily_month_progress",
        module: "daily",
        priority: 100,
        enabled: true,
        when: [],
        title: "月度进度播报",
        body: "本月目标完成率为 {summary.monthProgressPct}%，距离月度目标还差 {summary.monthGoalGapWan} 万；年度完成率为 {summary.yearProgressPct}%，低于 {summary.yearTheoryProgressPct}% 的理论时间进度。"
      },
      {
        id: "daily_structure_risk",
        module: "daily",
        priority: 90,
        enabled: true,
        when: [],
        title: "结构风险播报",
        body: "渠道侧看正值渠道和受退单影响渠道，产品侧看净产值结构与单品集中度；负值代表退单负向影响，不按饼图解读。"
      },
      {
        id: "daily_action_focus",
        module: "daily",
        priority: 80,
        enabled: true,
        when: [],
        title: "行动重点播报",
        body: "退单率最高的部门是{department.highRiskDepartmentName}，本期内退率 {department.highRiskRefundRatePct}%；建议同步关注退单复盘、头部渠道依赖和高客单产品打法。"
      },
      {
        id: "goal_year_pace",
        module: "goal",
        priority: 100,
        enabled: true,
        when: [],
        title: "年度目标进度说明",
        body: "按理论进度 {summary.yearTheoryProgressPct}%，实际完成 {summary.yearProgressPct}%，{summary.yearPaceDirection} {summary.yearPaceGapPp}pp"
      },
      {
        id: "goal_month_pace",
        module: "goal",
        priority: 90,
        enabled: true,
        when: [],
        title: "月度目标进度说明",
        body: "{summary.periodLabel}月均推算达成 {summary.monthProgressPct}%，{summary.monthGapText}"
      },
      {
        id: "structure_channel_top_dependency",
        module: "structure",
        priority: 100,
        enabled: true,
        when: [
          { path: "channel.topChannelOutputSharePct", op: "gte", value: 30 }
        ],
        title: "渠道结构摘要",
        body: "看渠道净额、正值渠道和受退单影响渠道，避免负数被结构占比掩盖"
      },
      {
        id: "structure_channel_multi_source",
        module: "structure",
        priority: 80,
        enabled: true,
        when: [
          { path: "channel.positiveChannelCount", op: "gte", value: 8 }
        ],
        title: "渠道结构摘要",
        body: "看渠道净额、正值渠道和受退单影响渠道，避免负数被结构占比掩盖"
      },
      {
        id: "structure_channel_default",
        module: "structure",
        priority: 10,
        enabled: true,
        when: [],
        title: "渠道结构摘要",
        body: "看渠道净额、正值渠道和受退单影响渠道，避免负数被结构占比掩盖"
      },
      {
        id: "structure_product_single_risk",
        module: "structure",
        priority: 100,
        enabled: true,
        when: [
          { path: "product.topProductOutputSharePct", op: "gte", value: 50 }
        ],
        title: "产品结构摘要",
        body: "{product.topProductName}贡献 {product.topProductOutputSharePct}%，单品集中风险较高，需培育第二曲线"
      },
      {
        id: "structure_product_top_two_concentration",
        module: "structure",
        priority: 90,
        enabled: true,
        when: [
          { path: "product.topTwoProductSharePct", op: "gte", value: 70 }
        ],
        title: "产品结构摘要",
        body: "{product.topProductName}+{product.secondProductName}合计 {product.topTwoProductSharePct}%，主力盘清晰，但要防止结构单薄"
      },
      {
        id: "structure_product_second_curve",
        module: "structure",
        priority: 70,
        enabled: true,
        when: [
          { path: "product.secondProductOutputSharePct", op: "gte", value: 25 }
        ],
        title: "产品结构摘要",
        body: "{product.secondProductName}占比 {product.secondProductOutputSharePct}%，已具备第二曲线基础"
      },
      {
        id: "structure_product_default",
        module: "structure",
        priority: 10,
        enabled: true,
        when: [],
        title: "产品结构摘要",
        body: "{product.topProductName}贡献最高，占比 {product.topProductOutputSharePct}%，建议观察主力与尾部产品结构"
      },
      {
        id: "product_annualized_pace",
        module: "product",
        dimension: "经营节奏",
        priority: 500,
        enabled: true,
        when: [
          { path: "summary.annualizedOutputYi", op: "lt", valuePath: "summary.yearTargetYi" }
        ],
        title: "经营节奏：当前规模可观察，但全年兑现仍要滚动追",
        body: "证据：{summary.statDays} 天实现净产值 {summary.currentOutputWan} 万、转正 {summary.currentOrders} 单、月均净产值 {summary.monthlyOutputWan} 万，线性外推全年约 {summary.annualizedOutputYi} 亿，低于年目标 {summary.yearTargetYi} 亿。判断：家装成交有明显季节性，淡旺季、交付周期和退单都会影响全年节奏，不能只用当前月份简单外推。动作：按月建立“净产值 / 转正单数 / 报价单均单 / 退单率”滚动盘点；旺季前优先确认主力产品承接、重点渠道预算、设计部产能和退单预警，避免到旺季才被动追量。"
      },
      {
        id: "product_annualized_on_track",
        module: "product",
        dimension: "经营节奏",
        priority: 499,
        enabled: true,
        when: [
          { path: "summary.annualizedOutputYi", op: "gte", valuePath: "summary.yearTargetYi" }
        ],
        title: "经营节奏：当前年化可覆盖目标，但仍需看结构质量",
        body: "证据：当前净产值线性外推年化达到 {summary.annualizedOutputYi} 亿，高于年目标 {summary.yearTargetYi} 亿，规模节奏暂时站得住。判断：目标覆盖只说明当期速度不错，不代表结构健康；如果净产值来自少数产品、少数渠道或少数大单，后续波动会比较大。动作：经营会上不要只看达成率，建议同步固定三张追踪表：产品结构表、退单原因表、高客单产品渗透表；如果连续两个月结构稳定，再考虑加大预算或复制打法。"
      },
      {
        id: "product_structure_extreme_concentration",
        module: "product",
        dimension: "产品结构分析",
        priority: 420,
        enabled: true,
        when: [
          { path: "product.topProductOutputSharePct", op: "gte", value: 65 }
        ],
        title: "产品结构：{product.topProductName}占比较高，主力打法要稳，第二支柱要补",
        body: "证据：{product.topProductName}贡献 {product.topProductOutputSharePct}% 净产值，前两大产品合计约 {product.topTwoProductSharePct}%。判断：主力产品清晰有利于组织复制，但占比过高时，退单、交付压力、报价政策变化都会集中影响大盘。动作：{product.topProductName}继续做标准化报价、交付清单和退单预警；同时给{product.secondProductName}设置独立观察目标，明确适合的客户画像、渠道入口、设计师话术和样板展示，先验证稳定成交路径，再逐步放大。"
      },
      {
        id: "product_structure_concentration",
        module: "product",
        dimension: "产品结构分析",
        priority: 410,
        enabled: true,
        when: [
          { path: "product.topProductOutputSharePct", op: "gte", value: 50 }
        ],
        title: "产品结构：{product.topProductName}是主力盘，适合做标准化经营",
        body: "证据：{product.topProductName}贡献 <strong>{product.topProductOutputSharePct}% 净产值</strong>，{product.secondProductName}贡献 {product.secondProductOutputSharePct}%。判断：这类结构适合先把主力产品做稳，再逐步培养第二曲线；不宜同时推太多产品，容易分散销售和设计动作。动作：主力产品统一报价模板、关键配置、交付节点和退单预警；第二产品线先配置一套销售话术、一套样板展示和一个重点渠道来源，观察 1-2 个周期后再决定是否加资源。"
      },
      {
        id: "product_structure_balanced_portfolio",
        module: "product",
        dimension: "产品结构分析",
        priority: 405,
        enabled: true,
        when: [
          { path: "product.topProductOutputSharePct", op: "between", value: [35, 50] },
          { path: "product.secondProductOutputSharePct", op: "gte", value: 20 }
        ],
        title: "产品结构：相对均衡，适合做双主力打法",
        body: "证据：{product.topProductName}占比 {product.topProductOutputSharePct}%，{product.secondProductName}占比 {product.secondProductOutputSharePct}%，没有出现单一产品过度独大。判断：当前更适合“双主力产品”打法，既能稳规模，也能降低对单一产品的依赖。动作：把{product.topProductName}作为稳规模产品，把{product.secondProductName}作为增长承接产品；渠道预算、设计师话术、样板间陈列和活动政策按两套主推逻辑配置，同时持续看各自产值、单数、均单和退单率。"
      },
      {
        id: "product_structure_top_two_concentration",
        module: "product",
        dimension: "产品结构分析",
        priority: 398,
        enabled: true,
        when: [
          { path: "product.topTwoProductSharePct", op: "gte", value: 70 }
        ],
        title: "产品结构：组合集中在{product.topProductName}+{product.secondProductName}，要防止结构单薄",
        body: "证据：{product.topProductName}和{product.secondProductName}合计贡献 {product.topTwoProductSharePct}% 产值。判断：主力盘清晰是好事，但增长弹性也集中在少数产品，尾部产品如果没有明确角色，很难自然成长。动作：两大主力先稳交付和退单率；第三梯队产品只做小范围试点，例如绑定特定渠道、特定户型或特定设计师团队，先看单数、均单和退单表现，再决定是否扩大。"
      },
      {
        id: "product_price_soft_booster",
        module: "product",
        dimension: "客单价提升抓手",
        priority: 330,
        enabled: false,
        when: [
          { path: "soft.softLiftRatePct", op: "gte", value: 25 }
        ],
        title: "客单价抓手：软装包是明确的均单放大器",
        body: "证据：{soft.exampleProductName}未选软装 {soft.exampleNoSoftAvgWan} 万 vs 选配 {soft.exampleSoftAvgWan} 万，溢价 +{soft.exampleLiftRatePct}%；加权后软装可带来约 {soft.softLiftWan} 万均单提升。判断：软装不是装饰性增项，而是直接影响客单价的关键服务。动作：把软装前置到方案阶段，销售话术从“要不要加”改成“按你家风格给两档配置”，并用样板间、套餐包和限时权益提高接受度。"
      },
      {
        id: "product_price_value_leader_sample",
        module: "product",
        dimension: "客单价提升抓手",
        priority: 320,
        enabled: true,
        when: [
          { path: "product.valueLeaderAvgWan", op: "gte", value: 18 }
        ],
        title: "客单价抓手：{product.valueLeaderProductName}可作为高客单样板，但要拆清来源",
        body: "证据：{product.valueLeaderProductName}报价单均单达到 {product.valueLeaderAvgWan} 万，高于主力产品平均水平；{product.unitPriceLeaderProductName}单位面积价格约 {product.unitPriceLeaderYuan} 元/㎡。判断：高客单可能来自大面积、配置升级、报价完整度或客户层级，不能只看总价就判断产品溢价强。动作：复盘该产品的客户来源、户型面积、设计师话术、主材配置和报价完整度；如果高客单主要来自配置升级，就沉淀标准套餐和案例；如果主要来自面积，就重点优化大户型方案完整度。"
      },
      {
        id: "product_price_soft_low_lift",
        module: "product",
        dimension: "客单价提升抓手",
        priority: 310,
        enabled: false,
        when: [
          { path: "soft.softLiftRatePct", op: "lt", value: 15 }
        ],
        title: "客单价抓手：软装溢价偏弱，先修产品包再推选配",
        body: "证据：当前软装加权溢价只有 +{soft.softLiftRatePct}%，对均单拉动不明显。判断：如果直接强推选配率，可能只是增加销售动作，却未必增加有效产值。动作：先复盘软装套餐配置、报价层级和客户接受度，重新设计基础款 / 标准款 / 高配款三档，再决定是否加大推广。"
      },
      {
        id: "product_conversion_soft_gap",
        module: "product",
        dimension: "转化优化空间",
        priority: 260,
        enabled: false,
        when: [
          { path: "soft.softSelectedRatePct", op: "lt", value: 35 },
          { path: "soft.softLiftRatePct", op: "gte", value: 25 }
        ],
        title: "转化优化：高价值服务有效，但软装选配率还没打透",
        body: "证据：软装选配率约 {soft.softSelectedRatePct}%，但软装加权均单提升 {soft.softLiftWan} 万、溢价 +{soft.softLiftRatePct}%。判断：这不是需求不存在，而是推荐时机、样板展示或销售话术没有充分转化。动作：把软装从“可选项”改成成交前置推荐项，要求每单至少给出一套软装组合方案，并按设计部追踪选配率、放弃原因和成交后加购率。"
      },
      {
        id: "product_conversion_soft_mature",
        module: "product",
        dimension: "转化优化空间",
        priority: 250,
        enabled: false,
        when: [
          { path: "soft.softSelectedRatePct", op: "gte", value: 45 },
          { path: "soft.softLiftRatePct", op: "gte", value: 25 }
        ],
        title: "转化优化：软装选配进入成熟区，下一步看毛利和交付",
        body: "证据：软装选配率达到 {soft.softSelectedRatePct}%，且溢价仍有 +{soft.softLiftRatePct}%。判断：此时继续只追选配率意义有限，更要防止交付压力和低毛利套餐稀释收益。动作：把管理指标升级为“选配率 + 毛利率 + 交付周期 + 客诉率”，并筛出高毛利、低投诉的配置做主推。"
      },
      {
        id: "product_conversion_high_value_gap",
        module: "product",
        dimension: "转化优化空间",
        priority: 240,
        enabled: true,
        when: [
          { path: "product.highEndPenetrationPct", op: "lt", value: 8 }
        ],
        title: "转化优化：高客单产品渗透率偏低，适合先做条件化推荐",
        body: "证据：{product.highEndNames}等高客单产品当前约 {product.highEndOrders} 单，渗透率约 {product.highEndPenetrationPct}%。判断：高客单产品单数少不一定是坏事，关键要看是否有清晰触发条件，例如户型面积、预算能力、客户关注点和设计师配置能力。动作：不要全员硬推高客单，先建立“适合推荐”的客户画像和话术条件；对符合条件的客户，要求设计师给出标准版和升级版两套方案，观察升级接受率、退单率和毛利表现。"
      },
      {
        id: "product_conversion_second_curve_candidate",
        module: "product",
        dimension: "转化优化空间",
        priority: 230,
        enabled: true,
        when: [
          { path: "product.secondProductOutputSharePct", op: "gte", value: 25 }
        ],
        title: "转化优化：{product.secondProductName}已具备第二曲线基础",
        body: "证据：{product.secondProductName}产值占比达到 {product.secondProductOutputSharePct}%，已经不是边缘产品。判断：这类产品最适合从“自然成交”升级为“明确打法”，但仍要看它的单数基础和退单质量。动作：单独看{product.secondProductName}的渠道来源、设计师成交动作、均单、退单率和配置升级空间；如果连续两个周期表现稳定，再配置独立目标和预算。"
      },
      {
        id: "product_conversion_high_value_stable",
        module: "product",
        dimension: "转化优化空间",
        priority: 220,
        enabled: true,
        when: [
          { path: "product.highEndPenetrationPct", op: "gte", value: 8 }
        ],
        title: "转化优化：高客单产品已有一定渗透，下一步看质量",
        body: "证据：{product.highEndNames}等高客单产品渗透率约 {product.highEndPenetrationPct}%，已经不是完全空白。判断：此时继续只追高客单单数意义有限，更要确认退单率、毛利率和交付复杂度是否可控。动作：把高客单管理从“有没有卖出去”升级为“卖给谁、怎么卖、交付是否稳定”；优先复盘稳定成交案例，再决定是否扩大推荐范围。"
      },
      {
        id: "product_foundation_low_value_volume",
        module: "product",
        dimension: "基础产品定位",
        priority: 180,
        enabled: true,
        when: [
          { path: "product.lowValueShareGapPct", op: "gte", value: 3 }
        ],
        title: "基础产品定位：{product.lowValueProductName}走量但低客单，要先明确角色",
        body: "证据：{product.lowValueProductName}贡献 {product.lowValueOrderSharePct}% 单量，但产值占比仅 {product.lowValueOutputSharePct}%，均单 {product.lowValueAvgWan} 万。判断：这类产品可能是引流入口，也可能是低毛利消耗项，不能只用单数评价，也不宜简单砍掉。动作：如果定位为引流产品，就重点追踪升级到任性装、T1-2.0、新Q3、Q5 的比例；如果定位为利润产品，就必须核查毛利率、交付成本和退单率；如果两项都不成立，再考虑收缩。"
      },
      {
        id: "product_foundation_entry_package_pressure",
        module: "product",
        dimension: "基础产品定位",
        priority: 170,
        enabled: true,
        when: [
          { path: "product.lowValueAvgWan", op: "lte", value: 9 }
        ],
        title: "基础产品定位：{product.lowValueProductName}偏入口型，重点看升级能力",
        body: "证据：{product.lowValueProductName}均单约 {product.lowValueAvgWan} 万，低于主力产品均单，更像入口型或基础型产品。判断：入口型产品的价值不只看当期产值，更要看是否带来客户进入、配置升级和后续加购。动作：给基础产品单独建立升级漏斗：成交单数、升级到主力产品比例、配置升级率、退单率、毛利率；如果只带来低价成交但不升级，就需要调整话术或控制占比。"
      },
      {
        id: "product_foundation_no_low_value_gap",
        module: "product",
        dimension: "基础产品定位",
        priority: 160,
        enabled: true,
        when: [
          { path: "product.lowValueShareGapPct", op: "lt", value: 2 }
        ],
        title: "基础产品定位：单量和产值结构基本匹配，暂未形成明显负向影响",
        body: "证据：当前低客单产品的单量占比和产值占比差距小于 2pp，没有明显“高单量、低产值”的负向影响项。判断：基础产品暂时没有明显挤压经营结构，但仍需要看毛利和退单质量。动作：继续按均单、退单率、毛利率和升级率做第二层筛查，不急于简单砍掉低客单产品；如果后续连续出现单量高但产值弱，再重新评估定位。"
      },
      {
        id: "product_structure_second_curve_weak",
        module: "product",
        dimension: "产品结构分析",
        priority: 390,
        enabled: true,
        when: [
          { path: "product.secondProductOutputSharePct", op: "lt", value: 18 }
        ],
        title: "产品结构：第二产品线偏弱，主力之外承接还不充分",
        body: "证据：{product.secondProductName}当前产值占比只有 {product.secondProductOutputSharePct}%。判断：第二支柱还不稳，经营弹性不足；如果主力产品波动，整体产值会更容易受影响。动作：给第二产品线设观察目标，不要只靠自然成交；先指定适合的客户画像、渠道入口、设计师话术和套餐配置，跑出小样板后再扩资源。"
      },
      {
        id: "product_price_area_value_check",
        module: "product",
        dimension: "客单价提升抓手",
        priority: 300,
        enabled: true,
        when: [
          { path: "product.areaLeaderAvgSqm", op: "gte", value: 95 }
        ],
        title: "客单价抓手：{product.areaLeaderProductName}面积较大，要区分大户型和高价值",
        body: "证据：{product.areaLeaderProductName}均单面积达到 {product.areaLeaderAvgSqm} 平方米。判断：高总价可能来自大面积，也可能来自真正的产品溢价，二者经营动作不同；只看均单容易把面积红利误判成产品能力。动作：结合单位面积价格一起看，如果只是面积拉高，要优化大户型方案完整度和工期预期；如果单位面积价格也高，就把配置项、设计话术和案例沉淀为高客单模板。"
      },
      {
        id: "product_price_no_obvious_spike",
        module: "product",
        dimension: "客单价提升抓手",
        priority: 290,
        enabled: true,
        when: [
          { path: "product.valueLeaderAvgWan", op: "lt", value: 18 },
          { path: "product.areaLeaderAvgSqm", op: "lt", value: 95 }
        ],
        title: "客单价抓手：均单没有明显尖峰，先稳配置完整度",
        body: "证据：当前最高均单产品约 {product.valueLeaderAvgWan} 万，最大均单面积约 {product.areaLeaderAvgSqm} 平方米，暂未看到特别突出的高客单尖峰。判断：这类结构通常不是靠少数大单拉动，更适合从标准配置、方案完整度和升级率里找稳定提升。动作：先统一主力产品的基础配置清单和升级项表达，要求报价中清楚区分基础项、可升级项和非必要项；每月看升级率、退单率和均单变化，不急于用激进政策拉高总价。"
      },
      {
        id: "product_foundation_tail_cleanup",
        module: "product",
        dimension: "基础产品定位",
        priority: 150,
        enabled: true,
        when: [
          { path: "product.tailProductSharePct", op: "lt", value: 2 }
        ],
        title: "基础产品定位：尾部产品贡献小，适合做模板清理",
        body: "证据：尾部产品当前产值占比约 {product.tailProductSharePct}%，对规模贡献有限。判断：尾部产品如果没有明确战略意义，容易占用报价、培训和交付管理精力，但也可能承担特殊客户或特殊户型需求。动作：先按成交频次、毛利率、退单率和交付复杂度做一次清单分层；低频且低毛利的模板收缩，仍有战略意义的产品保留为专项场景，不放进日常主推。"
      },
      {
        id: "channel_top_dependency",
        module: "channel",
        priority: 100,
        enabled: true,
        when: [
          { path: "channel.topChannelOutputSharePct", op: "gte", value: 30 }
        ],
        title: "{channel.topChannelName}是头部渠道，但不宜简单继续放大",
        body: "证据：{channel.topChannelName}单一渠道贡献 <strong>{channel.topChannelOutputWan} 万（占 {channel.topChannelOutputSharePct}%）</strong>。判断：头部渠道能说明当前有有效来源，但线索来了以后，最终能否转正、能否少退单，核心还在设计师承接质量。动作：先把{channel.topChannelName}作为基本盘维稳，预算追加要绑定转正率、均单、退单率和有效线索成本；同时要求设计师对该渠道客户固定记录预算边界、需求重点、报价解释和交付预期，减少因沟通不清造成的线索浪费。"
      },
      {
        id: "channel_broadcast_core_stable",
        module: "channel",
        priority: 96,
        enabled: true,
        when: [
          { path: "channel.broadcastSharePct", op: "gte", value: 30 }
        ],
        title: "线上广播仍有基本盘价值，但要防止路径依赖",
        body: "证据：线上广播贡献 {channel.broadcastOutputWan} 万，占比 {channel.broadcastSharePct}%。判断：广播、交通、相声、新闻等入口仍有稳定价值，但客户通常先形成模糊认知，进店后更依赖设计师把需求、预算和方案讲清楚。动作：保留广播基本盘，同时按月看有效线索、到店、转正和退单质量；设计师接待广播客户时，要把客户期待和实际报价边界提前说透，如果退单升高，优先复盘沟通和方案承诺，再决定是否调投放内容和频次。"
      },
      {
        id: "channel_paid_info_flow",
        module: "channel",
        priority: 90,
        enabled: true,
        when: [
          { path: "channel.paidInfoFlowSharePct", op: "gte", value: 25 }
        ],
        title: "线上投放贡献不低，但要按质量分层，不宜平均加码",
        body: "证据：线上投放类渠道合计约 {channel.paidInfoFlowOutputWan} 万，占总产值 {channel.paidInfoFlowSharePct}%，其中{channel.onlineTopChannelName}贡献最高。判断：线上投放能带来规模，但客户意向、价格敏感度和退单风险差异很大，渠道只能解决进线，设计师承接决定线索是否被有效消化。动作：拆分各子渠道的转正率、均单、退单率和有效线索成本；对质量不稳的渠道先控预算，同时要求设计师按渠道建立沟通清单，重点记录客户来源预期、价格敏感点、方案调整原因和退单原因，先把承接质量做稳再谈加码。"
      },
      {
        id: "channel_douyin_live_big_but_needs_quality_check",
        module: "channel",
        priority: 88,
        enabled: true,
        when: [
          { path: "channel.douyinLiveSharePct", op: "gte", value: 12 }
        ],
        title: "抖音直播类贡献较高，但必须同步看转正质量",
        body: "证据：抖音直播类贡献 {channel.douyinLiveOutputWan} 万，占比 {channel.douyinLiveSharePct}%。判断：直播容易带来规模，也容易带来低意向、强比价和价格敏感客户，设计师如果没有把预算、材料、工期和增项讲清楚，后续退单风险会被放大。动作：单独追踪直播渠道的到店率、转正率、均单和退单率；设计师接待直播客户时要先做需求确认和预算校准，不能只追求快速签单，若转正质量不稳定，应先优化筛客、话术和设计沟通模板，不靠增加直播场次放量。"
      },
      {
        id: "channel_baidu_second_tier",
        module: "channel",
        priority: 86,
        enabled: true,
        when: [
          { path: "channel.baiduSharePct", op: "gte", value: 10 }
        ],
        title: "百度系有搜索意图优势，但不能只看占比",
        body: "证据：百度系贡献 {channel.baiduOutputWan} 万，占比 {channel.baiduSharePct}%。判断：搜索类客户通常意图更明确，但也更容易带着对比和疑问进店，设计师解释能力会直接影响信任建立和退单风险。动作：百度系要和直播类分开评估，重点看有效咨询率、到店率、成交周期、均单稳定性和退单率；设计师要把客户搜索关注点转成方案解释和报价说明，只有当转正和退单质量稳定，才考虑扩大投放。"
      },
      {
        id: "channel_community_offline_has_base",
        module: "channel",
        priority: 84,
        enabled: true,
        when: [
          { path: "channel.communityOfflineSharePct", op: "gte", value: 5 }
        ],
        title: "市场部渠道有基础，但更适合小范围验证",
        body: "证据：市场部、市场商务、小区和展会等市场部渠道合计 {channel.communityOfflineOutputWan} 万，占比 {channel.communityOfflineSharePct}%。判断：线下渠道更依赖点位、人效和现场信任，线索本身只是入口，后续是否浪费主要看设计师能不能接住客户真实需求。动作：先看小区驻点效率、活动转正率、设计师承接质量和单场投入产出；设计师要参与前置沟通，明确客户户型、预算和改造重点，只保留能稳定产出有效线索且设计承接顺畅的点位。"
      },
      {
        id: "channel_third_party_platform_watch",
        module: "channel",
        priority: 82,
        enabled: true,
        when: [
          { path: "channel.thirdPartySharePct", op: "gte", value: 6 }
        ],
        title: "第三方平台垂直类有贡献，但要看成本和议价压力",
        body: "证据：第三方平台垂直类贡献 {channel.thirdPartyOutputWan} 万，占比 {channel.thirdPartySharePct}%。判断：平台流量看起来稳定，但客户比价强、信任弱，设计师如果不能讲清差异化方案和交付边界，线索很容易变成低效消耗。动作：单独看平台线索成本、有效到店、成交周期、均单和退单率；设计师接待平台客户时要强化需求诊断和方案价值说明，如果利润或转正质量不稳定，只保留必要曝光，不扩大依赖。"
      },
      {
        id: "channel_stock_flow",
        module: "channel",
        priority: 80,
        enabled: true,
        when: [
          { path: "channel.stockFlowSharePct", op: "gte", value: 20 }
        ],
        title: "回单/转介绍有贡献，但要区分真实口碑和内部回流",
        body: "证据：设计回单、工程回单、关系单、客户转介绍和中介等回单/转介绍合计 {channel.stockFlowOutputWan} 万，占总产值 {channel.stockFlowSharePct}%。判断：存量流量通常信任基础更好，但如果设计师沟通不到位，同样会出现预期偏差和退单，不能笼统当作低成本优质渠道。动作：拆分客户转介绍、设计回单、工程回单和中介来源，分别看成交率、均单和退单率；对真实口碑线索，设计师要做好老客户案例承接和需求确认，对低质量中介或异常回流保持审慎。"
      },
      {
        id: "channel_negative_anomaly",
        module: "channel",
        priority: 70,
        enabled: true,
        when: [
          { path: "channel.negativeChannelValueWan", op: "lt", value: 0 }
        ],
        title: "{channel.negativeChannelName}出现负值异常",
        body: "证据：{channel.negativeChannelName}出现 <strong>{channel.negativeChannelValueWan} 万</strong> 的负产值。判断：这通常不是经营动作本身，而可能是退单、取消、冲销或渠道分类错误被记录到该渠道下；如果确实来自退单，就要回到设计沟通和预期管理上复盘。动作：先排查 CRM 录入口径和退单归因，不要直接据此调整渠道预算；确认不是录入问题后，再追到设计师沟通记录、报价解释和退单原因，判断是渠道质量问题还是承接问题。"
      },
      {
        id: "channel_gap_between_first_second",
        module: "channel",
        priority: 68,
        enabled: true,
        when: [
          { path: "channel.topSecondGapPct", op: "gte", value: 20 }
        ],
        title: "{channel.topChannelName}与第二渠道差距较大，第二支柱仍需验证",
        body: "证据：{channel.topChannelName}占比 {channel.topChannelOutputSharePct}%，第二渠道{channel.secondChannelName}占比约 {channel.secondChannelOutputSharePct}%，两者差距 {channel.topSecondGapPct}pp。判断：头部领先不代表应继续单点加码，第二支柱也不能只靠投放试出来，还要看设计师是否能接住不同渠道的客户预期。动作：头部渠道保稳定，第二渠道小步测试；每个测试渠道都要同步记录设计师跟进质量、方案沟通问题和退单原因，只有转正率、均单、退单率和承接质量连续达标后，才进入加码池。"
      },
      {
        id: "channel_long_tail_many",
        module: "channel",
        priority: 66,
        enabled: true,
        when: [
          { path: "channel.positiveChannelCount", op: "gte", value: 8 }
        ],
        title: "渠道数量较多，更需要分层而不是平均投入",
        body: "证据：当前有 {channel.positiveChannelCount} 个正值渠道。判断：渠道多不等于机会多，如果都投入资源，预算会被摊薄，设计师承接也会被不同类型客户打散。动作：分成三层管理：主力渠道保稳定，验证渠道小预算测试，低效渠道只观察；每月按转正率、均单、退单率、线索成本和设计师承接反馈决定升降级，不做平均主义投放。"
      },
      {
        id: "channel_offline_low",
        module: "channel",
        priority: 64,
        enabled: true,
        when: [
          { path: "channel.offlineSharePct", op: "lt", value: 5 }
        ],
        title: "线下渠道产出偏低，先判断是战略收缩还是效率问题",
        body: "证据：社区/线下类渠道当前占比约 {channel.offlineSharePct}%，低于观察线。判断：低占比不一定代表渠道无效，也可能是阶段性收缩、人员配置不足、活动打法没有跑通，或设计师前置沟通不足。动作：先核对小区、展会、运营活动的投入、人效、到店和转正数据；如果线索到店后流失高，要复盘设计师是否讲清方案、预算和交付边界，再决定是收缩渠道还是优化承接。"
      },
      {
        id: "channel_paid_and_stock_balance",
        module: "channel",
        priority: 62,
        enabled: true,
        when: [
          { path: "channel.paidInfoFlowSharePct", op: "gte", value: 25 },
          { path: "channel.stockFlowSharePct", op: "gte", value: 20 }
        ],
        title: "付费流量和存量流量都有贡献，但要分开管理质量",
        body: "证据：线上投放类占比 {channel.paidInfoFlowSharePct}%，回单/转介绍类占比 {channel.stockFlowSharePct}%。判断：这说明获客不是单一路径，但两类流量的客户预期不同，设计师不能用同一套沟通方式承接所有线索。动作：线上投放看有效线索成本、转正率和退单率，设计师重点做预算校准；存量流量看真实转介绍比例、均单和口碑质量，设计师重点承接信任和案例解释；两边都达标时再考虑双轮驱动。"
      },
      {
        id: "channel_small_negative_needs_audit",
        module: "channel",
        priority: 60,
        enabled: true,
        when: [
          { path: "channel.negativeChannelCount", op: "gte", value: 1 }
        ],
        title: "存在负向渠道记录，先排数据再下经营结论",
        body: "证据：当前共有 {channel.negativeChannelCount} 个渠道出现负值记录。判断：负数可能来自退单、冲销或分类错误，不适合直接拿来评价渠道好坏；如果确实来自退单，更要回到设计沟通和预期管理上复盘。动作：先进入飞书异常视图核对订单、退单和渠道归因；确认不是录入问题后，再追到设计师沟通记录、报价解释和退单原因，判断是渠道质量问题还是承接问题。"
      },
      {
        id: "department_high_refund",
        module: "department",
        priority: 100,
        enabled: true,
        when: [
          { path: "department.highRiskRefundRatePct", op: "gte", value: 25 }
        ],
        title: "{department.highRiskDepartmentName}退单风险最高，需优先复盘",
        body: "证据：{department.highRiskDepartmentName}退单率为 <strong>{department.highRiskRefundRatePct}%</strong>，在 6 个设计部里风险最高；风险标签按“退单单数 / 草签单数”生成，不按产值大小生成。动作：先复盘该部门退单客户清单，重点看设计方案、报价解释、承诺口径和交付预期是否一致；渠道线索已经进来后，减少浪费的关键在设计师有效沟通和控退。"
      },
      {
        id: "department_multi_risk_watch",
        module: "department",
        priority: 98,
        enabled: true,
        when: [
          { path: "department.highRiskDepartmentCount", op: "gte", value: 2 }
        ],
        title: "多个设计部退单率超关注线，需要集中控退",
        body: "证据：当前有 {department.highRiskDepartmentCount} 个设计部退单率超过关注线，6 个设计部的平均退单率约 {department.avgDepartmentRefundRatePct}%。动作：先统一退单原因分类，再按部门拆解设计方案、报价预期和交付承诺；不要把压力简单压到渠道放量，优先让设计师把已到店线索接稳。"
      },
      {
        id: "department_six_team_refund_watch",
        module: "department",
        priority: 95,
        enabled: true,
        when: [
          { path: "department.highRiskRefundRatePct", op: "gte", value: 20 }
        ],
        title: "6 个设计部里，{department.highRiskDepartmentName}需要优先控退",
        body: "证据：{department.highRiskDepartmentName}退单率达到 {department.highRiskRefundRatePct}%，已超过经营关注线。动作：本周先看该部门退单客户清单，再拆分为设计方案、价格预期、交付承诺和客户资金四类原因；对设计师统一报价解释和预期管理话术。"
      },
      {
        id: "department_per_capita_leader",
        module: "department",
        priority: 80,
        enabled: true,
        when: [
          { path: "department.topPerCapitaWan", op: "gte", value: 150 }
        ],
        title: "{department.topPerCapitaDepartmentName}人均产值突出，可提炼打法",
        body: "证据：{department.topPerCapitaDepartmentName}人均净产值达到 {department.topPerCapitaWan} 万，是 6 个设计部里人效表现较好的部门。动作：复盘其客户来源、产品结构和设计师成交动作，沉淀可复制打法；复制时要同步看退单率，避免只复制签单动作不复制控退动作。"
      },
      {
        id: "department_top_output_has_risk",
        module: "department",
        priority: 90,
        enabled: true,
        when: [
          { path: "department.topOutputRefundRatePct", op: "gte", value: 20 }
        ],
        title: "{department.topOutputDepartmentName}规模第一，但退单风险不能忽视",
        body: "证据：{department.topOutputDepartmentName}净产值 {department.topOutputWan} 万、排名第一，但本期内退率达到 {department.topOutputRefundRatePct}%。动作：经营会不要只表扬规模，也要同步复盘退单原因；重点追设计师是否把预算、配置、工期和交付边界讲清楚。"
      },
      {
        id: "department_top_output_healthy",
        module: "department",
        priority: 88,
        enabled: true,
        when: [
          { path: "department.topOutputWan", op: "gte", value: 1500 },
          { path: "department.topOutputRefundRatePct", op: "lt", value: 18 }
        ],
        title: "{department.topOutputDepartmentName}规模领先且风险可控，可作为标杆",
        body: "证据：{department.topOutputDepartmentName}净产值达到 {department.topOutputWan} 万，且退单率 {department.topOutputRefundRatePct}% 没有明显失控。动作：复盘其线索分配、产品结构、设计师沟通节奏和控退动作，形成 6 个设计部可复制模板。"
      },
      {
        id: "department_low_per_capita",
        module: "department",
        priority: 70,
        enabled: true,
        when: [
          { path: "department.bottomPerCapitaWan", op: "lt", value: 80 }
        ],
        title: "{department.bottomPerCapitaDepartmentName}人均产值偏低，需看资源是否匹配",
        body: "证据：{department.bottomPerCapitaDepartmentName}人均净产值仅 {department.bottomPerCapitaWan} 万。动作：核查设计师人数、线索分配、客户质量和退单情况，判断是阶段性低谷还是组织效率问题；如果线索不差，优先看设计师承接和沟通质量。"
      },
      {
        id: "department_avg_order_leader",
        module: "department",
        priority: 68,
        enabled: true,
        when: [
          { path: "department.topAvgOrderWan", op: "gte", value: 16 }
        ],
        title: "{department.topAvgOrderDepartmentName}均单领先，客户质量较高",
        body: "证据：{department.topAvgOrderDepartmentName}报价单均单达到 {department.topAvgOrderWan} 万，说明该部门当前转正式客户的报价完整度或客单层级更高。动作：提炼其高客单客户来源、配置组合和设计师报价解释方法，供低均单部门学习；同时观察退单率，确认高均单不是靠过度承诺换来的。"
      },
      {
        id: "department_avg_order_gap_large",
        module: "department",
        priority: 67,
        enabled: true,
        when: [
          { path: "department.avgOrderGapWan", op: "gte", value: 2.5 }
        ],
        title: "设计部均单差距明显，需要拆客户质量和套餐打法",
        body: "证据：当前最高报价单均单部门是{department.topAvgOrderDepartmentName}，均单 {department.topAvgOrderWan} 万；部门之间均单差距约 {department.avgOrderGapWan} 万。动作：拆客户来源、产品结构、配置升级和报价完整度；低均单部门不一定简单涨价，先看方案完整度和升级项表达。"
      },
      {
        id: "department_monthly_floor",
        module: "department",
        priority: 66,
        enabled: true,
        when: [
          { path: "department.bottomMonthlyWan", op: "lt", value: 60 }
        ],
        title: "{department.bottomMonthlyDepartmentName}月均产值偏低，需要单独盯过程",
        body: "证据：{department.bottomMonthlyDepartmentName}月均净产值约 {department.bottomMonthlyWan} 万，是当前部门中较低水平。动作：不要只等月末结果，要拆到线索量、到店量、签单率和退单率逐项跟进；重点看设计师是否把已分配线索转成有效沟通。"
      },
      {
        id: "department_top_bottom_gap",
        module: "department",
        priority: 64,
        enabled: true,
        when: [
          { path: "department.topBottomOutputGapWan", op: "gte", value: 500 }
        ],
        title: "设计部头尾产值差距较大，管理动作要分层",
        body: "证据：{department.topOutputDepartmentName}与{department.bottomOutputDepartmentName}净产值差距约 {department.topBottomOutputGapWan} 万。动作：不要用同一套目标压所有部门，头部部门提炼打法，尾部部门先补线索承接、报价沟通和退单复盘。"
      }
    ]
  };

  function generate(data, options = {}) {
    const moduleName = options.module || "product";
    const limit = options.limit || 4;
    const library = options.library || data.ruleTemplateLibrary || global.GM_RULE_TEMPLATE_LIBRARY || DEFAULT_RULE_TEMPLATE_LIBRARY;
    const context = buildContext(data);

    const matchedRules = (library.rules || [])
      .filter(rule => rule.enabled !== false && rule.module === moduleName)
      .filter(rule => matchesRule(rule, context))
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
    const selectedRules = selectRulesForDisplay(moduleName, matchedRules, limit);

    return selectedRules.map(rule => ({
        id: rule.id,
        module: rule.module,
        dimension: rule.dimension || "",
        priority: rule.priority || 0,
        title: renderTemplate(rule.title, context),
        body: renderTemplate(rule.body, context),
        source: "rule-template-library"
      }));
  }

  function selectRulesForDisplay(moduleName, matchedRules, limit) {
    if (moduleName !== "product") return matchedRules.slice(0, limit);

    const dimensionOrder = ["经营节奏", "产品结构分析", "客单价提升抓手", "转化优化空间", "基础产品定位"];
    const selected = [];
    const used = new Set();

    dimensionOrder.forEach(dimension => {
      const rule = matchedRules.find(item => item.dimension === dimension && !used.has(item.id));
      if (rule) {
        selected.push(rule);
        used.add(rule.id);
      }
    });

    matchedRules.forEach(rule => {
      if (selected.length >= limit) return;
      if (!used.has(rule.id)) {
        selected.push(rule);
        used.add(rule.id);
      }
    });

    return selected.slice(0, limit);
  }

  function getKpiBadge(metricKey, currentValue, benchmarkValue, options = {}) {
    const library = options.library || global.GM_RULE_TEMPLATE_LIBRARY || DEFAULT_RULE_TEMPLATE_LIBRARY;
    const rules = library.kpiBadgeRules?.[metricKey] || [];
    const current = parseNumber(currentValue);
    const benchmark = parseNumber(benchmarkValue);

    if (!rules.length) {
      return { label: "稳定", ruleId: "kpi_default_stable", source: "kpi-rule-library" };
    }

    if (!benchmark) {
      return { label: "稳定", ruleId: "kpi_missing_benchmark", source: "kpi-rule-library" };
    }

    const comparison = {
      current,
      benchmark,
      ratio: current / benchmark,
      diffPp: current - benchmark
    };
    const matched = rules.find(rule => matchesKpiBadgeRule(rule, comparison)) || rules[rules.length - 1];

    return {
      label: matched.label,
      ruleId: matched.id,
      source: "kpi-rule-library",
      current: Number(current.toFixed(2)),
      benchmark: Number(benchmark.toFixed(2)),
      ratio: Number(comparison.ratio.toFixed(4)),
      diffPp: Number(comparison.diffPp.toFixed(2))
    };
  }

  function getSoftReadout(data, options = {}) {
    const library = options.library || global.GM_RULE_TEMPLATE_LIBRARY || DEFAULT_RULE_TEMPLATE_LIBRARY;
    const rules = library.softReadoutRules || DEFAULT_RULE_TEMPLATE_LIBRARY.softReadoutRules;
    const rows = data.soft || [];
    const detailRows = rows.filter(row => !String(row.name || "").includes("加权"));
    const totalRow = rows.find(row => String(row.name || "").includes("加权")) || rows[rows.length - 1] || {};
    const totalOrders = detailRows.reduce((total, row) => total + (Number(row.count) || 0), 0) || Number(totalRow.count) || 0;
    const stepPp = pickNumber(data.productSummary || {}, ["soft_step_pp", "softStepPp"], 10) || 10;
    const liftWan = (Number(totalRow.soft) || 0) - (Number(totalRow.noSoft) || 0);
    const liftRatePct = totalRow.noSoft ? (liftWan / Number(totalRow.noSoft)) * 100 : 0;
    const selectedRatePct = Number(totalRow.selectedRatePct ?? totalRow.selected_rate_pct) || 0;
    const newSelectedOrders = Math.round(totalOrders * stepPp / 100);
    const potentialWan = Math.round(newSelectedOrders * liftWan);
    const baseNames = detailRows
      .map(row => String(row.name || "").replace("整体", ""))
      .filter(Boolean)
      .join(" + ") || "主力产品";
    const context = {
      baseNames,
      totalOrders,
      stepPp,
      newSelectedOrders,
      liftWan: formatMetric(liftWan),
      liftRatePct: formatMetric(liftRatePct),
      selectedRatePct: formatMetric(selectedRatePct),
      potentialWan: formatMetric(potentialWan)
    };
    const quickItems = rows.map(row => {
      const noSoft = Number(row.noSoft) || 0;
      const soft = Number(row.soft) || 0;
      const liftRatePct = noSoft ? ((soft - noSoft) / noSoft) * 100 : 0;
      return renderTemplate(rules.quickItemTemplate, {
        name: String(row.name || "").replace("整体", "").replace("加权总计", "加权平均"),
        selectedRatePct: formatMetric(row.selectedRatePct ?? row.selected_rate_pct ?? 0),
        liftRatePct: formatMetric(liftRatePct)
      });
    });
    const actionRule = (rules.actionRules || []).find(rule => matchesSoftActionRule(rule, context));

    return {
      quickItems,
      potentialText: renderTemplate(rules.potentialTemplate, context),
      callout: renderTemplate(rules.calloutTemplate, context),
      action: actionRule?.body || ""
    };
  }

  function getChannelWarning(data, options = {}) {
    const library = options.library || global.GM_RULE_TEMPLATE_LIBRARY || DEFAULT_RULE_TEMPLATE_LIBRARY;
    const warningRules = library.channelWarningRules || DEFAULT_RULE_TEMPLATE_LIBRARY.channelWarningRules;
    const rows = data.channelRanking || [];
    const namesSet = new Set(warningRules.onlineNames || []);
    const hasOrderData = rows.some(row => Number.isFinite(Number(row.orders)) && Number(row.orders) > 0);
    const onlineRows = rows.filter(row => namesSet.has(row.name) && (hasOrderData ? Number(row.orders) > 0 : (row.value || 0) > 0));
    const outputWan = onlineRows.reduce((total, row) => total + (Number(row.value) || 0), 0);
    const sharePct = onlineRows.reduce((total, row) => total + (Number(row.sharePct) || extractPercent(row.label) || 0), 0);
    const context = {
      count: onlineRows.length,
      outputWan: formatMetric(outputWan),
      sharePct: formatMetric(sharePct),
      names: onlineRows.map(row => row.name).join("、") || "线上投放类渠道"
    };
    const matched = (warningRules.templates || []).find(rule => matchesSoftActionRule(rule, context));
    return matched ? renderTemplate(matched.body, context) : "线上投放类渠道待接入数据后自动汇总";
  }

  function getDepartmentRiskLabel(refundRatePct, options = {}) {
    const library = options.library || global.GM_RULE_TEMPLATE_LIBRARY || DEFAULT_RULE_TEMPLATE_LIBRARY;
    const rules = library.departmentRiskLabelRules || DEFAULT_RULE_TEMPLATE_LIBRARY.departmentRiskLabelRules;
    const context = { refundRatePct: parseNumber(refundRatePct) };
    const matched = rules.find(rule => matchesSoftActionRule(rule, context)) || rules[rules.length - 1];

    return {
      label: matched.label,
      color: matched.color,
      bg: matched.bg,
      rateColor: matched.rateColor,
      rateBg: matched.rateBg,
      ruleId: matched.id,
      source: "department-risk-rule-library"
    };
  }

  function matchesSoftActionRule(rule, context) {
    const conditions = Array.isArray(rule.when) ? rule.when : [rule.when || { op: "default" }];
    return conditions.every(condition => {
      if (condition.op === "default") return true;
      return compare(getByPath(context, condition.path), condition.op, condition.value);
    });
  }

  function buildContext(data) {
    const summaryInput = data.summary || {};
    const productInput = data.productSummary || data.product_summary || {};
    const channelInput = data.channelSummary || data.channel_summary || {};

    const kpiOutput = getKpiByLabel(data.kpis, "转正总产值");
    const kpiOrders = getKpiByLabel(data.kpis, "转正单数");
    const kpiRefund = getKpiByLabel(data.kpis, "退单率（按草签）") || getKpiByLabel(data.kpis, "本期内退率");
    const totalOutputMetric = getMultiMetric(data.multiMetrics, "转正总产值");
    const totalOrdersMetric = getMultiMetric(data.multiMetrics, "转正总单数");
    const monthlyOutputMetric = getMultiMetric(data.multiMetrics, "月均产值");
    const annualizedMetric = getMultiMetric(data.multiMetrics, "年化产值");

    const summary = {
      statDays: pickNumber(summaryInput, ["stat_days", "statDays"], 108),
      currentOutputWan: pickNumber(summaryInput, ["current_output_wan", "currentOutputWan"], totalOutputMetric || kpiOutput || 9357),
      currentOrders: pickNumber(summaryInput, ["current_orders", "currentOrders"], totalOrdersMetric || kpiOrders || 646),
      monthlyOutputWan: pickNumber(summaryInput, ["monthly_output_wan", "monthlyOutputWan"], monthlyOutputMetric || 2636),
      annualizedOutputYi: pickNumber(summaryInput, ["annualized_output_yi", "annualizedOutputYi"], annualizedMetric || 3.16),
      yearTargetYi: pickNumber(summaryInput, ["year_target_yi", "yearTargetYi"], 3.5),
      yearProgressPct: pickNumber(summaryInput, ["year_progress_pct", "yearProgressPct"], 6.4),
      yearTheoryProgressPct: pickNumber(summaryInput, ["year_theory_progress_pct", "yearTheoryProgressPct"], 30),
      monthProgressPct: pickNumber(summaryInput, ["month_progress_pct", "monthProgressPct"], 90.9),
      monthGoalGapWan: pickNumber(summaryInput, ["month_goal_gap_wan", "monthGoalGapWan"], 264),
      refundRatePct: pickNumber(summaryInput, ["refund_rate_pct", "refundRatePct"], kpiRefund || 18.6),
      refundRateDeltaPp: pickNumber(summaryInput, ["refund_rate_delta_pp", "refundRateDeltaPp"], 4.5)
    };
    summary.yearTargetWan = pickNumber(summaryInput, ["year_target_wan", "yearTargetWan"], summary.yearTargetYi * 10000);
    summary.periodLabel = pickString(summaryInput, ["period_label", "periodLabel"], "当前筛选月份");
    summary.yearPaceDirection = summary.yearProgressPct >= summary.yearTheoryProgressPct ? "领先" : "落后";
    summary.yearPaceGapPp = Math.abs(summary.yearProgressPct - summary.yearTheoryProgressPct);
    summary.monthTargetWan = pickNumber(
      summaryInput,
      ["month_target_wan", "monthTargetWan"],
      summary.monthProgressPct ? (summary.monthlyOutputWan * 100) / summary.monthProgressPct : summary.monthlyOutputWan + summary.monthGoalGapWan
    );
    summary.monthGapText = pickString(
      summaryInput,
      ["month_gap_text", "monthGapText"],
      summary.monthlyOutputWan >= summary.monthTargetWan
        ? `已超过月度目标 ${Math.abs(summary.monthlyOutputWan - summary.monthTargetWan).toFixed(2)} 万`
        : `差 ${summary.monthGoalGapWan} 万追平月度目标`
    );

    const topProduct = getTopProduct(data, productInput);
    const lowValueProduct = getLowValueProduct(data);
    const productPortfolio = getProductPortfolio(data);
    const soft = getSoftSummary(data, productInput);
    const topChannel = getTopChannel(data, channelInput);
    const channelPortfolio = getChannelPortfolio(data);
    const negativeChannel = getNegativeChannel(data);
    const department = getDepartmentSummary(data);
    const highEndOrderInput = pickNumber(productInput, ["high_end_orders", "highEndOrders"], null);
    const highEndOrders = highEndOrderInput > 0 ? highEndOrderInput : estimateHighEndOrders(data, summary.currentOrders);

    return {
      summary: roundObject(summary),
      product: roundObject({
        ...topProduct,
        ...lowValueProduct,
        ...productPortfolio,
        highEndNames: pickString(productInput, ["high_end_names", "highEndNames"], "Q5、新Q3、T1-2.0"),
        highEndOrders,
        highEndPenetrationPct: pickNumber(
          productInput,
          ["high_end_penetration_pct", "highEndPenetrationPct"],
          summary.currentOrders ? (highEndOrders / summary.currentOrders) * 100 : 0
        )
      }),
      soft: roundObject(soft),
      channel: roundObject({
        ...topChannel,
        ...channelPortfolio,
        negativeChannelName: negativeChannel.name,
        negativeChannelValueWan: negativeChannel.value,
        paidInfoFlowOutputWan: channelPortfolio.onlineOutputWan || pickNumber(channelInput, ["paid_info_flow_output_wan", "paidInfoFlowOutputWan"], 3595.67),
        paidInfoFlowOrders: pickNumber(channelInput, ["paid_info_flow_orders", "paidInfoFlowOrders"], 219),
        paidInfoFlowSharePct: channelPortfolio.onlineSharePct || pickNumber(channelInput, ["paid_info_flow_share_pct", "paidInfoFlowSharePct"], 31.5),
        paidInfoFlowAvgWan: pickNumber(channelInput, ["paid_info_flow_avg_wan", "paidInfoFlowAvgWan"], 16.42),
        stockFlowOutputWan: channelPortfolio.stockFlowOutputWan || pickNumber(channelInput, ["stock_flow_output_wan", "stockFlowOutputWan"], 0),
        stockFlowOrders: channelPortfolio.stockFlowOrders || pickNumber(channelInput, ["stock_flow_orders", "stockFlowOrders"], 0),
        stockFlowSharePct: channelPortfolio.stockFlowSharePct || pickNumber(channelInput, ["stock_flow_share_pct", "stockFlowSharePct"], 0)
      }),
      department: roundObject(department)
    };
  }

  function getTopProduct(data, input) {
    const topFromSummary = {
      topProductName: pickString(input, ["top_product_name", "topProductName"], null),
      topProductOutputSharePct: pickNumber(input, ["top_product_output_share_pct", "topProductOutputSharePct"], null),
      topProductOutputWan: pickNumber(input, ["top_product_output_wan", "topProductOutputWan"], null),
      topProductOrders: pickNumber(input, ["top_product_orders", "topProductOrders"], null)
    };

    if (topFromSummary.topProductName && topFromSummary.topProductOutputSharePct !== null) {
      return topFromSummary;
    }

    const top = [...(data.products || [])]
      .filter(row => (row.netValueWan ?? row.value ?? 0) > 0)
      .sort((a, b) => (b.netValueWan ?? b.value ?? 0) - (a.netValueWan ?? a.value ?? 0))[0] || {};
    return {
      topProductName: top.name || "主力产品线",
      topProductOutputSharePct: top.value || 0,
      topProductOutputWan: pickNumber(input, ["top_product_output_wan", "topProductOutputWan"], 0),
      topProductOrders: pickNumber(input, ["top_product_orders", "topProductOrders"], 0)
    };
  }

  function getLowValueProduct(data) {
    const valueByName = new Map((data.productValue || []).map(row => [row.name, row.value]));
    const entryNames = ["89900", "基装"];
    const rows = (data.productContribution || [])
      .map(row => ({
        name: row.name,
        output: row.output,
        orders: row.orders,
        gap: row.orders - row.output,
        avg: valueByName.get(row.name) || 0
      }))
      .filter(row => row.avg > 0)
      .sort((a, b) => b.gap - a.gap);
    const picked = rows.find(row => entryNames.includes(row.name) && row.avg <= 9.5) || rows[0] || null;

    if (!picked) {
      return {
        lowValueProductName: "低客单产品线",
        lowValueOrderSharePct: 0,
        lowValueOutputSharePct: 0,
        lowValueShareGapPct: 0,
        lowValueAvgWan: 999
      };
    }

    return {
      lowValueProductName: picked.name,
      lowValueOrderSharePct: picked.orders || 0,
      lowValueOutputSharePct: picked.output || 0,
      lowValueShareGapPct: picked.gap || 0,
      lowValueAvgWan: picked.avg || 0
    };
  }

  function getProductPortfolio(data) {
    const products = [...(data.products || [])]
      .filter(row => (row.netValueWan ?? row.value ?? 0) > 0)
      .sort((a, b) => (b.netValueWan ?? b.value ?? 0) - (a.netValueWan ?? a.value ?? 0));
    const values = data.productValue || [];
    const areas = data.productArea || [];
    const second = products[1] || {};
    const tailShare = products.slice(4).reduce((sum, row) => sum + (row.value || 0), 0);
    const valueLeader = [...values].sort((a, b) => b.value - a.value)[0] || {};
    const areaLeader = [...areas].sort((a, b) => b.value - a.value)[0] || {};
    const valueByName = new Map(values.map(row => [row.name, row.value]));
    const unitPriceRows = areas
      .map(row => ({
        name: row.name,
        unitPrice: row.value ? ((valueByName.get(row.name) || 0) * 10000) / row.value : 0
      }))
      .filter(row => row.unitPrice > 0)
      .sort((a, b) => b.unitPrice - a.unitPrice);
    const unitPriceLeader = unitPriceRows[0] || {};

    return {
      secondProductName: second.name || "第二产品线",
      secondProductOutputSharePct: second.value || 0,
      topTwoProductSharePct: (products[0]?.value || 0) + (second.value || 0),
      tailProductSharePct: tailShare,
      valueLeaderProductName: valueLeader.name || "高客单产品线",
      valueLeaderAvgWan: valueLeader.value || 0,
      areaLeaderProductName: areaLeader.name || "大面积产品线",
      areaLeaderAvgSqm: areaLeader.value || 0,
      unitPriceLeaderProductName: unitPriceLeader.name || "高单价产品线",
      unitPriceLeaderYuan: Math.round(unitPriceLeader.unitPrice || 0)
    };
  }

  function estimateHighEndOrders(data, totalOrders) {
    const highEndKeywords = ["Q5", "新Q3", "T1", "T1-2.0"];
    const orderSharePct = (data.productContribution || [])
      .filter(row => highEndKeywords.some(keyword => String(row.name || "").includes(keyword)))
      .reduce((total, row) => total + (Number(row.orders) || 0), 0);
    return totalOrders ? (orderSharePct / 100) * totalOrders : 0;
  }

  function getSoftSummary(data, input) {
    const rows = data.soft || [];
    const total = rows.find(row => row.name.includes("加权")) || rows[rows.length - 1] || {};
    const example = rows[0] || total;
    const softLiftWan = (total.soft || 0) - (total.noSoft || 0);
    const softLiftRatePct = total.noSoft ? (softLiftWan / total.noSoft) * 100 : 0;
    const exampleLiftWan = (example.soft || 0) - (example.noSoft || 0);
    const exampleLiftRatePct = example.noSoft ? (exampleLiftWan / example.noSoft) * 100 : 0;

    return {
      softSelectedRatePct: pickNumber(input, ["soft_selected_rate_pct", "softSelectedRatePct"], 34),
      softPotentialWanPer10Pp: pickNumber(input, ["soft_potential_wan_per_10pp", "softPotentialWanPer10Pp"], 250),
      softLiftWan,
      softLiftRatePct,
      exampleProductName: (example.name || "软装").replace("整体", ""),
      exampleNoSoftAvgWan: example.noSoft || 0,
      exampleSoftAvgWan: example.soft || 0,
      exampleLiftRatePct
    };
  }

  function getTopChannel(data, input) {
    const top = [...(data.channelRanking || [])]
      .filter(row => row.value > 0)
      .sort((a, b) => b.value - a.value)[0] || {};

    if (top.name) {
      return {
        topChannelName: top.name || "主力渠道",
        topChannelOutputWan: top.value || 0,
        topChannelOutputSharePct: top.sharePct || extractPercent(top.label) || 0,
        topChannelOrders: extractOrders(top.label) || 0
      };
    }

    const name = pickString(input, ["top_channel_name", "topChannelName"], null);
    if (name) {
      return {
        topChannelName: name,
        topChannelOutputWan: pickNumber(input, ["top_channel_output_wan", "topChannelOutputWan"], 0),
        topChannelOutputSharePct: pickNumber(input, ["top_channel_output_share_pct", "topChannelOutputSharePct"], 0),
        topChannelOrders: pickNumber(input, ["top_channel_orders", "topChannelOrders"], 0)
      };
    }

    return {
      topChannelName: "主力渠道",
      topChannelOutputWan: 0,
      topChannelOutputSharePct: 0,
      topChannelOrders: 0
    };
  }

  function getNegativeChannel(data) {
    const negative = (data.channelRanking || []).find(row => row.value < 0) || {};
    return {
      name: negative.name || "异常渠道",
      value: negative.value || 0
    };
  }

  function getChannelPortfolio(data) {
    const rows = data.channelRanking || [];
    const positive = rows.filter(row => row.value > 0);
    const sorted = [...positive].sort((a, b) => b.value - a.value);
    const top = sorted[0] || {};
    const second = sorted[1] || {};
    const topShare = top.sharePct || extractPercent(top.label) || 0;
    const secondShare = second.sharePct || extractPercent(second.label) || 0;
    const negativeCount = rows.filter(row => row.value < 0).length;
    const getMetric = name => {
      const row = rows.find(item => item.name === name) || {};
      const rawValue = Number(row.value) || 0;
      const rawShare = row.sharePct || extractPercent(row.label) || 0;
      return {
        name,
        value: rawValue,
        share: rawValue > 0 ? rawShare : 0,
        orders: extractOrders(row.label) || row.orders || 0
      };
    };
    const sumMetrics = names => {
      const pickedRows = names.map(getMetric).filter(row => row.value > 0);
      return {
        rows: pickedRows,
        outputWan: pickedRows.reduce((total, row) => total + row.value, 0),
        sharePct: pickedRows.reduce((total, row) => total + row.share, 0),
        orders: pickedRows.reduce((total, row) => total + row.orders, 0)
      };
    };
    const broadcastNames = ["99", "878", "广播", "广播电视", "交通106.8", "进线", "经典音乐88.5", "客户转介绍（广播）", "天津广播", "相声92.1", "新闻97.2", "线上广播"];
    const onlineNames = ["400热线", "百度搜索", "百度系", "搜索", "抖音直播", "抖音直播（二）", "抖音直播类", "第三方平台垂直类", "抖音信息流类", "腾讯系", "微信朋友圈推广", "线上非诺云", "线上投放类"];
    const marketNames = ["市场部", "市场商务", "小区(非定点)", "小区(定点)", "运营类", "展会"];
    const stockFlowNames = ["工程回单", "回单", "客户转介绍（其他）", "商务一部(中介)", "商务一部（中介）", "其他中介", "21世纪", "关系单", "设计回单", "回单/转介绍"];
    const broadcast = sumMetrics(broadcastNames);
    const douyinLive = getMetric("抖音直播类");
    const douyinInfo = getMetric("抖音信息流类");
    const baidu = getMetric("百度系");
    const thirdParty = getMetric("第三方平台垂直类");
    const tencent = getMetric("腾讯系");
    const otherIntermediary = getMetric("其他中介");
    const online = sumMetrics(onlineNames);
    const communityOffline = sumMetrics(marketNames);
    const stockFlow = sumMetrics(stockFlowNames);
    const lowVolumeRows = positive.filter(row => (row.sharePct || extractPercent(row.label) || 0) < 1);
    const lowVolumeSharePct = lowVolumeRows.reduce((total, row) => total + (row.sharePct || extractPercent(row.label) || 0), 0);
    const onlineRows = online.rows;
    const onlineOutputWan = online.outputWan;
    const onlineSharePct = online.sharePct;
    const onlineTop = [...onlineRows].sort((a, b) => b.value - a.value)[0] || {};

    return {
      secondChannelName: second.name || "第二渠道",
      secondChannelOutputWan: second.value || 0,
      secondChannelOutputSharePct: secondShare,
      topSecondGapPct: topShare - secondShare,
      positiveChannelCount: positive.length,
      negativeChannelCount: negativeCount,
      broadcastOutputWan: broadcast.outputWan,
      broadcastSharePct: broadcast.sharePct,
      douyinLiveOutputWan: douyinLive.value,
      douyinLiveSharePct: douyinLive.share,
      douyinInfoOutputWan: douyinInfo.value,
      douyinInfoSharePct: douyinInfo.share,
      baiduOutputWan: baidu.value,
      baiduSharePct: baidu.share,
      thirdPartyOutputWan: thirdParty.value,
      thirdPartySharePct: thirdParty.share,
      tencentOutputWan: tencent.value,
      tencentSharePct: tencent.share,
      otherIntermediaryOutputWan: otherIntermediary.value,
      otherIntermediarySharePct: otherIntermediary.share,
      communityOfflineOutputWan: communityOffline.outputWan,
      communityOfflineSharePct: communityOffline.sharePct,
      stockFlowOutputWan: stockFlow.outputWan,
      stockFlowOrders: stockFlow.orders,
      stockFlowSharePct: stockFlow.sharePct,
      lowVolumeChannelCount: lowVolumeRows.length,
      lowVolumeSharePct,
      offlineSharePct: communityOffline.sharePct,
      onlineOutputWan,
      onlineSharePct,
      onlineTopChannelName: onlineTop.name || "线上投放渠道",
      onlineTopOutputWan: onlineTop.value || 0,
      onlineTopSharePct: onlineTop.share || 0
    };
  }

  function getDepartmentSummary(data) {
    const rows = data.departments || [];
    const highRisk = [...rows].sort((a, b) => b.refundRate - a.refundRate)[0] || {};
    const perCapita = [...rows].sort((a, b) => b.perCapita - a.perCapita)[0] || {};
    const topOutput = [...rows].sort((a, b) => b.output - a.output)[0] || {};
    const bottomOutput = [...rows].sort((a, b) => a.output - b.output)[0] || {};
    const bottomPerCapita = [...rows].sort((a, b) => a.perCapita - b.perCapita)[0] || {};
    const topAvgOrder = [...rows].sort((a, b) => b.avg - a.avg)[0] || {};
    const bottomMonthly = [...rows].sort((a, b) => a.monthly - b.monthly)[0] || {};
    const highRiskCount = rows.filter(row => row.refundRate >= 20).length;
    const avgRefundRatePct = rows.length ? rows.reduce((total, row) => total + (row.refundRate || 0), 0) / rows.length : 0;
    const avgPerCapitaWan = rows.length ? rows.reduce((total, row) => total + (row.perCapita || 0), 0) / rows.length : 0;
    const avgOrderGapWan = (topAvgOrder.avg || 0) - ([...rows].sort((a, b) => a.avg - b.avg)[0]?.avg || 0);
    return {
      highRiskDepartmentName: highRisk.name || "高风险部门",
      highRiskRefundRatePct: highRisk.refundRate || 0,
      highRiskDepartmentCount: highRiskCount,
      avgDepartmentRefundRatePct: avgRefundRatePct,
      topPerCapitaDepartmentName: perCapita.name || "高人效部门",
      topPerCapitaWan: perCapita.perCapita || 0,
      avgPerCapitaWan,
      topOutputDepartmentName: topOutput.name || "头部部门",
      topOutputWan: topOutput.output || 0,
      topOutputRefundRatePct: topOutput.refundRate || 0,
      bottomOutputDepartmentName: bottomOutput.name || "尾部部门",
      bottomOutputWan: bottomOutput.output || 0,
      topBottomOutputGapWan: (topOutput.output || 0) - (bottomOutput.output || 0),
      bottomPerCapitaDepartmentName: bottomPerCapita.name || "低人效部门",
      bottomPerCapitaWan: bottomPerCapita.perCapita || 0,
      topAvgOrderDepartmentName: topAvgOrder.name || "高均单部门",
      topAvgOrderWan: topAvgOrder.avg || 0,
      avgOrderGapWan,
      bottomMonthlyDepartmentName: bottomMonthly.name || "低月均部门",
      bottomMonthlyWan: bottomMonthly.monthly || 0
    };
  }

  function matchesRule(rule, context) {
    return (rule.when || []).every(condition => {
      const left = getByPath(context, condition.path);
      const right = condition.valuePath ? getByPath(context, condition.valuePath) : condition.value;
      return compare(left, condition.op, right);
    });
  }

  function matchesKpiBadgeRule(rule, comparison) {
    const condition = rule.when || { op: "default" };
    switch (condition.op) {
      case "gteRatio":
        return comparison.ratio >= condition.value;
      case "betweenRatio":
        return comparison.ratio >= condition.min && comparison.ratio < condition.max;
      case "lteDiffPp":
        return comparison.diffPp <= condition.value;
      case "betweenDiffPp":
        return comparison.diffPp >= condition.min && comparison.diffPp <= condition.max;
      case "default":
        return true;
      default:
        return false;
    }
  }

  function compare(left, op, right) {
    if (op === "exists") return left !== undefined && left !== null && left !== "";
    if (left === undefined || left === null) return false;
    switch (op) {
      case "gt": return left > right;
      case "gte": return left >= right;
      case "lt": return left < right;
      case "lte": return left <= right;
      case "eq": return left === right;
      case "neq": return left !== right;
      case "between": return Array.isArray(right) && left >= right[0] && left <= right[1];
      default: return false;
    }
  }

  function renderTemplate(template, context) {
    return String(template || "").replace(/\{([a-zA-Z0-9_.]+)\}/g, (_, path) => {
      const value = getByPath(context, path);
      return value === undefined || value === null ? "" : value;
    });
  }

  function getByPath(source, path) {
    return String(path).split(".").reduce((current, key) => {
      if (current === undefined || current === null) return undefined;
      return current[key];
    }, source);
  }

  function getKpiByLabel(kpis = [], label) {
    const row = kpis.find(item => item.label.includes(label));
    return row ? parseNumber(row.value) : null;
  }

  function getMultiMetric(metrics = [], label) {
    const row = metrics.find(item => item[0].includes(label));
    return row ? parseNumber(row[1]) : null;
  }

  function pickNumber(source, keys, fallback) {
    for (const key of keys) {
      if (source[key] !== undefined && source[key] !== null && source[key] !== "") {
        return parseNumber(source[key]);
      }
    }
    return fallback;
  }

  function pickString(source, keys, fallback) {
    for (const key of keys) {
      if (source[key] !== undefined && source[key] !== null && source[key] !== "") {
        return String(source[key]);
      }
    }
    return fallback;
  }

  function parseNumber(value) {
    if (typeof value === "number") return value;
    if (typeof value !== "string") return Number(value) || 0;
    const cleaned = value.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
    return cleaned ? Number(cleaned[0]) : 0;
  }

  function extractPercent(text = "") {
    const matches = String(text).match(/\d+(\.\d+)?%/g);
    if (!matches || !matches.length) return null;
    return parseNumber(matches[matches.length - 1]);
  }

  function extractOrders(text = "") {
    const match = String(text).match(/\/\s*(-?\d+)\s*单/);
    return match ? Number(match[1]) : null;
  }

  function formatMetric(value) {
    const number = Number(value) || 0;
    if (Number.isInteger(number)) return String(number);
    return String(Number(number.toFixed(2)));
  }

  function roundObject(source) {
    return Object.fromEntries(Object.entries(source).map(([key, value]) => {
      if (typeof value !== "number") return [key, value];
      return [key, Number(value.toFixed(2))];
    }));
  }

  global.GM_RULE_TEMPLATE_LIBRARY = global.GM_RULE_TEMPLATE_LIBRARY || DEFAULT_RULE_TEMPLATE_LIBRARY;
  global.RuleTalkEngine = {
    buildContext,
    generate,
    getSoftReadout,
    getChannelWarning,
    getDepartmentRiskLabel,
    getKpiBadge,
    renderTemplate,
    defaultLibrary: DEFAULT_RULE_TEMPLATE_LIBRARY
  };
})(window);
