# Test Login and Register API
Write-Host "Testing Login and Register APIs..." -ForegroundColor Green

# Test Login API
Write-Host "`n1. Testing Login API..." -ForegroundColor Yellow
try {
    $loginData = @{
        username = "testuser"
        password = "test123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/user/login" -Method POST -Body $loginData -ContentType "application/json" -TimeoutSec 10
    Write-Host "Login API Status: $($loginResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Login Response: $($loginResponse.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Login API Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Register API
Write-Host "`n2. Testing Register API..." -ForegroundColor Yellow
try {
    $registerData = @{
        username = "newuser$(Get-Date -Format 'HHmmss')"
        email = "newuser$(Get-Date -Format 'HHmmss')@example.com"
        password = "newpass123"
    } | ConvertTo-Json
    
    $registerResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/user/register" -Method POST -Body $registerData -ContentType "application/json" -TimeoutSec 10
    Write-Host "Register API Status: $($registerResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Register Response: $($registerResponse.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Register API Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Page Access
Write-Host "`n3. Testing Page Access..." -ForegroundColor Yellow
try {
    $pageResponse = Invoke-WebRequest -Uri "http://localhost:8080" -Method GET -TimeoutSec 5
    Write-Host "Page Status: $($pageResponse.StatusCode)" -ForegroundColor Green
    if ($pageResponse.Content -match "loginForm" -and $pageResponse.Content -match "registerForm") {
        Write-Host "Page contains login and register forms" -ForegroundColor Green
    } else {
        Write-Host "Page missing login/register forms" -ForegroundColor Red
    }
} catch {
    Write-Host "Page Access Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTest completed!" -ForegroundColor Green


