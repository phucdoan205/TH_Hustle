/**
 * EcoTech Loop - Main Application Logic (Bright & Fresh Theme)
 * Interactive Waste Valuation Calculator, O2O Stepper, Drop-Off Map, Modals & Toast System
 */

// ==========================================
// 1. STATE MANAGEMENT & CALCULATOR ENGINE
// ==========================================
const state = {
  quantities: {
    battery: 4,     // Pin các loại (AA, AAA, 18650, cúc áo)
    cable: 2,       // Dây cáp sạc, củ sạc
    headphone: 1,   // Tai nghe, loa bluetooth mini
    phone: 1,       // Điện thoại, máy tính bảng vỡ
    accessory: 0    // Chuột, bàn phím, webcam, v.v.
  },
  rates: {
    // [weight (kg), co2 reduction (kg), points, water saved (Liters)]
    battery: { weight: 0.05, co2: 0.35, points: 15, water: 500 },
    cable: { weight: 0.08, co2: 0.25, points: 10, water: 80 },
    headphone: { weight: 0.12, co2: 0.80, points: 25, water: 200 },
    phone: { weight: 0.20, co2: 1.70, points: 65, water: 600 },
    accessory: { weight: 0.30, co2: 1.20, points: 30, water: 300 }
  },
  selectedPlatform: 'Shopee'
};

/**
 * Update item quantity in the calculator (+1 / -1)
 * @param {string} item - The key of the item
 * @param {number} change - Delta (+1 or -1)
 */
function updateQty(item, change) {
  const current = state.quantities[item] || 0;
  const next = Math.max(0, current + change);
  state.quantities[item] = next;
  
  const qtyEl = document.getElementById(`qty-${item}`);
  if (qtyEl) qtyEl.textContent = next;
  
  recalculateStats();
}

/**
 * Recalculate stats based on current quantities
 */
function recalculateStats() {
  let totalWeight = 0;
  let totalCO2 = 0;
  let totalWater = 0;
  let totalPoints = 0;

  for (const [key, qty] of Object.entries(state.quantities)) {
    const rate = state.rates[key];
    totalWeight += qty * rate.weight;
    totalCO2 += qty * rate.co2;
    totalPoints += qty * rate.points;
    totalWater += qty * rate.water;
  }

  // Update DOM displays
  const resWeight = document.getElementById('resWeight');
  const resCO2 = document.getElementById('resCO2');
  const resWater = document.getElementById('resWater');
  const resPoints = document.getElementById('resPoints');

  if (resWeight) resWeight.textContent = totalWeight.toFixed(2);
  if (resCO2) resCO2.textContent = totalCO2.toFixed(2);
  if (resWater) resWater.textContent = Math.round(totalWater).toLocaleString('vi-VN');
  if (resPoints) resPoints.textContent = totalPoints;

  // Dynamic Voucher Calculation
  const voucherBadge = document.getElementById('voucherPlatformBadge');
  const voucherValue = document.getElementById('voucherValueText');
  if (voucherBadge) voucherBadge.textContent = `${state.selectedPlatform} Eco Voucher`;

  if (voucherValue) {
    if (totalPoints === 0) {
      voucherValue.textContent = "GIẢM 0 VNĐ";
    } else if (totalPoints < 50) {
      voucherValue.textContent = "GIẢM 15.000 VNĐ";
    } else if (totalPoints < 120) {
      voucherValue.textContent = "GIẢM 30.000 VNĐ";
    } else if (totalPoints < 200) {
      voucherValue.textContent = "GIẢM 50.000 VNĐ";
    } else {
      voucherValue.textContent = "GIẢM 100.000 VNĐ";
    }
  }
}

/**
 * Select E-Commerce Platform for Voucher Reward
 * @param {string} plat - 'Shopee' | 'Lazada' | 'TikTokShop'
 */
function selectPlatform(plat) {
  state.selectedPlatform = plat;
  ['Shopee', 'Lazada', 'TikTok'].forEach(p => {
    const el = document.getElementById(`plat${p}`);
    if (!el) return;
    if ((p === 'TikTok' && plat === 'TikTokShop') || p === plat) {
      el.className = "py-2.5 px-3.5 rounded-xl border-2 border-actionOrange bg-orange-50 text-actionOrange font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm";
    } else {
      el.className = "py-2.5 px-3.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 font-medium text-xs flex items-center justify-center gap-1.5 transition-all";
    }
  });
  recalculateStats();
  showToast(`Đã chọn nhận Voucher đổi điểm trên sàn ${plat}!`);
}

