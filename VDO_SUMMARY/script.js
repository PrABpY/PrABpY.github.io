document.addEventListener('DOMContentLoaded', () => {
    // === Elements ===
    const fileInput = document.getElementById('file-input');
    const newSummaryBtn = document.getElementById('new-summary-btn');

    const mainVideo = document.getElementById('main-video');
    const metaTitle = document.getElementById('meta-title');
    const metaDetails = document.getElementById('meta-details');

    const loadingOverlay = document.getElementById('video-loading-overlay');
    const loadingStatus = document.getElementById('loading-status');
    const loadingProgress = document.getElementById('loading-progress');

    const videoListBody = document.getElementById('video-list-body');
    const searchInput = document.getElementById('search-input');

    const summaryOverviewText = document.getElementById('summary-overview-text');
    const summaryAccordion = document.getElementById('summary-accordion');
    const copySummaryBtn = document.getElementById('copy-summary-btn');

    // === State ===
    let videoLibrary = [];
    let activeVideoId = null;
    let currentWs = null;

    // === Initialization ===
    loadLibraryFromServer();

    // === Event Listeners ===
    if (newSummaryBtn) newSummaryBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);
    searchInput.addEventListener('input', (e) => renderLibrary(e.target.value));
    copySummaryBtn.addEventListener('click', () => {
        const text = summaryAccordion.innerText;
        if (!text) return showToast('ไม่มีข้อมูลสรุปให้คัดลอก');
        navigator.clipboard.writeText(summaryOverviewText.innerText + '\n\n' + text)
            .then(() => showToast('คัดลอกสรุปแล้ว!'))
            .catch(() => showToast('ไม่สามารถคัดลอกได้'));
    });

    // === Library API Functions ===
    async function loadLibraryFromServer() {
        try {
            const res = await fetch('https://tpqi-aiservices-uat.tpqi.go.th/videos/');
            if (res.ok) {
                videoLibrary = await res.json();
                renderLibrary();
            }
        } catch (err) {
            console.error('ไม่สามารถโหลดคลังวิดีโอ:', err);
            showToast('ไม่สามารถเชื่อมต่อกับ Server ได้');
        }
    }

    async function handleDeleteVideo(e, videoId) {
        e.stopPropagation();
        if (!confirm('ต้องการลบวิดีโอนี้ออกจากคลังหรือไม่?')) return;

        try {
            const res = await fetch(`https://tpqi-aiservices-uat.tpqi.go.th/videos/${videoId}`, { method: 'DELETE' });
            if (res.ok) {
                videoLibrary = videoLibrary.filter(v => v.id !== videoId);
                if (activeVideoId === videoId) {
                    activeVideoId = null;
                    mainVideo.src = '';
                    metaTitle.innerText = 'เลือกวิดีโอจากคลัง';
                    metaDetails.innerText = '';
                    summaryOverviewText.innerText = 'ยังไม่มีข้อมูลสรุป อัปโหลดวิดีโอเพื่อเริ่มต้น';
                    summaryAccordion.innerHTML = '';
                }
                renderLibrary(searchInput.value);
                showToast('ลบวิดีโอเรียบร้อยแล้ว');
            } else {
                showToast('เกิดข้อผิดพลาดในการลบ');
            }
        } catch (err) {
            console.error(err);
            showToast('ไม่สามารถเชื่อมต่อกับ Server ได้');
        }
    }

    // === Render Functions ===
    function renderLibrary(filterText = '') {
        videoListBody.innerHTML = '';
        const lowerFilter = filterText.toLowerCase();

        const filtered = videoLibrary.filter(v => v.title.toLowerCase().includes(lowerFilter));

        if (filtered.length === 0) {
            videoListBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; padding:32px; color:var(--gray-500);">
                        ${filterText ? 'ไม่พบวิดีโอที่ตรงกับการค้นหา' : 'ยังไม่มีวิดีโอในคลัง'}
                    </td>
                </tr>`;
            return;
        }

        filtered.forEach(video => {
            const tr = document.createElement('tr');
            if (video.id === activeVideoId) tr.classList.add('active-row');

            const isProcessing = video.duration === 'กำลังประมวลผล';
            tr.innerHTML = `
                <td>
                    <strong>${video.title}</strong>
                    ${isProcessing ? '<span style="font-size:11px;background:#fef3c7;color:#92400e;padding:2px 6px;border-radius:4px;margin-left:8px;">กำลังประมวลผล</span>' : ''}
                </td>
                <td>${video.date}</td>
                <td>${video.duration}</td>
                <td>${video.size}</td>
                <td style="display:flex;gap:6px;">
                    <button class="row-btn view-btn" title="โหลดวิดีโอ">📂 เปิด</button>
                    <button class="row-btn delete-btn" title="ลบวิดีโอ" style="color:#dc2626;border-color:#fca5a5;">ลบ</button>
                </td>
            `;

            tr.querySelector('.view-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                loadVideo(video);
            });
            tr.querySelector('.delete-btn').addEventListener('click', (e) => handleDeleteVideo(e, video.id));
            tr.addEventListener('click', () => loadVideo(video));

            videoListBody.appendChild(tr);
        });
    }

    function loadVideo(video) {
        activeVideoId = video.id;
        renderLibrary(searchInput.value);

        metaTitle.innerText = video.title;
        metaDetails.innerText = `📅 ${video.date} • ⏱ ${video.duration} • 💾 ${video.size}`;

        const placeholder = document.getElementById('video-placeholder');
        if (video.url) {
            mainVideo.src = video.url;
            mainVideo.style.display = 'block';
            if (placeholder) placeholder.style.display = 'none';
        } else {
            mainVideo.src = '';
            mainVideo.style.display = 'none';
            if (placeholder) placeholder.style.display = 'flex';
        }

        renderSummary(video.summary);
    }

    function renderSummary(summaryData) {
        summaryAccordion.innerHTML = '';
        if (!summaryData || summaryData.length === 0) {
            summaryOverviewText.innerText = 'ยังไม่มีข้อมูลสรุปสำหรับวิดีโอนี้';
            return;
        }

        const overviewTitles = summaryData.slice(0, 3).map(s => s.title).join(', ');
        summaryOverviewText.innerText = `การประชุมนี้พูดถึง ${overviewTitles} และประเด็นอื่นๆ`;

        summaryData.forEach((item, index) => {
            const nextItem = summaryData[index + 1];
            const startTimeStr = formatTime(item.timestamp || 0);
            const endTimeStr = nextItem ? formatTime(nextItem.timestamp) : 'จบ';

            let bulletsHTML = '';
            if (item.summary) {
                const lines = item.summary.split('\n').filter(l => l.trim().length > 0);
                if (lines.length > 1) {
                    bulletsHTML = '<ul>' + lines.map(l => `<li>${l.replace(/^[-*•]\s*/, '')}</li>`).join('') + '</ul>';
                } else {
                    bulletsHTML = `<p>${item.summary}</p>`;
                }
            }

            const topicDiv = document.createElement('div');
            topicDiv.className = 'topic-item';
            topicDiv.innerHTML = `
                <div class="topic-header" onclick="seekVideo(${item.timestamp || 0})">
                    <div class="topic-number">${index + 1}</div>
                    <div class="topic-title-area">
                        <div class="topic-title-row">
                            <div class="topic-title">${item.title || 'ไม่มีชื่อหัวข้อ'}</div>
                            <div class="topic-time">${startTimeStr} - ${endTimeStr}</div>
                        </div>
                        <div class="topic-body">${bulletsHTML}</div>
                    </div>
                </div>
            `;
            summaryAccordion.appendChild(topicDiv);
        });
    }

    window.seekVideo = function (seconds) {
        if (mainVideo && mainVideo.src) {
            mainVideo.currentTime = seconds;
            mainVideo.play();
        }
    };

    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    async function handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Optimistically add to UI
        const tempId = 'temp_' + Date.now();
        const tempVideo = {
            id: tempId,
            title: file.filename || file.name,
            date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
            duration: 'กำลังประมวลผล',
            size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
            url: URL.createObjectURL(file),
            summary: []
        };
        videoLibrary.unshift(tempVideo);
        loadVideo(tempVideo);

        // Show loading
        loadingOverlay.style.display = 'flex';
        loadingStatus.innerText = 'กำลังอัปโหลด...';
        loadingProgress.style.width = '10%';

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('https://tpqi-aiservices-uat.tpqi.go.th/upload/', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.task_id) {
                // Replace temp entry with real one from server
                const realId = data.task_id;
                tempVideo.id = realId;
                activeVideoId = realId;
                renderLibrary(searchInput.value);
                connectWebSocket(realId, tempVideo);
            }
        } catch (err) {
            console.error(err);
            showToast('เกิดข้อผิดพลาดในการอัปโหลด');
            loadingOverlay.style.display = 'none';
            videoLibrary = videoLibrary.filter(v => v.id !== tempId);
            renderLibrary();
        }

        fileInput.value = '';
    }

    function connectWebSocket(taskId, videoObj) {
        if (currentWs) currentWs.close();
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        currentWs = new WebSocket(`wss://tpqi-aiservices-uat.tpqi.go.th/ws/${taskId}`);

        currentWs.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.status) loadingStatus.innerText = data.status;
            if (data.progress) loadingProgress.style.width = `${data.progress}%`;

            if (data.result && data.result.length > 0 && activeVideoId === videoObj.id) {
                videoObj.summary = data.result;
                renderSummary(data.result);
            }

            if (data.status === 'เสร็จสิ้น') {
                loadingOverlay.style.display = 'none';
                showToast('ถอดเสียงและสรุปเสร็จสมบูรณ์!');

                videoObj.summary = data.result || [];
                videoObj.url = data.video_url || videoObj.url;

                // Reload library from server to get updated duration/url from DB
                loadLibraryFromServer().then(() => {
                    if (activeVideoId === videoObj.id) {
                        const updated = videoLibrary.find(v => v.id === videoObj.id);
                        if (updated) loadVideo(updated);
                    }
                });

                currentWs.close();
            } else if (data.status === 'เกิดข้อผิดพลาด') {
                loadingOverlay.style.display = 'none';
                showToast('เกิดข้อผิดพลาด: ' + (data.message || ''));
                currentWs.close();
            }
        };

        currentWs.onerror = () => {
            showToast('การเชื่อมต่อ WebSocket ขัดข้อง');
            loadingOverlay.style.display = 'none';
        };
    }

    function showToast(msg) {
        const toast = document.getElementById('toast');
        toast.innerText = msg;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    }
});
