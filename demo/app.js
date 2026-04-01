/**
 * 合规库管理 Demo - 应用逻辑
 * 操作流程：上传文件 → 拆分检查项 → 创建合规检查任务 → 执行检查 → 下载报告
 */

// ============ Mock 数据 ============
let complianceFiles = [
  { id: 'f1', name: '信息安全等级保护基本要求.pdf', uploadTime: '2026-02-28 10:30:00', size: '2.3MB', complianceType: '等级保护', publishUnit: '公安部', remark: '等保2.0 国标', uploader: '超级管理员', content: '《信息安全技术 网络安全等级保护基本要求》\n\n文档内容预览...\n\n一、安全物理环境\n二、安全通信网络\n三、安全区域边界\n四、安全计算环境\n五、安全管理中心\n\n（Demo 环境下为模拟展示）' },
  { id: 'f2', name: '等保2.0合规检查清单.docx', uploadTime: '2026-03-01 09:15:00', size: '856KB', complianceType: '等级保护', publishUnit: '网信办', remark: '', uploader: '超级管理员', content: '等保2.0 合规检查项清单\n\n包含安全物理环境、安全通信网络等章节...\n\n（Demo 环境下为模拟展示）' },
  { id: 'f3', name: '等保三级要求对照表.xlsx', uploadTime: '2026-03-02 14:20:00', size: '1.1MB', complianceType: '行业合规', publishUnit: '工信部', remark: '三级等保参考', uploader: '超级管理员', content: '等保三级技术要求与管理要求对照表\n\n（Demo 环境下为模拟展示）' },
];

// 检查项数据：检查类别、检查事项、检查要求、检查方式、合规文件、检查要点(详情)、需要被检查单位配合事项(详情)
let checkItems = [
  { id: 'c1', fileId: 'f1', category: '数据安全', item: '数据安全组织体系', requirement: '是否明确数据安全保护负责人，建立数据安全管理组织架构', method: '1.登陆系统验证 2.材料检查 3.现场询问', autoCheck: true, keyPoints: ['了解数据保护负责人任职情况及职责分工', '核查数据安全管理岗位配置', '查验相关任命文件'], cooperation: ['系统清单', '关键人员名单', '数据安全管理责任制文件'] },
  { id: 'c2', fileId: 'f1', category: '数据安全', item: '数据安全制度建设', requirement: '是否建立网络安全责任制，明确各级安全责任', method: '1.登陆系统验证 2.材料检查 3.现场询问', autoCheck: false, keyPoints: ['核查网络安全责任制文件', '检查责任落实情况', '核对责任追究记录'], cooperation: ['网络安全责任制制度', '责任落实台账', '考核记录'] },
  { id: 'c3', fileId: 'f2', category: '数据安全', item: '数据安全制度建设', requirement: '是否对重大数据安全事件进行责任追究', method: '1.登陆系统验证 2.材料检查 3.现场询问', autoCheck: true, keyPoints: ['检查事件处置流程', '核查责任认定材料', '查验问责记录'], cooperation: ['重大事件处置记录', '责任追究报告', '整改措施材料'] },
  { id: 'c4', fileId: 'f2', category: '数据安全', item: '数据安全制度建设', requirement: '是否制定个人信息保护管理制度和操作规程', method: '1.登陆系统验证 2.材料检查 3.现场询问', keyPoints: ['核查管理制度完备性', '检查操作规程可执行性', '验证制度落地情况'], cooperation: ['个人信息保护制度', '操作规程文档', '执行记录'] },
  { id: 'c5', fileId: 'f3', category: '数据安全', item: '数据分类分级', requirement: '各行业主管部门是否制定本行业本领域的数据分类分级制度或标准规范', method: '1.登陆系统验证 2.材料检查 3.现场询问', keyPoints: ['了解行业分类分级要求', '核查本机构制度制定情况', '检查执行落实情况'], cooperation: ['行业分类分级标准', '本机构分类分级制度', '数据资产台账'] },
  { id: 'c6', fileId: 'f1', category: '数据安全', item: '关键操作审批机制', requirement: '信息系统重大数据操作是否落实审批、监控、审计等安全管理要求', method: '1.登陆系统验证 2.材料检查 3.现场询问', autoCheck: false, keyPoints: ['了解数据类型和数量', '检查操作权限配置', '核对审批流程', '查验审计日志'], cooperation: ['系统清单', '账号权限表', '重大数据操作记录', '系统日志'] },
  { id: 'c7', fileId: 'f2', category: '数据安全', item: '数据资产管理', requirement: '是否建立全量数据资产台账，实施数据分类分级管理', method: '1.登陆系统验证 2.材料检查 3.现场询问', keyPoints: ['核查数据资产台账完整性', '检查接口清单', '验证分类分级标识'], cooperation: ['数据资产台账', '个人用户数据资产台账', '接口台账'] },
  { id: 'c8', fileId: 'f2', category: '数据安全', item: '数据安全制度建设', requirement: '是否对数据处理活动定期开展风险监测', method: '1.登陆系统验证 2.材料检查 3.现场询问', keyPoints: ['检查监测机制建立情况', '核查监测频率和范围', '查验风险处置记录'], cooperation: ['风险监测制度', '监测记录', '处置台账'] },
  { id: 'c9', fileId: 'f3', category: '数据安全', item: '数据分类分级', requirement: '是否对重要数据进行识别和备案', method: '1.登陆系统验证 2.材料检查 3.现场询问', keyPoints: ['核查重要数据目录', '检查备案材料', '验证更新机制'], cooperation: ['重要数据目录', '备案证明材料'] },
  { id: 'c10', fileId: 'f2', category: '应急管理', item: '异常工号风险管理', requirement: '是否建立数据安全事件应急处置机制', method: '1.登陆系统验证 2.材料检查 3.现场询问', keyPoints: ['检查应急预案', '核查演练记录', '验证联动机制'], cooperation: ['应急预案', '演练记录', '应急演练材料'] },
  { id: 'c11', fileId: 'f1', category: '数据安全', item: '数据安全组织体系', requirement: '是否定期组织开展数据安全教育培训', method: '1.登陆系统验证 2.材料检查 3.现场询问', autoCheck: true, keyPoints: ['核查培训计划', '检查培训记录', '验证考核情况'], cooperation: ['培训计划', '培训记录', '考核材料'] },
  { id: 'c12', fileId: 'f3', category: '数据安全', item: '数据分类分级', requirement: '是否落实数据安全技术防护措施', method: '1.登陆系统验证 2.材料检查 3.现场询问', keyPoints: ['核查技术防护部署', '检查访问控制配置', '查验加密措施'], cooperation: ['技术防护清单', '配置文档', '审计日志'] },
];

// 单位列表（省公司创建任务时下发给各单位）
let units = [
  { id: 'u0', name: '省公司' },
  { id: 'u1', name: 'A市分公司' },
  { id: 'u2', name: 'B市分公司' },
  { id: 'u3', name: 'C市分公司' },
];
let currentUnitId = 'u0'; // 当前登录单位，u0=省公司

const ASSET_OPTIONS = ['OA系统', '财务系统', 'HR系统', '安全管控平台'];
let tasks = [
  { id: 't1', name: 'OA系统等保自查', startTime: '2026-03-01 09:00', endTime: '2026-03-02 18:00', deadline: '2026-03-02 18:00', itemCount: 5, itemIds: ['c1','c2','c3','c6','c11'], progress: 100, creator: '张三', status: 'done', result: '通过', remark: '', attachments: ['检查记录.pdf'], reportUrl: '#report1', assignments: [{ id: 'a1', unitId: 'u1', unitName: 'A市分公司', asset: 'OA系统' }, { id: 'a2', unitId: 'u2', unitName: 'B市分公司', asset: 'OA系统' }] },
  { id: 't2', name: '财务系统合规检查', startTime: '2026-03-02 10:00', endTime: '-', deadline: '2026-03-15 18:00', itemCount: 8, itemIds: ['c2','c3','c4','c7','c8','c10','c11','c12'], progress: 60, creator: '李四', status: 'running', result: '', remark: '', attachments: [], reportUrl: '', assignments: [{ id: 'a3', unitId: 'u1', unitName: 'A市分公司', asset: '财务系统' }, { id: 'a4', unitId: 'u2', unitName: 'B市分公司', asset: '' }, { id: 'a5', unitId: 'u3', unitName: 'C市分公司', asset: '' }] },
  { id: 't4', name: '安全管控平台季度合规检查（进行中）', startTime: '2026-03-20 09:00', endTime: '-', deadline: '2026-04-30 18:00', itemCount: 6, itemIds: ['c1','c2','c3','c6','c10','c11'], progress: 20, creator: '省公司-赵六', status: 'running', result: '', remark: '季度例行检查（Demo Mock）', attachments: [], reportUrl: '', assignments: [{ id: 'a7', unitId: 'u1', unitName: 'A市分公司', asset: '' }, { id: 'a8', unitId: 'u2', unitName: 'B市分公司', asset: '' }, { id: 'a9', unitId: 'u3', unitName: 'C市分公司', asset: '' }] },
  { id: 't3', name: 'HR系统等保预检', startTime: '2026-02-28 14:00', endTime: '2026-02-29 17:00', deadline: '2026-02-29 17:00', itemCount: 3, itemIds: ['c1','c5','c9'], progress: 0, creator: '王五', status: 'stopped', result: '', remark: '', attachments: [], reportUrl: '', assignments: [{ id: 'a6', unitId: 'u1', unitName: 'A市分公司', asset: '' }] },
];
let taskCheckResults = {}; // 兼容旧任务：{ taskId: { itemId: {...} } }
// 单位检查结果（支持多次上传）：{ assignmentId: [{ uploadTime, results: { itemId: {...} } }] }
let unitCheckResults = {
  a1: [{ uploadTime: '2026-03-02 10:30', asset: 'OA系统', period: '2026-03', results: { c1: { result: 'pass', score: '10', suggestion: '', remark: '', attachments: [] }, c2: { result: 'pass', score: '10', suggestion: '', remark: '', attachments: [] }, c3: { result: 'fail', score: '5', suggestion: '需完善制度', remark: '', attachments: ['整改材料.pdf'] } } }],
  a3: [{ uploadTime: '2026-03-03 09:00', asset: '财务系统', period: '2026-03', results: { c2: { result: 'pass', score: '10', suggestion: '', remark: '', attachments: [] } } }, { uploadTime: '2026-03-03 14:20', asset: '财务系统', period: '2026-03', results: { c2: { result: 'pass' }, c3: { result: 'fail', suggestion: '待整改' } } }],
  // Demo：进行中任务 t4，A市分公司(a7) 已上传一次检查结果
  a7: [{
    uploadTime: '2026-03-25 15:30',
    asset: '安全管控平台',
    period: '2026-03',
    reviewStatus: 'returned',
    reviewedAt: '2026-03-26 10:00',
    reviewedBy: '省公司审核员',
    results: {
      c1: { result: 'pass', score: '10', remark: '组织体系健全', attachments: [] },
      c2: { result: 'pass', score: '9', remark: '已明确责任制', attachments: [] },
      c3: {
        result: 'fail', score: '6', suggestion: '需补充重大事件问责材料', remark: '', attachments: ['重大事件问责记录.pdf'],
        reviewComment: '请补充盖章版问责说明，并附现场照片。',
        reviewAttachments: ['审核批注-截图1.png', '补充材料模板.docx']
      },
      c6: { result: 'pass', score: '10', remark: '审批与审计日志齐全', attachments: [] }
    }
  }],
};
let currentInspectTaskId = null;
let currentInspectAssignmentId = null;
let pendingExecuteTaskId = null;
let pendingExecuteAssignmentId = null;
let inspectSelectedItem = null;
let inspectUploadItemId = null;
let INSPECT_PAGE_SIZE = 10;
let inspectCurrentPage = 1;
const LOCAL_METRIC_DEFAULTS = [
  '资产信息泄漏检查', '等保备案', '等保评测', '基线检查', '代码审计', '威胁情报', '安全服务'
];
let opsMetricsByDate = {};
let currentOpsDate = '';
let currentOpsFilteredKeyword = '';

