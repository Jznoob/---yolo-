// daily_record.js
document.addEventListener('DOMContentLoaded', () => {
    const datePicker = document.getElementById('recordDate');
    const ctx = document.getElementById('nutritionChart').getContext('2d');
    
    // 初始化图表
    const nutritionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['蛋白质', '脂肪', '碳水化合物'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#3498db', '#e74c3c', '#2ecc71']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // 设置默认日期为今天
    datePicker.value = new Date().toISOString().split('T')[0];
    
    // 日期变更监听
    datePicker.addEventListener('change', loadDailyRecord);
    
    // 初始加载
    loadDailyRecord();

    async function loadDailyRecord() {
        const selectedDate = datePicker.value;
        // 模拟API调用，实际应替换为真实数据获取
        const recordData = await mockGetDailyRecord(selectedDate);
        
        // 更新菜单列表
        renderMenuList(recordData.menu);
        
        // 更新营养数据
        updateNutritionStats(recordData.nutrition);
        updateChartData(recordData.nutrition);
    }

    function renderMenuList(menu) {
        const container = document.getElementById('dailyMenu');
        container.innerHTML = menu.map(item => `
            <div class="menu-item">
                <span>${item.name}</span>
                <span>${item.calories} kcal</span>
            </div>
        `).join('');
    }

    function updateNutritionStats(nutrition) {
        document.getElementById('totalCalories').textContent = nutrition.totalCalories;
        document.getElementById('totalProtein').textContent = nutrition.protein;
        document.getElementById('totalCarbs').textContent = nutrition.carbs;
        document.getElementById('totalFat').textContent = nutrition.fat;
    }

    function updateChartData(nutrition) {
        nutritionChart.data.datasets[0].data = [
            nutrition.protein,
            nutrition.fat,
            nutrition.carbs
        ];
        nutritionChart.update();
    }

    // 模拟数据获取
    async function mockGetDailyRecord(date) {
        // 模拟不同日期的数据
        return {
            menu: [
                { name: "番茄炒蛋", calories: 280 },
                { name: "紫菜蛋花汤", calories: 120 },
                { name: "糙米饭", calories: 200 }
            ],
            nutrition: {
                totalCalories: 600,
                protein: 25,
                carbs: 75,
                fat: 20
            }
        };
    }
});
// 在子页面中添加返回主菜单导航的功能
document.querySelector('.back-to-main').addEventListener('click', () => {
    parent.postMessage({ type: 'navigation', target: 'recommend' }, '*');
});
