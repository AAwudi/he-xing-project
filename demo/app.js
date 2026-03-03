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
  { id: 'c1', fileId: 'f1', category: '数据安全', item: '数据安全组织体系', requirement: '是否明确数据安全保护负责人，建立数据安全管理组织架构', method: '1.登陆系统验证 2.材料检查 3.现场询问', keyPoints: ['了解数据保护负责人任职情况及职责分工', '核查数据安全管理岗位配置', '查验相关任命文件'], cooperation: ['系统清单', '关键人员名单', '数据安全管理责任制文件'] },
  { id: 'c2', fileId: 'f1', category: '数据安全', item: '数据安全制度建设', requirement: '是否建立网络安全责任制，明确各级安全责任', method: '1.登陆系统验证 2.材料检查 3.现场询问', keyPoints: ['核查网络安全责任制文件', '检查责任落实情况', '核对责任追究记录'], cooperation: ['网络安全责任制制度', '责任落实台账', '考核记录'] },
  { id: 'c3', fileId: 'f2', category: '数据安全', item: '数据安全制度建设', requirement: '是否对重大数据安全事件进行责任追究', method: '1.登陆系统验证 2.材料检查 3.现场询问', keyPoints: ['检查事件处置流程', '核查责任认定材料', '查验问责记录'], cooperation: ['重大事件处置记录', '责任追究报告', '整改措施材料'] },
  { id: 'c4', fileId: 'f2', category: '数据安全', item: '数据安全制度建设', requirement: '是否制定个人信息保护管理制度和操作规程', method: '1.登陆系统验证 2.材料检查 3.现场询问', keyPoints: ['核查管理制度完备性', '检查操作规程可执行性', '验证制度落地情况'], cooperation: ['个人信息保护制度', '操作规程文档', '执行记录'] },
  { id: 'c5', fileId: 'f3', category: '数据安全', item: '数据分类分级', requirement: '各行业主管部门是否制定本行业本领域的数据分类分级制度或标准规范', method: '1.登陆系统验证 2.材料检查 3.现场询问', keyPoints: ['了解行业分类分级要求', '核查本机构制度制定情况', '检查执行落实情况'], cooperation: ['行业分类分级标准', '本机构分类分级制度', '数据资产台账'] },
  { id: 'c6', fileId: 'f1', category: '数据安全', item: '关键操作审批机制', requirement: '信息系统重大数据操作是否落实审批、监控、审计等安全管理要求', method: '1.登陆系统验证 2.材料检查 3.现场询问', keyPoints: ['了解数据类型和数量', '检查操作权限配置', '核对审批流程', '查验审计日志'], cooperation: ['系统清单', '账号权限表', '重大数据操作记录', '系统日志'] },
  { id: 'c7', fileId: 'f2', category: '数据安全', item: '数据资产管理', requirement: '是否建立全量数据资产台账，实施数据分类分级管理', method: '1.登陆系统验证 2.材料检查 3.现场询问', keyPoints: ['核查数据资产台账完整性', '检查接口清单', '验证分类分级标识'], cooperation: ['数据资产台账', '个人用户数据资产台账', '接口台账'] },
  { id: 'c8', fileId: 'f2', category: '数据安全', item: '数据安全制度建设', requirement: '是否对数据处理活动定期开展风险监测', method: '1.登陆系统验证 2.材料检查 3.现场询问', keyPoints: ['检查监测机制建立情况', '核查监测频率和范围', '查验风险处置记录'], cooperation: ['风险监测制度', '监测记录', '处置台账'] },
  { id: 'c9', fileId: 'f3', category: '数据安全', item: '数据分类分级', requirement: '是否对重要数据进行识别和备案', method: '1.登陆系统验证 2.材料检查 3.现场询问', keyPoints: ['核查重要数据目录', '检查备案材料', '验证更新机制'], cooperation: ['重要数据目录', '备案证明材料'] },
  { id: 'c10', fileId: 'f2', category: '应急管理', item: '异常工号风险管理', requirement: '是否建立数据安全事件应急处置机制', method: '1.登陆系统验证 2.材料检查 3.现场询问', keyPoints: ['检查应急预案', '核查演练记录', '验证联动机制'], cooperation: ['应急预案', '演练记录', '应急演练材料'] },
  { id: 'c11', fileId: 'f1', category: '数据安全', item: '数据安全组织体系', requirement: '是否定期组织开展数据安全教育培训', method: '1.登陆系统验证 2.材料检查 3.现场询问', keyPoints: ['核查培训计划', '检查培训记录', '验证考核情况'], cooperation: ['培训计划', '培训记录', '考核材料'] },
  { id: 'c12', fileId: 'f3', category: '数据安全', item: '数据分类分级', requirement: '是否落实数据安全技术防护措施', method: '1.登陆系统验证 2.材料检查 3.现场询问', keyPoints: ['核查技术防护部署', '检查访问控制配置', '查验加密措施'], cooperation: ['技术防护清单', '配置文档', '审计日志'] },
];

