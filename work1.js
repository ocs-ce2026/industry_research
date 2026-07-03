document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('worksheet-form');
    const saveBtn = document.getElementById('save-btn');
    const clearBtn = document.getElementById('clear-btn');
    const toast = document.getElementById('toast');

    // Load saved data
    const savedData = JSON.parse(localStorage.getItem('industry_work_1') || '{}');
    Object.keys(savedData).forEach(key => {
        const input = form.elements[key];
        if (input) {
            input.value = savedData[key];
        }
    });

    // Save logic
    const showToast = (message) => {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    saveBtn.addEventListener('click', () => {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        localStorage.setItem('industry_work_1', JSON.stringify(data));
        showToast('進捗を保存しました！');
    });

    // Clear logic
    clearBtn.addEventListener('click', () => {
        if (confirm('入力をすべてクリアしますか？')) {
            form.reset();
            localStorage.removeItem('industry_work_1');
            showToast('クリアしました');
        }
    });

    // Animate on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once visible, no need to observe anymore
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-in').forEach(el => {
        observer.observe(el);
    });

    // Simple auto-save every 30 seconds
    setInterval(() => {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        if (Object.keys(data).some(k => data[k])) {
            localStorage.setItem('industry_work_1', JSON.stringify(data));
        }
    }, 30000);
});
