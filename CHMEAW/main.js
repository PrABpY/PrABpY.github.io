const state = {
  dashboard: null,
  payments: [],
  members: [],
  settings: {},
  activeView: 'dashboard'
};

const statusMessage = document.getElementById('status-message');
const connectionStatus = document.getElementById('connection-status');
const lastRefresh = document.getElementById('last-refresh');
const dashboardMetrics = document.getElementById('dashboard-metrics');
const dashboardSummary = document.getElementById('dashboard-summary');
const paymentsGrid = document.getElementById('payments-grid');
const membersGrid = document.getElementById('members-grid');
const settingsForm = document.getElementById('settings-form');
const imageModal = document.getElementById('image-modal');
const imagePreview = document.getElementById('image-preview');
const imageModalTitle = document.getElementById('image-modal-title');
const imageModalSubtitle = document.getElementById('image-modal-subtitle');
const memberModal = document.getElementById('member-modal');
const memberForm = document.getElementById('member-form');

const moneyFormatter = new Intl.NumberFormat('th-TH', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

function escapeHtml(value) {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatMoney(value) {
  const number = Number(value || 0);
  return `${moneyFormatter.format(Number.isFinite(number) ? number : 0)} บาท`;
}

function setMessage(text, type = 'info') {
  if (!statusMessage) return;
  statusMessage.textContent = text;
  statusMessage.dataset.type = type;
  statusMessage.className = `status-banner ${type}`;
  if (text && type !== 'info') {
    window.clearTimeout(setMessage.timer);
    setMessage.timer = window.setTimeout(() => {
      statusMessage.textContent = '';
      statusMessage.className = 'status-banner';
      delete statusMessage.dataset.type;
    }, 4000);
  }
}

function normalizeStatus(value) {
  return String(value || '').trim().toLowerCase();
}

function isConfirmed(record) {
  return normalizeStatus(record.check || record.status) === 'confirmed';
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    let detail = 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์';
    const responseText = await response.text();
    try {
      const payload = responseText ? JSON.parse(responseText) : null;
      detail = payload.detail || detail;
    } catch (error) {
      if (responseText) detail = responseText;
    }
    throw new Error(detail);
  }

  return response.json();
}

function showView(viewName) {
  state.activeView = viewName;
  document.querySelectorAll('[data-view]').forEach((section) => {
    section.classList.toggle('active', section.dataset.view === viewName);
  });
  document.querySelectorAll('[data-nav]').forEach((button) => {
    button.classList.toggle('active', button.dataset.nav === viewName);
  });
}

function renderDashboard() {
  const dashboard = state.dashboard || {};
  const settings = dashboard.settings || state.settings || {};
  const cards = [
    { label: 'ยอดที่ต้องเก็บทั้งหมด', value: formatMoney(dashboard.total_target) },
    { label: 'ยอดที่เก็บได้แล้ว', value: formatMoney(dashboard.total_collected) },
    { label: 'ยอดค้างทั้งหมด', value: formatMoney(dashboard.total_outstanding) },
    { label: 'คนที่ชำระแล้ว', value: `${dashboard.paid_people || 0} คน` },
    { label: 'จำนวนรายชื่อทั้งหมด', value: `${dashboard.total_people || 0} คน` },
    { label: 'ต่อคน', value: formatMoney(settings.amount_per_person || dashboard.amount_per_person) }
  ];

  dashboardMetrics.innerHTML = cards.map((card) => `
    <article class="metric-card">
      <span>${escapeHtml(card.label)}</span>
      <strong>${escapeHtml(card.value)}</strong>
    </article>
  `).join('');

  dashboardSummary.innerHTML = `
    <article class="summary-card accent">
      <span>ชำระครบแล้ว</span>
      <strong>${dashboard.paid_people || 0}/${dashboard.total_people || 0}</strong>
      <p>คิดเป็น ${dashboard.total_people ? Math.round(((dashboard.paid_people || 0) / dashboard.total_people) * 100) : 0}% ของรายชื่อทั้งหมด</p>
    </article>
    <article class="summary-card">
      <span>รอชำระ</span>
      <strong>${dashboard.pending_people || 0}</strong>
      <p>${formatMoney(dashboard.total_outstanding)} ยังค้างอยู่ในระบบ</p>
    </article>
    <article class="summary-card">
      <span>รายการที่ยืนยัน</span>
      <strong>${dashboard.confirmed_payments || 0}</strong>
      <p>จำนวน slip ที่ปักสถานะเรียบร้อยแล้ว</p>
    </article>
  `;
}

function renderPayments() {
  if (!state.payments.length) {
    paymentsGrid.innerHTML = '<div class="empty-state">ยังไม่มีข้อมูลการโอนเงิน</div>';
    return;
  }

  paymentsGrid.innerHTML = state.payments.map((record) => {
    const confirmed = isConfirmed(record);
    const senderName = record.real_name || record.line_name || record.name || '-';
    return `
      <article class="info-card payment-card ${confirmed ? 'is-confirmed' : ''}">
        <div class="card-topline">
          <span class="badge ${confirmed ? 'success' : 'warning'}">${confirmed ? 'Confirmed' : 'Pending'}</span>
          <span class="muted">Row ${record.row}</span>
        </div>
        <h4>${escapeHtml(record.name || '-')}</h4>
        <div class="card-kv">
          <span>จำนวนเงิน</span>
          <div class="editable-money">
            <input type="number" min="0" step="0.01" value="${escapeHtml(record.amount ?? '')}" data-amount-input="${record.row}" />
            <button class="primary-btn" data-save-amount="${record.row}">บันทึกยอด</button>
          </div>
        </div>
        <div class="card-kv">
          <span>เวลา</span>
          <strong>${escapeHtml(record.timestamp || '-')}</strong>
        </div>
        <div class="card-kv">
          <span>ผู้ส่ง</span>
          <strong>${escapeHtml(senderName)}</strong>
        </div>
        <div class="card-actions">
          <button class="ghost-btn" ${record.image_url ? `data-view-image="${escapeHtml(record.image_url)}"` : 'disabled'} data-image-title="${escapeHtml(record.name || 'ภาพสลิป')}" data-image-subtitle="${escapeHtml(record.timestamp || '')}">ดูภาพ</button>
          <button class="primary-btn" data-confirm-payment="${record.row}" ${confirmed ? 'disabled' : ''}>ยืนยัน</button>
        </div>
      </article>
    `;
  }).join('');
}

function renderMembers() {
  if (!state.members.length) {
    membersGrid.innerHTML = '<div class="empty-state">ยังไม่มีข้อมูลรายชื่อ</div>';
    return;
  }

  membersGrid.innerHTML = state.members.map((member) => {
    const remaining = Number(member.remaining || 0);
    const paid = Number(member.confirmed_total || 0);
    const badgeClass = remaining <= 0 ? 'success' : 'warning';
    return `
      <article class="info-card member-card">
        <div class="card-topline">
          <span class="badge ${badgeClass}">${escapeHtml(member.status_text || 'รอชำระ')}</span>
          <span class="muted">Row ${member.row}</span>
        </div>
        <h4>${escapeHtml(member.line_name || '-')}</h4>
        <p class="member-name">${escapeHtml(member.real_name || '-')}</p>
        <div class="card-kv">
          <span>รหัสนักศึกษา</span>
          <strong>${escapeHtml(member.student_id || '-')}</strong>
        </div>
        <div class="card-kv">
          <span>ยอดชำระแล้ว</span>
          <strong>${escapeHtml(formatMoney(paid))}</strong>
        </div>
        <div class="card-kv highlight">
          <span>ยอดค้างชำระ</span>
          <strong>${escapeHtml(formatMoney(remaining))}</strong>
        </div>
        <div class="card-actions">
          <button class="primary-btn" data-edit-member="${member.row}">แก้ไขข้อมูล</button>
        </div>
      </article>
    `;
  }).join('');
}

function fillSettingsForm() {
  const settings = state.settings || {};
  document.getElementById('collection_name').value = settings.collection_name || '';
  document.getElementById('amount_per_person').value = settings.amount_per_person ?? '';
  document.getElementById('deadline').value = settings.deadline || '';
  document.getElementById('note').value = settings.note || '';
  document.getElementById('line_message_template').value = settings.line_message_template || '';
}

function openImageModal({ url, title, subtitle }) {
  const proxiedUrl = `/api/image-proxy?url=${encodeURIComponent(url)}`;
  imagePreview.onerror = () => {
    imagePreview.onerror = null;
    imagePreview.src = url;
  };
  imagePreview.src = proxiedUrl;
  imageModalTitle.textContent = title || 'ภาพสลิป';
  imageModalSubtitle.textContent = subtitle || '';
  imageModal.classList.remove('hidden');
  imageModal.setAttribute('aria-hidden', 'false');
}

function closeImageModal() {
  imageModal.classList.add('hidden');
  imageModal.setAttribute('aria-hidden', 'true');
  imagePreview.removeAttribute('src');
}

function openMemberModal(member) {
  document.getElementById('member-row').value = member.row;
  document.getElementById('member-line-name').value = member.line_name || '';
  document.getElementById('member-real-name').value = member.real_name || '';
  document.getElementById('member-student-id').value = member.student_id || '';
  document.getElementById('member-check').value = member.check || '';
  memberModal.classList.remove('hidden');
  memberModal.setAttribute('aria-hidden', 'false');
}

function closeMemberModal() {
  memberModal.classList.add('hidden');
  memberModal.setAttribute('aria-hidden', 'true');
}

async function refreshData() {
  connectionStatus.textContent = 'กำลังโหลดข้อมูล';
  try {
    const dashboard = await apiRequest('/api/dashboard');
    state.dashboard = dashboard;
    renderDashboard();

    const payments = await apiRequest('/api/payments');
    state.payments = payments.records || [];
    renderPayments();

    const members = await apiRequest('/api/members');
    state.members = members.records || [];
    renderMembers();

    const settings = await apiRequest('/api/settings');
    state.settings = settings || {};
    fillSettingsForm();

    renderDashboard();
    renderPayments();
    renderMembers();

    const now = new Date();
    lastRefresh.textContent = `อัปเดตล่าสุด ${now.toLocaleString('th-TH')}`;
    connectionStatus.textContent = 'เชื่อมต่อแล้ว';
    setMessage('โหลดข้อมูลเรียบร้อย', 'success');
  } catch (error) {
    connectionStatus.textContent = 'เกิดข้อผิดพลาด';
    setMessage(error.message, 'error');
  }
}

async function confirmPayment(row, button) {
  if (button) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = 'กำลังยืนยัน...';
  }

  try {
    await apiRequest(`/api/payments/${row}/confirm`, { method: 'POST' });
    setMessage('ยืนยันรายการสำเร็จและส่งข้อความเข้า LINE แล้ว', 'success');
    await refreshData();
  } catch (error) {
    setMessage(error.message, 'error');
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = button.dataset.originalText || 'ยืนยัน';
      delete button.dataset.originalText;
    }
  }
}

