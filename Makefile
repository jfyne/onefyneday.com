default: serve

PWD := $(shell pwd)

functions/node_modules:
	npm i -g firebase-tools
	cd functions && npm i && npm run build

serve: functions/node_modules
	GOOGLE_APPLICATION_CREDENTIALS=$(PWD)/sa.json firebase serve -p 8000 -o 0.0.0.0

deploy: functions/node_modules
	GOOGLE_APPLICATION_CREDENTIALS=$(PWD)/sa.json firebase deploy