/**
 * Trigger voucher claim simulation modal
 */
function claimVoucherSimulation() {
  const pointsEl = document.getElementById('resPoints');
  const points = pointsEl ? parseInt(pointsEl.textContent, 10) : 0;
  if (points <= 0) {
    showToast("Vui lòng chọn ít nhất 1 món đồ rác thải điện tử để nhận điểm!", "error");
    return;
  }
  openModal('dropoffModal');
}

/**
 * Confirm completion of drop-off in modal
 */
function confirmDropoffComplete() {
  closeModal('dropoffModal');
  showToast("Chúc mừng! Đã ghi nhận thả rác thành công. +Voucher đã được chuyển vào ví sàn TMĐT của bạn!", "success");
}

// ==========================================
// 2. 4-STEP O2O INTERACTIVE SOLUTION
// ==========================================
const stepDetails = {
  1: {
    phase: "Giai đoạn 1 &bull; Người Tiêu Dùng O2O",
    title: "Phân loại dễ dàng ngay tại Smart Drop-box",
    desc: "Người dùng gom các loại rác điện tử nhỏ lẻ phát sinh từ mua sắm online: củ sạc cháy, cáp đứt ngầm, pin sạc dự phòng chai phù, tai nghe Bluetooth hỏng 1 bên. Mở Mini App của LHU Green",
    features: [
      "Quét mã ngay trong Zalo",
      "Dự định sẽ có mặt tại cs1, cs2, cs5 tại Trường Đại học Lạc Hồng",
      "Hỗ trợ tích điểm để quy đổi"
    ]
  },
  2: {
    phase: "Giai đoạn 2 &bull; Tiếp Nhận Tại Smart Drop-box",
    title: "Thả rác tự động & Quét mã QR",
    desc: "Đến các trạm Smart Drop-box đặt tại các cơ sở của Trường. Quét mã QR trên Smart Drop-box",
    features: [
      "Khóa an toàn",
      "Cảm biến cân đo chuẩn xác đến từng gram",
      "Hạn chế hư hỏng"
    ]
  },
  3: {
    phase: "Giai đoạn 3 &bull; Tích Điểm Xanh & Ví Điện Tử",
    title: "Nhận Green Points khi quét mã QR",
    desc: "Ngay khi cửa tủ đóng lại và hệ thống hoàn tất kiểm đếm, điểm thưởng Green Points sẽ được chuyển thẳng vào ví LHU Green.",
    features: [
      "Cộng điểm thời gian thực",
      "Sẽ có bảng xếp hạng",
      "Tích lũy hạng thẻ thành viên"
    ]
  },
  4: {
    phase: "Giai đoạn 4 &bull; Đổi Voucher & Tái Chế Khép Kín",
    title: "Đổi Voucher để áp dụng",
    desc: "Người dùng sử dụng điểm để lấy voucher giảm giá.",
    features: [
      "Voucher áp dụng",
      "Kích cầu mua sắm sản phẩm công nghệ xanh",
      "Thu hồi 98% kim loại quý và đất hiếm"
    ]
  }
};

/**
 * Switch active step in O2O interactive showcase
 * @param {number} stepNum - 1 to 4
 */
