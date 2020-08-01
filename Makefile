default: serve

PWD := $(shell pwd)

setup:
	firebase login

serve:
	GOOGLE_APPLICATION_CREDENTIALS=$(PWD)/sa.json firebase serve -p 8000 -o 0.0.0.0 --only hosting

deploy:
	GOOGLE_APPLICATION_CREDENTIALS=$(PWD)/sa.json firebase deploy --only hosting
