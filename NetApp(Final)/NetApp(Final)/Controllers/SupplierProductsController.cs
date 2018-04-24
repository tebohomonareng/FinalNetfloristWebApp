using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace NetApp_Final_.Controllers
{
    public class SupplierProductsController : ApiController
    {
        public int ProductID { get; set; }
        public string Name { get; set; }
        public Nullable<decimal> Price { get; set; }
        public Nullable<int> Quantity { get; set; }
        public Nullable<int> StockThreshold { get; set; }
        public Nullable<int> BatchQuantity { get; set; }
        public string SupplierName { get; set; }
        public string SupplierEmail { get; set; }
        public byte[] Image { get; set; }
    }
}
