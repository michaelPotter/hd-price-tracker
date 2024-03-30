import express from 'express';
// const express = require('express')
import type HdxService from './hdxService';

export default class Server {

  hdxService: HdxService;

  constructor(hdxService: HdxService) {
    this.hdxService = hdxService;
  }

  async start() {
    const app = express()
    const port = 3000

    await this.hdxService.init();

    app.get('/prometheus', async (req, res) => {
      let data = await this.hdxService.getPrometheusPrices();
      return res.send(data);
    })

    app.listen(port, () => {
      console.log(`App listening on port ${port}`)
    })
  }

}
