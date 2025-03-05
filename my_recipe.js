// 引入菜品数据
import { RECIPE_DATABASE, getRandomRecipes, searchRecipes } from './recipes-data.js';

// 模拟数据
const sampleRecommendations = [
    {
        id: 1,
        title: "番茄炒蛋",
        image: "https://example.com/tomato-egg.jpg",
        desc: "经典家常菜，营养均衡",
        ingredients: ["番茄", "鸡蛋"]
    },
    {
        id: 2,
        title: "青椒肉丝",
        image: "https://example.com/pepper-pork.jpg",
        desc: "鲜香下饭，快速料理",
        ingredients: ["青椒", "猪肉"]
    }
];

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadRecommendations();
    loadRecipesByCategory('all');
    
    // 绑定分类标签点击事件
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadRecipesByCategory(tab.dataset.category);
        });
    });
});

// 加载推荐菜谱
function loadRecommendations() {
    const container = document.getElementById('recommendations');
    container.innerHTML = sampleRecommendations.map(createRecipeCard).join('');
}

// 加载指定分类的菜品
function loadRecipesByCategory(category) {
    const grid = document.getElementById('recipesGrid');
    let recipes = [];
    
    if (category === 'all') {
        // 获取所有分类的菜品
        Object.values(RECIPE_DATABASE.categories).forEach(categoryRecipes => {
            recipes = recipes.concat(categoryRecipes);
        });
    } else {
        recipes = RECIPE_DATABASE.categories[category] || [];
    }
    
    grid.innerHTML = recipes.map(recipe => createRecipeCard(recipe)).join('');
}

// 创建菜品卡片
function createRecipeCard(recipe) {
    return `
        <div class="recipe-card">
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
            <div class="recipe-content">
                <h3>${recipe.name}</h3>
                <p>${recipe.description}</p>
                <div class="recipe-tags">
                    ${recipe.tags.map(tag => `<span class="recipe-tag">${tag}</span>`).join('')}
                </div>
                <div class="recipe-actions">
                    <button class="btn-add" onclick="addToMenu('${recipe.id}')">加入菜单</button>
                </div>
            </div>
        </div>
    `;
}

// 添加至我的菜单
function addToMenu(recipeId) {
    const recipe = sampleRecommendations.find(r => r.id === recipeId);
    const menu = JSON.parse(localStorage.getItem('myMenu') || '[]');
    
    if (!menu.some(r => r.id === recipeId)) {
        menu.push(recipe);
        localStorage.setItem('myMenu', JSON.stringify(menu));
        loadRecipesByCategory('all');
    }
}

// 加载我的菜单
function loadMyMenu() {
    const container = document.getElementById('myMenu');
    const menu = JSON.parse(localStorage.getItem('myMenu') || '[]');
    container.innerHTML = menu.map(createMenuCard).join('');
}

// 创建菜单卡片
function createMenuCard(recipe) {
    return `
        <div class="recipe-card" data-id="${recipe.id}">
            <img src="${recipe.image}" class="card-image" alt="${recipe.title}">
            <div class="card-content">
                <h3 class="card-title">${recipe.title}</h3>
                <div class="card-actions">
                    <button class="btn-cancel" onclick="removeFromMenu(${recipe.id})">移除</button>
                </div>
            </div>
        </div>
    `;
}

// 移除菜单项
function removeFromMenu(recipeId) {
    let menu = JSON.parse(localStorage.getItem('myMenu') || '[]');
    menu = menu.filter(r => r.id !== recipeId);
    localStorage.setItem('myMenu', JSON.stringify(menu));
    loadRecipesByCategory('all');
}

// 搜索功能
async function searchRecipe() {
    const query = document.getElementById('recipeSearch').value;
    // 这里应该调用实际API
    console.log('Searching:', query);
}

// 确认最终菜单
function confirmMenu() {
    const menu = JSON.parse(localStorage.getItem('myMenu') || '[]');
    if (menu.length === 0) {
        alert('请先添加菜谱到菜单！');
        return;
    }
    // 这里可以添加提交到后端的功能
    alert('菜单已确认！');
}

// 导出功能
function exportMenu() {
    const blob = new Blob([menuData.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my_menu.txt';
    a.click();
}

// 在子页面中添加返回主菜单导航的功能
document.querySelector('.back-to-main').addEventListener('click', () => {
    parent.postMessage({ type: 'navigation', target: 'recommend' }, '*');
});