// ============ 渲染 ============
function renderComplianceGrid() {
  const el = document.getElementById('complianceGrid');
  el.innerHTML = complianceFiles.map(f => `
    <div class="grid-card" data-id="${f.id}">
      <div class="icon">📄</div>
      <div class="title">${f.name}</div>
      <div class="meta">${f.uploadTime} · ${f.size}</div>
      ${f.complianceType ? `<div class="card-info"><span class="label">合规类型：</span>${f.complianceType}</div>` : ''}
      ${f.publishUnit ? `<div class="card-info"><span class="label">发布单位：</span>${f.publishUnit}</div>` : ''}
      ${f.remark ? `<div class="card-info card-remark"><span class="label">备注：</span>${f.remark}</div>` : ''}
    </div>
  `).join('');
  el.querySelectorAll('.grid-card').forEach(card => {
    card.addEventListener('click', () => openFileContentView(card.dataset.id));
  });
}

let ITEMS_PAGE_SIZE = 20;
let itemsCurrentPage = 1;
let itemsSelectedFileId = null;

function getFilteredItems() {
  const categoryVal = document.getElementById('searchCategory')?.value || '';
  const itemVal = document.getElementById('searchItem')?.value || '';
  const reqVal = (document.getElementById('searchRequirement')?.value || '').trim().toLowerCase();
  const methodVal = document.getElementById('searchMethod')?.value || '';
  return checkItems.filter(i => {
    if (itemsSelectedFileId && i.fileId !== itemsSelectedFileId) return false;
    if (categoryVal && i.category !== categoryVal) return false;
    if (itemVal && i.item !== itemVal) return false;
    if (reqVal && !i.requirement.toLowerCase().includes(reqVal)) return false;
    if (methodVal && !i.method.includes(methodVal)) return false;
    return true;
  });
}

function renderItemsFileList() {
  const el = document.getElementById('itemsFileList');
  if (!el) return;
  el.innerHTML = '<li class="file-list-item active" data-file-id="">全部</li>' +
    complianceFiles.map(f => `
      <li class="file-list-item" data-file-id="${f.id}">
        <span class="file-list-icon">📄</span>
        <span class="file-list-name" title="${f.name}">${f.name}</span>
      </li>
    `).join('');
  el.querySelectorAll('.file-list-item').forEach(li => {
    li.addEventListener('click', () => {
      itemsSelectedFileId = li.dataset.fileId || null;
      el.querySelectorAll('.file-list-item').forEach(i => i.classList.remove('active'));
      li.classList.add('active');
      itemsCurrentPage = 1;
      renderCheckItems();
    });
  });
}

function renderCheckItems() {
  const itemsFiltered = getFilteredItems();
  const total = itemsFiltered.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PAGE_SIZE));
  itemsCurrentPage = Math.min(itemsCurrentPage, totalPages);
  const start = (itemsCurrentPage - 1) * ITEMS_PAGE_SIZE;
  const pageData = itemsFiltered.slice(start, start + ITEMS_PAGE_SIZE);

  const tbody = document.getElementById('itemsTableBody');
  tbody.innerHTML = pageData.map(i => {
    const file = i.fileId ? complianceFiles.find(f => f.id === i.fileId) : null;
    const fileName = file ? file.name : '-';
    const autoText = i.autoCheck ? '是' : '否';
    return `
    <tr>
      <td>${i.category || '-'}</td>
      <td>${i.item || '-'}</td>
      <td class="cell-requirement">${i.requirement || '-'}</td>
      <td>${i.method || '-'}</td>
      <td>${fileName}</td>
      <td>${autoText}</td>
      <td><a href="#" class="link-detail" data-id="${i.id}">详情</a></td>
    </tr>
  `;
  }).join('');

  tbody.querySelectorAll('.link-detail').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); openItemDetailModal(a.dataset.id); });
  });

  renderItemsPagination(total, totalPages);
}

