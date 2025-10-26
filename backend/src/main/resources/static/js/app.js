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
        this.updateDashboardStats();
        
        // 初始化音乐播放器
        this.initMusicPlayer();
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
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startTimer();
            });
        }

        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.pauseTimer();
            });
        }

        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetTimer();
            });
        }

        // 任务管理
        const addTaskBtn = document.getElementById('addTaskBtn');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => {
                this.showAddTaskModal();
            });
        }

        const addTaskForm = document.getElementById('addTaskForm');
        if (addTaskForm) {
            addTaskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddTask(e.target);
            });
        }

        // 进度滑块交互
        const progressSlider = document.getElementById('taskProgress');
        const progressValue = document.getElementById('progressValue');
        if (progressSlider && progressValue) {
            progressSlider.addEventListener('input', (e) => {
                progressValue.textContent = e.target.value + '%';
            });
        }

        const filterAll = document.getElementById('filterAll');
        if (filterAll) {
            filterAll.addEventListener('click', () => {
                this.setFilter('all');
            });
        }

        const filterPending = document.getElementById('filterPending');
        if (filterPending) {
            filterPending.addEventListener('click', () => {
                this.setFilter('pending');
            });
        }

        const filterCompleted = document.getElementById('filterCompleted');
        if (filterCompleted) {
            filterCompleted.addEventListener('click', () => {
                this.setFilter('completed');
            });
        }

        const filterInProgress = document.getElementById('filterInProgress');
        if (filterInProgress) {
            filterInProgress.addEventListener('click', () => {
                this.setFilter('in-progress');
            });
        }

        // 自习室相关事件
        const createRoomBtn = document.getElementById('createRoomBtn');
        if (createRoomBtn) {
            createRoomBtn.addEventListener('click', () => {
                this.showCreateRoomModal();
            });
        }

        const createRoomForm = document.getElementById('createRoomForm');
        if (createRoomForm) {
            createRoomForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCreateRoom(e.target);
            });
        }

        const joinRoomForm = document.getElementById('joinRoomForm');
        if (joinRoomForm) {
            joinRoomForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleJoinRoom(e.target);
            });
        }

        const startStudyBtn = document.getElementById('startStudyBtn');
        if (startStudyBtn) {
            startStudyBtn.addEventListener('click', () => {
                this.startStudy();
            });
        }

        const endStudyBtn = document.getElementById('endStudyBtn');
        if (endStudyBtn) {
            endStudyBtn.addEventListener('click', () => {
                this.endStudy();
            });
        }

        const leaveCurrentRoomBtn = document.getElementById('leaveCurrentRoomBtn');
        if (leaveCurrentRoomBtn) {
            leaveCurrentRoomBtn.addEventListener('click', () => {
                this.leaveRoom();
            });
        }

        // 房间类型切换
        const roomType = document.getElementById('roomType');
        if (roomType) {
            roomType.addEventListener('change', (e) => {
                const passwordGroup = document.getElementById('passwordGroup');
                if (e.target.value === '3') {
                    passwordGroup.style.display = 'block';
                } else {
                    passwordGroup.style.display = 'none';
                }
            });
        }

        // 自定义文案相关事件
        const customizeTextBtn = document.getElementById('customizeTextBtn');
        if (customizeTextBtn) {
            customizeTextBtn.addEventListener('click', () => {
                this.showCustomizeTextModal();
            });
        }

        const customizeTextForm = document.getElementById('customizeTextForm');
        if (customizeTextForm) {
            customizeTextForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCustomText(e.target);
            });
        }

        const resetTextBtn = document.getElementById('resetTextBtn');
        if (resetTextBtn) {
            resetTextBtn.addEventListener('click', () => {
                this.resetCustomText();
            });
        }

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
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('登录按钮被点击');
                this.showLoginModal();
            });
        } else {
            console.error('登录按钮未找到');
        }

        if (registerBtn) {
            registerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('注册按钮被点击');
                this.showRegisterModal();
            });
        } else {
            console.error('注册按钮未找到');
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault(); // 阻止表单默认提交，使用JavaScript处理
                console.log('登录表单提交');
                this.handleLogin(e.target);
            });
        } else {
            console.error('登录表单未找到');
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault(); // 阻止表单默认提交，使用JavaScript处理
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
            if (e.target.id === 'addTaskModal') {
                this.hideAddTaskModal();
            }
            if (e.target.id === 'createRoomModal') {
                this.hideCreateRoomModal();
            }
            if (e.target.id === 'joinRoomModal') {
                this.hideJoinRoomModal();
            }
            if (e.target.id === 'customizeTextModal') {
                this.hideCustomizeTextModal();
            }
        });

        // 通用模态框关闭按钮事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
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
            this.loadAllRooms();
            this.bindStudyRoomTabs();
        }
        
        // 如果切换到个人中心页面，加载我的自习室
        if (pageId === 'profile') {
            this.loadMyRooms();
            this.bindRoomTabs();
        }
        
        // 如果切换到统计页面，加载统计数据
        if (pageId === 'statistics') {
            this.loadStatistics();
            this.bindStatisticsEvents();
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
            this.updateTodayFocusTime();
        } else {
            this.isBreak = false;
            this.timeLeft = 25 * 60;
            this.showNotification('休息结束！开始新的工作周期', 'info');
        }
        
        this.updateTimerDisplay();
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('pauseBtn').style.display = 'none';
    }

    // 更新今日专注时长
    updateTodayFocusTime() {
        const todayFocus = parseInt(localStorage.getItem('todayFocus') || '0') + 25;
        localStorage.setItem('todayFocus', todayFocus.toString());
        this.updateDashboardStats();
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
            <div class="task-item ${task.status === 'completed' ? 'completed' : task.status === 'in_progress' ? 'in-progress' : ''}">
                <div class="task-content">
                    <h4>${task.taskName}</h4>
                    <p>${task.description || '暂无描述'}</p>
                    <div class="task-meta">
                        <span class="status status-${task.status}">${this.getStatusText(task.status)}</span>
                        <span class="priority priority-${task.priority}">${this.getPriorityText(task.priority)}</span>
                        <span class="category">${task.category || '未分类'}</span>
                        <span class="duration">预计 ${task.plannedDuration} 分钟</span>
                    </div>
                </div>
                <div class="task-actions">
                    ${task.status === 'pending' ? `
                        <button class="btn btn-primary btn-small" onclick="app.startTask(${task.id})">开始</button>
                        <button class="btn btn-success btn-small" onclick="app.completeTask(${task.id})">完成</button>
                    ` : task.status === 'in_progress' ? `
                        <button class="btn btn-success btn-small" onclick="app.completeTask(${task.id})">完成</button>
                        <button class="btn btn-secondary btn-small" onclick="app.pauseTask(${task.id})">暂停</button>
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
            case 'in-progress':
                return this.tasks.filter(task => task.status === 'in_progress');
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
            priority: parseInt(formData.get('priority')), // 转换为 Integer
            category: formData.get('category'),
            status: parseInt(formData.get('status')), // 任务状态
            progress: parseInt(formData.get('progress')), // 完成进度
            deadline: formData.get('deadline'), // 截止日期
            userId: 1 // 默认用户ID (Long 类型)
        };

        try {
            console.log('=== 任务添加请求调试 ===');
            console.log('请求体内容 (taskData):', JSON.stringify(taskData, null, 2));
            console.log('字段详情:');
            console.log('- taskName:', taskData.taskName);
            console.log('- description:', taskData.description);
            console.log('- plannedDuration:', taskData.plannedDuration, typeof taskData.plannedDuration);
            console.log('- priority:', taskData.priority, typeof taskData.priority);
            console.log('- category:', taskData.category);
            console.log('- status:', taskData.status, typeof taskData.status);
            console.log('- progress:', taskData.progress, typeof taskData.progress);
            console.log('- deadline:', taskData.deadline);
            console.log('- userId:', taskData.userId, typeof taskData.userId);
            console.log('========================');
            
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

    async pauseTask(taskId) {
        try {
            const response = await this.apiCall(`/pomodoro_task/pause/${taskId}`, 'POST');
            if (response.code === 200) {
                this.showNotification('任务已暂停', 'info');
                this.loadTasks();
            } else {
                this.showNotification('暂停任务失败', 'error');
            }
        } catch (error) {
            console.error('暂停任务失败:', error);
            this.showNotification('暂停任务失败', 'error');
        }
    }

    async completeTask(taskId) {
        try {
            const response = await this.apiCall(`/pomodoro_task/complete/${taskId}`, 'POST');
            if (response.code === 200) {
                this.showNotification('任务已完成', 'success');
                this.loadTasks();
                this.updateTodayTasksCount();
            } else {
                this.showNotification('完成任务失败', 'error');
            }
        } catch (error) {
            console.error('完成任务失败:', error);
            this.showNotification('完成任务失败', 'error');
        }
    }

    // 更新今日完成任务数
    updateTodayTasksCount() {
        const todayTasks = parseInt(localStorage.getItem('todayTasks') || '0') + 1;
        localStorage.setItem('todayTasks', todayTasks.toString());
        this.updateDashboardStats();
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

    getStatusText(status) {
        const statusTexts = {
            'pending': '待开始',
            'in_progress': '进行中',
            'completed': '已完成'
        };
        return statusTexts[status] || '未知';
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
                    ${room.creatorId === 1 ? `
                        <button class="btn btn-danger btn-small" onclick="app.deleteRoom(${room.id})" title="删除房间">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
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
        const currentRoomInfo = document.getElementById('current-room-section');
        if (currentRoomInfo) {
            currentRoomInfo.style.display = 'block';
            this.updateRoomInfo();
        }
    }

    // 更新房间信息显示
    updateRoomInfo() {
        if (this.currentRoom) {
            const roomNameElement = document.getElementById('current-room-name');
            const membersCountElement = document.getElementById('room-members-count');
            const studyTimeElement = document.getElementById('room-study-time');
            
            if (roomNameElement) {
                roomNameElement.textContent = this.currentRoom.roomName;
            }
            if (membersCountElement) {
                membersCountElement.textContent = `成员: ${this.currentRoom.currentMembers}/${this.currentRoom.maxMembers}`;
            }
            if (studyTimeElement) {
                studyTimeElement.textContent = `学习时长: ${this.studyDuration}分钟`;
            }
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
                this.updateRoomInfo();
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
                if (this.studyStartTime) {
                    const studyDuration = Math.floor((new Date() - this.studyStartTime) / 60000);
                    this.studyDuration += studyDuration;
                }
                this.studyStartTime = null;
                this.showNotification('结束学习', 'info');
                this.loadRoomRanking();
                this.updateRoomInfo();
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
                this.showPage('study-room');
                this.loadRooms();
            } else {
                this.showNotification('离开房间失败', 'error');
            }
        } catch (error) {
            console.error('离开房间失败:', error);
            this.showNotification('离开房间失败', 'error');
        }
    }

    async deleteRoom(roomId) {
        if (!confirm('确定要删除这个房间吗？删除后无法恢复！')) {
            return;
        }

        try {
            const response = await this.apiCall(`/room/delete/${roomId}`, 'DELETE');
            
            if (response.code === 200) {
                this.showNotification('房间删除成功', 'success');
                // 更新所有相关列表
                await this.updateRoomStatus();
                
                // 如果删除的是当前房间，清空当前房间信息
                if (this.currentRoom && this.currentRoom.id === roomId) {
                    this.currentRoom = null;
                    this.roomMembers = [];
                    this.isStudying = false;
                }
            } else {
                this.showNotification('删除房间失败', 'error');
            }
        } catch (error) {
            console.error('删除房间失败:', error);
            this.showNotification('删除房间失败', 'error');
        }
    }

    // 加载我的自习室
    async loadMyRooms() {
        try {
            // 并行加载创建的房间和加入的房间
            const [createdResponse, joinedResponse] = await Promise.all([
                this.apiCall('/room/list?creatorId=1', 'GET'),
                this.apiCall('/room_member/list?userId=1', 'GET')
            ]);

            if (createdResponse.code === 200) {
                this.myCreatedRooms = createdResponse.data.records || [];
                this.renderMyCreatedRooms();
            }

            if (joinedResponse.code === 200) {
                this.myJoinedRooms = joinedResponse.data.records || [];
                this.renderMyJoinedRooms();
            }

            // 如果两个请求都失败，显示错误
            if (createdResponse.code !== 200 && joinedResponse.code !== 200) {
                this.showNotification('加载我的自习室失败', 'error');
            }
        } catch (error) {
            console.error('加载我的自习室失败:', error);
            this.showNotification('加载我的自习室失败', 'error');
        }
    }

    // 渲染我创建的房间
    renderMyCreatedRooms() {
        const myCreatedRoomsList = document.getElementById('my-created-rooms-list');
        if (!myCreatedRoomsList) return;

        if (this.myCreatedRooms.length === 0) {
            myCreatedRoomsList.innerHTML = '<div class="no-rooms">暂无创建的房间</div>';
            return;
        }

        myCreatedRoomsList.innerHTML = this.myCreatedRooms.map(room => `
            <div class="my-room-card">
                <div class="my-room-header">
                    <div class="my-room-name">${room.roomName}</div>
                    <div class="my-room-role">房主</div>
                </div>
                <div class="my-room-stats">
                    <span>成员: ${room.currentMembers || 0}/${room.maxMembers || 0}</span>
                    <span>主题: ${room.studyTheme || '无'}</span>
                    <span class="room-status ${this.getRoomStatusClass(room)}">${this.getRoomStatusText(room)}</span>
                </div>
                <div class="my-room-actions">
                    <button class="btn btn-primary btn-small" onclick="app.joinRoomById(${room.id})">
                        进入房间
                    </button>
                    <button class="btn btn-danger btn-small" onclick="app.deleteRoom(${room.id})">
                        删除房间
                    </button>
                </div>
            </div>
        `).join('');
    }

    // 渲染我加入的房间
    renderMyJoinedRooms() {
        const myJoinedRoomsList = document.getElementById('my-joined-rooms-list');
        if (!myJoinedRoomsList) return;

        if (this.myJoinedRooms.length === 0) {
            myJoinedRoomsList.innerHTML = '<div class="no-rooms">暂无加入的房间</div>';
            return;
        }

        myJoinedRoomsList.innerHTML = this.myJoinedRooms.map(roomMember => `
            <div class="my-room-card">
                <div class="my-room-header">
                    <div class="my-room-name">${roomMember.roomName || '未知房间'}</div>
                    <div class="my-room-role">成员</div>
                </div>
                <div class="my-room-stats">
                    <span>成员: ${roomMember.currentMembers || 0}/${roomMember.maxMembers || 0}</span>
                    <span>主题: ${roomMember.studyTheme || '无'}</span>
                    <span class="room-status ${this.getRoomStatusClass(roomMember)}">${this.getRoomStatusText(roomMember)}</span>
                </div>
                <div class="my-room-actions">
                    <button class="btn btn-primary btn-small" onclick="app.joinRoomById(${roomMember.roomId})">
                        进入房间
                    </button>
                    <button class="btn btn-outline btn-small" onclick="app.leaveMyRoom(${roomMember.roomId})">
                        退出房间
                    </button>
                </div>
            </div>
        `).join('');
    }

    // 绑定房间标签页
    bindRoomTabs() {
        const createdTab = document.getElementById('myCreatedRoomsTab');
        const joinedTab = document.getElementById('myJoinedRoomsTab');
        const createdCategory = document.getElementById('my-created-rooms');
        const joinedCategory = document.getElementById('my-joined-rooms');

        if (createdTab && joinedTab) {
            createdTab.addEventListener('click', () => {
                this.switchRoomTab('created');
            });

            joinedTab.addEventListener('click', () => {
                this.switchRoomTab('joined');
            });
        }
    }

    // 切换房间标签页
    switchRoomTab(tab) {
        const createdTab = document.getElementById('myCreatedRoomsTab');
        const joinedTab = document.getElementById('myJoinedRoomsTab');
        const createdCategory = document.getElementById('my-created-rooms');
        const joinedCategory = document.getElementById('my-joined-rooms');

        // 更新标签页状态
        if (tab === 'created') {
            createdTab.classList.add('active');
            joinedTab.classList.remove('active');
            createdCategory.classList.add('active');
            joinedCategory.classList.remove('active');
        } else {
            createdTab.classList.remove('active');
            joinedTab.classList.add('active');
            createdCategory.classList.remove('active');
            joinedCategory.classList.add('active');
        }
    }

    // 获取房间状态类名
    getRoomStatusClass(room) {
        if (room.status === 0) return 'inactive';
        if (room.currentMembers >= room.maxMembers) return 'full';
        return 'active';
    }

    // 获取房间状态文本
    getRoomStatusText(room) {
        if (room.status === 0) return '已关闭';
        if (room.currentMembers >= room.maxMembers) return '已满员';
        return '开放中';
    }

    // 获取房间类型类名
    getRoomTypeClass(roomType) {
        switch(roomType) {
            case 0: return 'public';
            case 1: return 'private';
            default: return 'public';
        }
    }

    // 获取房间类型文本
    getRoomTypeText(roomType) {
        switch(roomType) {
            case 0: return '公开';
            case 1: return '私密';
            default: return '公开';
        }
    }

    // 退出我的自习室
    async leaveMyRoom(roomId) {
        if (!confirm('确定要退出这个自习室吗？')) {
            return;
        }

        try {
            const response = await this.apiCall('/room/leave', 'POST', {
                roomId: roomId,
                userId: 1
            });

            if (response.code === 200) {
                this.showNotification('已退出自习室', 'success');
                // 重新加载我的房间列表
                this.loadMyRooms();
                
                // 如果退出的是当前房间，清空当前房间信息
                if (this.currentRoom && this.currentRoom.id === roomId) {
                    this.currentRoom = null;
                    this.roomMembers = [];
                    this.isStudying = false;
                }
            } else {
                this.showNotification('退出自习室失败', 'error');
            }
        } catch (error) {
            console.error('退出自习室失败:', error);
            this.showNotification('退出自习室失败', 'error');
        }
    }

    // 房间状态动态更新
    async updateRoomStatus() {
        try {
            // 更新房间列表
            await this.loadAllRooms();
            
            // 如果在个人中心页面，也更新我的房间
            const profilePage = document.getElementById('profile-page');
            if (profilePage && profilePage.classList.contains('active')) {
                await this.loadMyRooms();
            }
        } catch (error) {
            console.error('更新房间状态失败:', error);
        }
    }

    // 加载所有房间（自习室页面）
    async loadAllRooms() {
        try {
            // 并行加载所有房间、创建的房间和加入的房间
            const [allResponse, createdResponse, joinedResponse] = await Promise.all([
                this.apiCall('/room/list', 'GET'),
                this.apiCall('/room/list?creatorId=1', 'GET'),
                this.apiCall('/room_member/list?userId=1', 'GET')
            ]);

            if (allResponse.code === 200) {
                this.allRooms = allResponse.data.records || [];
                this.renderAllRooms();
            }

            if (createdResponse.code === 200) {
                this.myCreatedRoomsStudy = createdResponse.data.records || [];
                this.renderMyCreatedRoomsStudy();
            }

            if (joinedResponse.code === 200) {
                this.myJoinedRoomsStudy = joinedResponse.data.records || [];
                this.renderMyJoinedRoomsStudy();
            }
        } catch (error) {
            console.error('加载房间列表失败:', error);
            this.showNotification('加载房间列表失败', 'error');
        }
    }

    // 渲染所有房间
    renderAllRooms() {
        const allRoomsList = document.getElementById('all-rooms-list');
        if (!allRoomsList) return;

        if (this.allRooms.length === 0) {
            allRoomsList.innerHTML = '<div class="no-rooms">暂无可用房间</div>';
            return;
        }

        allRoomsList.innerHTML = this.allRooms.map(room => `
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
                    <span class="room-status ${this.getRoomStatusClass(room)}">${this.getRoomStatusText(room)}</span>
                </div>
                <div class="room-actions">
                    <button class="btn btn-outline btn-small" onclick="app.viewRoomMembers(${room.id})" title="查看成员">
                        <i class="fas fa-users"></i>
                    </button>
                    <button class="btn btn-primary" onclick="app.joinRoomById(${room.id})">
                        加入房间
                    </button>
                    ${room.creatorId === 1 ? `
                        <button class="btn btn-danger btn-small" onclick="app.deleteRoom(${room.id})" title="删除房间">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // 渲染我创建的房间（自习室页面）
    renderMyCreatedRoomsStudy() {
        const myCreatedRoomsList = document.getElementById('my-created-rooms-list-study');
        if (!myCreatedRoomsList) return;

        if (this.myCreatedRoomsStudy.length === 0) {
            myCreatedRoomsList.innerHTML = '<div class="no-rooms">暂无创建的房间</div>';
            return;
        }

        myCreatedRoomsList.innerHTML = this.myCreatedRoomsStudy.map(room => `
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
                    <span class="room-status ${this.getRoomStatusClass(room)}">${this.getRoomStatusText(room)}</span>
                </div>
                <div class="room-actions">
                    <button class="btn btn-outline btn-small" onclick="app.viewRoomMembers(${room.id})" title="查看成员">
                        <i class="fas fa-users"></i>
                    </button>
                    <button class="btn btn-primary" onclick="app.enterRoomById(${room.id})">
                        进入房间
                    </button>
                    <button class="btn btn-danger btn-small" onclick="app.deleteRoom(${room.id})" title="删除房间">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // 渲染我加入的房间（自习室页面）
    renderMyJoinedRoomsStudy() {
        const myJoinedRoomsList = document.getElementById('my-joined-rooms-list-study');
        if (!myJoinedRoomsList) return;

        if (this.myJoinedRoomsStudy.length === 0) {
            myJoinedRoomsList.innerHTML = '<div class="no-rooms">暂无加入的房间</div>';
            return;
        }

        myJoinedRoomsList.innerHTML = this.myJoinedRoomsStudy.map(roomMember => `
            <div class="room-card">
                <div class="room-card-header">
                    <div class="room-name">${roomMember.roomName || '未知房间'}</div>
                    <div class="room-type member">
                        成员
                    </div>
                </div>
                <div class="room-description">${roomMember.description || '暂无描述'}</div>
                <div class="room-stats">
                    <span>成员: ${roomMember.currentMembers || 0}/${roomMember.maxMembers || 0}</span>
                    <span>主题: ${roomMember.studyTheme || '无'}</span>
                    <span class="room-status ${this.getRoomStatusClass(roomMember)}">${this.getRoomStatusText(roomMember)}</span>
                </div>
                <div class="room-actions">
                    <button class="btn btn-outline btn-small" onclick="app.viewRoomMembers(${roomMember.roomId})" title="查看成员">
                        <i class="fas fa-users"></i>
                    </button>
                    <button class="btn btn-primary" onclick="app.enterRoomById(${roomMember.roomId})">
                        进入房间
                    </button>
                    <button class="btn btn-outline btn-small" onclick="app.leaveMyRoom(${roomMember.roomId})" title="退出房间">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // 绑定自习室页面标签页
    bindStudyRoomTabs() {
        const allTab = document.getElementById('allRoomsTab');
        const createdTab = document.getElementById('myCreatedRoomsTab');
        const joinedTab = document.getElementById('myJoinedRoomsTab');

        if (allTab && createdTab && joinedTab) {
            allTab.addEventListener('click', () => {
                this.switchStudyRoomTab('all');
            });

            createdTab.addEventListener('click', () => {
                this.switchStudyRoomTab('created');
            });

            joinedTab.addEventListener('click', () => {
                this.switchStudyRoomTab('joined');
            });
        }
    }

    // 切换自习室页面标签页
    switchStudyRoomTab(tab) {
        const allTab = document.getElementById('allRoomsTab');
        const createdTab = document.getElementById('myCreatedRoomsTab');
        const joinedTab = document.getElementById('myJoinedRoomsTab');
        const allCategory = document.getElementById('all-rooms');
        const createdCategory = document.getElementById('my-created-rooms-study');
        const joinedCategory = document.getElementById('my-joined-rooms-study');

        // 重置所有标签页
        [allTab, createdTab, joinedTab].forEach(t => t.classList.remove('active'));
        [allCategory, createdCategory, joinedCategory].forEach(c => c.classList.remove('active'));

        // 激活选中的标签页
        if (tab === 'all') {
            allTab.classList.add('active');
            allCategory.classList.add('active');
        } else if (tab === 'created') {
            createdTab.classList.add('active');
            createdCategory.classList.add('active');
        } else if (tab === 'joined') {
            joinedTab.classList.add('active');
            joinedCategory.classList.add('active');
        }
    }

    // 查看房间成员列表
    async viewRoomMembers(roomId) {
        try {
            const response = await this.apiCall(`/room_member/list?roomId=${roomId}`, 'GET');
            if (response.code === 200) {
                const members = response.data.records || [];
                this.showRoomMembersModal(roomId, members);
            } else {
                this.showNotification('获取成员列表失败', 'error');
            }
        } catch (error) {
            console.error('获取成员列表失败:', error);
            this.showNotification('获取成员列表失败', 'error');
        }
    }

    // 显示房间成员模态框
    showRoomMembersModal(roomId, members) {
        const room = this.allRooms.find(r => r.id === roomId) || 
                   this.myCreatedRoomsStudy.find(r => r.id === roomId) ||
                   this.myJoinedRoomsStudy.find(r => r.roomId === roomId);
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'roomMembersModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${room ? room.roomName : '房间'} 成员列表</h3>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="members-list">
                        ${members.map(member => `
                            <div class="member-item">
                                <div class="member-avatar">
                                    <i class="fas fa-user-circle"></i>
                                </div>
                                <div class="member-info">
                                    <div class="member-name">${member.username || '用户' + member.userId}</div>
                                    <div class="member-role">${member.role === 'creator' ? '房主' : '成员'}</div>
                                </div>
                                <div class="member-stats">
                                    <span>学习时长: ${member.studyTime || 0}分钟</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="app.enterRoomById(${roomId})">
                        进入房间
                    </button>
                    <button class="btn btn-outline" onclick="app.closeRoomMembersModal()">
                        关闭
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        // 绑定关闭事件
        modal.querySelector('.close').addEventListener('click', () => {
            this.closeRoomMembersModal();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeRoomMembersModal();
            }
        });
    }

    // 关闭房间成员模态框
    closeRoomMembersModal() {
        const modal = document.getElementById('roomMembersModal');
        if (modal) {
            modal.remove();
        }
    }

    // 进入房间（已加入的房间）
    async enterRoomById(roomId) {
        try {
            const response = await this.apiCall(`/room/${roomId}`, 'GET');
            if (response.code === 200) {
                this.currentRoom = response.data;
                this.showRoomDashboard();
                this.showNotification('已进入房间', 'success');
            } else {
                this.showNotification('进入房间失败', 'error');
            }
        } catch (error) {
            console.error('进入房间失败:', error);
            this.showNotification('进入房间失败', 'error');
        }
    }

    // 显示房间仪表板
    showRoomDashboard() {
        // 切换到房间仪表板页面
        this.showPage('room-dashboard');
        this.loadRoomDashboard();
    }

    // 加载房间仪表板数据
    async loadRoomDashboard() {
        if (!this.currentRoom) return;

        // 更新房间信息
        this.updateRoomInfo();
        
        // 加载排行榜
        await this.loadRoomRanking();
        
        // 加载成就系统
        await this.loadRoomAchievements();
        
        // 绑定倒计时器事件
        this.bindRoomTimerEvents();
        
        // 绑定房间仪表板离开房间按钮事件
        this.bindRoomDashboardEvents();
    }

    // 更新房间信息
    updateRoomInfo() {
        if (!this.currentRoom) return;

        document.getElementById('room-dashboard-title').textContent = this.currentRoom.roomName;
        document.getElementById('room-name').textContent = this.currentRoom.roomName;
        document.getElementById('room-members-count').textContent = `成员: ${this.currentRoom.currentMembers}/${this.currentRoom.maxMembers}`;
        document.getElementById('room-theme').textContent = `主题: ${this.currentRoom.studyTheme || '无'}`;
        document.getElementById('room-status').textContent = `状态: ${this.getRoomStatusText(this.currentRoom)}`;
    }

    // 加载房间排行榜
    async loadRoomRanking() {
        try {
            const response = await this.apiCall(`/room_member/list?roomId=${this.currentRoom.id}`, 'GET');
            if (response.code === 200) {
                const members = response.data.records || [];
                this.renderRoomRanking(members);
            }
        } catch (error) {
            console.error('加载排行榜失败:', error);
        }
    }

    // 渲染房间排行榜
    renderRoomRanking(members) {
        const rankingList = document.getElementById('ranking-list');
        if (!rankingList) return;

        // 按学习时长排序
        const sortedMembers = members.sort((a, b) => (b.studyTime || 0) - (a.studyTime || 0));

        rankingList.innerHTML = sortedMembers.map((member, index) => `
            <div class="ranking-item">
                <div class="ranking-position ${index < 3 ? ['first', 'second', 'third'][index] : ''}">
                    ${index + 1}
                </div>
                <div class="ranking-info">
                    <div class="ranking-name">${member.username || '用户' + member.userId}</div>
                    <div class="ranking-stats">学习时长: ${member.studyTime || 0}分钟</div>
                </div>
            </div>
        `).join('');
    }

    // 加载房间成就
    async loadRoomAchievements() {
        try {
            // 模拟成就数据
            const achievements = [
                {
                    id: 1,
                    name: '学习新手',
                    description: '完成第一次学习',
                    icon: 'fas fa-graduation-cap',
                    unlocked: true
                },
                {
                    id: 2,
                    name: '专注达人',
                    description: '连续学习7天',
                    icon: 'fas fa-fire',
                    unlocked: true
                },
                {
                    id: 3,
                    name: '时间管理大师',
                    description: '累计学习100小时',
                    icon: 'fas fa-clock',
                    unlocked: false
                },
                {
                    id: 4,
                    name: '房间活跃分子',
                    description: '在房间中学习50小时',
                    icon: 'fas fa-users',
                    unlocked: false
                }
            ];
            
            this.renderRoomAchievements(achievements);
        } catch (error) {
            console.error('加载成就失败:', error);
        }
    }

    // 渲染房间成就
    renderRoomAchievements(achievements) {
        const achievementsList = document.getElementById('achievements-list');
        if (!achievementsList) return;

        achievementsList.innerHTML = achievements.map(achievement => `
            <div class="achievement-item ${achievement.unlocked ? 'unlocked' : ''}">
                <div class="achievement-icon">
                    <i class="${achievement.icon}"></i>
                </div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
            </div>
        `).join('');
    }

    // 绑定房间倒计时器事件
    bindRoomTimerEvents() {
        const startBtn = document.getElementById('startRoomTimer');
        const pauseBtn = document.getElementById('pauseRoomTimer');
        const resetBtn = document.getElementById('resetRoomTimer');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startRoomTimer();
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.pauseRoomTimer();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetRoomTimer();
            });
        }
    }

    // 绑定房间仪表板事件
    bindRoomDashboardEvents() {
        const leaveBtn = document.getElementById('leaveRoomDashboardBtn');
        if (leaveBtn) {
            leaveBtn.addEventListener('click', () => {
                this.leaveRoom();
            });
        }
    }

    // 房间倒计时器功能
    startRoomTimer() {
        if (this.roomTimerInterval) return;

        this.roomTimerDuration = 25 * 60; // 25分钟
        this.roomTimerInterval = setInterval(() => {
            this.roomTimerDuration--;
            this.updateRoomTimerDisplay();
            
            if (this.roomTimerDuration <= 0) {
                this.completeRoomTimer();
            }
        }, 1000);

        this.updateRoomTimerButtons(true);
        this.updateRoomTimerStatus('学习中...');
    }

    pauseRoomTimer() {
        if (this.roomTimerInterval) {
            clearInterval(this.roomTimerInterval);
            this.roomTimerInterval = null;
            this.updateRoomTimerButtons(false);
            this.updateRoomTimerStatus('已暂停');
        }
    }

    resetRoomTimer() {
        if (this.roomTimerInterval) {
            clearInterval(this.roomTimerInterval);
            this.roomTimerInterval = null;
        }
        
        this.roomTimerDuration = 25 * 60;
        this.updateRoomTimerDisplay();
        this.updateRoomTimerButtons(false);
        this.updateRoomTimerStatus('准备开始');
    }

    completeRoomTimer() {
        if (this.roomTimerInterval) {
            clearInterval(this.roomTimerInterval);
            this.roomTimerInterval = null;
        }
        
        this.updateRoomTimerButtons(false);
        this.updateRoomTimerStatus('学习完成！');
        this.showNotification('恭喜！完成一次专注学习', 'success');
        
        // 更新学习统计
        this.updateTodayFocusTime();
    }

    updateRoomTimerDisplay() {
        const timerElement = document.getElementById('room-timer');
        if (timerElement) {
            const minutes = Math.floor(this.roomTimerDuration / 60);
            const seconds = this.roomTimerDuration % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    updateRoomTimerStatus(status) {
        const statusElement = document.getElementById('room-timer-status');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }

    updateRoomTimerButtons(isRunning) {
        const startBtn = document.getElementById('startRoomTimer');
        const pauseBtn = document.getElementById('pauseRoomTimer');
        
        if (startBtn) startBtn.disabled = isRunning;
        if (pauseBtn) pauseBtn.disabled = !isRunning;
    }


    // ==================== 音乐播放器功能 ====================

    // 初始化音乐播放器
    initMusicPlayer() {
        this.musicPlayer = {
            audio: null,
            currentTrack: 0,
            isPlaying: false,
            isCollapsed: false,
            isListExpanded: false,
            volume: 0.5,
            tracks: [
                { name: '读书声', artist: '环境音效', file: 'music/book.mp3' },
                { name: '篝火声', artist: '环境音效', file: 'music/fire.mp3' },
                { name: '雨声', artist: '环境音效', file: 'music/rain.mp3' },
                { name: '仓库声', artist: '环境音效', file: 'music/ware.mp3' }
            ]
        };

        this.bindMusicPlayerEvents();
        this.scanMusicFiles();
        this.renderMusicList();
        this.updateMusicInfo();
    }

    // 扫描music文件夹中的MP3文件
    async scanMusicFiles() {
        try {
            // 尝试获取music文件夹中的文件列表
            const response = await fetch('/music/');
            if (response.ok) {
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const links = doc.querySelectorAll('a[href$=".mp3"]');
                
                const foundFiles = Array.from(links).map(link => {
                    const filename = link.getAttribute('href');
                    const name = filename.replace('.mp3', '').replace('music/', '');
                    return {
                        name: this.formatMusicName(name),
                        artist: '环境音效',
                        file: filename
                    };
                });
                
                if (foundFiles.length > 0) {
                    this.musicPlayer.tracks = foundFiles;
                    console.log('发现音乐文件:', foundFiles);
                }
            }
        } catch (error) {
            console.log('无法扫描music文件夹，使用默认音乐列表');
        }
    }

    // 格式化音乐名称
    formatMusicName(filename) {
        const nameMap = {
            'book': '读书声',
            'fire': '篝火声',
            'rain': '雨声',
            'ware': '仓库声'
        };
        return nameMap[filename] || filename;
    }

    // 绑定音乐播放器事件
    bindMusicPlayerEvents() {
        // 收缩/展开按钮
        const toggleBtn = document.getElementById('musicPlayerToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleMusicPlayer();
            });
        }

        // 关闭按钮
        const closeBtn = document.getElementById('musicPlayerClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeMusicPlayer();
            });
        }

        // 播放/暂停按钮
        const playPauseBtn = document.getElementById('playPauseMusic');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this.togglePlayPause();
            });
        }

        // 上一首按钮
        const prevBtn = document.getElementById('prevMusic');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.previousTrack();
            });
        }

        // 下一首按钮
        const nextBtn = document.getElementById('nextMusic');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextTrack();
            });
        }

        // 音量滑块
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value / 100);
            });
        }

        // 进度条点击
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                this.seekTo(e);
            });
        }

        // 播放列表切换
        const toggleListBtn = document.getElementById('toggleMusicList');
        if (toggleListBtn) {
            toggleListBtn.addEventListener('click', () => {
                this.toggleMusicList();
            });
        }

        // 拖拽功能
        this.makeMusicPlayerDraggable();
    }

    // 使音乐播放器可拖拽
    makeMusicPlayerDraggable() {
        const player = document.getElementById('musicPlayer');
        const header = document.querySelector('.music-player-header');
        
        if (!player || !header) return;

        let isDragging = false;
        let startX, startY, startLeft, startTop;

        // 确保播放器有初始位置
        if (!player.style.left && !player.style.top) {
            player.style.position = 'fixed';
            player.style.left = '20px';
            player.style.top = '20px';
        }

        header.addEventListener('mousedown', (e) => {
            // 检查是否点击了按钮
            if (e.target.closest('button')) return;
            
            e.preventDefault();
            isDragging = true;
            
            startX = e.clientX;
            startY = e.clientY;
            
            // 获取当前位置
            const rect = player.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            
            // 设置样式
            player.style.position = 'fixed';
            player.style.left = startLeft + 'px';
            player.style.top = startTop + 'px';
            player.style.cursor = 'grabbing';
            
            // 添加事件监听器
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            const newLeft = startLeft + deltaX;
            const newTop = startTop + deltaY;
            
            // 边界检查
            const maxLeft = window.innerWidth - player.offsetWidth;
            const maxTop = window.innerHeight - player.offsetHeight;
            
            player.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
            player.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
        };

        const handleMouseUp = () => {
            if (!isDragging) return;
            
            isDragging = false;
            player.style.cursor = 'default';
            
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }

    // 切换播放器收缩/展开
    toggleMusicPlayer() {
        const player = document.getElementById('musicPlayer');
        const toggleIcon = document.querySelector('#musicPlayerToggle i');
        
        if (!player || !toggleIcon) return;

        this.musicPlayer.isCollapsed = !this.musicPlayer.isCollapsed;
        
        if (this.musicPlayer.isCollapsed) {
            player.classList.add('collapsed');
            toggleIcon.className = 'fas fa-plus';
            console.log('音乐播放器已收缩');
            
            // 为收缩状态添加点击展开功能
            this.addCollapsedClickHandler();
        } else {
            player.classList.remove('collapsed');
            toggleIcon.className = 'fas fa-minus';
            console.log('音乐播放器已展开');
            
            // 移除收缩状态的点击事件
            this.removeCollapsedClickHandler();
        }
    }

    // 添加收缩状态点击展开功能
    addCollapsedClickHandler() {
        const player = document.getElementById('musicPlayer');
        if (!player) return;

        // 移除之前的事件监听器（如果存在）
        this.removeCollapsedClickHandler();

        // 添加新的点击事件监听器
        this.collapsedClickHandler = (e) => {
            // 如果点击的不是按钮，则展开播放器
            if (!e.target.closest('button')) {
                this.toggleMusicPlayer();
            }
        };

        player.addEventListener('click', this.collapsedClickHandler);
    }

    // 移除收缩状态点击事件
    removeCollapsedClickHandler() {
        const player = document.getElementById('musicPlayer');
        if (!player || !this.collapsedClickHandler) return;

        player.removeEventListener('click', this.collapsedClickHandler);
        this.collapsedClickHandler = null;
    }

    // 关闭音乐播放器
    closeMusicPlayer() {
        const player = document.getElementById('musicPlayer');
        if (player) {
            player.style.display = 'none';
        }
        
        if (this.musicPlayer.audio) {
            this.musicPlayer.audio.pause();
            this.musicPlayer.audio = null;
        }
    }

    // 切换播放/暂停
    togglePlayPause() {
        console.log('切换播放/暂停，当前状态:', this.musicPlayer.isPlaying);
        
        if (!this.musicPlayer.audio) {
            console.log('没有音频对象，加载当前曲目');
            this.loadCurrentTrack();
            return;
        }

        if (this.musicPlayer.isPlaying) {
            console.log('当前正在播放，执行暂停');
            this.pauseMusic();
        } else {
            console.log('当前已暂停，执行播放');
            this.playMusic();
        }
    }

    // 播放音乐
    playMusic() {
        if (!this.musicPlayer.audio) {
            console.log('没有音频对象，无法播放');
            return;
        }

        console.log('开始播放音乐');
        this.musicPlayer.audio.play().then(() => {
            this.musicPlayer.isPlaying = true;
            this.updatePlayButton();
            console.log('播放成功，状态已更新');
        }).catch(error => {
            console.error('播放失败:', error);
            this.musicPlayer.isPlaying = false;
            this.updatePlayButton();
            this.showNotification('播放失败，请检查音频文件', 'error');
        });
    }

    // 暂停音乐
    pauseMusic() {
        if (!this.musicPlayer.audio) {
            console.log('没有音频对象，无法暂停');
            return;
        }

        console.log('暂停音乐');
        this.musicPlayer.audio.pause();
        this.musicPlayer.isPlaying = false;
        this.updatePlayButton();
        console.log('暂停成功，状态已更新');
    }

    // 加载当前曲目
    loadCurrentTrack() {
        const track = this.musicPlayer.tracks[this.musicPlayer.currentTrack];
        if (!track) return;

        // 停止当前播放的音频
        if (this.musicPlayer.audio) {
            this.musicPlayer.audio.pause();
            this.musicPlayer.audio = null;
        }

        this.musicPlayer.audio = new Audio(track.file);
        this.musicPlayer.audio.volume = this.musicPlayer.volume;
        
        this.musicPlayer.audio.addEventListener('loadedmetadata', () => {
            this.updateTimeDisplay();
        });

        this.musicPlayer.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.musicPlayer.audio.addEventListener('ended', () => {
            this.nextTrack();
        });

        this.musicPlayer.audio.addEventListener('error', (e) => {
            console.error('音频加载失败:', e);
            this.showNotification('音频文件加载失败', 'error');
        });

        this.updateMusicInfo();
        this.updatePlayButton();
    }

    // 上一首
    previousTrack() {
        console.log('切换到上一首');
        // 先停止当前播放
        if (this.musicPlayer.audio && this.musicPlayer.isPlaying) {
            this.musicPlayer.audio.pause();
        }
        
        this.musicPlayer.currentTrack = (this.musicPlayer.currentTrack - 1 + this.musicPlayer.tracks.length) % this.musicPlayer.tracks.length;
        this.musicPlayer.isPlaying = false; // 切换歌曲后默认暂停
        this.loadCurrentTrack();
        this.updateMusicList();
    }

    // 下一首
    nextTrack() {
        console.log('切换到下一首');
        // 先停止当前播放
        if (this.musicPlayer.audio && this.musicPlayer.isPlaying) {
            this.musicPlayer.audio.pause();
        }
        
        this.musicPlayer.currentTrack = (this.musicPlayer.currentTrack + 1) % this.musicPlayer.tracks.length;
        this.musicPlayer.isPlaying = false; // 切换歌曲后默认暂停
        this.loadCurrentTrack();
        this.updateMusicList();
    }

    // 设置音量
    setVolume(volume) {
        this.musicPlayer.volume = volume;
        if (this.musicPlayer.audio) {
            this.musicPlayer.audio.volume = volume;
        }
    }

    // 跳转到指定位置
    seekTo(event) {
        if (!this.musicPlayer.audio) return;

        const progressBar = event.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * this.musicPlayer.audio.duration;
        
        this.musicPlayer.audio.currentTime = newTime;
    }

    // 切换播放列表显示
    toggleMusicList() {
        const listContent = document.getElementById('musicListContent');
        const toggleIcon = document.querySelector('#toggleMusicList i');
        
        if (!listContent) return;

        this.musicPlayer.isListExpanded = !this.musicPlayer.isListExpanded;
        
        if (this.musicPlayer.isListExpanded) {
            listContent.classList.add('show');
            toggleIcon.className = 'fas fa-chevron-up';
        } else {
            listContent.classList.remove('show');
            toggleIcon.className = 'fas fa-chevron-down';
        }
    }

    // 渲染音乐列表
    renderMusicList() {
        const listContent = document.getElementById('musicListContent');
        if (!listContent) return;

        listContent.innerHTML = this.musicPlayer.tracks.map((track, index) => `
            <div class="music-item ${index === this.musicPlayer.currentTrack ? 'active' : ''}" 
                 onclick="app.selectTrack(${index})">
                <i class="fas fa-music"></i>
                <span>${track.name}</span>
            </div>
        `).join('');
    }

    // 选择曲目
    selectTrack(index) {
        console.log('选择曲目:', index);
        // 先停止当前播放
        if (this.musicPlayer.audio && this.musicPlayer.isPlaying) {
            this.musicPlayer.audio.pause();
        }
        
        this.musicPlayer.currentTrack = index;
        this.musicPlayer.isPlaying = false; // 切换歌曲后默认暂停
        this.loadCurrentTrack();
        this.updateMusicList();
    }

    // 更新音乐信息
    updateMusicInfo() {
        const track = this.musicPlayer.tracks[this.musicPlayer.currentTrack];
        if (!track) return;

        const nameElement = document.getElementById('currentMusicName');
        const artistElement = document.getElementById('currentMusicArtist');
        
        if (nameElement) nameElement.textContent = track.name;
        if (artistElement) artistElement.textContent = track.artist;
    }

    // 更新播放按钮
    updatePlayButton() {
        const playIcon = document.querySelector('#playPauseMusic i');
        if (!playIcon) return;

        if (this.musicPlayer.isPlaying) {
            playIcon.className = 'fas fa-pause';
        } else {
            playIcon.className = 'fas fa-play';
        }
    }

    // 更新进度条
    updateProgress() {
        if (!this.musicPlayer.audio) return;

        const progressFill = document.getElementById('musicProgressFill');
        if (progressFill) {
            const percentage = (this.musicPlayer.audio.currentTime / this.musicPlayer.audio.duration) * 100;
            progressFill.style.width = percentage + '%';
        }

        this.updateTimeDisplay();
    }

    // 更新时间显示
    updateTimeDisplay() {
        if (!this.musicPlayer.audio) return;

        const currentTimeElement = document.getElementById('currentTime');
        const totalTimeElement = document.getElementById('totalTime');
        
        if (currentTimeElement) {
            currentTimeElement.textContent = this.formatTime(this.musicPlayer.audio.currentTime);
        }
        
        if (totalTimeElement) {
            totalTimeElement.textContent = this.formatTime(this.musicPlayer.audio.duration);
        }
    }

    // 格式化时间
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // 更新音乐列表高亮
    updateMusicList() {
        const items = document.querySelectorAll('.music-item');
        items.forEach((item, index) => {
            if (index === this.musicPlayer.currentTrack) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // ==================== 学习统计功能 ====================

    // 加载统计数据
    loadStatistics() {
        this.updateStatisticsOverview();
        this.renderStudyChart();
        this.renderTaskChart();
        this.renderHabitChart();
    }

    // 绑定统计页面事件
    bindStatisticsEvents() {
        const generateBtn = document.getElementById('generateSampleDataBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generateSampleData();
            });
        }
    }

    // 更新统计概览
    updateStatisticsOverview() {
        const totalStudyTime = localStorage.getItem('totalStudyTime') || 0;
        const studyDays = localStorage.getItem('studyDays') || 0;
        const completedTasks = localStorage.getItem('completedTasks') || 0;
        const streakDays = localStorage.getItem('streakDays') || 0;

        document.getElementById('total-study-time').textContent = totalStudyTime;
        document.getElementById('study-days').textContent = studyDays;
        document.getElementById('completed-tasks').textContent = completedTasks;
        document.getElementById('streak-days').textContent = streakDays;
    }

    // 生成示例数据
    generateSampleData() {
        // 生成学习时长数据
        const totalStudyTime = Math.floor(Math.random() * 2000) + 500; // 500-2500分钟
        const studyDays = Math.floor(Math.random() * 30) + 10; // 10-40天
        const completedTasks = Math.floor(Math.random() * 50) + 20; // 20-70个任务
        const streakDays = Math.floor(Math.random() * 15) + 5; // 5-20天

        // 保存到localStorage
        localStorage.setItem('totalStudyTime', totalStudyTime);
        localStorage.setItem('studyDays', studyDays);
        localStorage.setItem('completedTasks', completedTasks);
        localStorage.setItem('streakDays', streakDays);

        // 更新显示
        this.updateStatisticsOverview();
        this.renderStudyChart();
        this.renderTaskChart();
        this.renderHabitChart();

        this.showNotification('示例数据生成成功！', 'success');
    }

    // 渲染学习时长图表
    renderStudyChart() {
        const chartContainer = document.getElementById('study-chart');
        if (!chartContainer) return;

        const totalTime = parseInt(localStorage.getItem('totalStudyTime')) || 0;
        const studyDays = parseInt(localStorage.getItem('studyDays')) || 0;
        const avgTime = studyDays > 0 ? Math.round(totalTime / studyDays) : 0;

        chartContainer.innerHTML = `
            <div style="text-align: center; padding: 1rem; width: 100%;">
                <div style="font-size: 2rem; color: var(--primary-color); margin-bottom: 0.5rem;">
                    <i class="fas fa-chart-line"></i>
                </div>
                <h4 style="color: #333; margin-bottom: 0.75rem; font-size: 1rem;">学习时长分析</h4>
                <div class="sample-data-item">
                    <span class="sample-data-label">总学习时长</span>
                    <span class="sample-data-value">${totalTime} 分钟</span>
                </div>
                <div class="sample-data-item">
                    <span class="sample-data-label">学习天数</span>
                    <span class="sample-data-value">${studyDays} 天</span>
                </div>
                <div class="sample-data-item">
                    <span class="sample-data-label">平均每日</span>
                    <span class="sample-data-value">${avgTime} 分钟</span>
                </div>
                <div class="sample-data-item">
                    <span class="sample-data-label">学习效率</span>
                    <span class="sample-data-value">${Math.min(100, Math.floor((totalTime / 100) * 10))}%</span>
                </div>
            </div>
        `;
    }

    // 渲染任务完成图表
    renderTaskChart() {
        const chartContainer = document.getElementById('task-chart');
        if (!chartContainer) return;

        const completedTasks = parseInt(localStorage.getItem('completedTasks')) || 0;
        const totalTasks = completedTasks + Math.floor(Math.random() * 20) + 5;
        const completionRate = Math.round((completedTasks / totalTasks) * 100);

        chartContainer.innerHTML = `
            <div style="text-align: center; padding: 1rem; width: 100%;">
                <div style="font-size: 2rem; color: #28a745; margin-bottom: 0.5rem;">
                    <i class="fas fa-tasks"></i>
                </div>
                <h4 style="color: #333; margin-bottom: 0.75rem; font-size: 1rem;">任务完成情况</h4>
                <div class="sample-data-item">
                    <span class="sample-data-label">已完成任务</span>
                    <span class="sample-data-value">${completedTasks} 个</span>
                </div>
                <div class="sample-data-item">
                    <span class="sample-data-label">总任务数</span>
                    <span class="sample-data-value">${totalTasks} 个</span>
                </div>
                <div class="sample-data-item">
                    <span class="sample-data-label">完成率</span>
                    <span class="sample-data-value">${completionRate}%</span>
                </div>
                <div class="sample-data-item">
                    <span class="sample-data-label">平均每日</span>
                    <span class="sample-data-value">${Math.round(completedTasks / 30)} 个</span>
                </div>
            </div>
        `;
    }

    // 渲染学习习惯图表
    renderHabitChart() {
        const chartContainer = document.getElementById('habit-chart');
        if (!chartContainer) return;

        const studyDays = parseInt(localStorage.getItem('studyDays')) || 0;
        const streakDays = parseInt(localStorage.getItem('streakDays')) || 0;
        const consistency = studyDays > 0 ? Math.round((streakDays / studyDays) * 100) : 0;

        // 生成学习时间段分布
        const timeSlots = [
            { period: '早晨 (6-9点)', percentage: Math.floor(Math.random() * 30) + 10 },
            { period: '上午 (9-12点)', percentage: Math.floor(Math.random() * 40) + 20 },
            { period: '下午 (14-17点)', percentage: Math.floor(Math.random() * 35) + 15 },
            { period: '晚上 (19-22点)', percentage: Math.floor(Math.random() * 25) + 15 }
        ];

        chartContainer.innerHTML = `
            <div style="text-align: center; padding: 1rem; width: 100%;">
                <div style="font-size: 2rem; color: #ffc107; margin-bottom: 0.5rem;">
                    <i class="fas fa-clock"></i>
                </div>
                <h4 style="color: #333; margin-bottom: 0.75rem; font-size: 1rem;">学习习惯分析</h4>
                <div class="sample-data-item">
                    <span class="sample-data-label">学习一致性</span>
                    <span class="sample-data-value">${consistency}%</span>
                </div>
                <div class="sample-data-item">
                    <span class="sample-data-label">最长连续</span>
                    <span class="sample-data-value">${streakDays} 天</span>
                </div>
                <div style="margin-top: 0.5rem;">
                    <h5 style="color: #333; margin-bottom: 0.4rem; font-size: 0.9rem;">学习时间段分布</h5>
                    ${timeSlots.map(slot => `
                        <div class="sample-data-item">
                            <span class="sample-data-label">${slot.period}</span>
                            <span class="sample-data-value">${slot.percentage}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
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

    // 更新首页统计数据
    updateDashboardStats() {
        // 更新今日专注时长
        const todayFocusElement = document.getElementById('today-focus');
        if (todayFocusElement) {
            const todayFocus = localStorage.getItem('todayFocus') || '0';
            todayFocusElement.textContent = todayFocus;
        }

        // 更新今日完成任务数
        const todayTasksElement = document.getElementById('today-tasks');
        if (todayTasksElement) {
            const todayTasks = localStorage.getItem('todayTasks') || '0';
            todayTasksElement.textContent = todayTasks;
        }

        // 更新连续学习天数
        const streakDaysElement = document.getElementById('streak-days');
        if (streakDaysElement) {
            const streakDays = localStorage.getItem('streakDays') || '0';
            streakDaysElement.textContent = streakDays;
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

// 初始化应用 - 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，初始化应用...');
    window.app = new PomodoroApp();
    console.log('应用初始化完成，app对象已创建');
});