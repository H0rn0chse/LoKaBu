@ECHO OFF
rem SETLOCAL

SET "filename2=client.py"
SET "filename1=client.html"
SET "outfile=Kassenbuch.py"
SET "insertafter=RAW_HTML = '''"

(
FOR /f "usebackqdelims=" %%a IN ("%filename2%") DO (
 ECHO.%%a
 IF "%%a"=="%insertafter%" TYPE "%filename1%"
)
)>"%outfile%"

pause

pyinstaller Kassenbuch.py --onefile --noconsole

pause 