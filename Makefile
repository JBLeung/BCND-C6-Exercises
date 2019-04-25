server:
	ganache-cli -m "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat"
reset:
	rm -Rf ./build; truffle migrate --reset; npm test;