// my_account.js
// 模拟用户数据
let currentUser = {
    username: '用户示例',
    password: 'oldpassword123',
    loginHistory: [
        { time: '2024-03-15 09:30', device: 'iPhone 12', location: '北京' },
        { time: '2024-03-14 15:20', device: 'Windows PC', location: '上海' }
    ]
};

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadLoginHistory();
    document.getElementById('username').textContent = currentUser.username;
});

// 初始化导航功能
function initNavigation() {
    document.querySelectorAll('.nav-menu li').forEach(item => {
        if (!item.onclick) {
            item.addEventListener('click', function() {
                document.querySelectorAll('.nav-menu li').forEach(li => 
                    li.classList.remove('active'));
                this.classList.add('active');
                
                const target = this.dataset.target;
                document.querySelectorAll('.content-section').forEach(section => 
                    section.classList.remove('active'));
                document.getElementById(target).classList.add('active');
            });
        }
    });
}

// 修改密码功能
function changePassword() {
    const oldPwd = document.getElementById('old-pwd').value;
    const newPwd = document.getElementById('new-pwd').value;
    const confirmPwd = document.getElementById('confirm-pwd').value;
    const errorElement = document.getElementById('pwd-error');

    // 验证逻辑
    if (oldPwd !== currentUser.password) {
        errorElement.textContent = "旧密码不正确";
        errorElement.style.display = 'block';
        return false;
    }

    if (newPwd.length < 8) {
        errorElement.textContent = "密码长度至少8位";
        errorElement.style.display = 'block';
        return false;
    }

    if (newPwd !== confirmPwd) {
        errorElement.textContent = "两次输入的新密码不一致";
        errorElement.style.display = 'block';
        return false;
    }

    // 成功逻辑
    currentUser.password = newPwd;
    errorElement.style.display = 'none';
    alert('密码修改成功！');
    clearForm();
    return false; // 阻止表单提交
}

// 清空表单
function clearForm() {
    document.getElementById('pwd-form').reset();
    document.getElementById('pwd-error').style.display = 'none';
}

// 加载登录记录
function loadLoginHistory() {
    const tbody = document.getElementById('login-records');
    tbody.innerHTML = currentUser.loginHistory.map(record => `
        <tr>
            <td>${record.time}</td>
            <td>${record.device}</td>
            <td>${record.location}</td>
        </tr>
    `).join('');
}

// 退出登录功能
function logout() {
    if (confirm('确定要退出登录吗？')) {
        // 清除登录状态逻辑
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    }
}

// 显示登录界面（示例）
function showLogin() {
    // 这里可以添加跳转登录页的逻辑
    alert('跳转至登录页面');
}

// 切换账号功能（示例）
function switchAccount(accountId) {
    // 实际应调用API切换账号
    console.log('切换至账号：', accountId);
}
// 在子页面中添加返回主菜单导航的功能
document.querySelector('.back-to-main').addEventListener('click', () => {
    parent.postMessage({ type: 'navigation', target: 'recommend' }, '*');
});