function renderItemsPagination(total, totalPages) {
  const el = document.getElementById('itemsPagination');
  if (!el) return;
  const start = (itemsCurrentPage - 1) * ITEMS_PAGE_SIZE + 1;
  const end = Math.min(itemsCurrentPage * ITEMS_PAGE_SIZE, total);
  el.innerHTML = `
    <div class="pagination-info">共${totalPages}页 / ${total}条数据</div>
    <div class="pagination-nav">
      <button class="btn btn-sm" data-page="1" ${itemsCurrentPage <= 1 ? 'disabled' : ''}>&lt;&lt;</button>
      <button class="btn btn-sm" data-page="${itemsCurrentPage - 1}" ${itemsCurrentPage <= 1 ? 'disabled' : ''}>&lt;</button>
      ${Array.from({ length: Math.min(6, totalPages) }, (_, k) => {
        let p = itemsCurrentPage <= 3 ? k + 1 : Math.max(1, itemsCurrentPage - 2 + k);
        if (p > totalPages) return '';
        return `<button class="btn btn-sm ${p === itemsCurrentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
      }).join('')}
      <button class="btn btn-sm" data-page="${itemsCurrentPage + 1}" ${itemsCurrentPage >= totalPages ? 'disabled' : ''}>&gt;</button>
      <button class="btn btn-sm" data-page="${totalPages}" ${itemsCurrentPage >= totalPages ? 'disabled' : ''}>&gt;&gt;</button>
    </div>
    <select class="page-size-select" id="itemsPageSize">
      <option value="20" ${ITEMS_PAGE_SIZE === 20 ? 'selected' : ''}>20条/页</option>
      <option value="50" ${ITEMS_PAGE_SIZE === 50 ? 'selected' : ''}>50条/页</option>
      <option value="100" ${ITEMS_PAGE_SIZE === 100 ? 'selected' : ''}>100条/页</option>
    </select>
    <div class="page-go"><span>前往</span><input type="number" min="1" max="${totalPages}" value="${itemsCurrentPage}" id="itemsGoPage"><span>页</span><button class="btn btn-sm" id="itemsGoBtn">跳转</button></div>
  `;
  el.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => { itemsCurrentPage = +btn.dataset.page; renderCheckItems(); });
  });
  el.querySelector('#itemsGoBtn')?.addEventListener('click', () => {
    const v = parseInt(document.getElementById('itemsGoPage')?.value, 10);
    if (v >= 1 && v <= totalPages) { itemsCurrentPage = v; renderCheckItems(); }
  });
  el.querySelector('#itemsPageSize')?.addEventListener('change', (e) => {
    ITEMS_PAGE_SIZE = parseInt(e.target.value, 10);
    itemsCurrentPage = 1;
    renderCheckItems();
  });
}

function openItemDetailModal(itemId) {
  const item = checkItems.find(i => i.id === itemId);
  if (!item) return;
  const file = item.fileId ? complianceFiles.find(f => f.id === item.fileId) : null;
  const fileName = file ? file.name : '-';
  const keyPointsHtml = (item.keyPoints && item.keyPoints.length) ? `<ul>${item.keyPoints.map(k => `<li>${k}</li>`).join('')}</ul>` : '<p>-</p>';
  const cooperationHtml = (item.cooperation && item.cooperation.length) ? `<ul>${item.cooperation.map(c => `<li>${c}</li>`).join('')}</ul>` : '<p>-</p>';
  document.getElementById('itemDetailContent').innerHTML = `
    <div class="detail-section">
      <h4>合规文件</h4>
      <p>${fileName}</p>
      <h4>检查要点</h4>
      ${keyPointsHtml}
      <h4>需要被检查单位配合事项</h4>
      ${cooperationHtml}
    </div>
  `;
  document.getElementById('itemDetailModal').classList.add('show');
}

function initItemsSearchOptions() {
  const categories = [...new Set(checkItems.map(i => i.category))].filter(Boolean).sort();
  const items = [...new Set(checkItems.map(i => i.item))].filter(Boolean).sort();
  const methods = [...new Set(checkItems.map(i => i.method))].filter(Boolean).sort();

  const categorySelect = document.getElementById('searchCategory');
  const itemSelect = document.getElementById('searchItem');
  const methodSelect = document.getElementById('searchMethod');
  if (categorySelect) {
    categorySelect.innerHTML = '<option value="">请选择</option>' + categories.map(c => `<option value="${c}">${c}</option>`).join('');
  }
  if (itemSelect) {
    itemSelect.innerHTML = '<option value="">请选择</option>' + items.map(i => `<option value="${i}">${i}</option>`).join('');
  }
  if (methodSelect) {
    methodSelect.innerHTML = '<option value="">请选择</option>' + methods.map(m => `<option value="${m}">${m}</option>`).join('');
  }
}

// ============ 检查项导入 ============
function openManualImportModal() {
  const select = document.querySelector('#manualImportForm select[name="fileId"]');
  if (select) {
    select.innerHTML = '<option value="">请选择</option>' + complianceFiles.map(f => `<option value="${f.id}">${f.name}</option>`).join('');
  }
  document.getElementById('manualImportForm')?.reset();
  document.getElementById('manualImportModal').classList.add('show');
}

function parseTextLines(val) {
  if (!val || typeof val !== 'string') return [];
  return val.split(/[\n;；]/).map(s => s.trim()).filter(Boolean);
}

function addCheckItem(item) {
  const id = 'c' + (Date.now() % 100000 + Math.floor(Math.random() * 1000));
  checkItems.push({ id, autoCheck: !!item.autoCheck, ...item });
}

document.getElementById('manualImportItem')?.addEventListener('click', openManualImportModal);
document.getElementById('openImportModal')?.addEventListener('click', () => {
  document.getElementById('excelImportInput').value = '';
  document.getElementById('excelImportModal').classList.add('show');
});
document.getElementById('manualImportForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const keyPoints = parseTextLines(fd.get('keyPoints'));
  const cooperation = parseTextLines(fd.get('cooperation'));
  addCheckItem({
    fileId: fd.get('fileId') || null,
    category: fd.get('category') || '',
    item: fd.get('item') || '',
    requirement: fd.get('requirement') || '',
    method: fd.get('method') || '',
    keyPoints,
    cooperation
  });
  document.getElementById('manualImportModal').classList.remove('show');
  initItemsSearchOptions();
  renderCheckItems();
  renderItemsFileList();
  alert('新建成功！');
});

document.getElementById('downloadExcelTemplate')?.addEventListener('click', (e) => {
  e.preventDefault();
  if (typeof XLSX === 'undefined') { alert('xlsx 库未加载'); return; }
  const headers = ['检查类别', '检查事项', '检查要求', '检查方式', '合规文件', '检查要点', '需要被检查单位配合事项'];
  const example = ['数据安全', '数据安全制度建设', '是否建立网络安全责任制', '1.登陆系统验证 2.材料检查', '信息安全等级保护基本要求.pdf', '核查责任制文件;检查责任落实', '网络安全责任制制度;责任落实台账'];
  const ws = XLSX.utils.aoa_to_sheet([headers, example]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '检查项');
  XLSX.writeFile(wb, '检查项导入模板.xlsx');
});

document.getElementById('excelImportInput')?.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = new Uint8Array(ev.target.result);
      const workbook = typeof XLSX !== 'undefined' ? XLSX.read(data, { type: 'array' }) : null;
      if (!workbook) { alert('请确保已加载 xlsx 库'); e.target.value = ''; return; }
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
      if (!rows.length) { alert('Excel 文件为空'); e.target.value = ''; return; }
      const headers = rows[0].map(h => String(h || '').trim());
      const col = (names) => {
        const arr = Array.isArray(names) ? names : [names];
        for (const n of arr) {
          const i = headers.findIndex(h => String(h || '').includes(n));
          if (i >= 0) return i;
        }
        return -1;
      };
      const idxCategory = col(['检查类别', '类别']);
      const idxItem = col(['检查事项', '事项']);
      const idxReq = col(['检查要求', '要求']);
      const idxMethod = col(['检查方式', '方式']);
      const idxFile = col(['合规文件', '所属合规文件', '文件']);
      const idxKeyPoints = col(['检查要点', '要点']);
      const idxCoop = Math.max(col(['需要配合', '需要被检查单位配合事项', '配合事项']), headers.findIndex(h => /配合/.test(String(h || ''))));
      let count = 0;
      for (let r = 1; r < rows.length; r++) {
        const row = rows[r] || [];
        const get = (i) => (i >= 0 && row[i] != null ? String(row[i]).trim() : '');
        const category = get(idxCategory);
        const item = get(idxItem);
        const requirement = get(idxReq);
        if (!category && !item && !requirement) continue;
        const fileId = idxFile >= 0 ? (complianceFiles.find(f => f.name === get(idxFile))?.id || null) : null;
        const keyPoints = parseTextLines(get(idxKeyPoints));
        const cooperation = parseTextLines(get(idxCoop));
        addCheckItem({
          fileId,
          category: category || '其他',
          item: item || '-',
          requirement: requirement || '-',
          method: get(idxMethod) || '',
        autoCheck: false,
          keyPoints,
          cooperation
        });
        count++;
      }
      e.target.value = '';
      document.getElementById('excelImportModal').classList.remove('show');
      initItemsSearchOptions();
      renderCheckItems();
      renderItemsFileList();
      alert(`导入成功，共 ${count} 条检查项`);
    } catch (err) {
      console.error(err);
      alert('Excel 解析失败：' + (err.message || '未知错误'));
      e.target.value = '';
    }
  };
  reader.readAsArrayBuffer(file);
});

function getDisplayAsset(task) {
  if (!task) return '-';
  if (currentInspectAssignmentId) {
    const a = (task.assignments || []).find(x => x.id === currentInspectAssignmentId);
    return a?.asset || '待选择';
  }
  if (currentUnitId !== 'u0') {
    const a = (task.assignments || []).find(x => x.unitId === currentUnitId);
    return a?.asset || '待选择';
  }
  return '各分公司自选';
}

function getTasksForCurrentUnit() {
  if (currentUnitId === 'u0') return tasks;
  return tasks.filter(t => (t.assignments || []).some(a => a.unitId === currentUnitId));
}

/** 是否已过截止时间 */
function isTaskDeadlinePassed(task) {
  if (!task?.deadline) return false;
  const d = new Date(task.deadline.replace(' ', 'T'));
  return !isNaN(d.getTime()) && new Date() > d;
}

/** 检查并自动结束已过截止时间的任务 */
function checkAndExpireTasks() {
  tasks.forEach(t => {
    if (t.status === 'running' && isTaskDeadlinePassed(t)) {
      t.status = 'stopped';
      t.endTime = t.endTime === '-' ? t.deadline : t.endTime;
    }
  });
}

/** 格式化截止时间显示 */
function formatDeadline(val) {
  if (!val) return '-';
  const d = new Date(val.replace ? val.replace(' ', 'T') : val);
  return isNaN(d.getTime()) ? val : d.toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-').slice(0, 16);
}

/** 分公司视角：当前单位最近一次上传是否被省公司退回 */
function isCurrentUnitLastUploadReturned(task) {
  if (currentUnitId === 'u0' || !task || task.status !== 'running') return false;
  const assign = (task.assignments || []).find(a => a.unitId === currentUnitId);
  if (!assign) return false;
  const uploads = unitCheckResults[assign.id] || [];
  const last = uploads.slice(-1)[0];
  return last?.reviewStatus === 'returned';
}

function renderTasks() {
  checkAndExpireTasks();
  const list = getTasksForCurrentUnit();
  const tbody = document.getElementById('tasksTableBody');
  tbody.innerHTML = list.map(t => {
    const returnedToBranch = isCurrentUnitLastUploadReturned(t);
    let statusCls = t.status === 'done' ? 'done' : t.status === 'running' ? 'running' : 'stopped';
    let statusText = t.status === 'done' ? '已完成' : t.status === 'running' ? '检查中' : '已停止';
    if (returnedToBranch) {
      statusText = '检查中-退回';
      statusCls = 'running returned';
    }
    const deadlineDisplay = formatDeadline(t.deadline);
    const assignList = (t.assignments || []).map(a => a.unitName).join('、') || '-';
    const deadlinePassed = isTaskDeadlinePassed(t);
    const canExecute = t.status === 'running' && !deadlinePassed && currentUnitId !== 'u0' && (t.assignments || []).some(a => a.unitId === currentUnitId);
    const canDownload = t.status === 'done';
    const canVerify = currentUnitId === 'u0' && (t.assignments || []).length > 0;
    const canEndTask = t.status === 'running' && currentUnitId === 'u0';
    const canCopy = currentUnitId === 'u0';
    return `
    <tr>
      <td>${t.name}</td>
      <td><span class="unit-tags">${assignList}</span></td>
      <td>${t.startTime}</td>
      <td>${deadlineDisplay}</td>
      <td>${t.itemCount}项</td>
      <td>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${t.progress}%"></div>
        </div>
      </td>
      <td>${t.creator}</td>
      <td><span class="status ${statusCls}">${statusText}</span></td>
      <td>
        ${canExecute ? `<button class="btn btn-primary btn-sm" data-action="execute" data-id="${t.id}">执行检查</button>` : ''}
        ${canVerify ? `<button class="btn btn-primary btn-sm" data-action="verify" data-id="${t.id}">查看结果</button>` : ''}
        ${canEndTask ? `<button class="btn btn-secondary btn-sm" data-action="endTask" data-id="${t.id}">结束任务</button>` : ''}
        ${canCopy ? `<button class="btn btn-secondary btn-sm" data-action="copy" data-id="${t.id}">复制</button>` : ''}
        ${canDownload ? `<button class="btn btn-primary btn-sm" data-action="download" data-id="${t.id}">下载报告</button>` : ''}
        ${t.status !== 'running' ? `<button class="btn btn-secondary btn-sm" data-action="detail" data-id="${t.id}">检查详情</button>` : ''}
        <button class="btn btn-danger btn-sm" data-action="delete" data-id="${t.id}">删除</button>
      </td>
    </tr>
  `;
  }).join('');

  tbody.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => handleTaskAction(btn.dataset.action, btn.dataset.id));
  });
}

// ============ 侧边目录切换 ============
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    item.classList.add('active');
    document.getElementById(item.dataset.tab).classList.add('active');
  });
});

// ============ 合规库 - 文件内容查看（页面内视图，按图示样式） ============
let currentFileViewId = null;

function openFileContentView(fileId) {
  const file = complianceFiles.find(f => f.id === fileId);
  if (!file) return;
  currentFileViewId = fileId;
  document.getElementById('complianceGridView').classList.add('hidden');
  document.getElementById('fileContentView').classList.remove('hidden');
  document.getElementById('fileViewName').textContent = file.name;
  document.getElementById('fileViewUploader').textContent = file.uploader || '未知';
  document.getElementById('fileViewUploadTime').textContent = file.uploadTime || '-';
  document.getElementById('fileViewDoc').textContent = file.content || '（无内容）';
}

function closeFileContentView() {
  currentFileViewId = null;
  document.getElementById('complianceGridView').classList.remove('hidden');
  document.getElementById('fileContentView').classList.add('hidden');
  renderComplianceGrid();
}

function downloadComplianceFile(fileId) {
  const file = complianceFiles.find(f => f.id === fileId);
  if (!file) return;
  alert(`正在下载：${file.name}\n（Demo 环境下为模拟下载）`);
}

document.getElementById('backToComplianceGrid')?.addEventListener('click', closeFileContentView);
document.getElementById('fileViewDownload')?.addEventListener('click', () => {
  if (currentFileViewId) downloadComplianceFile(currentFileViewId);
});

// ============ 上传文件 ============
document.getElementById('uploadFile').addEventListener('click', () => {
  document.getElementById('uploadFileForm').reset();
  document.getElementById('uploadFileModal').classList.add('show');
});
document.getElementById('uploadFileForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const fileInput = form.querySelector('input[name="file"]');
  const file = fileInput.files?.[0];
  if (!file) return;
  const fd = new FormData(form);
  const id = 'f' + (Date.now() % 10000);
  const uploadTime = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
  complianceFiles.push({
    id, name: file.name, uploadTime, size: (file.size / 1024).toFixed(1) + 'KB',
    complianceType: fd.get('complianceType') || '', publishUnit: fd.get('publishUnit') || '', remark: fd.get('remark') || '',
    uploader: '超级管理员', content: '（新上传文件，拆分检查项后可查看）'
  });
  renderComplianceGrid();
  renderItemsFileList();
  document.getElementById('uploadFileModal').classList.remove('show');
  form.reset();
  alert('文件上传成功！请到「检查项管理」拆分检查项。');
});

// ============ 新建检查任务 ============
function openNewTaskModal(copyFromTask) {
  const fileContainer = document.getElementById('complianceFileOptions');
  const unitContainer = document.getElementById('unitOptions');
  fileContainer.innerHTML = complianceFiles.map(f => `
    <label><input type="checkbox" name="complianceFile" value="${f.id}"> ${f.name}</label>
  `).join('');
  if (unitContainer) {
    unitContainer.innerHTML = units.filter(u => u.id !== 'u0').map(u => `
      <label><input type="checkbox" name="assignUnit" value="${u.id}" data-name="${u.name}"> ${u.name}</label>
    `).join('');
  }
  renderTaskCheckItemOptions();
  document.getElementById('newTaskForm').reset();
  document.getElementById('taskItemSearch').value = '';
  const days = 7;
  const defaultDeadline = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  document.querySelector('input[name="deadline"]').value = defaultDeadline.toISOString().slice(0, 16);
  document.querySelector('input[name="scopeType"][value="file"]').checked = true;
  document.getElementById('scopeFileBlock').classList.remove('hidden');
  document.getElementById('scopeItemBlock').classList.add('hidden');
  if (copyFromTask) {
    document.querySelector('input[name="taskName"]').value = (copyFromTask.name || '') + ' 副本';
    document.querySelector('input[name="scopeType"][value="item"]').checked = true;
    document.getElementById('scopeFileBlock').classList.add('hidden');
    document.getElementById('scopeItemBlock').classList.remove('hidden');
    renderTaskCheckItemOptions();
    setTimeout(() => {
      (copyFromTask.itemIds || []).forEach(id => {
        const cb = document.querySelector(`input[name="checkItem"][value="${id}"]`);
        if (cb) cb.checked = true;
      });
      (copyFromTask.assignments || []).forEach(a => {
        const cb = document.querySelector(`input[name="assignUnit"][value="${a.unitId}"]`);
        if (cb) cb.checked = true;
      });
    }, 0);
  }
  document.getElementById('newTaskModal').classList.add('show');
}

function openCopyTaskModal(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  openNewTaskModal(task);
}

function renderTaskCheckItemOptions(searchVal) {
  const container = document.getElementById('checkItemOptions');
  if (!container) return;
  const kw = (searchVal || document.getElementById('taskItemSearch')?.value || '').trim().toLowerCase();
  const filtered = checkItems.filter(i => {
    if (!kw) return true;
    const file = i.fileId ? complianceFiles.find(f => f.id === i.fileId) : null;
    const fileName = file ? file.name : '';
    return (i.requirement && i.requirement.toLowerCase().includes(kw)) ||
      (i.item && i.item.toLowerCase().includes(kw)) ||
      (i.category && i.category.toLowerCase().includes(kw)) ||
      (fileName && fileName.toLowerCase().includes(kw));
  });
  container.innerHTML = filtered.map(i => {
    const file = i.fileId ? complianceFiles.find(f => f.id === i.fileId) : null;
    const fileName = file ? file.name : '-';
    return `<label class="task-item-row">
      <input type="checkbox" name="checkItem" value="${i.id}">
      <span class="task-item-main">${i.requirement}（${i.item}）</span>
      <span class="task-item-file">所属合规文件：${fileName}</span>
    </label>`;
  }).join('');
}

function setupTaskScopeSwitch() {
  document.querySelectorAll('input[name="scopeType"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const isFile = radio.value === 'file';
      document.getElementById('scopeFileBlock').classList.toggle('hidden', !isFile);
      document.getElementById('scopeItemBlock').classList.toggle('hidden', isFile);
      if (isFile) document.querySelectorAll('input[name="checkItem"]').forEach(c => c.checked = false);
      else {
        document.querySelectorAll('input[name="complianceFile"]').forEach(c => c.checked = false);
        renderTaskCheckItemOptions();
      }
    });
  });
  document.getElementById('taskItemSearch')?.addEventListener('input', () => renderTaskCheckItemOptions());
}

function getSelectedTaskItemIds() {
  const scopeType = document.querySelector('input[name="scopeType"]:checked')?.value || 'file';
  if (scopeType === 'file') {
    const selectedFiles = [...document.querySelectorAll('input[name="complianceFile"]:checked')].map(c => c.value);
    return checkItems.filter(i => i.fileId && selectedFiles.includes(i.fileId)).map(i => i.id);
  } else {
    return [...document.querySelectorAll('input[name="checkItem"]:checked')].map(c => c.value);
  }
}

document.getElementById('newTask').addEventListener('click', openNewTaskModal);
document.getElementById('newTaskForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const scopeType = document.querySelector('input[name="scopeType"]:checked')?.value || 'file';
  const selectedIds = getSelectedTaskItemIds();
  const selectedFiles = scopeType === 'file' ? [...document.querySelectorAll('input[name="complianceFile"]:checked')].map(c => c.value) : [];
  const selectedItems = scopeType === 'item' ? [...document.querySelectorAll('input[name="checkItem"]:checked')].map(c => c.value) : [];
  const hasSelection = scopeType === 'file' ? selectedFiles.length > 0 : selectedItems.length > 0;
  if (!hasSelection) {
    alert(scopeType === 'file' ? '请至少选择一个合规文件' : '请至少选择一个检查项');
    return;
  }
  const assignUnits = [...document.querySelectorAll('input[name="assignUnit"]:checked')];
  if (!assignUnits.length) {
    alert('请至少选择一个下发单位');
    return;
  }
  const deadlineVal = fd.get('deadline');
  if (!deadlineVal) {
    alert('请设置任务截止时间');
    return;
  }
  const deadlineDate = new Date(deadlineVal);
  if (deadlineDate <= new Date()) {
    alert('截止时间必须晚于当前时间');
    return;
  }
  const deadlineStr = deadlineDate.getFullYear() + '-' + String(deadlineDate.getMonth() + 1).padStart(2, '0') + '-' + String(deadlineDate.getDate()).padStart(2, '0') + ' ' + String(deadlineDate.getHours()).padStart(2, '0') + ':' + String(deadlineDate.getMinutes()).padStart(2, '0');
  const id = 't' + (Date.now() % 10000);
  const itemCount = selectedIds.length || 1;
  const assignments = assignUnits.map((c, i) => ({ id: 'a' + (Date.now() + i) % 100000, unitId: c.value, unitName: c.dataset.name, asset: '' }));
  tasks.unshift({
    id, name: fd.get('taskName'), startTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'), endTime: '-', deadline: deadlineStr, itemCount, itemIds: selectedIds, progress: 0, creator: '当前用户', status: 'running', result: '', remark: '', attachments: [], reportUrl: '', assignments
  });
  renderTasks();
  document.getElementById('newTaskModal').classList.remove('show');
  alert('任务创建成功，已下发给 ' + assignments.map(a => a.unitName).join('、'));
});

document.getElementById('confirmSelectAsset')?.addEventListener('click', () => {
  const assets = [...document.querySelectorAll('#selectAssetList input[type="checkbox"]:checked')].map(c => c.value);
  if (!assets.length) { alert('请选择资产'); return; }
  const taskId = pendingExecuteTaskId || currentInspectTaskId;
  const assignmentId = pendingExecuteAssignmentId || currentInspectAssignmentId;
  const task = tasks.find(t => t.id === taskId);
  const assignment = task?.assignments?.find(a => a.id === assignmentId);
  if (assignment) {
    assignment.assets = assets;
    assignment.asset = assets.join('、');
  }
  document.getElementById('selectAssetModal').classList.remove('show');
  if (pendingExecuteTaskId) {
    openInspectView(pendingExecuteTaskId, pendingExecuteAssignmentId);
    pendingExecuteTaskId = null;
    pendingExecuteAssignmentId = null;
    renderTasks();
  } else {
    renderInspectTaskDetail();
  }
});

document.getElementById('changeAssetBtn')?.addEventListener('click', () => {
  const task = tasks.find(t => t.id === currentInspectTaskId);
  const assignment = task?.assignments?.find(a => a.id === currentInspectAssignmentId);
  if (!assignment) return;
  fillSelectAssetModal(assignment.assets || (assignment.asset ? assignment.asset.split('、').filter(Boolean) : []));
  pendingExecuteTaskId = null;
  pendingExecuteAssignmentId = null;
  document.getElementById('selectAssetModal').classList.add('show');
});

function fillSelectAssetModal(selectedAssets) {
  const el = document.getElementById('selectAssetList');
  if (!el) return;
  const set = new Set((selectedAssets || []).map(s => String(s)));
  el.innerHTML = ASSET_OPTIONS.map(a => {
    const checked = set.has(a) ? 'checked' : '';
    return `<label><input type="checkbox" value="${a}" ${checked}> ${a}</label>`;
  }).join('');
}

// ============ 执行检查 ============
function openExecuteModal(taskId) {
  document.querySelector('#executeForm input[name="taskId"]').value = taskId;
  document.getElementById('executeForm').reset();
  document.querySelector('#executeForm input[name="taskId"]').value = taskId;
  document.getElementById('executeModal').classList.add('show');
}

document.getElementById('executeForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const taskId = e.target.querySelector('input[name="taskId"]').value;
  const fd = new FormData(e.target);
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  const files = e.target.querySelector('input[name="attachment"]').files;
  const attNames = files.length ? [...files].map(f => f.name) : [];
  task.status = 'done';
  task.progress = 100;
  task.endTime = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
  task.result = fd.get('result');
  task.remark = fd.get('remark') || '';
  task.attachments = [...(task.attachments || []), ...attNames];
  task.reportUrl = '#report-' + taskId;
  renderTasks();
  document.getElementById('executeModal').classList.remove('show');
  alert('检查已完成！可下载报告或查看详情。');
});

// ============ 检查详情（页面内视图，只读，支持返回任务列表） ============
let detailViewTaskId = null;
let detailViewSelectedItem = null;

// ============ 核实结果视图（省公司） ============
let verifyViewTaskId = null;
let verifySelectedAssignmentId = null;
let verifySelectedUploadIndex = null;
let verifyFilteredUploads = []; // 当前筛选后的上传列表（按时期）

function openVerifyView(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task || !task.assignments?.length) return;
  verifyViewTaskId = taskId;
  verifySelectedAssignmentId = task.assignments[0].id;
  const uploads = unitCheckResults[verifySelectedAssignmentId] || [];
  verifySelectedUploadIndex = uploads.length ? 0 : null;
  document.getElementById('taskListView').classList.add('hidden');
  document.getElementById('inspectView').classList.add('hidden');
  document.getElementById('detailView').classList.add('hidden');
  document.getElementById('verifyView').classList.remove('hidden');
  renderVerifyView();
}

function closeVerifyView() {
  verifyViewTaskId = null;
  verifySelectedAssignmentId = null;
  verifySelectedUploadIndex = null;
  document.getElementById('taskListView').classList.remove('hidden');
  document.getElementById('inspectView').classList.add('hidden');
  document.getElementById('detailView').classList.add('hidden');
  document.getElementById('verifyView').classList.add('hidden');
  renderTasks();
}

function renderVerifyView() {
  const task = tasks.find(t => t.id === verifyViewTaskId);
  if (!task) return;
  document.getElementById('verifyTaskInfo').innerHTML = `
    <div class="inspect-task-detail">
      <div class="task-detail-row">
        <span class="task-detail-item"><span class="label">任务名称：</span>${task.name}</span>
        <span class="task-detail-item"><span class="label">下发单位：</span>${(task.assignments || []).map(a => a.unitName).join('、')}</span>
        <span class="task-detail-item"><span class="label">截止时间：</span>${formatDeadline(task.deadline)}</span>
      </div>
    </div>
  `;
  const listEl = document.getElementById('verifyUnitList');
  listEl.innerHTML = (task.assignments || []).map(a => {
    const uploads = unitCheckResults[a.id] || [];
    const active = verifySelectedAssignmentId === a.id ? 'active' : '';
    return `<li class="${active}" data-assignment-id="${a.id}">${a.unitName}（${uploads.length}次上传）</li>`;
  }).join('');
  listEl.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
      verifySelectedAssignmentId = li.dataset.assignmentId;
      const uploads = unitCheckResults[verifySelectedAssignmentId] || [];
      verifySelectedUploadIndex = uploads.length ? 0 : null;
      listEl.querySelectorAll('li').forEach(i => i.classList.remove('active'));
      li.classList.add('active');
      renderVerifyView();
    });
  });
  const uploads = unitCheckResults[verifySelectedAssignmentId] || [];
  const hasPeriods = false;
  const periodFilterEl = document.getElementById('verifyPeriodFilter');
  if (periodFilterEl) periodFilterEl.classList.add('hidden');
  verifyFilteredUploads = uploads;
  if (verifySelectedUploadIndex == null || verifySelectedUploadIndex >= verifyFilteredUploads.length) verifySelectedUploadIndex = verifyFilteredUploads.length ? 0 : null;
  const tabsEl = document.getElementById('verifyUploadTabs');
  tabsEl.innerHTML = verifyFilteredUploads.length ? verifyFilteredUploads.map((u, i) => {
    const label = u.period ? `${u.period} ${u.asset || ''} ${u.uploadTime}` : `第${i + 1}次 ${u.uploadTime}${u.asset ? ' ' + u.asset : ''}`;
    return `<button type="button" class="verify-upload-tab ${i === verifySelectedUploadIndex ? 'active' : ''}" data-index="${i}">${label}</button>`;
  }).join('') : '<p class="import-hint">该单位暂无上传记录</p>';
  tabsEl.querySelectorAll('.verify-upload-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      verifySelectedUploadIndex = +btn.dataset.index;
      tabsEl.querySelectorAll('.verify-upload-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderVerifyTable();
    });
  });
  renderVerifyTable();
}

function getCurrentVerifyUpload() {
  if (verifySelectedUploadIndex == null) return null;
  return verifyFilteredUploads[verifySelectedUploadIndex] || null;
}

function renderVerifyTable() {
  const task = tasks.find(t => t.id === verifyViewTaskId);
  if (!task) return;
  const items = getTaskCheckItems(task);
  const upload = getCurrentVerifyUpload();
  const results = upload ? (upload.results || {}) : {};
  /** 仅「已退回/已通过」的上传展示省公司已保存的审核评论；分公司新提交的待审核记录不展示旧审核内容 */
  const showProvincialReviewFields = upload && (upload.reviewStatus === 'returned' || upload.reviewStatus === 'approved');
  const tbody = document.getElementById('verifyTableBody');
  tbody.innerHTML = items.map(i => {
    const r = results[i.id] || {};
    const resultMain = r.result === 'pass' ? '通过' : r.result === 'fail' ? '不通过' : '-';
    const autoText = i.autoCheck ? '是' : '否';
    const attachHtml = (r.attachments && r.attachments.length)
      ? r.attachments.map(a => `<span class="inspect-attach-item">${escapeHtml(a)}</span>`).join('')
      : '';
    const reviewComment = showProvincialReviewFields ? (r.reviewComment || '') : '';
    const reviewAttach = showProvincialReviewFields && Array.isArray(r.reviewAttachments) ? r.reviewAttachments : [];
    const reviewAttachHtml = reviewAttach.length
      ? `<div class="verify-review-attach-list" aria-label="已保存的审核附件">${reviewAttach.map(n => `<span class="inspect-attach-item">${escapeHtml(n)}</span>`).join('')}</div>`
      : '';
    const metaBits = [];
    if (r.score) metaBits.push(`<div class="verify-result-meta">分值：${escapeHtml(String(r.score))}</div>`);
    if (r.remark) metaBits.push(`<div class="verify-result-meta">备注：${escapeHtml(r.remark)}</div>`);
    if (r.result === 'fail' && r.suggestion) {
      metaBits.push(`<div class="verify-result-meta">整改建议：${escapeHtml(r.suggestion)}</div>`);
    }
    return `<tr>
      <td>
        <span class="inspect-requirement">${i.requirement || '-'}</span>
        <a href="#" class="link-detail link-detail-sm" data-id="${i.id}">详情</a>
      </td>
      <td>${autoText}</td>
      <td class="inspect-remark-cell verify-result-readonly">
        <div class="verify-result-main">${resultMain}</div>
        ${metaBits.join('')}
      </td>
      <td class="inspect-attach-cell">
        <div class="inspect-attach-list">${attachHtml}</div>
      </td>
      <td class="verify-review-cell">
        <label class="sr-only" for="verifyReview_${i.id}">审核评论文字</label>
        <textarea id="verifyReview_${i.id}" class="verify-review-textarea" data-review-item-id="${i.id}" placeholder="针对该检查项填写审核评论…">${escapeHtml(reviewComment)}</textarea>
        ${reviewAttachHtml}
        <label class="verify-review-file-label" for="verifyReviewFiles_${i.id}">上传图片或附件</label>
        <input type="file" id="verifyReviewFiles_${i.id}" class="verify-review-file-input" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp" data-review-files-for="${i.id}" autocomplete="off">
      </td>
    </tr>`;
  }).join('');
  tbody.querySelectorAll('.link-detail-sm').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); openItemDetailModal(a.dataset.id); });
  });
}

document.getElementById('verifySubmitComments')?.addEventListener('click', () => {
  if (!verifyViewTaskId || !verifySelectedAssignmentId) return;
  const upload = getCurrentVerifyUpload();
  if (!upload) { alert('暂无可审核的上传记录'); return; }
  const textareas = [...document.querySelectorAll('#verifyTableBody textarea[data-review-item-id]')];
  const fileInputs = [...document.querySelectorAll('#verifyTableBody input[type="file"][data-review-files-for]')];
  if (!upload.results) upload.results = {};
  textareas.forEach(ta => {
    const itemId = ta.dataset.reviewItemId;
    if (!itemId) return;
    if (!upload.results[itemId]) upload.results[itemId] = {};
    upload.results[itemId].reviewComment = ta.value || '';
  });
  fileInputs.forEach(inp => {
    const itemId = inp.dataset.reviewFilesFor;
    if (!itemId || !inp.files?.length) return;
    if (!upload.results[itemId]) upload.results[itemId] = {};
    const prev = upload.results[itemId].reviewAttachments || [];
    const names = [...inp.files].map(f => f.name);
    upload.results[itemId].reviewAttachments = [...prev, ...names];
  });
  upload.reviewStatus = 'returned';
  upload.reviewedAt = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
  upload.reviewedBy = '省公司审核员';
  alert('已经提交。');
  renderVerifyTable();
});

document.getElementById('backFromVerify')?.addEventListener('click', closeVerifyView);

function openDetailView(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  detailViewTaskId = taskId;
  detailViewSelectedItem = null;
  document.getElementById('taskListView').classList.add('hidden');
  document.getElementById('inspectView').classList.add('hidden');
  document.getElementById('verifyView').classList.add('hidden');
  document.getElementById('detailView').classList.remove('hidden');
  renderDetailView();
}

function closeDetailView() {
  detailViewTaskId = null;
  detailViewSelectedItem = null;
  document.getElementById('taskListView').classList.remove('hidden');
  document.getElementById('inspectView').classList.add('hidden');
  document.getElementById('verifyView').classList.add('hidden');
  document.getElementById('detailView').classList.add('hidden');
  renderTasks();
}

function renderDetailView() {
  const task = tasks.find(t => t.id === detailViewTaskId);
  if (!task) return;
  const statusText = task.status === 'done' ? '已完成' : '已停止';
  document.getElementById('detailTaskInfo').innerHTML = `
    <div class="inspect-task-detail">
      <div class="task-detail-row">
        <span class="task-detail-item"><span class="label">任务名称：</span>${task.name}</span>
        <span class="task-detail-item"><span class="label">选择资产：</span>${getDisplayAsset(task)}</span>
        <span class="task-detail-item"><span class="label">开始时间：</span>${task.startTime}</span>
        <span class="task-detail-item"><span class="label">截止时间：</span>${formatDeadline(task.deadline)}</span>
        <span class="task-detail-item"><span class="label">结束时间：</span>${task.endTime || '-'}</span>
        <span class="task-detail-item"><span class="label">检查项：</span>${task.itemCount}项</span>
        <span class="task-detail-item"><span class="label">检查进度：</span><span class="task-progress">${task.progress || 0}%</span></span>
        <span class="task-detail-item"><span class="label">创建人：</span>${task.creator}</span>
        <span class="task-detail-item"><span class="label">状态：</span>${statusText}</span>
      </div>
    </div>
  `;

  const items = getTaskCheckItems(task);
  const results = taskCheckResults[task.id] || {};
  const byCategory = {};
  items.forEach(i => {
    const cat = i.category || '其他';
    if (!byCategory[cat]) byCategory[cat] = {};
    if (!byCategory[cat][i.item]) byCategory[cat][i.item] = [];
    byCategory[cat][i.item].push(i);
  });

  const listEl = document.getElementById('detailItemList');
  listEl.innerHTML = Object.entries(byCategory).map(([category, itemMap]) => {
    const children = Object.entries(itemMap).map(([itemName]) => {
      const active = detailViewSelectedItem === itemName ? 'active' : '';
      return `<li class="inspect-tree-item ${active}" data-item="${itemName}">${itemName}</li>`;
    }).join('');
    return `
      <li class="inspect-tree-node expanded">
        <div class="inspect-tree-category"><span class="inspect-tree-toggle">▼</span><span>${category}</span></div>
        <ul class="inspect-tree-children">${children}</ul>
      </li>
    `;
  }).join('');

  listEl.querySelectorAll('.inspect-tree-item').forEach(li => {
    li.addEventListener('click', () => {
      detailViewSelectedItem = li.dataset.item === detailViewSelectedItem ? null : li.dataset.item;
      listEl.querySelectorAll('.inspect-tree-item').forEach(i => i.classList.remove('active'));
      if (detailViewSelectedItem) li.classList.add('active');
      renderDetailViewTable();
    });
  });

  renderDetailViewTable();
}

function renderDetailViewTable() {
  const task = tasks.find(t => t.id === detailViewTaskId);
  if (!task) return;
  let items = getTaskCheckItems(task);
  if (detailViewSelectedItem) items = items.filter(i => i.item === detailViewSelectedItem);
  let results = taskCheckResults[task.id] || {};
  if (task.assignments?.length) {
    const allResults = {};
    task.assignments.forEach(a => {
      const uploads = unitCheckResults[a.id] || [];
      const last = uploads[uploads.length - 1];
      if (last?.results) Object.assign(allResults, last.results);
    });
    if (Object.keys(allResults).length) results = allResults;
  }

  const tbody = document.getElementById('detailTableBody');
  tbody.innerHTML = items.map(i => {
    const r = results[i.id] || {};
    const resultText = r.result === 'pass' ? '通过' : r.result === 'fail' ? '不通过' : '-';
    const scoreText = r.score ? `分值：${r.score}` : '';
    const suggestionText = r.result === 'fail' && r.suggestion ? `整改建议：${r.suggestion}` : '';
    const problemText = [resultText, scoreText, suggestionText].filter(Boolean).join(' ');
    const attachHtml = (r.attachments && r.attachments.length) ? r.attachments.map(a => `<span class="inspect-attach-item">${a}</span>`).join('') : '-';
    return `
      <tr>
        <td><span class="inspect-requirement">${i.requirement || '-'}</span> <a href="#" class="link-detail link-detail-sm" data-id="${i.id}">详情</a></td>
        <td>${problemText || '-'}</td>
        <td>${r.remark || '-'}</td>
        <td><div class="inspect-attach-list">${attachHtml}</div></td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('.link-detail-sm').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); openItemDetailModal(a.dataset.id); });
  });
}