let tasks = [
  { id: 't1', name: 'OA系统等保自查', asset: 'OA系统', startTime: '2026-03-01 09:00', endTime: '2026-03-02 18:00', itemCount: 5, itemIds: ['c1','c2','c3','c6','c11'], progress: 100, creator: '张三', status: 'done', result: '通过', remark: '', attachments: ['检查记录.pdf'], reportUrl: '#report1' },
  { id: 't2', name: '财务系统合规检查', asset: '财务系统', startTime: '2026-03-02 10:00', endTime: '-', itemCount: 8, itemIds: ['c2','c3','c4','c7','c8','c10','c11','c12'], progress: 60, creator: '李四', status: 'running', result: '', remark: '', attachments: [], reportUrl: '' },
  { id: 't3', name: 'HR系统等保预检', asset: 'HR系统', startTime: '2026-02-28 14:00', endTime: '2026-02-29 17:00', itemCount: 3, itemIds: ['c1','c5','c9'], progress: 0, creator: '王五', status: 'stopped', result: '', remark: '', attachments: [], reportUrl: '' },
];
let taskCheckResults = {}; // { taskId: { itemId: { result, score, suggestion, remark, attachments } } }
let currentInspectTaskId = null;
let inspectSelectedItem = null;
let inspectUploadItemId = null;
let INSPECT_PAGE_SIZE = 10;
let inspectCurrentPage = 1;

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
    return `
    <tr>
      <td>${i.category || '-'}</td>
      <td>${i.item || '-'}</td>
      <td class="cell-requirement">${i.requirement || '-'}</td>
      <td>${i.method || '-'}</td>
      <td>${fileName}</td>
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

function renderTasks() {
  const tbody = document.getElementById('tasksTableBody');
  tbody.innerHTML = tasks.map(t => {
    const statusCls = t.status === 'done' ? 'done' : t.status === 'running' ? 'running' : 'stopped';
    const statusText = t.status === 'done' ? '已完成' : t.status === 'running' ? '检查中' : '已停止';
    const endTime = t.endTime === '-' ? '-' : t.endTime;
    const canExecute = t.status === 'running';
    const canDownload = t.status === 'done';
    return `
    <tr>
      <td>${t.name}</td>
      <td>${t.asset}</td>
      <td>${t.startTime}</td>
      <td>${endTime}</td>
      <td>${t.itemCount}项</td>
      <td>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${t.progress}%"></div>
        </div>
      </td>
      <td>${t.creator}</td>
      <td><span class="status ${statusCls}">${statusText}</span></td>
      <td>
        ${canExecute ? `<button class="btn btn-primary btn-sm" data-action="execute" data-id="${t.id}">合规检查</button>` : ''}
        ${t.status === 'running' ? `<button class="btn btn-secondary btn-sm" data-action="stop" data-id="${t.id}">停止检查</button>` : ''}
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
function openNewTaskModal() {
  const fileContainer = document.getElementById('complianceFileOptions');
  const itemContainer = document.getElementById('checkItemOptions');
  fileContainer.innerHTML = complianceFiles.map(f => `
    <label><input type="checkbox" name="complianceFile" value="${f.id}"> ${f.name}</label>
  `).join('');
  renderTaskCheckItemOptions();
  document.getElementById('newTaskForm').reset();
  document.getElementById('taskItemSearch').value = '';
  document.querySelector('input[name="scopeType"][value="file"]').checked = true;
  document.getElementById('scopeFileBlock').classList.remove('hidden');
  document.getElementById('scopeItemBlock').classList.add('hidden');
  document.getElementById('newTaskModal').classList.add('show');
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
  const id = 't' + (Date.now() % 10000);
  const itemCount = selectedIds.length || 1;
  tasks.unshift({
    id, name: fd.get('taskName'), asset: fd.get('asset') || '-', startTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'), endTime: '-', itemCount, itemIds: selectedIds, progress: 0, creator: '当前用户', status: 'running', result: '', remark: '', attachments: [], reportUrl: ''
  });
  renderTasks();
  document.getElementById('newTaskModal').classList.remove('show');
  alert('任务创建成功！');
});

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

