// my_account.js
// 通用错误处理
function showError(message) {
    const errorDiv = document.getElementById('pwd-error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 3000);
}

// 修改密码示例
async function changePassword() {
    const oldPwd = document.getElementById('old-pwd').value;
    const newPwd = document.getElementById('new-pwd').value;
    const confirmPwd = document.getElementById('confirm-pwd').value;

    try {
        const response = await fetch('/api/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ oldPwd, newPwd, confirmPwd })
        });

        const result = await response.json();
        
        if(result.code === 1) {
            showSuccessMessage(result.msg);
            clearForm();
        } else {
            showErrorMessage(result.msg);
        }
    } catch (error) {
        showErrorMessage('请求失败，请检查网络连接');
    }
}

function showSuccessMessage(msg) {
    const msgBox = document.getElementById('pwd-error');
    msgBox.style.color = '#52c41a';
    msgBox.textContent = msg;
}

function showErrorMessage(msg) {
    const msgBox = document.getElementById('pwd-error');
    msgBox.style.color = '#ff4d4f';
    msgBox.textContent = msg;
}


// 加载登录记录
async function loadLoginHistory() {
    try {
        const response = await fetch('/api/login-history', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        const result = await response.json();
        
        if (result.code === 1) {
            renderLoginRecords(result.data);
        } else {
            showError(`❌ ${result.msg}`);
        }
    } catch (error) {
        showError('获取登录记录失败');
    }
}

// 切换账号功能
async function switchAccount(accountId) {
    try {
        const response = await fetch('/api/switch-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ account_id: accountId })
        });
        
        const result = await response.json();
        
        if (result.code === 1) {
            window.location.reload();
        } else {
            showError(`❌ ${result.msg}`);
        }
    } catch (error) {
        showError('账号切换失败');
    }
}

// 初始化加载
document.addEventListener('DOMContentLoaded', () => {
    // 加载用户信息
    fetch('/api/user-info')
        .then(res => res.json())
        .then(result => {
            if (result.code === 1) {
                document.getElementById('username').textContent = result.data.username;
                // 其他用户信息初始化...
            }
        });
});