function downloadReport(taskId) {
  const task = tasks.find(t => t.id === taskId);
  alert(`正在下载检查报告：${task?.name || ''}_合规检查报告.pdf\n（Demo 环境下为模拟下载）`);
}

// ============ 合规检查执行视图 ============
function getTaskCheckItems(task) {
  const ids = task.itemIds || [];
  return checkItems.filter(i => ids.includes(i.id));
}

function renderInspectTaskDetail() {
  const task = tasks.find(t => t.id === currentInspectTaskId);
  const el = document.getElementById('inspectTaskDetail');
  const changeBtn = document.getElementById('changeAssetBtn');
  if (changeBtn) changeBtn.style.display = currentInspectAssignmentId ? 'inline-block' : 'none';
  if (!el || !task) return;
  let statusText = task.status === 'done' ? '已完成' : task.status === 'running' ? '检查中' : '已停止';
  let returnedBannerHtml = '';
  if (currentInspectAssignmentId) {
    const uploads = unitCheckResults[currentInspectAssignmentId] || [];
    const last = uploads.slice(-1)[0];
    if (last?.reviewStatus === 'returned') {
      statusText = '检查中-退回';
      returnedBannerHtml = `
        <div class="inspect-returned-banner">
          <span class="banner-title">已退回：</span>
          <span>省公司已退回本次检查结果，请按各检查项下的退回意见与审核附件修改后重新提交。</span>
        </div>
      `;
    }
  }
  el.innerHTML = `
    <div class="task-detail-row">
      <span class="task-detail-item"><span class="label">任务名称：</span>${task.name}</span>
      <span class="task-detail-item"><span class="label">选择资产：</span>${getDisplayAsset(task)}</span>
      <span class="task-detail-item"><span class="label">开始时间：</span>${task.startTime}</span>
      <span class="task-detail-item"><span class="label">截止时间：</span>${formatDeadline(task.deadline)}</span>
      <span class="task-detail-item"><span class="label">检查项：</span>${task.itemCount}项</span>
      <span class="task-detail-item"><span class="label">检查进度：</span><span class="task-progress">${task.progress || 0}%</span></span>
      <span class="task-detail-item"><span class="label">创建人：</span>${task.creator}</span>
      <span class="task-detail-item"><span class="label">状态：</span>${statusText}</span>
    </div>
    ${returnedBannerHtml}
  `;
}

