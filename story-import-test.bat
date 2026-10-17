@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\story-import.ps1" -NoPush
echo.
pause
