    // 在子页面中添加返回主菜单导航的功能
document.querySelector('.back-to-main').addEventListener('click', () => {
    parent.postMessage({ type: 'navigation', target: 'recommend' }, '*');
});

// 注意：请不要修改上述代码，除非它会影响逻辑正确性。