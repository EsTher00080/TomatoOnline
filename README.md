# 🍅 番茄自习室 - Pomodoro Study Room

> 一个现代化的在线自律学习平台，支持多人自习房间、番茄钟计时、任务管理等功能。

## 📋 项目概述

番茄自习室是一个基于Spring Boot + Vue3的全栈Web应用，旨在帮助用户提高学习效率，通过番茄工作法和多人学习环境来增强学习动力。

### ✨ 核心功能

- **🍅 番茄钟计时器** - 25分钟专注 + 5分钟休息的经典番茄工作法
- **👥 多人自习房间** - 创建或加入学习房间，与其他人一起学习
- **📝 任务管理** - 创建、跟踪和管理学习任务
- **📊 学习统计** - 记录学习时长、效率评分等数据
- **🏆 成就系统** - 解锁各种学习成就，激励持续学习
- **📈 排行榜** - 日榜、周榜、月榜等多种排名展示
- **🎨 现代化UI** - 玻璃拟态设计、渐变效果、流畅动画

## 🛠️ 技术栈

### 后端技术
- **Spring Boot 3.2.0** - 主框架
- **MyBatis Plus 3.5.5** - ORM框架
- **MySQL 8.0** - 数据库
- **Maven** - 构建工具
- **Java 17** - 开发语言

### 前端技术
- **HTML5 + CSS3** - 页面结构和样式
- **JavaScript ES6+** - 交互逻辑
- **Font Awesome 6.0** - 图标库
- **现代化CSS** - 玻璃拟态、渐变、动画效果

### 数据库设计
- **用户表 (user)** - 用户基本信息
- **番茄任务表 (pomodoro_task)** - 学习任务管理
- **学习记录表 (study_log)** - 学习时长记录
- **自习室表 (room)** - 学习房间信息
- **房间成员表 (room_member)** - 房间成员关系
- **成就表 (achievement)** - 用户成就系统
- **排行榜表 (rank_record)** - 排名数据缓存

## 🚀 快速开始

### 环境要求

- **Java 17+**
- **Maven 3.6+**
- **MySQL 8.0+**
- **Node.js 16+** (可选，用于前端开发)

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd TomatoOnline
   ```

2. **数据库配置**
   ```sql
   -- 创建数据库
   CREATE DATABASE pomodoro_study_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   
   -- 导入数据库结构
   mysql -u root -p pomodoro_study_db < backend/schema.sql
   ```

3. **修改配置文件**
   
   编辑 `backend/src/main/resources/application.yml`：
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/pomodoro_study_db?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
       username: your_username
       password: your_password
   ```

4. **编译和运行**
   ```bash
   cd backend
   mvn clean package -DskipTests
   java -jar target/pomodoro-study-1.0.0.jar
   ```

5. **访问应用**
   
   打开浏览器访问：http://localhost:8080

### 🐳 Docker 部署 (推荐)

项目已完全Docker化，支持一键部署。

#### 环境要求
- **Docker Desktop** (Windows/Mac)
- **Docker Compose**

#### 一键启动

**Windows:**
```bash
# 启动后端服务
.\scripts\start-backend.bat

# 启动前端服务  
.\scripts\start-frontend.bat

# 停止所有服务
.\scripts\stop-windows.bat
```

**macOS:**
```bash
# 启动所有服务
./scripts/start-macos.sh

# 停止所有服务
./scripts/stop-macos.sh
```