function escapeHtml(input) {
  const s = (input ?? '').toString();
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** 去掉省公司审核写入的字段，避免分公司重新提交时把旧审核评论带进新上传记录 */
function stripReviewMetadataFromResults(results) {
  const out = {};
  Object.keys(results || {}).forEach(k => {
    const row = { ...(results[k] || {}) };
    delete row.reviewComment;
    delete row.reviewAttachments;
    out[k] = row;
  });
  return out;
}

let unitInspectDraft = {}; // { assignmentId: { itemId: {...} } } 单位执行时的草稿

function openInspectView(taskId, assignmentId) {
  currentInspectTaskId = taskId;
  currentInspectAssignmentId = assignmentId || null;
  inspectSelectedItem = null;
  inspectCurrentPage = 1;
  if (assignmentId && !unitInspectDraft[assignmentId]) {
    const last = (unitCheckResults[assignmentId] || []).slice(-1)[0];
    const taskForInit = tasks.find(t => t.id === taskId);
    const baseline = last
      ? stripReviewMetadataFromResults(JSON.parse(JSON.stringify(last.results || {})))
      : {};
    const init = {};
    (taskForInit?.itemIds || []).forEach(id => {
      init[id] = { ...(baseline[id] || {}) };
    });
    unitInspectDraft[assignmentId] = init;
  }
  if (currentInspectAssignmentId) {
    const task = tasks.find(t => t.id === currentInspectTaskId);
    const assignment = task?.assignments?.find(a => a.id === currentInspectAssignmentId);
    fillSelectAssetModal(assignment?.assets || (assignment?.asset ? assignment.asset.split('、').filter(Boolean) : []));
    applyAutoCheckDefaults();
  }
  document.getElementById('taskListView').classList.add('hidden');
  const iv = document.getElementById('inspectView');
  iv.classList.remove('hidden');
  document.getElementById('verifyView').classList.add('hidden');
  iv.classList.remove('inspect-oneclick-enabled', 'inspect-oneclick-compact');
  renderInspectTaskDetail();
  renderInspectView();
}

function closeInspectView() {
  currentInspectTaskId = null;
  currentInspectAssignmentId = null;
  inspectSelectedItem = null;
  document.getElementById('taskListView').classList.remove('hidden');
  document.getElementById('inspectView').classList.add('hidden');
  renderTasks();
}

function getInspectStats(task) {
  const items = getTaskCheckItems(task);
  const results = getInspectResultsForCurrent();
  let passed = 0, failed = 0;
  items.forEach(i => {
    const r = results[i.id];
    const code = r?.resultCode || r?.result || '';
    if (code === 'match' || code === 'pass') passed++;
    else if (code === 'mismatch' || code === 'fail') failed++;
  });
  const checked = items.filter(i => {
    const r = results[i.id] || {};
    return !!(r.resultCode || r.result || r.resultText);
  }).length;
  const pending = items.length - checked;
  return { total: items.length, checked, passed, failed, pending };
}

function renderInspectSidebar() {
  const task = tasks.find(t => t.id === currentInspectTaskId);
  if (!task) return;
  const items = getTaskCheckItems(task);
  const kw = (document.getElementById('inspectItemSearch')?.value || '').trim().toLowerCase();
  const results = getInspectResultsForCurrent();
  const byCategory = {};
  items.forEach(i => {
    const cat = i.category || '其他';
    if (!byCategory[cat]) byCategory[cat] = {};
    if (!byCategory[cat][i.item]) byCategory[cat][i.item] = [];
    byCategory[cat][i.item].push(i);
  });
  const el = document.getElementById('inspectItemList');
  el.innerHTML = Object.entries(byCategory)
    .filter(([cat]) => !kw || cat.toLowerCase().includes(kw) || Object.keys(byCategory[cat]).some(it => it.toLowerCase().includes(kw)))
    .map(([category, itemMap]) => {
      const itemEntries = Object.entries(itemMap).filter(([it]) => !kw || it.toLowerCase().includes(kw));
      if (itemEntries.length === 0) return '';
      const children = itemEntries.map(([itemName, arr]) => {
        const checked = arr.filter(i => results[i.id]?.result).length;
        const total = arr.length;
        const active = inspectSelectedItem === itemName ? 'active' : '';
        return `<li class="inspect-tree-item ${active}" data-item="${itemName}">${itemName} (${checked}/${total})</li>`;
      }).join('');
      return `
        <li class="inspect-tree-node">
          <div class="inspect-tree-category" data-category="${category}">
            <span class="inspect-tree-toggle">▶</span>
            <span>${category}</span>
          </div>
          <ul class="inspect-tree-children">${children}</ul>
        </li>
      `;
    }).join('');

  el.querySelectorAll('.inspect-tree-category').forEach(div => {
    div.addEventListener('click', (e) => {
      e.stopPropagation();
      const node = div.closest('.inspect-tree-node');
      node?.classList.toggle('expanded');
    });
  });
  el.querySelectorAll('.inspect-tree-item').forEach(li => {
    li.addEventListener('click', (e) => {
      e.stopPropagation();
      inspectSelectedItem = li.dataset.item === inspectSelectedItem ? null : li.dataset.item;
      inspectCurrentPage = 1;
      renderInspectTable();
      el.querySelectorAll('.inspect-tree-item').forEach(i => i.classList.remove('active'));
      if (inspectSelectedItem) li.classList.add('active');
    });
  });
  el.querySelectorAll('.inspect-tree-node').forEach(node => node.classList.add('expanded'));
}

function getInspectResultsForCurrent() {
  if (currentInspectAssignmentId) return unitInspectDraft[currentInspectAssignmentId] || {};
  const task = tasks.find(t => t.id === currentInspectTaskId);
  return task ? (taskCheckResults[task.id] || {}) : {};
}

function getInspectTableData() {
  const task = tasks.find(t => t.id === currentInspectTaskId);
  if (!task) return [];
  let items = getTaskCheckItems(task);
  const keyVal = (document.getElementById('inspectKeyPointSearch')?.value || '').trim().toLowerCase();
  const resultVal = document.getElementById('inspectResultFilter')?.value || '';
  if (inspectSelectedItem) items = items.filter(i => i.item === inspectSelectedItem);
  if (keyVal) items = items.filter(i => (i.requirement || '').toLowerCase().includes(keyVal));
  const results = getInspectResultsForCurrent();
  if (resultVal) {
    items = items.filter(i => {
      const r = results[i.id] || {};
      const code = r.resultCode || r.result || '';
      return code === resultVal;
    });
  }
  return items;
}

function getInspectResultMeta(r) {
  const code = r?.resultCode || r?.result || '';
  if (code === 'pass') return { code: 'match', label: '符合', isCustom: false };
  if (code === 'fail') return { code: 'mismatch', label: '不符合', isCustom: false };
  if (code === 'match') return { code: 'match', label: '符合', isCustom: false };
  if (code === 'partial') return { code: 'partial', label: '部分符合', isCustom: false };
  if (code === 'mismatch') return { code: 'mismatch', label: '不符合', isCustom: false };
  if (code === 'na') return { code: 'na', label: '不适用', isCustom: false };
  if (code === 'custom') return { code: 'custom', label: (r?.resultText || '').trim() || '其他', isCustom: true };
  // 兼容：历史数据可能直接写中文
  const s = (code || '').toString().trim();
  if (s === '符合') return { code: 'match', label: '符合', isCustom: false };
  if (s === '部分符合') return { code: 'partial', label: '部分符合', isCustom: false };
  if (s === '不符合') return { code: 'mismatch', label: '不符合', isCustom: false };
  if (s === '不适用') return { code: 'na', label: '不适用', isCustom: false };
  if (s) return { code: 'custom', label: s, isCustom: true };
  return { code: '', label: '', isCustom: false };
}

function renderInspectTable() {
  const data = getInspectTableData();
  const totalPages = Math.max(1, Math.ceil(data.length / INSPECT_PAGE_SIZE));
  inspectCurrentPage = Math.min(inspectCurrentPage, totalPages);
  const start = (inspectCurrentPage - 1) * INSPECT_PAGE_SIZE;
  const pageData = data.slice(start, start + INSPECT_PAGE_SIZE);
  const task = tasks.find(t => t.id === currentInspectTaskId);
  const results = getInspectResultsForCurrent();
  const lastUpload = currentInspectAssignmentId ? (unitCheckResults[currentInspectAssignmentId] || []).slice(-1)[0] : null;
  const lastUploadResults = lastUpload?.results || {};

  const tbody = document.getElementById('inspectTableBody');
  tbody.innerHTML = pageData.map(i => {
    const r = results[i.id] || {};
    const meta = getInspectResultMeta(r);
    const resultCode = meta.code;
    const customText = (r.resultText || '').toString();
    const autoText = i.autoCheck ? '是' : '否';
    const canAutoFill = !!i.autoCheck;
    const lr = (lastUpload?.reviewStatus === 'returned') ? (lastUploadResults[i.id] || {}) : {};
    const reviewComment = lr.reviewComment || '';
    const reviewAttach = Array.isArray(lr.reviewAttachments) ? lr.reviewAttachments : [];
    const reviewAttachBlock = reviewAttach.length
      ? `<div class="inspect-review-attach-wrap"><span class="inspect-review-attach-label">审核附件：</span>${reviewAttach.map(n => `<span class="inspect-attach-item">${escapeHtml(n)}</span>`).join('')}</div>`
      : '';
    const reviewCommentBlock = reviewComment
      ? `<div class="inspect-review-comment"><strong>退回意见：</strong>${escapeHtml(reviewComment)}</div>`
      : '';
    const reviewBlock = (lastUpload?.reviewStatus === 'returned' && (reviewComment || reviewAttach.length))
      ? `${reviewCommentBlock}${reviewAttachBlock}`
      : '';
    return `<tr>
      <td>
        <span class="inspect-requirement">${i.requirement || '-'}</span>
        <a href="#" class="link-detail link-detail-sm" data-id="${i.id}">详情</a>
      </td>
      <td>${autoText}</td>
      <td class="inspect-remark-cell">
        ${canAutoFill ? `<button type="button" class="btn btn-sm btn-secondary inspect-autocheck-btn" data-id="${i.id}">检查</button>` : ''}
        <div class="inspect-result-control">
          <label class="sr-only" for="inspectResultCode_${i.id}">检查结果类型</label>
          <select id="inspectResultCode_${i.id}" class="inspect-result-select" data-field="resultCode" data-id="${i.id}">
            <option value="">请选择</option>
            <option value="match" ${resultCode==='match'?'selected':''}>符合</option>
            <option value="partial" ${resultCode==='partial'?'selected':''}>部分符合</option>
            <option value="mismatch" ${resultCode==='mismatch'?'selected':''}>不符合</option>
            <option value="na" ${resultCode==='na'?'selected':''}>不适用</option>
            <option value="custom" ${resultCode==='custom'?'selected':''}>其他</option>
          </select>
          <label class="sr-only" for="inspectResultText_${i.id}">其他结果内容</label>
          <input
            id="inspectResultText_${i.id}"
            type="text"
            placeholder="请输入其他内容…"
            class="inspect-result-text ${resultCode==='custom'?'':'hidden'}"
            data-field="resultText"
            data-id="${i.id}"
            value="${escapeHtml(customText)}"
          >
        </div>
        ${reviewBlock}
      </td>
      <td class="inspect-attach-cell">
        <button type="button" class="btn btn-sm btn-secondary inspect-upload-btn" data-id="${i.id}">请上传</button>
        <div class="inspect-attach-list" data-id="${i.id}">${(r.attachments || []).map((a, idx) => {
          const safe = escapeHtml(a);
          const delBtn = currentInspectAssignmentId
            ? `<button type="button" class="inspect-attach-remove" aria-label="删除附件" data-item-id="${i.id}" data-attach-index="${idx}">×</button>`
            : '';
          return `<span class="inspect-attach-item inspect-attach-item-with-action">${safe}${delBtn}</span>`;
        }).join('')}</div>
      </td>
    </tr>`;
  }).join('');

  tbody.querySelectorAll('input[data-field]').forEach(inp => {
    inp.addEventListener('change', () => saveInspectResult(inp.dataset.id, inp.dataset.field, inp.value));
    inp.addEventListener('blur', () => saveInspectResult(inp.dataset.id, inp.dataset.field, inp.value));
  });
  tbody.querySelectorAll('select[data-field]').forEach(sel => {
    sel.addEventListener('change', () => saveInspectResult(sel.dataset.id, sel.dataset.field, sel.value));
  });
  tbody.querySelectorAll('input[name^="result_"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const itemId = radio.name.replace('result_','');
      saveInspectResult(itemId, 'result', radio.value);
      const row = radio.closest('tr');
      const suggestionWrap = row?.querySelector('.inspect-suggestion-wrap');
      if (suggestionWrap) suggestionWrap.style.display = radio.value === 'fail' ? 'block' : 'none';
      if (radio.value === 'pass') { saveInspectResult(itemId, 'suggestion', ''); const inp = suggestionWrap?.querySelector('input'); if (inp) inp.value = ''; }
    });
  });
  tbody.querySelectorAll('.link-detail-sm').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); openItemDetailModal(a.dataset.id); });
  });
  tbody.querySelectorAll('.inspect-upload-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      inspectUploadItemId = btn.dataset.id;
      document.getElementById('inspectFileInput').click();
    });
  });
  tbody.querySelectorAll('.inspect-attach-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      removeInspectAttachment(btn.dataset.itemId, btn.dataset.attachIndex);
    });
  });
  tbody.querySelectorAll('.inspect-autocheck-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyAutoCheckForItem(btn.dataset.id, { force: true });
      renderInspectTable();
    });
  });

  renderInspectPagination(data.length, totalPages);
}

