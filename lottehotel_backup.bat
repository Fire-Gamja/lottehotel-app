@echo off
chcp 65001 >nul
setlocal

:: 경로 설정
set "PROJECT_DIR=%~dp0"
set "BACKUP_DIR=%USERPROFILE%\Desktop\lottehotel_backups"
set "DATE=%DATE:~0,4%-%DATE:~5,2%-%DATE:~8,2%_%TIME:~0,2%%TIME:~3,2%"
set "ZIP_NAME=lottehotel_backup_%DATE%.zip"
set "TEMP_DIR=%TEMP%\lottehotel_temp_%RANDOM%"

:: 백업 대상 폴더를 임시 위치에 복사 (node_modules 등 제외)
echo 🔄 파일 복사 중...
mkdir "%TEMP_DIR%"
xcopy "%PROJECT_DIR%*" "%TEMP_DIR%\" /E /I /EXCLUDE:exclude.txt >nul

:: 압축 실행
echo 📦 압축 중...
powershell -NoProfile -Command ^
  "Compress-Archive -Path '%TEMP_DIR%\*' -DestinationPath '%BACKUP_DIR%\%ZIP_NAME%'"

:: 정리
rmdir /S /Q "%TEMP_DIR%"

echo ✅ 백업 완료: %BACKUP_DIR%\%ZIP_NAME%
pause
