document.addEventListener('DOMContentLoaded', () => {
    // 初始化默认显示推荐页面
    showContent('recommend');
    
    // 绑定导航点击事件
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.dataset.target;
            showContent(target);
            setActiveNav(this);
        });
    });
});

function showContent(targetId) {
    // 隐藏所有iframe
    document.querySelectorAll('.content-frame').forEach(frame => {
        frame.classList.remove('active');
    });
    
    // 显示目标iframe
    const targetFrame = document.getElementById(targetId);
    if (targetFrame) {
        targetFrame.classList.add('active');
    }
}

function setActiveNav(clickedItem) {
    // 移除所有active状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 设置当前active状态
    clickedItem.classList.add('active');
}

// 跨iframe通信
window.addEventListener('message', function(e) {
    if (e.data.type === 'navigation') {
        showContent(e.data.target);
        const navItem = document.querySelector(`[data-target="${e.data.target}"]`);
        setActiveNav(navItem);
    }
});
