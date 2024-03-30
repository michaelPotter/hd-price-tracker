import { getHdxItemFromUrl } from './hdx';
import _ from 'underscore';
import { object2Labels } from './utils';

import type { HdxProduct } from './hdx';

const urls: string[] = [
];

export interface HdxServiceOptions {
	sleepBetween: number,
}

export default class HdxService {

	// Holds the latest data in memory for future reference.
	// I don't want to set up a database, why this is kinda funny.
	// Will need to figure out a way to keep this structure up to date. A background loop to refresh it?
	data: Record<string, HdxProduct> = {};
	loaded = false;
	sleepBetween = 2000;
	
	constructor(options?: HdxServiceOptions) {
		this.sleepBetween = options?.sleepBetween ?? this.sleepBetween;
	}

	/**
	 * Initialize the service
	 */
	async init() {
		console.log("Initial data load")
		await this.loadAll();
		console.log("Initial data load complete")
		console.log("Starting loop")
		// Don't await this, it will run in the background.
		this.loadLoop();
	}

	/**
	 * Pull one product
	 */
	async pullProduct(url: string) {
		let product = await getHdxItemFromUrl(url);
		if (product) {
			this.data[product.productID] = product;
		}
	}

	/**
	 * Loads all products
	 * Sleeps for 2 seconds between each request to avoid getting blocked.
	 */
	async loadAll() {
		for (let url of urls) {
			await this.pullProduct(url);
			await new Promise(r => setTimeout(r, this.sleepBetween));
		}
		this.loaded = true;
	}

	/**
	 * Load all products in a loop.
	 */
	async loadLoop() {
		while (true) {
			// Sleep for an hour
			await new Promise(r => setTimeout(r, 1000 * 60 * 60));
			// Reload the data
			console.log("Reloading data")
			await this.loadAll();
			console.log("Data reloaded")
		}
	}

	async getProduct(id: string) {
		if (!this.loaded) {
			await this.loadAll();
		}

		return this.data[id];
	}

	/**
	 * Return all products.
	 */
	async getProducts() {
		if (!this.loaded) {
			await this.loadAll();
		}

		return this.data;
	}

	async getPrometheusPrices(): Promise<string> {
		if (!this.loaded) {
			await this.loadAll();
		}

		return _.map(this.data, (p => {
			let x = p as typeof p & {
				price: number;
				url: string;
			}
			x.price = p.offers.price;
			x.url = p.offers.url;
			let labels = object2Labels(_.pick(p, 'productID', 'name', 'url'));
			let promLine = `hdx_product_price{${labels}} ${x.price}`;
			return promLine;
		})).join("\n") + "\n";
	}
}
