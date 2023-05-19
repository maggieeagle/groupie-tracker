sudo docker build -f Dockerfile -t groupie-tracker . # create groupie-tracker image based on Dockerfile
echo -e ""
sudo docker run --name groupie-tracker -p 8080:8080 groupie-tracker # create and run the container from groupie-tracker image