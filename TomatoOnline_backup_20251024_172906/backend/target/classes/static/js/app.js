// 番茄自习室 - 主JavaScript文件

class PomodoroApp {
    constructor() {
        this.currentUser = null;
        this.timer = null;
        this.timerInterval = null;
        this.isRunning = false;
        this.isBreak = false;
        this.timeLeft = 25 * 60; // 25分钟 = 1500秒
        this.breakTime = 5 * 60; // 5分钟休息
        this.longBreakTime = 15 * 60; // 15分钟长休息
        this.sessionCount = 0;
        this.tasks = [];
        this.currentFilter = 'all';
        
        // 自习室相关属性
        this.rooms = [];
        this.currentRoom = null;
        this.roomMembers = [];
        this.isStudying = false;
        this.studyStartTime = null;
        this.studyDuration = 0;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTasks();
        this.updateTimerDisplay();
        this.loadCustomTextOnInit();
    }

    bindEvents() {
        console.log('开始绑定事件...');
        
        // 导航事件
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                this.showPage(pageId);
                this.updateNavActive(link);
            });
        });

        // 番茄钟控制
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startTimer();
        });

        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.pauseTimer();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetTimer();
        });

        // 任务管理
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            this.showAddTaskModal();
        });

        document.getElementById('addTaskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddTask(e.target);
        });

        document.getElementById('filterAll').addEventListener('click', () => {
            this.setFilter('all');
        });

        document.getElementById('filterPending').addEventListener('click', () => {
            this.setFilter('pending');
        });

        document.getElementById('filterCompleted').addEventListener('click', () => {
            this.setFilter('completed');
        });

        // 自习室相关事件
        document.getElementById('createRoomBtn').addEventListener('click', () => {
            this.showCreateRoomModal();
        });

        document.getElementById('createRoomForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateRoom(e.target);
        });

        document.getElementById('joinRoomForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleJoinRoom(e.target);
        });

        document.getElementById('startStudyBtn').addEventListener('click', () => {
            this.startStudy();
        });

        document.getElementById('endStudyBtn').addEventListener('click', () => {
            this.endStudy();
        });

        document.getElementById('leaveRoomBtn').addEventListener('click', () => {
            this.leaveRoom();
        });

        // 房间类型切换
        document.getElementById('roomType').addEventListener('change', (e) => {
            const passwordField = document.getElementById('roomPassword');
            if (e.target.value === '3') {
                passwordField.style.display = 'block';
            } else {
                passwordField.style.display = 'none';
            }
        });

        // 自定义文案相关事件
        document.getElementById('customizeTextBtn').addEventListener('click', () => {
            this.showCustomizeTextModal();
        });

        document.getElementById('customizeTextForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCustomText(e.target);
        });

        document.getElementById('resetTextBtn').addEventListener('click', () => {
            this.resetCustomText();
        });

        // 登录注册相关事件
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        console.log('登录按钮:', loginBtn);
        console.log('注册按钮:', registerBtn);
        console.log('登录表单:', loginForm);
        console.log('注册表单:', registerForm);
        
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                console.log('登录按钮被点击');
                this.showLoginModal();
            });
        } else {
            console.error('登录按钮未找到');
        }

        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                console.log('注册按钮被点击');
                this.showRegisterModal();
            });
        } else {
            console.error('注册按钮未找到');
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('登录表单提交');
                this.handleLogin(e.target);
            });
        } else {
            console.error('登录表单未找到');
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('注册表单提交');
                this.handleRegister(e.target);
            });
        } else {
            console.error('注册表单未找到');
        }
        
        // 模态框关闭事件
        const loginClose = document.getElementById('loginClose');
        const registerClose = document.getElementById('registerClose');
        
        if (loginClose) {
            loginClose.addEventListener('click', () => {
                console.log('关闭登录模态框');
                this.hideLoginModal();
            });
        }
        
        if (registerClose) {
            registerClose.addEventListener('click', () => {
                console.log('关闭注册模态框');
                this.hideRegisterModal();
            });
        }
        
        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            if (e.target.id === 'loginModal') {
                this.hideLoginModal();
            }
            if (e.target.id === 'registerModal') {
                this.hideRegisterModal();
            }
        });
    }

    // 页面导航
    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId + '-page').classList.add('active');

        // 如果切换到自习室页面，加载房间列表
        if (pageId === 'study-room') {
            this.loadRooms();
        }
    }

    updateNavActive(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    // ==================== 番茄钟功能 ====================

    startTimer() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerInterval = setInterval(() => {
                this.timeLeft--;
                this.updateTimerDisplay();
                
                if (this.timeLeft <= 0) {
                    this.completeSession();
                }
            }, 1000);
            
            document.getElementById('startBtn').style.display = 'none';
            document.getElementById('pauseBtn').style.display = 'inline-block';
        }
    }

    pauseTimer() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.timerInterval);
            
            document.getElementById('startBtn').style.display = 'inline-block';
            document.getElementById('pauseBtn').style.display = 'none';
        }
    }

    resetTimer() {
        this.isRunning = false;
        clearInterval(this.timerInterval);
        this.timeLeft = this.isBreak ? this.breakTime : 25 * 60;
        this.updateTimerDisplay();
        
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('pauseBtn').style.display = 'none';
    }

    completeSession() {
        this.isRunning = false;
        clearInterval(this.timerInterval);
        this.sessionCount++;
        
        if (!this.isBreak) {
            this.isBreak = true;
            this.timeLeft = this.sessionCount % 4 === 0 ? this.longBreakTime : this.breakTime;
            this.showNotification('工作完成！开始休息时间', 'success');
        } else {
            this.isBreak = false;
            this.timeLeft = 25 * 60;
            this.showNotification('休息结束！开始新的工作周期', 'info');
        }
        
        this.updateTimerDisplay();
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('pauseBtn').style.display = 'none';
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('timer').textContent = display;
        
        const status = this.isBreak ? '休息时间' : '工作时间';
        document.getElementById('timerStatus').textContent = status;
    }

    // ==================== 任务管理功能 ====================

    async loadTasks() {
        try {
            const response = await this.apiCall('/pomodoro_task/list', 'GET');
            if (response.code === 200 && response.data && response.data.records) {
                this.tasks = response.data.records;
                this.renderTasks();
            } else {
                this.tasks = [];
                this.renderTasks();
            }
        } catch (error) {
            console.error('加载任务失败:', error);
            this.showNotification('加载任务失败', 'error');
        }
    }

    renderTasks() {
        const tasksList = document.getElementById('tasks-list');
        if (!tasksList) return;

        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            tasksList.innerHTML = '<div class="no-tasks">暂无任务</div>';
            return;
        }

        tasksList.innerHTML = filteredTasks.map(task => `
            <div class="task-item ${task.status === 'completed' ? 'completed' : ''}">
                <div class="task-content">
                    <h4>${task.taskName}</h4>
                    <p>${task.description || '暂无描述'}</p>
                    <div class="task-meta">
                        <span class="priority priority-${task.priority}">${this.getPriorityText(task.priority)}</span>
                        <span class="category">${task.category || '未分类'}</span>
                        <span class="duration">预计 ${task.plannedDuration} 分钟</span>
                    </div>
                </div>
                <div class="task-actions">
                    ${task.status === 'pending' ? `
                        <button class="btn btn-primary btn-small" onclick="app.startTask(${task.id})">开始</button>
                        <button class="btn btn-success btn-small" onclick="app.completeTask(${task.id})">完成</button>
                    ` : ''}
                    <button class="btn btn-danger btn-small" onclick="app.deleteTask(${task.id})">删除</button>
                </div>
            </div>
        `).join('');
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'pending':
                return this.tasks.filter(task => task.status === 'pending');
            case 'completed':
                return this.tasks.filter(task => task.status === 'completed');
            default:
                return this.tasks;
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.renderTasks();
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`).classList.add('active');
    }

    showAddTaskModal() {
        document.getElementById('addTaskModal').style.display = 'flex';
    }

    hideAddTaskModal() {
        document.getElementById('addTaskModal').style.display = 'none';
        document.getElementById('addTaskForm').reset();
    }

    async handleAddTask(form) {
        const formData = new FormData(form);
        const taskData = {
            taskName: formData.get('taskName'),
            description: formData.get('description'),
            plannedDuration: parseInt(formData.get('plannedDuration')),
            priority: formData.get('priority'),
            category: formData.get('category'),
            userId: 1, // 默认用户ID
            status: 'pending'
        };

        try {
            const response = await this.apiCall('/pomodoro_task/add', 'POST', taskData);
            if (response.code === 200) {
                this.showNotification('任务添加成功', 'success');
                this.hideAddTaskModal();
                this.loadTasks();
            } else {
                this.showNotification('任务添加失败', 'error');
            }
        } catch (error) {
            console.error('添加任务失败:', error);
            this.showNotification('任务添加失败', 'error');
        }
    }

    async startTask(taskId) {
        try {
            const response = await this.apiCall(`/pomodoro_task/start/${taskId}`, 'POST');
            if (response.code === 200) {
                this.showNotification('任务已开始', 'success');
                this.loadTasks();
            } else {
                this.showNotification('开始任务失败', 'error');
            }
        } catch (error) {
            console.error('开始任务失败:', error);
            this.showNotification('开始任务失败', 'error');
        }
    }

    async completeTask(taskId) {
        try {
            const response = await this.apiCall(`/pomodoro_task/complete/${taskId}`, 'POST');
            if (response.code === 200) {
                this.showNotification('任务已完成', 'success');
                this.loadTasks();
            } else {
                this.showNotification('完成任务失败', 'error');
            }
        } catch (error) {
            console.error('完成任务失败:', error);
            this.showNotification('完成任务失败', 'error');
        }
    }

    async deleteTask(taskId) {
        if (confirm('确定要删除这个任务吗？')) {
            try {
                const response = await this.apiCall(`/pomodoro_task/delete/${taskId}`, 'DELETE');
                if (response.code === 200) {
                    this.showNotification('任务已删除', 'success');
                    this.loadTasks();
                } else {
                    this.showNotification('删除任务失败', 'error');
                }
            } catch (error) {
                console.error('删除任务失败:', error);
                this.showNotification('删除任务失败', 'error');
            }
        }
    }

    getPriorityText(priority) {
        const priorities = {
            '1': '低',
            '2': '中',
            '3': '高'
        };
        return priorities[priority] || '未知';
    }

    getStatusFromNumber(status) {
        const statuses = {
            0: 'pending',
            1: 'in_progress',
            2: 'completed'
        };
        return statuses[status] || 'pending';
    }

    // ==================== 自习室功能 ====================

    async loadRooms() {
        try {
            const response = await this.apiCall('/room/list', 'GET');
            if (response.code === 200 && response.data && response.data.records) {
                this.rooms = response.data.records;
                this.renderRooms();
            } else {
                this.rooms = [];
                this.renderRooms();
            }
        } catch (error) {
            console.error('加载房间列表失败:', error);
            this.showNotification('加载房间列表失败', 'error');
        }
    }

    renderRooms() {
        const roomsList = document.getElementById('rooms-list');
        if (!roomsList) return;

        if (this.rooms.length === 0) {
            roomsList.innerHTML = '<div class="no-rooms">暂无可用房间</div>';
            return;
        }

        roomsList.innerHTML = this.rooms.map(room => `
            <div class="room-card">
                <div class="room-card-header">
                    <div class="room-name">${room.roomName}</div>
                    <div class="room-type ${this.getRoomTypeClass(room.roomType)}">
                        ${this.getRoomTypeText(room.roomType)}
                    </div>
                </div>
                <div class="room-description">${room.description || '暂无描述'}</div>
                <div class="room-stats">
                    <span>成员: ${room.currentMembers}/${room.maxMembers}</span>
                    <span>主题: ${room.studyTheme || '无'}</span>
                </div>
                <div class="room-actions">
                    <button class="btn btn-primary" onclick="app.joinRoomById(${room.id})">
                        加入房间
                    </button>
                </div>
            </div>
        `).join('');
    }

    getRoomTypeClass(roomType) {
        const types = {
            1: 'public',
            2: 'private',
            3: 'password'
        };
        return types[roomType] || 'public';
    }

    getRoomTypeText(roomType) {
        const types = {
            1: '公开',
            2: '私密',
            3: '密码'
        };
        return types[roomType] || '公开';
    }

    async joinRoomById(roomId) {
        const room = this.rooms.find(r => r.id === roomId);
        if (!room) return;

        if (room.roomType === 3) {
            const password = prompt('请输入房间密码：');
            if (!password) return;
            await this.joinRoom(roomId, password);
        } else {
            await this.joinRoom(roomId);
        }
    }

    showCreateRoomModal() {
        document.getElementById('createRoomModal').style.display = 'flex';
    }

    hideCreateRoomModal() {
        document.getElementById('createRoomModal').style.display = 'none';
        document.getElementById('createRoomForm').reset();
    }

    showJoinRoomModal() {
        document.getElementById('joinRoomModal').style.display = 'flex';
    }

    hideJoinRoomModal() {
        document.getElementById('joinRoomModal').style.display = 'none';
        document.getElementById('joinRoomForm').reset();
    }

    async handleCreateRoom(form) {
        const formData = new FormData(form);
        const roomData = {
            roomName: formData.get('roomName'),
            description: formData.get('description'),
            maxMembers: parseInt(formData.get('maxMembers')),
            roomType: parseInt(formData.get('roomType')),
            password: formData.get('password'),
            studyTheme: formData.get('studyTheme'),
            creatorId: 1 // 默认创建者ID
        };

        try {
            const response = await this.apiCall('/room/create', 'POST', roomData);
            if (response.code === 200) {
                this.showNotification('房间创建成功', 'success');
                this.hideCreateRoomModal();
                this.loadRooms();
            } else {
                this.showNotification('房间创建失败', 'error');
            }
        } catch (error) {
            console.error('创建房间失败:', error);
            this.showNotification('房间创建失败', 'error');
        }
    }

    async handleJoinRoom(form) {
        const formData = new FormData(form);
        const roomId = parseInt(formData.get('roomId'));
        const password = formData.get('password');

        await this.joinRoom(roomId, password);
    }

    async joinRoom(roomId, password = null) {
        try {
            const joinData = {
                roomId: roomId,
                userId: 1, // 默认用户ID
                password: password
            };

            const response = await this.apiCall('/room/join', 'POST', joinData);
            if (response.code === 200) {
                this.showNotification('成功加入房间', 'success');
                this.hideJoinRoomModal();
                this.loadRooms();
                this.showCurrentRoom();
            } else {
                this.showNotification('加入房间失败', 'error');
            }
        } catch (error) {
            console.error('加入房间失败:', error);
            this.showNotification('加入房间失败', 'error');
        }
    }

    showCurrentRoom() {
        // 显示当前房间信息
        const currentRoomInfo = document.getElementById('current-room-info');
        if (currentRoomInfo) {
            currentRoomInfo.style.display = 'block';
        }
    }

    async loadRoomRanking() {
        if (!this.currentRoom) return;

        try {
            const response = await this.apiCall(`/room/${this.currentRoom.id}/ranking`, 'GET');
            if (response.code === 200) {
                this.roomMembers = response.data;
                this.renderRoomRanking();
            }
        } catch (error) {
            console.error('加载房间排名失败:', error);
        }
    }

    renderRoomRanking() {
        const membersRanking = document.getElementById('members-ranking');
        if (!membersRanking) return;

        if (this.roomMembers.length === 0) {
            membersRanking.innerHTML = '<div class="no-members">暂无成员</div>';
            return;
        }

        membersRanking.innerHTML = this.roomMembers.map((member, index) => `
            <div class="member-item">
                <div class="member-rank rank-${index + 1}">${index + 1}</div>
                <div class="member-info">
                    <div class="member-name">${member.username}</div>
                    <div class="member-role ${this.getRoleClass(member.role)}">
                        ${this.getRoleText(member.role)}
                    </div>
                </div>
                <div class="member-stats">
                    <div class="study-duration">${member.studyDuration || 0} 分钟</div>
                </div>
            </div>
        `).join('');
    }

    getRoleClass(role) {
        const roles = {
            'creator': 'creator',
            'member': 'member'
        };
        return roles[role] || 'member';
    }

    getRoleText(role) {
        const roles = {
            'creator': '房主',
            'member': '成员'
        };
        return roles[role] || '成员';
    }

    getRankClass(rank) {
        if (rank === 1) return 'rank-1';
        if (rank === 2) return 'rank-2';
        if (rank === 3) return 'rank-3';
        return 'rank-other';
    }

    async startStudy() {
        if (!this.currentRoom) {
            this.showNotification('请先加入房间', 'warning');
            return;
        }

        try {
            const response = await this.apiCall('/room/start-study', 'POST', {
                roomId: this.currentRoom.id,
                userId: 1
            });

            if (response.code === 200) {
                this.isStudying = true;
                this.studyStartTime = new Date();
                this.showNotification('开始学习', 'success');
                this.loadRoomRanking();
            } else {
                this.showNotification('开始学习失败', 'error');
            }
        } catch (error) {
            console.error('开始学习失败:', error);
            this.showNotification('开始学习失败', 'error');
        }
    }

    async endStudy() {
        if (!this.currentRoom || !this.isStudying) {
            this.showNotification('当前没有在学习', 'warning');
            return;
        }

        try {
            const response = await this.apiCall('/room/end-study', 'POST', {
                roomId: this.currentRoom.id,
                userId: 1
            });

            if (response.code === 200) {
                this.isStudying = false;
                this.studyStartTime = null;
                this.showNotification('结束学习', 'info');
                this.loadRoomRanking();
            } else {
                this.showNotification('结束学习失败', 'error');
            }
        } catch (error) {
            console.error('结束学习失败:', error);
            this.showNotification('结束学习失败', 'error');
        }
    }

    async leaveRoom() {
        if (!this.currentRoom) {
            this.showNotification('当前不在任何房间中', 'warning');
            return;
        }

        try {
            const response = await this.apiCall('/room/leave', 'POST', {
                roomId: this.currentRoom.id,
                userId: 1
            });

            if (response.code === 200) {
                this.currentRoom = null;
                this.roomMembers = [];
                this.isStudying = false;
                this.showNotification('已离开房间', 'info');
                this.loadRooms();
            } else {
                this.showNotification('离开房间失败', 'error');
            }
        } catch (error) {
            console.error('离开房间失败:', error);
            this.showNotification('离开房间失败', 'error');
        }
    }

    // ==================== 自定义文案功能 ====================

    showCustomizeTextModal() {
        document.getElementById('customizeTextModal').style.display = 'flex';
        this.loadCustomText();
    }

    hideCustomizeTextModal() {
        document.getElementById('customizeTextModal').style.display = 'none';
    }

    loadCustomText() {
        const customText = JSON.parse(localStorage.getItem('customText') || '{}');
        document.getElementById('customTitle').value = customText.title || '';
        document.getElementById('customSubtitle').value = customText.subtitle || '';
        document.getElementById('customColor').value = customText.color || '#6c7b95';
    }

    handleCustomText(form) {
        const formData = new FormData(form);
        const customText = {
            title: formData.get('title'),
            subtitle: formData.get('subtitle'),
            color: formData.get('color')
        };

        localStorage.setItem('customText', JSON.stringify(customText));
        this.updateHeroText(customText);
        this.hideCustomizeTextModal();
        this.showNotification('文案设置已保存', 'success');
    }

    updateHeroText(customText) {
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.getElementById('hero-subtitle');
        
        if (heroTitle && customText.title) {
            heroTitle.textContent = customText.title;
        }
        
        if (heroSubtitle && customText.subtitle) {
            heroSubtitle.textContent = customText.subtitle;
        }
        
        if (customText.color) {
            const style = document.createElement('style');
            style.textContent = `
                .hero-section h1,
                .hero-section p {
                    color: ${customText.color} !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    resetCustomText() {
        localStorage.removeItem('customText');
        document.getElementById('hero-title').textContent = '命定的局限尽可永在，不屈的挑战却不可须臾或缺。';
        document.getElementById('hero-subtitle').textContent = '欢迎来到番茄自习室，让我们一起专注学习，提升效率！';
        this.hideCustomizeTextModal();
        this.showNotification('文案已恢复默认', 'info');
    }

    loadCustomTextOnInit() {
        const customText = JSON.parse(localStorage.getItem('customText') || '{}');
        if (customText.title || customText.subtitle || customText.color) {
            this.updateHeroText(customText);
        }
    }

    // ==================== 登录注册功能 ====================

    showLoginModal() {
        console.log('显示登录模态框');
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'flex';
            console.log('登录模态框已显示');
        } else {
            console.error('登录模态框未找到');
        }
    }

    hideLoginModal() {
        console.log('隐藏登录模态框');
        const modal = document.getElementById('loginModal');
        const form = document.getElementById('loginForm');
        if (modal) {
            modal.style.display = 'none';
        }
        if (form) {
            form.reset();
        }
    }

    showRegisterModal() {
        console.log('显示注册模态框');
        const modal = document.getElementById('registerModal');
        if (modal) {
            modal.style.display = 'flex';
            console.log('注册模态框已显示');
        } else {
            console.error('注册模态框未找到');
        }
    }

    hideRegisterModal() {
        console.log('隐藏注册模态框');
        const modal = document.getElementById('registerModal');
        const form = document.getElementById('registerForm');
        if (modal) {
            modal.style.display = 'none';
        }
        if (form) {
            form.reset();
        }
    }

    async handleLogin(form) {
        const formData = new FormData(form);
        const loginData = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        try {
            const response = await this.apiCall('/user/login', 'POST', loginData);
            if (response.code === 200) {
                this.currentUser = response.data;
                this.showNotification('登录成功', 'success');
                this.hideLoginModal();
                this.updateUserDisplay();
            } else {
                this.showNotification(response.message || '登录失败', 'error');
            }
        } catch (error) {
            console.error('登录失败:', error);
            this.showNotification('登录失败', 'error');
        }
    }

    async handleRegister(form) {
        const formData = new FormData(form);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            const response = await this.apiCall('/user/register', 'POST', userData);
            if (response.code === 200) {
                this.showNotification('注册成功', 'success');
                this.hideRegisterModal();
            } else {
                this.showNotification(response.message || '注册失败', 'error');
            }
        } catch (error) {
            console.error('注册失败:', error);
            this.showNotification('注册失败', 'error');
        }
    }

    updateUserDisplay() {
        if (this.currentUser) {
            // 更新用户显示
            const userNameElement = document.getElementById('user-name');
            const userEmailElement = document.getElementById('user-email');
            const totalStudyTimeElement = document.getElementById('total-study-time');
            
            if (userNameElement) {
                userNameElement.textContent = this.currentUser.username;
            }
            if (userEmailElement) {
                userEmailElement.textContent = this.currentUser.email;
            }
            if (totalStudyTimeElement) {
                totalStudyTimeElement.textContent = (this.currentUser.totalStudyTime || 0) + ' 小时';
            }
        }
    }

    // ==================== 工具方法 ====================

    async apiCall(endpoint, method = 'GET', data = null) {
        const url = `/api${endpoint}`;
        console.log(`API调用: ${method} ${url}`, data);
        
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            console.log('API响应状态:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('API响应数据:', result);
            return result;
        } catch (error) {
            console.error('API调用失败:', error);
            return { code: 500, message: '网络错误: ' + error.message };
        }
    }

    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

        // 根据类型设置背景色
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // 显示动画
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// 初始化应用
const app = new PomodoroApp();