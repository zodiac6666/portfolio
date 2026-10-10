@echo off
title Portfolio Launcher
echo ============================================
echo   Yahya Baji Portfolio - starting servers
echo ============================================
echo.

REM --- Make sure the tools are available ---
where php >nul 2>nul || (echo [ERROR] PHP not found in PATH. & echo Add C:\XAMP\php to your PATH. & pause & exit /b 1)
where npm >nul 2>nul || (echo [ERROR] npm not found in PATH. & pause & exit /b 1)

REM --- 1) PHP backend on port 8000 (IPv4 127.0.0.1) ---
echo [1/2] Backend  -^> http://127.0.0.1:8000
start "Portfolio Backend" /D "%~dp0backend" cmd /k php -S 127.0.0.1:8000 -t .

timeout /t 2 /nobreak >nul

REM --- 2) Vite frontend on port 5173 ---
echo [2/2] Frontend -^> http://localhost:5173
start "Portfolio Frontend" /D "%~dp0" cmd /k npm run dev

REM --- Open the site ---
timeout /t 5 /nobreak >nul
start "" http://localhost:5173

echo.
echo Two windows were opened - keep BOTH open while working:
echo    "Portfolio Backend"  and  "Portfolio Frontend"
echo Closing either window stops that server.
exit
