default: serve

serve:
	firebase serve -p 8000 -o 0.0.0.0

deploy:
	firebase deploy
