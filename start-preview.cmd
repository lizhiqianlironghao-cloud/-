@echo off
title Portfolio Preview
cd /d "%~dp0"
echo Preview URL: http://127.0.0.1:5173/
echo Keep this window open while viewing the website.
if exist "E:\Codex\tools\nodejs\npm.cmd" (
  call "E:\Codex\tools\nodejs\npm.cmd" run dev
) else (
  call npm run dev
)
if errorlevel 1 pause
