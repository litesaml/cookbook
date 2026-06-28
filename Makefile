IMAGE = node:20
PORT  = 3000

install:
	docker run --rm \
		-v $(PWD):/app \
		-w /app \
		$(IMAGE) \
		sh -c "rm -rf node_modules package-lock.json .docusaurus && npm install"

start:
	docker run --rm -it \
		-v $(PWD):/app \
		-w /app \
		-p $(PORT):3000 \
		$(IMAGE) \
		npm run start -- --host 0.0.0.0