function switchStep(stepNum) {
  for (let i = 1; i <= 4; i++) {
    const btn = document.getElementById(`stepBtn${i}`);
    if (!btn) continue;
    if (i === stepNum) {
      btn.className = "p-4 sm:p-5 rounded-2xl glass-card border-2 border-ecoGreen bg-white shadow-md cursor-pointer transition-all flex items-start gap-4";
      btn.querySelector('div').className = "w-10 h-10 rounded-xl bg-gradient-to-tr from-cyberCyan to-ecoGreen text-white font-extrabold flex items-center justify-center shrink-0 shadow-sm";
    } else {
      btn.className = "p-4 sm:p-5 rounded-2xl glass-card border border-slate-200/90 hover:border-slate-300 bg-white/70 hover:bg-white cursor-pointer transition-all flex items-start gap-4";
      btn.querySelector('div').className = "w-10 h-10 rounded-xl bg-slate-100 text-slate-600 font-extrabold flex items-center justify-center shrink-0 border border-slate-200";
    }
  }

  const data = stepDetails[stepNum];
  const box = document.getElementById('stepDetailContent');
  if (box && data) {
    box.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-ecoGreen border border-emerald-200">
          ${data.phase}
        </span>
        <span class="text-xs font-mono text-slate-500">Bước ${stepNum}/4 &bull; Tối ưu O2O</span>
      </div>

      <div class="space-y-3">
        <h3 class="text-2xl font-extrabold text-slate-900">${data.title}</h3>
        <p class="text-slate-600 text-sm leading-relaxed">${data.desc}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        ${data.features.map(f => `
          <div class="flex items-center gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <i class="fa-solid fa-circle-check text-ecoGreen"></i>
            <span>${f}</span>
          </div>
        `).join('')}
      </div>
    `;
  }
}

// ==========================================
// 3. DROP-OFF LOCATIONS & GOOGLE MAPS ENGINE
// ==========================================
const dropoffLocations = {
  1: {
    name: "Trường đại học Lạc Hồng (Cơ sở 1)",
    badge: '<i class="fa-solid fa-graduation-cap text-ecoGreen mr-1"></i> Cơ sở 1 &bull; Trụ sở chính',
    address: "Số 10 Huỳnh Văn Nghệ, Trấn Biên, Đồng Nai, Việt Nam",
    hours: "07:00 - 20:30",
    mapUrl: "https://maps.google.com/maps?q=10.9530222,106.8022549&t=&z=17&ie=UTF8&iwloc=&output=embed",
    directUrl: "https://maps.app.goo.gl/WjHapgoaRFmEgh1c7"
  },
  2: {
    name: "Trường đại học Lạc Hồng (Cơ sở 2)",
    badge: '<i class="fa-solid fa-graduation-cap text-cyberCyan mr-1"></i> Cơ sở 2 &bull; Khu thực hành',
    address: "15/3B Huỳnh Văn Nghệ, P. Trấn Biên, Đồng Nai, Việt Nam",
    hours: "06:00 - 22:00",
    mapUrl: "https://maps.google.com/maps?q=10.9550497,106.8020956&t=&z=17&ie=UTF8&iwloc=&output=embed",
    directUrl: "https://maps.app.goo.gl/TGGhq72u5YUwq2i28"
  },
  3: {
    name: "Trường đại học Lạc Hồng (Cơ sở 5)",
    badge: '<i class="fa-solid fa-graduation-cap text-ecoGreen mr-1"></i> Cơ sở 5 &bull; Trung tâm Công nghệ',
    address: "XQ4Q+VH5, 579 Tân Ba - Bửu Long, Trấn Biên, Đồng Nai, Việt Nam",
    hours: "07:30 - 20:30",
    mapUrl: "https://maps.google.com/maps?q=10.9571446,106.7889922&t=&z=17&ie=UTF8&iwloc=&output=embed",
    directUrl: "https://maps.app.goo.gl/A85W1wfZkGTLJhte9"
  }
};

/**
 * Focus and display Google Maps for a campus
 * @param {number} index - 1, 2, or 3
 */
function focusDropoff(index) {
  const loc = dropoffLocations[index];
  if (!loc) return;

  // 1. Update Map Iframe
  const iframe = document.getElementById('googleMapIframe');
  if (iframe) {
    iframe.src = loc.mapUrl;
  }

  // 2. Update Map Header & Footer Information
  const badgeEl = document.getElementById('activeMapBadge');
  const nameEl = document.getElementById('activeMapName');
  const addressEl = document.getElementById('activeMapAddress');
  const hoursEl = document.getElementById('activeMapHours');
  const directLinkEl = document.getElementById('openGoogleMapsBtn');

  if (badgeEl) badgeEl.innerHTML = loc.badge;
  if (nameEl) nameEl.textContent = loc.name;
  if (addressEl) addressEl.textContent = loc.address;
  if (hoursEl) hoursEl.textContent = loc.hours;
  if (directLinkEl) directLinkEl.href = loc.directUrl;

  // 3. Highlight selected card and campus button
  for (let i = 1; i <= 3; i++) {
    const card = document.getElementById(`locCard${i}`);
    const btn = document.getElementById(`campusBtn${i}`);
    
    if (card) {
      if (i === index) {
        card.className = "loc-item p-4 rounded-2xl glass-card border-2 border-ecoGreen ring-2 ring-emerald-400/20 bg-emerald-50/30 transition-all cursor-pointer shadow-md";
      } else {
        card.className = "loc-item p-4 rounded-2xl glass-card border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer bg-white shadow-xs";
      }
    }

    if (btn) {
      if (i === index) {
        btn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyberCyan to-ecoGreen text-white transition-all shrink-0 shadow-sm flex items-center gap-1.5";
      } else {
        btn.className = "px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all shrink-0 flex items-center gap-1.5";
      }
    }
  }

  const allBtn = document.getElementById('campusAll');
  if (allBtn) {
    allBtn.className = "px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all shrink-0 flex items-center gap-1.5";
  }

  showToast(`Đã chuyển bản đồ đến: ${loc.name}`);
}

/**
 * Filter / reset campus view
 */
function filterMapCampus(filter) {
  const items = document.querySelectorAll('.loc-item');
  items.forEach(item => {
    item.style.display = 'block';
  });

  const allBtn = document.getElementById('campusAll');
  if (allBtn) {
    allBtn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyberCyan to-ecoGreen text-white transition-all shrink-0 shadow-sm flex items-center gap-1.5";
  }

  for (let i = 1; i <= 3; i++) {
    const btn = document.getElementById(`campusBtn${i}`);
    if (btn) {
      btn.className = "px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all shrink-0 flex items-center gap-1.5";
    }
  }

  focusDropoff(1);
}

function searchDropoffLocations() {
  const input = document.getElementById('mapSearchInput');
  if (!input) return;
  const term = input.value.toLowerCase().trim();
  const items = document.querySelectorAll('.loc-item');
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(term) ? 'block' : 'none';
  });
}

// ==========================================
// 4. FAQ ACCORDION
// ==========================================
function toggleFaq(id) {
  const ans = document.getElementById(`faqAnswer${id}`);
  const icon = document.getElementById(`faqIcon${id}`);
  if (!ans || !icon) return;
  if (ans.classList.contains('hidden')) {
    ans.classList.remove('hidden');
    icon.classList.add('rotate-180');
  } else {
    ans.classList.add('hidden');
    icon.classList.remove('rotate-180');
  }
}

// ==========================================
// 5. MODAL SYSTEM
// ==========================================
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('hidden');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('hidden');
}

// ==========================================
// 6. MOBILE NAVIGATION
// ==========================================
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('hidden');
}

// ==========================================
// 7. TOAST NOTIFICATION SYSTEM
// ==========================================
function showToast(message, type = 'info') {
  const toast = document.getElementById('toastNotification');
  const msg = document.getElementById('toastMessage');
  const title = document.getElementById('toastTitle');
  const icon = document.getElementById('toastIcon');

  if (!toast || !msg || !title || !icon) return;

  msg.textContent = message;
  if (type === 'success') {
    title.textContent = "Thành công!";
    icon.innerHTML = '<i class="fa-solid fa-circle-check text-ecoGreen"></i>';
    icon.className = "w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0";
  } else if (type === 'error') {
    title.textContent = "Chú ý";
    icon.innerHTML = '<i class="fa-solid fa-circle-exclamation text-actionOrange"></i>';
    icon.className = "w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shrink-0";
  } else {
    title.textContent = "EcoTech Loop";
    icon.innerHTML = '<i class="fa-solid fa-bell text-cyberCyan"></i>';
    icon.className = "w-9 h-9 rounded-xl bg-cyan-100 flex items-center justify-center shrink-0";
  }

  toast.classList.remove('hidden', 'translate-y-4');
  setTimeout(() => {
    toast.classList.add('translate-y-4');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 4000);
}

// ==========================================
// 8. B2B SUBMISSION & SAMPLE REPORT EXPORT
// ==========================================
function handleB2BSubmit(e) {
  e.preventDefault();
  closeModal('b2bModal');
  showToast("Cảm ơn bạn! Hồ sơ giải pháp EPR 2026 & hợp đồng mẫu đã được gửi tới email của doanh nghiệp.", "success");
}

function downloadReportMock() {
  showToast("Đang tạo tệp Báo cáo Kiểm toán EPR & Chứng chỉ Carbon Q1/2026 (PDF chuẩn GRI)...", "info");
  setTimeout(() => {
    showToast("Đã tải xong: EcoTechLoop_EPR_Audit_Report_2026.pdf", "success");
  }, 1500);
}

function subscribeNewsletter() {
  const input = document.getElementById('newsletterEmail');
  if (!input) return;
  const email = input.value;
  if (!email || !email.includes('@')) {
    showToast("Vui lòng nhập địa chỉ email hợp lệ!", "error");
    return;
  }
  input.value = '';
  showToast("Đăng ký thành công! Bạn sẽ nhận được bản tin xu hướng TMĐT xanh và voucher sớm nhất.", "success");
}

// ==========================================
// 9. INITIALIZATION
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  recalculateStats();

  const mobileBtn = document.getElementById('mobileMenuBtn');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', toggleMobileMenu);
  }
});
