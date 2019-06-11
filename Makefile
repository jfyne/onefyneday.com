default: deploy

deploy:
	gcloud config set project onefyneday
	gsutil rsync -R dist gs://www.onefyneday.com
	gsutil iam ch allUsers:objectViewer gs://www.onefyneday.com
	gsutil web set -m index.html -e 404.html gs://www.onefyneday.com
