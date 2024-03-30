import axios from 'axios';
import { load } from 'cheerio';

// Fetch HTML page and filter for a specific HTML tag
export async function getHdxItemFromUrl(url: string): Promise<HdxProduct | undefined>{
	try {
		const response = await axios.get(url);

		// Load the HTML into Cheerio
		const $ = load(response.data);
		// TODO check for error here

		// Filter for the tag with product info
		const filteredTag = $('#thd-helmet__script--productStructureData');
		const content = filteredTag.html();

		if (content != null) {
			const data = JSON.parse(content)
			delete data.review
			delete data.image
			return data;
		} else {
			console.warn("Could not find html tag or content in tag")
		}

	} catch (error) {
		console.log('Error occurred:', error);
	}
}

export type HdxProduct = {
	"@context": string,
	"@type": string,
	"name": string,
	"description": string,
	"productID": string,
	"sku": string,
	"gtin13": string,
	"depth": string,
	"height": string,
	"width": string,
	"color": string,
	"weight": string,
	"brand": {
		"@type": string,
		"name": string
	},
	"aggregateRating": {
		"@type": string,
		"ratingValue": string,
		"reviewCount": string
	},
	"offers": {
		"@type": string,
		"url": string,
		"priceCurrency": string,
		"price": number,
		"priceValidUntil": string,
		"availability": string,
		"hasMerchantReturnPolicy": {
			"@type": string,
			"applicableCountry": string,
			"returnPolicyCategory": string,
			"merchantReturnDays": number
		}
	}
}
