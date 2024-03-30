import HdxService from './src/hdxService';
import Server from './src/server';

(async function main() {

	let service = new HdxService({sleepBetween: 2000});

	let server = new Server(service);
	server.start();



	// let data = await service.getPrometheusPrices();
	// console.log(`data: `, data)  // TODO DELETE ME
	// // console.log(`jsons: `, JSON.stringify(data, null, 2))  // TODO DELETE ME

	
})();
