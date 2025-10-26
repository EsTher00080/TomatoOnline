# 验证项目修改是否生效的脚本
# 执行此脚本来验证登录注册功能

Write-Host "=================================" -ForegroundColor Green
Write-Host "🍅 番茄自习室 - 修改验证脚本" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# 1. 检查应用是否启动
Write-Host "`n1. 检查应用启动状态..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ 应用已启动，状态码: $($response.StatusCode)" -ForegroundColor Green
    } else {
        Write-Host "❌ 应用启动异常，状态码: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ 应用未启动或无法访问: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "请先启动应用: mvn spring-boot:run" -ForegroundColor Yellow
    exit 1
}

# 2. 测试登录API
Write-Host "`n2. 测试登录API..." -ForegroundColor Yellow
try {
    $loginData = @{
        username = "testuser"
        password = "test123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/user/login" -Method POST -Body $loginData -ContentType "application/json" -TimeoutSec 10
    Write-Host "✅ 登录API响应状态: $($loginResponse.StatusCode)" -ForegroundColor Green
    Write-Host "响应内容: $($loginResponse.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ 登录API测试失败: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. 测试注册API
Write-Host "`n3. 测试注册API..." -ForegroundColor Yellow
try {
    $registerData = @{
        username = "newuser$(Get-Date -Format 'HHmmss')"
        email = "newuser$(Get-Date -Format 'HHmmss')@example.com"
        password = "newpass123"
    } | ConvertTo-Json
    
    $registerResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/user/register" -Method POST -Body $registerData -ContentType "application/json" -TimeoutSec 10
    Write-Host "✅ 注册API响应状态: $($registerResponse.StatusCode)" -ForegroundColor Green
    Write-Host "响应内容: $($registerResponse.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ 注册API测试失败: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. 测试页面访问
Write-Host "`n4. 测试页面访问..." -ForegroundColor Yellow
try {
    $pageResponse = Invoke-WebRequest -Uri "http://localhost:8080" -Method GET -TimeoutSec 5
    if ($pageResponse.Content -match "loginForm" -and $pageResponse.Content -match "registerForm") {
        Write-Host "✅ 页面包含登录注册表单" -ForegroundColor Green
    } else {
        Write-Host "❌ 页面缺少登录注册表单" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ 页面访问失败: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=================================" -ForegroundColor Green
Write-Host "🎉 验证完成！" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

Write-Host "`n📝 手动验证步骤:" -ForegroundColor Yellow
Write-Host "1. 打开浏览器访问: http://localhost:8080" -ForegroundColor White
Write-Host "2. 点击右上角'登录'按钮" -ForegroundColor White
Write-Host "3. 填写用户名: testuser, 密码: test123" -ForegroundColor White
Write-Host "4. 点击'登录'按钮提交表单" -ForegroundColor White
Write-Host "5. 检查是否显示登录成功消息" -ForegroundColor White
Write-Host "6. 点击'注册'按钮测试注册功能" -ForegroundColor White



