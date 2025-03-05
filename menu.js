document.addEventListener('DOMContentLoaded', () => {
    // 初始化默认显示推荐页面
    showContent('recommend');
    
    // 绑定导航点击事件
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.dataset.target;
            
            // 添加点击波纹效果
            createRippleEffect(e);
            
            showContent(target);
            setActiveNav(this);
        });
    });
});

// 添加点击波纹效果
function createRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    ripple.className = 'ripple';
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    
    button.appendChild(ripple);
    
    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
}

function showContent(targetId) {
    // 平滑切换内容
    document.querySelectorAll('.content-frame').forEach(frame => {
        frame.style.opacity = '0';
        frame.style.transform = 'scale(0.98)';
        setTimeout(() => {
            frame.classList.remove('active');
            if(frame.id === targetId) {
                frame.classList.add('active');
                requestAnimationFrame(() => {
                    frame.style.opacity = '1';
                    frame.style.transform = 'scale(1)';
                });
            }
        }, 300);
    });
}

function setActiveNav(clickedItem) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    clickedItem.classList.add('active');
}

// 处理子页面的导航请求
window.addEventListener('message', function(e) {
    if (e.data.type === 'navigation') {
        const navItem = document.querySelector(`[data-target="${e.data.target}"]`);
        if (navItem) {
            navItem.click();
        }
    }
});

// 监听滚动以调整头部样式
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});