function getAutoCheckDefaultResult(item) {
  return { resultCode: 'match', resultText: '' };
}

function applyAutoCheckForItem(itemId, opts) {
  const force = !!opts?.force;
  const item = checkItems.find(i => i.id === itemId);
  if (!item?.autoCheck) return;
  const results = getInspectResultsForCurrent();
  const cur = results[itemId] || {};
  if (!force && cur.result) return;
  const patch = getAutoCheckDefaultResult(item);
  if (patch.resultCode) saveInspectResult(itemId, 'resultCode', patch.resultCode);
}

function applyAutoCheckDefaults() {
  const task = tasks.find(t => t.id === currentInspectTaskId);
  if (!task) return;
  const items = getTaskCheckItems(task);
  items.filter(i => i.autoCheck).forEach(i => applyAutoCheckForItem(i.id, { force: false }));
}

function removeInspectAttachment(itemId, index) {
  if (!currentInspectTaskId || !itemId) return;
  const idx = parseInt(index, 10);
  if (Number.isNaN(idx) || idx < 0) return;
  if (currentInspectAssignmentId) {
    const draft = unitInspectDraft[currentInspectAssignmentId];
    if (!draft?.[itemId]?.attachments) return;
    const arr = draft[itemId].attachments;
    if (idx >= arr.length) return;
    arr.splice(idx, 1);
    if (!arr.length) delete draft[itemId].attachments;
  } else {
    const map = taskCheckResults[currentInspectTaskId];
    if (!map?.[itemId]?.attachments) return;
    const arr = map[itemId].attachments;
    if (idx >= arr.length) return;
    arr.splice(idx, 1);
    if (!arr.length) delete map[itemId].attachments;
  }
  renderInspectTable();
  updateTaskProgress();
  renderInspectTaskDetail();
}

