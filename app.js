document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('workbook-form');
    const textareas = form.querySelectorAll('textarea');
    const progressFill = document.getElementById('progress-fill');
    const progressPercent = document.getElementById('progress-percent');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.workbook-section');
    const saveBtn = document.getElementById('save-btn');
    const exportBtn = document.getElementById('export-btn');
    const toast = document.getElementById('toast');

    // Load saved data
    const loadData = () => {
        const savedData = JSON.parse(localStorage.getItem('industry_research_v1') || '{}');
        Object.entries(savedData).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.value = value;
        });
        updateProgress();
    };

    // Save data
    const saveData = () => {
        const data = {};
        textareas.forEach(textarea => {
            data[textarea.id] = textarea.value;
        });
        localStorage.setItem('industry_research_v1', JSON.stringify(data));
        showToast('進捗を保存しました');
    };

    // Update Progress
    const updateProgress = () => {
        const total = textareas.length;
        const filled = Array.from(textareas).filter(t => t.value.trim() !== '').length;
        const percent = Math.round((filled / total) * 100);
        
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

    // Export Data
    const exportData = () => {
        let content = "業界研究ワークブック（税理士業界）\n";
        content += "====================================\n\n";
        
        sections.forEach((section, index) => {
            const title = section.querySelector('.section-title').textContent;
            const answer = section.querySelector('textarea').value;
            content += `${index + 1}. ${title}\n`;
            content += `回答:\n${answer || '(未入力)'}\n`;
            content += "------------------------------------\n\n";
        });

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'industry_research_result.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Active Navigation on Scroll
    const updateActiveNav = () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    };

    // Event Listeners
    textareas.forEach(textarea => {
        textarea.addEventListener('input', updateProgress);
    });

    saveBtn.addEventListener('click', saveData);
    exportBtn.addEventListener('click', exportData);
    window.addEventListener('scroll', updateActiveNav);

    // Initial Load
    loadData();
    updateActiveNav();
});
