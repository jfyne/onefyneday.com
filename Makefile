default: serve

serve:
	cd main && python -m http.server

deploy:
	gcloud config set project onefyneday
	gsutil rsync -R main gs://www.onefyneday.com
	gsutil iam ch allUsers:objectViewer gs://www.onefyneday.com
	gsutil web set -m index.html -e 404.html gs://www.onefyneday.com