function saveInspectResult(itemId, field, value) {
  if (!currentInspectTaskId) return;
  if (currentInspectAssignmentId) {
    if (!unitInspectDraft[currentInspectAssignmentId]) unitInspectDraft[currentInspectAssignmentId] = {};
    if (!unitInspectDraft[currentInspectAssignmentId][itemId]) unitInspectDraft[currentInspectAssignmentId][itemId] = {};
    if (field === 'resultCode') {
      unitInspectDraft[currentInspectAssignmentId][itemId].resultCode = value || '';
      if (value !== 'custom') unitInspectDraft[currentInspectAssignmentId][itemId].resultText = '';
    } else if (field === 'resultText') {
      unitInspectDraft[currentInspectAssignmentId][itemId].resultText = value || '';
      if (value && unitInspectDraft[currentInspectAssignmentId][itemId].resultCode !== 'custom') {
        unitInspectDraft[currentInspectAssignmentId][itemId].resultCode = 'custom';
      }
    } else {
    unitInspectDraft[currentInspectAssignmentId][itemId][field] = value;
    }
  } else {
    if (!taskCheckResults[currentInspectTaskId]) taskCheckResults[currentInspectTaskId] = {};
    if (!taskCheckResults[currentInspectTaskId][itemId]) taskCheckResults[currentInspectTaskId][itemId] = {};
    if (field === 'resultCode') {
      taskCheckResults[currentInspectTaskId][itemId].resultCode = value || '';
      if (value !== 'custom') taskCheckResults[currentInspectTaskId][itemId].resultText = '';
    } else if (field === 'resultText') {
      taskCheckResults[currentInspectTaskId][itemId].resultText = value || '';
      if (value && taskCheckResults[currentInspectTaskId][itemId].resultCode !== 'custom') {
        taskCheckResults[currentInspectTaskId][itemId].resultCode = 'custom';
      }
    } else {
    taskCheckResults[currentInspectTaskId][itemId][field] = value;
    }
  }
  updateTaskProgress();
  renderInspectTaskDetail();
}

function updateTaskProgress() {
  const task = tasks.find(t => t.id === currentInspectTaskId);
  if (!task) return;
  const s = getInspectStats(task);
  task.progress = s.total ? Math.round((s.checked / s.total) * 100) : 0;
}

function renderInspectPagination(total, totalPages) {
  const el = document.getElementById('inspectPagination');
  if (!el) return;
  el.innerHTML = `
    <div class="pagination-info">共${totalPages}页 / ${total}条数据</div>
    <div class="pagination-nav">
      <button class="btn btn-sm" data-page="1" ${inspectCurrentPage<=1?'disabled':''}>&lt;&lt;</button>
      <button class="btn btn-sm" data-page="${inspectCurrentPage-1}" ${inspectCurrentPage<=1?'disabled':''}>&lt;</button>
      ${Array.from({length:Math.min(5,totalPages)},(_,k)=>k+1).map(p=>`<button class="btn btn-sm ${p===inspectCurrentPage?'active':''}" data-page="${p}">${p}</button>`).join('')}
      <button class="btn btn-sm" data-page="${inspectCurrentPage+1}" ${inspectCurrentPage>=totalPages?'disabled':''}>&gt;</button>
      <button class="btn btn-sm" data-page="${totalPages}" ${inspectCurrentPage>=totalPages?'disabled':''}>&gt;&gt;</button>
    </div>
    <select id="inspectPageSize"><option value="10" ${INSPECT_PAGE_SIZE===10?'selected':''}>10条/页</option><option value="20">20条/页</option></select>
  `;
  el.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => { inspectCurrentPage = +btn.dataset.page; renderInspectTable(); });
  });
}

function renderInspectView() {
  renderInspectSidebar();
  renderInspectTable();
  document.getElementById('inspectKeyPointSearch').value = '';
  document.getElementById('inspectResultFilter').value = '';
  document.getElementById('inspectItemSearch').value = '';
}

// ============ 任务操作 ============
function handleTaskAction(action, taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  switch (action) {
    case 'execute':
      if (currentUnitId === 'u0') return;
      if (isTaskDeadlinePassed(task)) {
        alert('任务已过截止时间，无法执行检查');
        renderTasks();
        return;
      }
      const assignment = (task.assignments || []).find(a => a.unitId === currentUnitId);
      if (!assignment) return;
      if (!assignment.asset) {
        pendingExecuteTaskId = taskId;
        pendingExecuteAssignmentId = assignment.id;
        fillSelectAssetModal(assignment.assets || []);
        document.getElementById('selectAssetModal').classList.add('show');
      } else {
        openInspectView(taskId, assignment.id);
      }
      break;
    case 'verify': openVerifyView(taskId); break;
    case 'endTask':
      task.status = 'done';
      task.progress = task.progress || 0;
      task.endTime = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
      renderTasks();
      alert('任务已结束，各单位将无法再上传结果');
      break;
    case 'copy': openCopyTaskModal(taskId); break;
    case 'download': downloadReport(taskId); break;
    case 'detail': openDetailView(taskId); break;
    case 'delete':
      if (confirm('确定删除该任务？')) {
        tasks = tasks.filter(t => t.id !== taskId);
        renderTasks();
      }
      break;
  }
}