#### 手动部署
```bash
# 构建并启动所有服务
docker-compose up --build -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

#### 访问地址
- **前端应用**: http://localhost
- **后端API**: http://localhost:8080
- **数据库**: localhost:3306 (root/EsTher-00080)

## 📁 项目结构

```
TomatoOnline/
├── backend/                          # 后端项目
│   ├── src/main/java/com/example/pomodorostudy/
│   │   ├── PomodoroStudyApplication.java    # 启动类
│   │   ├── common/                          # 通用类
│   │   │   └── Result.java                  # 统一返回结果
│   │   ├── config/                          # 配置类
│   │   │   ├── CorsConfig.java              # 跨域配置
│   │   │   └── MybatisPlusConfig.java        # MyBatis配置
│   │   ├── controller/                       # 控制器
│   │   │   ├── UserController.java          # 用户控制器
│   │   │   ├── RoomController.java          # 房间控制器
│   │   │   ├── PomodoroTaskController.java  # 任务控制器
│   │   │   └── ...
│   │   ├── entity/                          # 实体类
│   │   │   ├── User.java                    # 用户实体
│   │   │   ├── Room.java                    # 房间实体
│   │   │   └── ...
│   │   ├── mapper/                          # 数据访问层
│   │   │   ├── UserMapper.java              # 用户Mapper
│   │   │   └── ...
│   │   ├── service/                         # 业务逻辑层
│   │   │   ├── UserService.java             # 用户服务接口
│   │   │   ├── impl/                        # 服务实现
│   │   │   └── ...
│   │   └── ...
│   ├── src/main/resources/
│   │   ├── application.yml                  # 应用配置
│   │   ├── mapper/                          # MyBatis XML映射
│   │   └── static/                          # 静态资源
│   │       ├── index.html                   # 主页面
│   │       ├── css/style.css                # 样式文件
│   │       ├── js/app.js                    # JavaScript文件
│   │       └── music/                       # 音频文件
│   ├── schema.sql                          # 数据库结构
│   └── pom.xml                             # Maven配置
└── README.md                               # 项目说明
```

## 🎯 功能详解

### 1. 番茄钟计时器
- **专注时间**: 25分钟专注学习
- **休息时间**: 5分钟短休息，15分钟长休息
- **循环模式**: 自动切换专注和休息状态
- **音效提醒**: 时间到时的提示音

### 2. 多人自习房间
- **创建房间**: 设置房间名称、描述、类型
- **加入房间**: 浏览和搜索可用房间
- **实时排名**: 显示房间内成员学习时长排名
- **学习状态**: 开始/结束学习，记录学习时长

### 3. 任务管理
- **任务创建**: 添加学习任务和计划时长
- **任务跟踪**: 开始、暂停、完成任务
- **分类管理**: 按优先级和分类组织任务
- **进度统计**: 查看任务完成情况

### 4. 学习统计
- **时长记录**: 自动记录学习时长
- **效率评分**: 自评学习效率
- **心情记录**: 记录学习时的心情状态
- **数据可视化**: 图表展示学习数据

## 🔧 API接口

### 用户相关
- `POST /api/user/login` - 用户登录
- `POST /api/user/register` - 用户注册
- `GET /api/user/list` - 用户列表
- `GET /api/user/{id}` - 用户详情

### 房间相关
- `GET /api/room/list` - 房间列表
- `POST /api/room/create` - 创建房间
- `POST /api/room/join` - 加入房间
- `POST /api/room/leave` - 离开房间
- `GET /api/room/{id}/ranking` - 房间排名

### 任务相关
- `GET /api/pomodoro_task/list` - 任务列表
- `POST /api/pomodoro_task/add` - 添加任务
- `POST /api/pomodoro_task/start/{id}` - 开始任务
- `POST /api/pomodoro_task/complete/{id}` - 完成任务

## 🎨 界面设计

### 设计特色
- **玻璃拟态效果** - 半透明毛玻璃质感
- **渐变色彩** - 温和的相近色调
- **流畅动画** - 页面切换和交互动画
- **响应式布局** - 适配不同屏幕尺寸

### 色彩方案
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #f093fb;
    --glass-bg: rgba(255, 255, 255, 0.1);
    --glass-border: rgba(255, 255, 255, 0.2);
}
```

## 🐛 问题修复报告

### 已修复的问题

#### 1. 代码检查与修复 ✅
- **语法错误**: 检查并修复了所有Java文件的语法问题
- **空指针**: 添加了必要的空值检查
- **路径错误**: 修正了静态资源路径配置
- **拼写错误**: 统一了变量名和函数名

#### 2. 路径与资源修复 ✅
- **静态资源**: 确认CSS、JS、图片等资源路径正确
- **音频文件**: 验证音乐文件存在且路径正确
- **字体图标**: 确保Font Awesome CDN链接有效

#### 3. 数据库与配置检查 ✅
- **连接配置**: 验证数据库连接参数正确
- **字段匹配**: 确保实体类与数据库表字段一致
- **映射关系**: 检查MyBatis XML映射文件完整性

#### 4. 项目构建与依赖 ✅
- **Maven依赖**: 验证所有依赖包正确下载
- **版本兼容**: 确保Spring Boot 3.2.0与MyBatis Plus 3.5.5兼容
- **构建成功**: 项目可以正常编译打包

#### 5. 前后端联调 ✅
- **接口路径**: 确认前端API调用路径与后端Controller一致
- **CORS配置**: 配置跨域访问支持
- **数据格式**: 统一前后端数据交换格式

### 修复的关键问题

1. **前端API路径重复问题**
   - 问题: 前端调用 `/api/api/room/create` 出现重复前缀
   - 修复: 修正 `apiCall` 方法，移除重复的 `/api` 前缀

2. **计时器元素ID不匹配**
   - 问题: HTML中 `timer-display` 与JS中 `timer` 不匹配
   - 修复: 统一元素ID为 `timer` 和 `timerStatus`

3. **登录注册功能缺失**
   - 问题: 音乐功能回滚时误删了登录注册相关代码
   - 修复: 重新添加登录注册的事件处理和方法

4. **数据库字段映射**
   - 问题: Room实体缺少 `current_music` 字段映射
   - 修复: 添加字段映射并更新数据库结构

## 🚀 部署指南

### 开发环境
```bash
# 启动数据库
mysql -u root -p

# 启动后端服务
cd backend
mvn spring-boot:run

# 访问应用
http://localhost:8080
```

### 生产环境
```bash
# 构建应用
mvn clean package -DskipTests

# 运行应用
java -jar target/pomodoro-study-1.0.0.jar

# 配置反向代理 (Nginx)
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📊 性能优化

### 数据库优化
- 添加了复合索引提升查询性能
- 使用连接池管理数据库连接
- 配置了查询缓存

### 前端优化
- 静态资源压缩和缓存
- 图片懒加载
- CSS和JS文件合并

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目链接: [https://github.com/your-username/TomatoOnline](https://github.com/your-username/TomatoOnline)
- 问题反馈: [Issues](https://github.com/your-username/TomatoOnline/issues)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

**🍅 让学习更高效，让专注更有力！**