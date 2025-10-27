# 测试房间创建API
$body = @{
    roomName = "Test Room"
    description = "This is a test room"
    maxMembers = 10
    roomType = 1
    studyTheme = "Study"
    creatorId = 1
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/room/create" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Content: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
