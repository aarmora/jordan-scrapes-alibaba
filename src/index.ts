import puppeteer, { Browser, Page } from 'puppeteer';
import { setUpNewPage, getPropertyBySelector } from 'puppeteer-helpers';

(async () => {

    const baseDomain = 'https://www.alibaba.com/trade/search?fsb=y&IndexArea=product_en&SearchText=';
    const searchText = 'pasta maker';
    const url = baseDomain + searchText;

    const browser = await puppeteer.launch();

    const page = await setUpNewPage(browser);

    await page.goto(url);

    const products = await page.$$('.m-product-item');

    const parsedProducts: any[] = [];

    for (let product of products) {
        const parsedProduct = {
            title: '',
            price: '',
            minimumOrder: ''
        };
        parsedProduct.title = await getPropertyBySelector(product, '.title a', 'innerHTML');
        parsedProduct.price = await getPropertyBySelector(product, '.price b', 'innerHTML')
        if (parsedProduct.price) {
            parsedProduct.price = parsedProduct.price.replace(/\n/g, '').trim();
        }
        parsedProduct.minimumOrder = await getPropertyBySelector(product, '.min-order b', 'innerHTML');

        console.log('parsed Product', parsedProduct);

        if (parsedProduct.title) {
            parsedProducts.push(parsedProduct);
        }

    }

    console.log('parsedPRoducts', parsedProducts);

    process.exit();


})();