using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Titanium.Data;
using Titanium.Models;
using Titanium.Service;

namespace Titanium.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StocksController : ControllerBase
    {
        private IStockService _stockService;
        private readonly string fullReportName = "FullReport";

        public StocksController(IStockService stockService)
        {
            _stockService = stockService;
        }

        // /api/Stocks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Stock>>> GetStocks()
        {
            return await _stockService.GetStocks();
        }

        [HttpPost]
        public async Task<int> PostStocks(Stock newStock)
        {
            return await _stockService.PostStocks(newStock);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Stock>> GetStock(int id)
        {
            return await _stockService.GetStock(id);
        }

        [HttpPut]
        public async Task<ActionResult<int>> PutStock(Stock updatedProduct)
        {
            return await _stockService.PutStock(updatedProduct);
        }

        // /api/Stocks/StockReport/
        [HttpGet("StockReport")]
        public ActionResult<int> GetStockReport()
        {
            _stockService.CreateFullReport(fullReportName);
            return new JsonResult(200);
        }

        [HttpGet("Settings")]
        public async Task<ActionResult<Settings>> GetSettings()
        {
            return await _stockService.GetSettings();
        }
    }
}
