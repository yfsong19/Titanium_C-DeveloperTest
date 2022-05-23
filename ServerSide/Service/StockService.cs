using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Results;
using Microsoft.AspNetCore.Http;
using CsvHelper;
using System.IO;
using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Titanium.Data;
using Titanium.Models;
using Microsoft.VisualBasic.FileIO;

namespace Titanium.Service
{
    public interface IStockService
    {
        public Task<ActionResult<IEnumerable<Stock>>> GetStocks();
        public Task<int> PostStocks(Stock newStock);
        public Task<ActionResult<Stock>> GetStock(int id);
        public Task<ActionResult<int>> PutStock(Stock updatedProduct);
        public void CreateFullReport(string reportName);
        public Task<ActionResult<Settings>> GetSettings();
    }

    public class StockService : IStockService
    {
        private readonly TitaniumContext _titaniumContext;
        private readonly int maxOrderMoney = 100;
        private readonly string currentDirectory = Environment.CurrentDirectory;
        public StockService(TitaniumContext titaniumContext)
        {
            _titaniumContext = titaniumContext;
        }

        public async Task<ActionResult<IEnumerable<Stock>>> GetStocks()
        {
            return await _titaniumContext.Stocks.ToListAsync();
        }

        public async Task<int> PostStocks(Stock newStock)
        {
            _titaniumContext.Stocks.Add(newStock);
            await _titaniumContext.SaveChangesAsync();
            return 200;
        }

        public async Task<ActionResult<Stock>> GetStock(int id)
        {
            var currentProduct = await _titaniumContext.Stocks.Where(s => s.ProductId == id).Select(s => new Stock
            {
                ProductId = s.ProductId,
                Description = s.Description,
                CurrentStock = s.CurrentStock,
                SafeStock = s.SafeStock,
                SoldStockTotal = s.SoldStockTotal,
                Price = s.Price
            }).FirstOrDefaultAsync();
            return new JsonResult(currentProduct);
        }
        public async Task<ActionResult<int>> PutStock(Stock updatedProduct)
        {
            int currentProductId = updatedProduct.ProductId;
            var currentProduct = await _titaniumContext.Stocks.Where(s => s.ProductId == currentProductId).Select(s => new Stock
            {
                ProductId = s.ProductId,
                Description = s.Description,
                CurrentStock = s.CurrentStock,
                SafeStock = s.SafeStock,
                SoldStockTotal = s.SoldStockTotal,
                Price = s.Price
            }).AsNoTracking().FirstOrDefaultAsync();

            if (currentProduct != null)
            {
                currentProduct.ProductId = updatedProduct.ProductId;
                currentProduct.Description = updatedProduct.Description;
                currentProduct.SoldStockTotal = updatedProduct.SoldStockTotal;
                currentProduct.CurrentStock = updatedProduct.CurrentStock;
                currentProduct.SafeStock = updatedProduct.SafeStock;
                currentProduct.Price = updatedProduct.Price;

                _titaniumContext.Stocks.Update(currentProduct);
                await _titaniumContext.SaveChangesAsync();

                CheckProductSafeStock(currentProduct);
            }

            
            return new JsonResult(200);
        }

        private void CheckProductSafeStock(Stock currentProduct)
        {
            if(currentProduct.CurrentStock < currentProduct.SafeStock)
            {
                // TODO create the csv file reorder report.
                int numberOfUnitsToReOrder = currentProduct.Price > maxOrderMoney ? 1 : (int)(maxOrderMoney / currentProduct.Price);
                List<OrderStock> orderStockList = new List<OrderStock>()
                {
                    new OrderStock
                    {
                        ProductId = currentProduct.ProductId,
                        Description = currentProduct.Description,
                        ReOrderUnits = numberOfUnitsToReOrder
                    }
                };
                
                var reportName = "OrderReport-" + orderStockList[0].Description;
                CreateOrderReport(reportName, orderStockList);
            }
        }

        public void CreateOrderReport(string reportName, List<OrderStock> orderStock)
        {
            var csvName = $"{reportName}.csv";
            var csvPath = Path.Combine(currentDirectory, csvName);
            if (!File.Exists(csvPath))
            {
                using (var streamWriter = new StreamWriter(csvPath))
                {
                    using (var csvWriter = new CsvWriter(streamWriter, CultureInfo.InvariantCulture))
                    {
                        csvWriter.WriteRecords(orderStock);
                        
                    }
                }
            }
            else
            {
                List<string> dataFromExistingReport = new List<string>();
                using (TextFieldParser parser = new TextFieldParser(csvPath))
                {
                    parser.TextFieldType = FieldType.Delimited;
                    parser.SetDelimiters(",");
                    while (!parser.EndOfData)
                    {
                        string[] fields = parser.ReadFields();
                        foreach (string field in fields)
                        {
                            dataFromExistingReport.Add(field);
                        }
                    }
                }

                List<OrderStock> newOrderStocks = new List<OrderStock>();
                // hard code, very hard
                for (var i = 3; i < dataFromExistingReport.Count; i = i + 3)
                {
                    newOrderStocks.Add(new OrderStock
                    {
                        ProductId = Int32.Parse(dataFromExistingReport[i]),
                        Description = dataFromExistingReport[i + 1],
                        ReOrderUnits = Int32.Parse(dataFromExistingReport[i + 2])
                    });
                }

                newOrderStocks.Add(orderStock[0]);
                File.Delete(csvPath);

                using (var streamWriter = new StreamWriter(csvPath))
                {
                    using (var csvWriter = new CsvWriter(streamWriter, CultureInfo.InvariantCulture))
                    {
                        csvWriter.WriteRecords(newOrderStocks);
                    }
                }
            }   
        }

        public async void CreateFullReport(string reportName)
        {
            var csvName = $"{reportName}.csv";
            var csvPath = Path.Combine(currentDirectory, csvName);
            List<Stock> stocks = await _titaniumContext.Stocks.ToListAsync();
            if (!File.Exists(csvPath))
            {
                using (var streamWriter = new StreamWriter(csvPath))
                {
                    using (var csvWriter = new CsvWriter(streamWriter, CultureInfo.InvariantCulture))
                    {
                        
                        csvWriter.WriteRecords(stocks);
                    }
                }
            }
        }

        public async Task<ActionResult<Settings>> GetSettings()
        {
            return new JsonResult(
                new Settings
                {
                    TableColumns = new List<string> { "ProductId", "Description", "CurrentStock", "SafeStock", "TotalSales", "Price", "Sale", "ReOrder", "ChangeDetails" },
                    MaxOrderMoney = this.maxOrderMoney
                }
            );
        }
    }
}
