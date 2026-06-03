@echo off

REM ==== API ====
cd WebApiReact
docker build -t p32-native-api .
docker tag p32-native-api:latest maxslipchuk22/p32-native-api:latest
docker push maxslipchuk22/p32-native-api:latest

echo DONE
pause