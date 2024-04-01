IMAGE_NAME=hd-price-tracker
GITHUB_SCOPE=michaelpotter
_VERSION=latest
DOCKER_IMAGE=ghcr.io/$(GITHUB_SCOPE)/$(IMAGE_NAME):$(_VERSION)

dist: node_modules src/*
	@npm run build
	@touch dist

node_modules: package.json
	@npm install
	@touch node_modules

builddocker: Dockerfile dist
	docker build \
		-t $(DOCKER_IMAGE) \
		.

rundocker: Dockerfile dist
	docker run \
		--rm \
		-it \
		-p 3000:3000 \
		$(DOCKER_IMAGE)

pushdocker:
	docker push $(DOCKER_IMAGE)

clean:
	@rm -rf node_modules dist

.PHONY: test clean
