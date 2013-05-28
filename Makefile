sssp:
	cp -Rv * ~/Documents/brightsign/Publish/SSSP

install:
	cp -Rv * ~/Sites/test

blog:
	scp -rv * blog.herlein.com:/var/www/blog/bsn

zip:
	zip  ~/bsn-js.zip *

