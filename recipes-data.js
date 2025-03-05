// 菜品库数据
const RECIPE_DATABASE = {
    popularRecipes: [
        {
            id: 'p1',
            name: '红烧肉',
            image: 'images/dishes/hongshaorou.jpg',
            description: '经典红烧肉，肥而不腻，入口即化',
            category: '肉类',
            difficulty: '中等',
            cookingTime: '45分钟',
            ingredients: ['五花肉', '生抽', '老抽', '料酒', '姜片', '葱段'],
            tags: ['热门', '家常菜', '下饭']
        },
        {
            id: 'p2',
            name: '清蒸鲈鱼',
            image: 'images/dishes/luyu.jpg',
            description: '鲜美可口，营养丰富',
            category: '海鲜',
            difficulty: '简单',
            cookingTime: '20分钟',
            ingredients: ['鲈鱼', '姜丝', '葱丝', '蒸鱼豉油'],
            tags: ['清淡', '海鲜', '蒸菜']
        },
        {
            id: 'p3',
            name: '麻婆豆腐',
            image: 'images/dishes/mapodoufu.jpg',
            description: '川菜代表，麻辣鲜香',
            category: '豆制品',
            difficulty: '简单',
            cookingTime: '15分钟',
            ingredients: ['豆腐', '猪肉末', '豆瓣酱', '花椒'],
            tags: ['川菜', '下饭', '快手菜']
        }
        // ... 可以继续添加更多菜品
    ],

    categories: {
        '家常菜': [
            {
                id: 'h1',
                name: '番茄炒蛋',
                image: 'images/dishes/fanqiechaojidan.jpg',
                description: '简单美味的家常菜',
                difficulty: '入门',
                cookingTime: '10分钟',
                ingredients: ['番茄', '鸡蛋', '葱花'],
                tags: ['快手菜', '家常菜']
            },
            // ... 更多家常菜
        ],
        '川菜': [
            {
                id: 's1',
                name: '回锅肉',
                image: 'images/dishes/huiguorou.jpg',
                description: '川菜经典，香辣可口',
                difficulty: '中等',
                cookingTime: '30分钟',
                ingredients: ['五花肉', '青椒', '蒜苗', '豆瓣酱'],
                tags: ['川菜', '下饭']
            },
            // ... 更多川菜
        ],
        // ... 更多分类
    },

    // 根据食材推荐的菜品
    ingredientBasedRecipes: {
        '茄子': ['鱼香茄子', '红烧茄子', '茄子煲'],
        '豆腐': ['麻婆豆腐', '家常豆腐', '豆腐汤'],
        '猪肉': ['红烧肉', '回锅肉', '糖醋里脊'],
        // ... 更多食材对应的菜品
    }
};

// 获取随机推荐菜品
function getRandomRecipes(count = 5) {
    const allRecipes = RECIPE_DATABASE.popularRecipes;
    const shuffled = [...allRecipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// 根据食材获取推荐菜品
function getRecipesByIngredients(ingredients) {
    const recommendations = new Set();
    ingredients.forEach(ingredient => {
        const recipes = RECIPE_DATABASE.ingredientBasedRecipes[ingredient] || [];
        recipes.forEach(recipe => recommendations.add(recipe));
    });
    return Array.from(recommendations);
}

// 搜索菜品
function searchRecipes(keyword) {
    const results = [];
    // 搜索热门菜品
    RECIPE_DATABASE.popularRecipes.forEach(recipe => {
        if (recipe.name.includes(keyword) || 
            recipe.tags.some(tag => tag.includes(keyword)) ||
            recipe.ingredients.some(ing => ing.includes(keyword))) {
            results.push(recipe);
        }
    });
    // 搜索分类中的菜品
    Object.values(RECIPE_DATABASE.categories).forEach(category => {
        category.forEach(recipe => {
            if (recipe.name.includes(keyword) || 
                recipe.tags.some(tag => tag.includes(keyword)) ||
                recipe.ingredients.some(ing => ing.includes(keyword))) {
                results.push(recipe);
            }
        });
    });
    return results;
} 