// ============ 模态框关闭 ============
document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal').classList.remove('show');
  });
});
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
  });
});

// ============ 检查项搜索 ============
document.getElementById('itemsSearch')?.addEventListener('click', () => {
  itemsCurrentPage = 1;
  renderCheckItems();
});

// ============ 合规检查视图事件 ============
document.getElementById('backToTaskList')?.addEventListener('click', closeInspectView);
document.getElementById('inspectFileInput')?.addEventListener('change', (e) => {
  const files = e.target.files;
  if (!files?.length || !currentInspectTaskId || !inspectUploadItemId) return;
  const task = tasks.find(t => t.id === currentInspectTaskId);
  if (!task) return;
  if (currentInspectAssignmentId) {
    if (!unitInspectDraft[currentInspectAssignmentId]) unitInspectDraft[currentInspectAssignmentId] = {};
    if (!unitInspectDraft[currentInspectAssignmentId][inspectUploadItemId]) unitInspectDraft[currentInspectAssignmentId][inspectUploadItemId] = {};
    const prev = unitInspectDraft[currentInspectAssignmentId][inspectUploadItemId].attachments || [];
    unitInspectDraft[currentInspectAssignmentId][inspectUploadItemId].attachments = [...prev, ...Array.from(files).map(f => f.name)];
  } else {
    if (!taskCheckResults[currentInspectTaskId]) taskCheckResults[currentInspectTaskId] = {};
    if (!taskCheckResults[currentInspectTaskId][inspectUploadItemId]) taskCheckResults[currentInspectTaskId][inspectUploadItemId] = {};
    const prev = taskCheckResults[currentInspectTaskId][inspectUploadItemId].attachments || [];
    taskCheckResults[currentInspectTaskId][inspectUploadItemId].attachments = [...prev, ...Array.from(files).map(f => f.name)];
  }
  inspectUploadItemId = null;
  e.target.value = '';
  renderInspectTable();
  updateTaskProgress();
  renderInspectTaskDetail();
});
document.getElementById('finishInspect')?.addEventListener('click', () => {
  const task = tasks.find(t => t.id === currentInspectTaskId);
  if (task && isTaskDeadlinePassed(task)) {
    alert('任务已过截止时间，无法提交检查结果');
    return;
  }
  if (currentInspectAssignmentId) {
    const task = tasks.find(t => t.id === currentInspectTaskId);
    const assignment = task?.assignments?.find(a => a.id === currentInspectAssignmentId);
    const draft = unitInspectDraft[currentInspectAssignmentId] || {};
    const uploadTime = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
    const asset = assignment?.asset || '';
    if (!unitCheckResults[currentInspectAssignmentId]) unitCheckResults[currentInspectAssignmentId] = [];
    const prevUpload = (unitCheckResults[currentInspectAssignmentId] || []).slice(-1)[0];
    const baseline = prevUpload
      ? stripReviewMetadataFromResults(JSON.parse(JSON.stringify(prevUpload.results || {})))
      : {};
    const merged = {};
    (task.itemIds || []).forEach(id => {
      merged[id] = { ...(baseline[id] || {}), ...(draft[id] || {}) };
    });
    const resultsPayload = stripReviewMetadataFromResults(JSON.parse(JSON.stringify(merged)));
    unitCheckResults[currentInspectAssignmentId].push({
      uploadTime,
      asset,
      results: resultsPayload,
      reviewStatus: 'pending',
      reviewComment: '',
      reviewedAt: '',
      reviewedBy: ''
    });
    unitInspectDraft[currentInspectAssignmentId] = JSON.parse(JSON.stringify(resultsPayload));
    renderInspectView();
    alert('检查结果已提交！可继续补充并再次提交，或点击返回退出。');
  } else {
    const task = tasks.find(t => t.id === currentInspectTaskId);
    if (task) { task.status = 'done'; task.progress = 100; task.endTime = new Date().toLocaleString('zh-CN',{hour12:false}).replace(/\//g,'-'); }
    closeInspectView();
    alert('检查已完成！可下载报告或查看详情。');
  }
});
document.getElementById('inspectSearchBtn')?.addEventListener('click', () => { inspectCurrentPage = 1; renderInspectTable(); });
document.getElementById('inspectItemSearch')?.addEventListener('input', renderInspectSidebar);

// 检查详情视图：返回任务列表 / 下载报告
document.getElementById('backToDetailTaskList')?.addEventListener('click', closeDetailView);
document.getElementById('detailDownloadReport')?.addEventListener('click', () => {
  if (detailViewTaskId) downloadReport(detailViewTaskId);
});

document.getElementById('currentUnitSelect')?.addEventListener('change', (e) => {
  currentUnitId = e.target.value;
  renderTasks();
});

// ============ 本地运营指标 ============
function getDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function cloneMetrics(metrics) {
  return (metrics || []).map(m => ({ ...m }));
}

function buildDefaultLocalMetrics() {
  const defaultWeight = +(100 / LOCAL_METRIC_DEFAULTS.length).toFixed(2);
  return LOCAL_METRIC_DEFAULTS.map(name => ({ name, score: 0, weight: defaultWeight }));
}

function getOrInitOpsRecord(dateStr) {
  if (opsMetricsByDate[dateStr]) return opsMetricsByDate[dateStr];
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() - 1);
  const prevDate = getDateStr(d);
  const prev = opsMetricsByDate[prevDate];
  opsMetricsByDate[dateStr] = {
    metrics: prev ? cloneMetrics(prev.metrics) : buildDefaultLocalMetrics(),
    source: prev ? 'default-prev-day' : 'default-init',
    modifiedAt: '',
    modifiedBy: ''
  };
  return opsMetricsByDate[dateStr];
}

function calcOpsTotal(metrics) {
  return (metrics || []).reduce((sum, m) => {
    const score = Number(m.score) || 0;
    const weight = Number(m.weight) || 0;
    return sum + (score * weight / 100);
  }, 0);
}

function renderOpsTabs(activeTab) {
  document.querySelectorAll('.ops-tab').forEach(btn => {
    const on = btn.dataset.opsTab === activeTab;
    btn.classList.toggle('active', on);
  });
  const map = { security: 'opsSecurityView', local: 'opsLocalView', network: 'opsNetworkView' };
  Object.values(map).forEach(id => document.getElementById(id)?.classList.remove('active'));
  document.getElementById(map[activeTab])?.classList.add('active');
}

function renderOpsLocalTable() {
  const dateStr = document.getElementById('opsDate')?.value;
  if (!dateStr) return;
  currentOpsDate = dateStr;
  const record = getOrInitOpsRecord(dateStr);
  const kw = (document.getElementById('opsKeyword')?.value || '').trim().toLowerCase();
  currentOpsFilteredKeyword = kw;
  const list = record.metrics.filter(m => !kw || m.name.toLowerCase().includes(kw));
  const tbody = document.getElementById('opsTableBody');
  tbody.innerHTML = list.map((m, idx) => {
    const realIdx = record.metrics.findIndex(x => x.name === m.name && Number(x.score) === Number(m.score) && Number(x.weight) === Number(m.weight));
    const weighted = ((Number(m.score) || 0) * (Number(m.weight) || 0) / 100).toFixed(2);
    return `<tr>
      <td>${m.name}</td>
      <td><input class="ops-score-input" type="number" min="0" max="100" step="0.01" data-role="score" data-idx="${realIdx}" value="${m.score}"></td>
      <td><input class="ops-weight-input" type="number" min="0" max="100" step="0.01" data-role="weight" data-idx="${realIdx}" value="${m.weight}"></td>
      <td>${weighted}</td>
      <td><button class="btn btn-danger btn-sm" data-role="deleteMetric" data-idx="${realIdx}">删除</button></td>
    </tr>`;
  }).join('');

  const total = calcOpsTotal(record.metrics).toFixed(2);
  document.getElementById('opsTotalScore').textContent = total;
  const hintEl = document.getElementById('opsModifiedHint');
  const sourceText = record.source === 'manual'
    ? `数据来源：人工修改（${record.modifiedAt || '-' }）`
    : '数据来源：默认前一天';
  hintEl.textContent = sourceText;
  hintEl.classList.toggle('ops-source-manual', record.source === 'manual');
  hintEl.classList.toggle('ops-source-default', record.source !== 'manual');

  tbody.querySelectorAll('input[data-role]').forEach(input => {
    input.addEventListener('change', () => {
      const i = Number(input.dataset.idx);
      const role = input.dataset.role;
      const val = Number(input.value);
      if (Number.isNaN(val) || val < 0 || val > 100) {
        alert(`${role === 'score' ? '分数' : '权重'}需在0-100之间`);
        renderOpsLocalTable();
        return;
      }
      record.metrics[i][role] = +val.toFixed(2);
      record.source = 'manual';
      record.modifiedAt = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
      record.modifiedBy = '当前用户';
      renderOpsLocalTable();
    });
  });

  tbody.querySelectorAll('button[data-role="deleteMetric"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = Number(btn.dataset.idx);
      if (confirm('确定删除该指标？')) {
        record.metrics.splice(i, 1);
        record.source = 'manual';
        record.modifiedAt = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
        record.modifiedBy = '当前用户';
        renderOpsLocalTable();
      }
    });
  });
}

function initOpsMetrics() {
  const dateInput = document.getElementById('opsDate');
  if (!dateInput) return;
  if (!dateInput.value) dateInput.value = getDateStr(new Date());
  currentOpsDate = dateInput.value;
  getOrInitOpsRecord(currentOpsDate);
  renderOpsTabs('local');
  renderOpsLocalTable();

  document.querySelectorAll('.ops-tab').forEach(btn => {
    btn.addEventListener('click', () => renderOpsTabs(btn.dataset.opsTab));
  });
  document.getElementById('opsSearchBtn')?.addEventListener('click', renderOpsLocalTable);
  document.getElementById('opsDate')?.addEventListener('change', renderOpsLocalTable);
  document.getElementById('opsAddMetricBtn')?.addEventListener('click', () => {
    const name = prompt('请输入新增指标名称');
    if (!name || !name.trim()) return;
    const metricName = name.trim();
    const record = getOrInitOpsRecord(document.getElementById('opsDate').value);
    if (record.metrics.some(m => m.name === metricName)) {
      alert('指标名称已存在');
      return;
    }
    record.metrics.push({ name: metricName, score: 0, weight: 0 });
    record.source = 'manual';
    record.modifiedAt = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
    record.modifiedBy = '当前用户';
    renderOpsLocalTable();
  });
  document.getElementById('opsSaveBtn')?.addEventListener('click', () => {
    const record = getOrInitOpsRecord(document.getElementById('opsDate').value);
    const weightSum = record.metrics.reduce((sum, m) => sum + (Number(m.weight) || 0), 0);
    if (Math.abs(weightSum - 100) > 0.01) {
      alert(`已保存，但提示：当前权重总和为 ${weightSum.toFixed(2)}，建议为100`);
    } else {
      alert('保存成功');
    }
  });
}

// ============ 初始化 ============
document.getElementById('currentUnitSelect') && (document.getElementById('currentUnitSelect').value = currentUnitId);
renderComplianceGrid();
renderItemsFileList();
initItemsSearchOptions();
renderCheckItems();
renderTasks();
setupTaskScopeSwitch();
initOpsMetrics();