function openDetailView(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  detailViewTaskId = taskId;
  detailViewSelectedItem = null;
  document.getElementById('taskListView').classList.add('hidden');
  document.getElementById('inspectView').classList.add('hidden');
  document.getElementById('detailView').classList.remove('hidden');
  renderDetailView();
}

function closeDetailView() {
  detailViewTaskId = null;
  detailViewSelectedItem = null;
  document.getElementById('taskListView').classList.remove('hidden');
  document.getElementById('inspectView').classList.add('hidden');
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
        <span class="task-detail-item"><span class="label">选择资产：</span>${task.asset}</span>
        <span class="task-detail-item"><span class="label">开始时间：</span>${task.startTime}</span>
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
  const results = taskCheckResults[task.id] || {};

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
  if (!el || !task) return;
  const statusText = task.status === 'done' ? '已完成' : task.status === 'running' ? '检查中' : '已停止';
  el.innerHTML = `
    <div class="task-detail-row">
      <span class="task-detail-item"><span class="label">任务名称：</span>${task.name}</span>
      <span class="task-detail-item"><span class="label">选择资产：</span>${task.asset}</span>
      <span class="task-detail-item"><span class="label">开始时间：</span>${task.startTime}</span>
      <span class="task-detail-item"><span class="label">结束时间：</span>${task.endTime || '-'}</span>
      <span class="task-detail-item"><span class="label">检查项：</span>${task.itemCount}项</span>
      <span class="task-detail-item"><span class="label">检查进度：</span><span class="task-progress">${task.progress || 0}%</span></span>
      <span class="task-detail-item"><span class="label">创建人：</span>${task.creator}</span>
      <span class="task-detail-item"><span class="label">状态：</span>${statusText}</span>
    </div>
  `;
}

function openInspectView(taskId) {
  currentInspectTaskId = taskId;
  inspectSelectedItem = null;
  inspectCurrentPage = 1;
  document.getElementById('taskListView').classList.add('hidden');
  document.getElementById('inspectView').classList.remove('hidden');
  renderInspectTaskDetail();
  renderInspectView();
}

function closeInspectView() {
  currentInspectTaskId = null;
  inspectSelectedItem = null;
  document.getElementById('taskListView').classList.remove('hidden');
  document.getElementById('inspectView').classList.add('hidden');
  renderTasks();
}

function getInspectStats(task) {
  const items = getTaskCheckItems(task);
  const results = taskCheckResults[task.id] || {};
  let passed = 0, failed = 0;
  items.forEach(i => {
    const r = results[i.id];
    if (r?.result === 'pass') passed++;
    else if (r?.result === 'fail') failed++;
  });
  const checked = passed + failed;
  const pending = items.length - checked;
  return { total: items.length, checked, passed, failed, pending };
}

