document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('workbook-form');
    const textareas = document.querySelectorAll('textarea');
    const progressFill = document.getElementById('progress-fill');
    const progressPercent = document.getElementById('progress-percent');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.workbook-section');

    const saveBtn = document.getElementById('save-btn');
    const exportBtn = document.getElementById('export-btn');
    const copyBtn = document.getElementById('copy-btn');
    const resetBtn = document.getElementById('reset-btn');
    const toast = document.getElementById('toast');

    const STORAGE_KEY = 'industry_research_v2';

    // 強制的にキャッシュ（テスト等の入力内容）を一度リセットします
    localStorage.removeItem(STORAGE_KEY);

    // Load saved data
    const loadData = () => {
        const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        textareas.forEach(textarea => {
            if (savedData[textarea.id]) {
                textarea.value = savedData[textarea.id];
            }
        });
        updateProgress();
    };

    // Save data
    const saveData = () => {
        const data = {};
        textareas.forEach(textarea => {
            data[textarea.id] = textarea.value;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        showToast('進捗を保存しました');
    };

    // Update Progress
    const updateProgress = () => {
        const total = textareas.length;
        const filled = Array.from(textareas).filter(t => t.value.trim() !== '').length;
        const percent = total > 0 ? Math.round((filled / total) * 100) : 0;

        progressFill.style.width = `${percent}%`;
        progressPercent.textContent = `${percent}%`;
    };

    // Show Toast
    const showToast = (message) => {
        toast.textContent = message;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 2000);
    };

    // Generate Text Content
    const generateTextContent = () => {
        let content = "業界研究ワークブック（税理士業界）\n";
        content += "====================================\n\n";

        sections.forEach((section, index) => {
            const titleEl = section.querySelector('.section-title');
            const textareas = section.querySelectorAll('textarea');
            if (titleEl && textareas.length > 0) {
                const title = titleEl.textContent;
                content += `■ ${title}\n`;

                textareas.forEach((textareaEl, tIndex) => {
                    const answer = textareaEl.value;
                    let questionText = '';

                    // Try to find the question text associated with this textarea
                    const block = textareaEl.closest('.question-block');
                    if (block) {
                        const pEl = block.querySelector('p');
                        if (pEl) {
                            questionText = pEl.textContent.replace('👉', '').trim() + '\n';
                        }
                    }

                    if (textareas.length > 1) {
                        content += `【質問】 ${questionText}回答 ${tIndex + 1}:\n${answer || '(未入力)'}\n\n`;
                    } else {
                        content += `回答:\n${answer || '(未入力)'}\n\n`;
                    }
                });
                content += "------------------------------------\n\n";
            }
        });
        
        return content;
    };

    // Export Data
    const exportData = () => {
        const content = generateTextContent();
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'industry_research_result.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Copy Data
    const copyData = () => {
        const content = generateTextContent();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(content).then(() => {
                showToast('クリップボードにコピーしました');
            }).catch(err => {
                console.error('コピーに失敗しました', err);
                showToast('コピーに失敗しました');
            });
        } else {
            // Fallback for older browsers / webviews
            const textArea = document.createElement("textarea");
            textArea.value = content;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showToast('クリップボードにコピーしました');
            } catch (err) {
                console.error('コピーに失敗しました', err);
                showToast('コピーに失敗しました');
            }
            document.body.removeChild(textArea);
        }
    };

    // Reset Form
    const resetForm = () => {
        if (confirm('全ての入力を削除してリセットしますか？')) {
            localStorage.removeItem(STORAGE_KEY);
            textareas.forEach(t => {
                t.value = '';
            });
            updateProgress();
            showToast('リセットしました');
        }
    };

    // Active Navigation on Scroll
    const updateActiveNav = () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.slice(1) === current) {
                link.classList.add('active');
            }
        });
    };

    // Event Listeners
    textareas.forEach(textarea => {
        textarea.addEventListener('input', updateProgress);
    });

    if (saveBtn) saveBtn.addEventListener('click', saveData);
    if (resetBtn) resetBtn.addEventListener('click', resetForm);
    if (exportBtn) exportBtn.addEventListener('click', exportData);
    if (copyBtn) copyBtn.addEventListener('click', copyData);

    window.addEventListener('scroll', updateActiveNav);

    // Initial Load
    loadData();
    updateActiveNav();
});