async function savePaymentAmount(row) {
  const record = state.payments.find((item) => String(item.row) === String(row));
  const amountInput = document.querySelector(`[data-amount-input="${row}"]`);
  const amount = amountInput?.value?.trim();

  if (!record) {
    setMessage('ไม่พบข้อมูลรายการนี้', 'error');
    return;
  }

  if (amount === '') {
    setMessage('กรุณากรอกจำนวนเงิน', 'error');
    return;
  }

  try {
    await apiRequest(`/api/records/${row}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: record.name || '',
        amount
      })
    });
    setMessage('บันทึกยอดเงินเรียบร้อย', 'success');
    await refreshData();
  } catch (error) {
    setMessage(error.message, 'error');
  }
}

async function saveMember() {
  const row = document.getElementById('member-row').value;
  const payload = {
    line_name: document.getElementById('member-line-name').value.trim(),
    real_name: document.getElementById('member-real-name').value.trim(),
    student_id: document.getElementById('member-student-id').value.trim(),
    check: document.getElementById('member-check').value.trim()
  };

  try {
    await apiRequest(`/api/members/${row}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    closeMemberModal();
    setMessage('บันทึกข้อมูลรายชื่อเรียบร้อย', 'success');
    await refreshData();
  } catch (error) {
    setMessage(error.message, 'error');
  }
}

async function saveSettings(event) {
  event.preventDefault();
  const payload = {
    collection_name: document.getElementById('collection_name').value.trim(),
    amount_per_person: document.getElementById('amount_per_person').value,
    deadline: document.getElementById('deadline').value,
    note: document.getElementById('note').value.trim(),
    line_message_template: document.getElementById('line_message_template').value.trim()
  };

  try {
    await apiRequest('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    setMessage('บันทึกการตั้งค่าเรียบร้อย', 'success');
    await refreshData();
  } catch (error) {
    setMessage(error.message, 'error');
  }
}

document.addEventListener('click', (event) => {
  const navButton = event.target.closest('[data-nav]');
  if (navButton) {
    showView(navButton.dataset.nav);
  }

  const confirmButton = event.target.closest('[data-confirm-payment]');
  if (confirmButton) {
    confirmPayment(confirmButton.dataset.confirmPayment, confirmButton);
  }

  const saveAmountButton = event.target.closest('[data-save-amount]');
  if (saveAmountButton) {
    savePaymentAmount(saveAmountButton.dataset.saveAmount);
  }

  const imageButton = event.target.closest('[data-view-image]');
  if (imageButton) {
    openImageModal({
      url: imageButton.dataset.viewImage,
      title: imageButton.dataset.imageTitle,
      subtitle: imageButton.dataset.imageSubtitle
    });
  }

  const memberButton = event.target.closest('[data-edit-member]');
  if (memberButton) {
    const member = state.members.find((item) => String(item.row) === String(memberButton.dataset.editMember));
    if (member) openMemberModal(member);
  }

  if (event.target.matches('[data-close-modal]')) {
    closeImageModal();
  }

  if (event.target.matches('[data-close-member-modal]')) {
    closeMemberModal();
  }
});

document.getElementById('refresh-all').addEventListener('click', refreshData);
document.getElementById('jump-payments').addEventListener('click', () => showView('payments'));
settingsForm.addEventListener('submit', saveSettings);
memberForm.addEventListener('submit', (event) => {
  event.preventDefault();
  saveMember();
});

window.addEventListener('DOMContentLoaded', async () => {
  showView('dashboard');
  await refreshData();
});
