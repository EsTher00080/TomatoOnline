# 测试登录API
$loginData = @{
    username = "testuser"
    password = "123456"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/user/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "Login Status: $($response.StatusCode)"
    Write-Host "Login Content: $($response.Content)"
} catch {
    Write-Host "Login Error: $($_.Exception.Message)"
}

# 测试注册API
$registerData = @{
    username = "newuser"
    email = "newuser@example.com"
    password = "123456"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/user/register" -Method POST -Body $registerData -ContentType "application/json"
    Write-Host "Register Status: $($response.StatusCode)"
    Write-Host "Register Content: $($response.Content)"
} catch {
    Write-Host "Register Error: $($_.Exception.Message)"
}