function renderInspectSidebar() {
  const task = tasks.find(t => t.id === currentInspectTaskId);
  if (!task) return;
  const items = getTaskCheckItems(task);
  const kw = (document.getElementById('inspectItemSearch')?.value || '').trim().toLowerCase();
  const results = taskCheckResults[task.id] || {};
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

function getInspectTableData() {
  const task = tasks.find(t => t.id === currentInspectTaskId);
  if (!task) return [];
  let items = getTaskCheckItems(task);
  const keyVal = (document.getElementById('inspectKeyPointSearch')?.value || '').trim().toLowerCase();
  const resultVal = document.getElementById('inspectResultFilter')?.value || '';
  if (inspectSelectedItem) items = items.filter(i => i.item === inspectSelectedItem);
  if (keyVal) items = items.filter(i => (i.requirement || '').toLowerCase().includes(keyVal));
  const results = taskCheckResults[task.id] || {};
  if (resultVal) items = items.filter(i => (results[i.id]?.result || '') === resultVal);
  return items;
}

function renderInspectTable() {
  const data = getInspectTableData();
  const totalPages = Math.max(1, Math.ceil(data.length / INSPECT_PAGE_SIZE));
  inspectCurrentPage = Math.min(inspectCurrentPage, totalPages);
  const start = (inspectCurrentPage - 1) * INSPECT_PAGE_SIZE;
  const pageData = data.slice(start, start + INSPECT_PAGE_SIZE);
  const task = tasks.find(t => t.id === currentInspectTaskId);
  const results = (task && taskCheckResults[task.id]) || {};

  const tbody = document.getElementById('inspectTableBody');
  tbody.innerHTML = pageData.map(i => {
    const r = results[i.id] || {};
    const showSuggestion = r.result === 'fail';
    return `<tr>
      <td>
        <span class="inspect-requirement">${i.requirement || '-'}</span>
        <a href="#" class="link-detail link-detail-sm" data-id="${i.id}">详情</a>
      </td>
      <td class="inspect-result-cell">
        <div class="inspect-pass-fail">
          <label><input type="radio" name="result_${i.id}" value="pass" ${r.result==='pass'?'checked':''}> 通过</label>
          <label><input type="radio" name="result_${i.id}" value="fail" ${r.result==='fail'?'checked':''}> 不通过</label>
        </div>
        <div class="inspect-score-suggestion">
          <input type="text" placeholder="分值" class="inspect-input-sm" data-field="score" data-id="${i.id}" value="${r.score||''}">
          <div class="inspect-suggestion-wrap" data-id="${i.id}" style="display:${showSuggestion?'block':'none'}">
            <input type="text" placeholder="整改建议" class="inspect-input" data-field="suggestion" data-id="${i.id}" value="${r.suggestion||''}">
          </div>
        </div>
      </td>
      <td><input type="text" placeholder="请输入" class="inspect-input" data-field="remark" data-id="${i.id}" value="${r.remark||''}"></td>
      <td class="inspect-attach-cell">
        <button type="button" class="btn btn-sm btn-secondary inspect-upload-btn" data-id="${i.id}">请上传</button>
        <div class="inspect-attach-list" data-id="${i.id}">${(r.attachments||[]).map(a=>`<span class="inspect-attach-item">${a}</span>`).join('')}</div>
      </td>
    </tr>`;
  }).join('');

  tbody.querySelectorAll('input[data-field]').forEach(inp => {
    inp.addEventListener('change', () => saveInspectResult(inp.dataset.id, inp.dataset.field, inp.value));
    inp.addEventListener('blur', () => saveInspectResult(inp.dataset.id, inp.dataset.field, inp.value));
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

  renderInspectPagination(data.length, totalPages);
}

function saveInspectResult(itemId, field, value) {
  if (!currentInspectTaskId) return;
  if (!taskCheckResults[currentInspectTaskId]) taskCheckResults[currentInspectTaskId] = {};
  if (!taskCheckResults[currentInspectTaskId][itemId]) taskCheckResults[currentInspectTaskId][itemId] = {};
  taskCheckResults[currentInspectTaskId][itemId][field] = value;
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
    case 'execute': openInspectView(taskId); break;
    case 'stop':
      task.status = 'stopped';
      task.progress = task.progress;
      renderTasks();
      alert('已停止检查');
      break;
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
  if (!taskCheckResults[task.id]) taskCheckResults[task.id] = {};
  if (!taskCheckResults[task.id][inspectUploadItemId]) taskCheckResults[task.id][inspectUploadItemId] = {};
  const names = [...(taskCheckResults[task.id][inspectUploadItemId].attachments || []), ...Array.from(files).map(f => f.name)];
  taskCheckResults[task.id][inspectUploadItemId].attachments = names;
  inspectUploadItemId = null;
  e.target.value = '';
  renderInspectTable();
  updateTaskProgress();
  renderInspectTaskDetail();
});
document.getElementById('finishInspect')?.addEventListener('click', () => {
  const task = tasks.find(t => t.id === currentInspectTaskId);
  if (task) { task.status = 'done'; task.progress = 100; task.endTime = new Date().toLocaleString('zh-CN',{hour12:false}).replace(/\//g,'-'); }
  closeInspectView();
  alert('检查已完成！可下载报告或查看详情。');
});
document.getElementById('inspectSearchBtn')?.addEventListener('click', () => { inspectCurrentPage = 1; renderInspectTable(); });
document.getElementById('inspectItemSearch')?.addEventListener('input', renderInspectSidebar);

// 检查详情视图：返回任务列表 / 下载报告
document.getElementById('backToDetailTaskList')?.addEventListener('click', closeDetailView);
document.getElementById('detailDownloadReport')?.addEventListener('click', () => {
  if (detailViewTaskId) downloadReport(detailViewTaskId);
});

// ============ 初始化 ============
renderComplianceGrid();
renderItemsFileList();
initItemsSearchOptions();
renderCheckItems();
renderTasks();
setupTaskScopeSwitch();
