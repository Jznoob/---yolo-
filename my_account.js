// my_account.js
// 导入推荐算法模块
import { DietaryPreferenceAnalyzer, RecipeRecommendationEngine, ShoppingListGenerator } from './recommendation-algorithm.js';

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

        if (result.code === 1) {
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

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 初始化用户信息
    initUserInfo();

    // 添加导航菜单点击事件
    initNavigation();

    // 加载登录记录
    loadLoginHistory();

    // 初始化饮食分析
    initDietAnalysis();

    // 初始化食谱推荐
    initRecipeRecommendation();
});

// 初始化用户信息
async function initUserInfo() {
    try {
        const response = await fetch('/api/user/info', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();

        if (data.code === 1) {
            // 更新用户信息显示
            document.getElementById('username').textContent = data.data.username;
            const avatar = document.querySelector('.avatar');
            if (data.data.avatar) {
                avatar.src = data.data.avatar;
            }

            // 加载账号列表
            loadAccountList();
        }
    } catch (error) {
        console.error('获取用户信息失败:', error);
    }
}

// 初始化导航菜单
function initNavigation() {
    const menuItems = document.querySelectorAll('.nav-menu li');
    menuItems.forEach(item => {
        item.addEventListener('click', function () {
            // 移除其他菜单项的active类
            menuItems.forEach(i => i.classList.remove('active'));
            // 添加当前菜单项的active类
            this.classList.add('active');

            // 显示对应的内容区域
            const target = this.dataset.target;
            const sections = document.querySelectorAll('.content-section');
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === target) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// 修改密码
async function changePassword() {
    const oldPwd = document.getElementById('old-pwd').value;
    const newPwd = document.getElementById('new-pwd').value;
    const confirmPwd = document.getElementById('confirm-pwd').value;
    const errorMsg = document.getElementById('pwd-error');

    // 验证新密码
    if (newPwd !== confirmPwd) {
        errorMsg.textContent = '两次输入的新密码不一致';
        return false;
    }

    try {
        const response = await fetch('/api/user/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                oldPassword: oldPwd,
                newPassword: newPwd
            })
        });

        const data = await response.json();

        if (data.code === 1) {
            alert('密码修改成功！');
            clearForm();
        } else {
            errorMsg.textContent = data.msg || '密码修改失败';
        }
    } catch (error) {
        console.error('修改密码失败:', error);
        errorMsg.textContent = '网络错误，请稍后重试';
    }

    return false;
}

// 清空表单
function clearForm() {
    document.getElementById('pwd-form').reset();
    document.getElementById('pwd-error').textContent = '';
}

// 加载账号列表
async function loadAccountList() {
    try {
        const response = await fetch('/api/user/accounts', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();

        if (data.code === 1) {
            const accountList = document.querySelector('.account-list');
            accountList.innerHTML = data.data.accounts.map(account => `
                <div class="account-item">
                    <img src="${account.avatar || 'default-avatar.png'}" alt="头像">
                    <div class="account-info">
                        <h4>${account.username}</h4>
                        <p>${account.email}</p>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('获取账号列表失败:', error);
    }
}

// 加载登录记录
async function loadLoginHistory() {
    try {
        const response = await fetch('/api/user/login-history', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();

        if (data.code === 1) {
            const tbody = document.getElementById('login-records');
            tbody.innerHTML = data.data.records.map(record => `
                <tr>
                    <td>${new Date(record.time).toLocaleString()}</td>
                    <td>${record.device}</td>
                    <td>${record.location}</td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('获取登录记录失败:', error);
    }
}

// 退出登录
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// 显示登录模态框
function showLogin() {
    // 这里可以调用主页面的登录模态框
    window.parent.showLoginModal();
}

// 上传头像
function uploadAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('avatar', file);

        fetch('/api/user/upload-avatar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 1) {
                    document.querySelector('.avatar').src = data.data.avatarUrl;
                } else {
                    alert('上传失败：' + data.msg);
                }
            })
            .catch(error => {
                console.error('上传头像失败:', error);
                alert('上传失败，请稍后重试');
            });
    }
}

// 初始化饮食分析
async function initDietAnalysis() {
    try {
        const response = await fetch('/api/user/diet-history', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();

        if (data.code === 1) {
            const analyzer = new DietaryPreferenceAnalyzer(data.data.history);
            const preferences = analyzer.analyzeHistory();

            // 更新饮食分析图表
            updateDietCharts(preferences);
        }
    } catch (error) {
        console.error('获取饮食分析数据失败:', error);
    }
}

// 更新饮食分析图表
function updateDietCharts(preferences) {
    const dietAnalysisFrame = document.querySelector('#diet-analysis iframe');
    if (dietAnalysisFrame) {
        dietAnalysisFrame.contentWindow.postMessage({
            type: 'UPDATE_CHARTS',
            data: preferences
        }, '*');
    }
}

// 初始化食谱推荐
async function initRecipeRecommendation() {
    try {
        // 获取食谱数据库
        const response = await fetch('/api/recipes/database', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();

        if (data.code === 1) {
            // 获取用户饮食历史
            const historyResponse = await fetch('/api/user/diet-history', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const historyData = await historyResponse.json();

            if (historyData.code === 1) {
                // 创建推荐引擎实例
                const analyzer = new DietaryPreferenceAnalyzer(historyData.data.history);
                const preferences = analyzer.analyzeHistory();
                const recommendationEngine = new RecipeRecommendationEngine(data.data.recipes);

                // 生成推荐
                const recommendations = recommendationEngine.generateRecommendations(
                    preferences,
                    historyData.data.dietaryRestrictions
                );

                // 生成购物清单
                const shoppingListGenerator = new ShoppingListGenerator(recommendations);
                const shoppingList = shoppingListGenerator.generateShoppingList();
                const totalCost = shoppingListGenerator.estimateTotalCost(shoppingList);

                // 更新推荐页面
                updateRecipeRecommendations(recommendations, shoppingList, totalCost);
            }
        }
    } catch (error) {
        console.error('获取食谱推荐数据失败:', error);
    }
}

// 更新食谱推荐页面
function updateRecipeRecommendations(recommendations, shoppingList, totalCost) {
    const recipeFrame = document.querySelector('#recipe-recommendation iframe');
    if (recipeFrame) {
        recipeFrame.contentWindow.postMessage({
            type: 'UPDATE_RECOMMENDATIONS',
            data: {
                recipes: recommendations,
                shoppingList: shoppingList,
                totalCost: totalCost
            }
        }, '*');
    }
}
