# 简单测试登录功能
Write-Host "Testing login API..."

$loginData = @{
    username = "testuser"
    password = "123456"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/user/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
    }
}


