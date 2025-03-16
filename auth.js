//账户信息
const validUsers = {
    'lyc': 'dupu',
    '仓鼠': 'sb',
    'cjx': '100412',
    'lcn': 'yeah',
    'lzh': '114514'
};
    
const corePermissions = {
    'lyc.html': ['lyc'],
    'cs.html': ['仓鼠'],
    'cjx.html': ['cjx'],
    'lcn.html': ['lcn'],
    'lzh.html': ['lzh'],
};


// 工具函数
function normalize(str) {
    return str.trim().toLowerCase();
}
    
function getEndOfDay() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime();
}
    

// 认证验证系统
function validateAccess() {
    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    const currentPage = window.location.pathname.split('/').pop();
    
    // 未登录状态直接跳转登录页
    if (!auth.expires || auth.expires <= Date.now() || !validUsers[auth.user]) {
        localStorage.removeItem('auth');
        window.location.href = 'login.html';
        return false;
    }
    
    // 权限验证
    const coreAllowed = corePermissions[currentPage];
    const localAllowed = window.__localPagePermissions__ || [];
    const finalAllowed = coreAllowed !== undefined ? coreAllowed : localAllowed;
    
    if (!finalAllowed.includes(auth.user)) {
        window.location.href = 'none.html';
        return false;
    }
        return true;
}

function attemptLogin() {
    const username = normalize(document.getElementById('username').value);
    const password = normalize(document.getElementById('password').value);
    
    if (!username || !password) {
    showError('请输入完整的凭证信息');
    return;
    }
    
    if (validUsers[username] === password) {
    localStorage.setItem('auth', JSON.stringify({
    user: username,
    expires: getEndOfDay()
    }));
    
    // 智能跳转：优先核心页面，否则默认页
    const targetPage = Object.keys(corePermissions).find(page =>
    corePermissions[page].includes(username)
    ) || '6.html';
    
    window.location.href = targetPage;
    } else {
    showError('认证失败，请检查凭证');
    }
    }


// 退出功能
function logout() {
    localStorage.removeItem('auth');
    window.location.href = 'login.html';
}


// 错误处理
function showError(msg) {
    const container = document.querySelector('.login-container');
    container.style.animation = 'shake 0.4s';
    setTimeout(() => container.style.animation = '', 400);
    alert(msg);
}


// 登录页自动跳转
if (window.location.pathname.endsWith('login.html')) {
    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    if (auth.expires > Date.now() && validUsers[auth.user]) {
    const targetPage = Object.keys(corePermissions).find(page =>
    corePermissions[page].includes(auth.user)
    ) || '6.html';
    window.location.href = targetPage;
    }
}