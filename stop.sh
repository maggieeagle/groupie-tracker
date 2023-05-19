docker stop groupie-tracker
docker rm groupie-tracker
docker image prune -a
echo "Groupie-tracker container stopped and deleted, unused images cleaned"