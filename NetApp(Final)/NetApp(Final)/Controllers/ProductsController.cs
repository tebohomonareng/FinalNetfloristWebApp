using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using NetApp_Final_.Models;

namespace NetApp_Final_.Controllers
{
    public class ProductsController : ApiController
    {
        private theflowershopEntities2 db = new theflowershopEntities2();

        // GET: api/Products
        public IQueryable<Product> GetProducts()
        {
            return db.Products;
        }

        // GET: api/Products/5
        [ResponseType(typeof(Product))]
        public IHttpActionResult GetProduct(int id)
        {
            Product product = db.Products.Find(id);
            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        // PUT: api/Products/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutProduct(int id, Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != product.ProductID)
            {
                return BadRequest();
            }

            db.Entry(product).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }
        
        public async Task<string> POST()
        {
            Random random = new Random();
            int counter = 0;
            int ProductID = random.Next(999);
            var Name = HttpContext.Current.Request.Form["Name"];
            decimal Price = decimal.Parse(HttpContext.Current.Request.Form["Price"]);
            int Quantity = int.Parse(HttpContext.Current.Request.Form["Quantity"]);
            int Batch = int.Parse(HttpContext.Current.Request.Form["Batch"]);
            int StockThreshold = int.Parse(HttpContext.Current.Request.Form["StockThreshold"]);
            var SupplierName = HttpContext.Current.Request.Form["Supplier"];

            //collection files
            HttpFileCollection files = HttpContext.Current.Request.Files;
            string url = HttpContext.Current.Request.Url.AbsoluteUri;
            Product product = new Product();


            string Status = "";
            for (int i = 0; i <= files.Count; i++)
            {
                //get the posted file
                HttpPostedFile file = files[i];

                string fileName = new FileInfo(file.FileName).Name;

                if (file.ContentLength > 0)
                {
                    Guid id = Guid.NewGuid();

                    string modifiedFileName = id.ToString() + "_" + fileName;

                    byte[] imageb = new byte[file.ContentLength];
                    file.InputStream.Read(imageb, 0, file.ContentLength);

                    product.ProductID = ProductID;
                    product.Name = Name;
                    product.Price = Price;
                    product.Quantity = Quantity;
                    product.BatchQuantity = Batch;
                    product.StockThreshold = StockThreshold;
                    //product.Supplier = SupplierName;
                    product.SupplierName = SupplierName;
                    product.Image = imageb;
                    db.Products.Add(product); 
                    await db.SaveChangesAsync();
                    counter++;

                }

            }

            if (counter > 0)
            {
                return Status;
            }
            return "Upload Failed";
        }

        // DELETE: api/Products/5
        [ResponseType(typeof(Product))]
        public IHttpActionResult DeleteProduct(int id)
        {
            Product product = db.Products.Find(id);
            if (product == null)
            {
                return NotFound();
            }

            db.Products.Remove(product);
            db.SaveChanges();

            return Ok(product);
        }

        [Route("api/SupplierProducts")]
        public IHttpActionResult GetSupplierProduct(string Name)
        {
            Product product = db.Products.Where(Product => Product.SupplierEmail.Equals("Benmore Florist") && Product.Quantity < Product.StockThreshold).FirstOrDefault();
            return Ok(product);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ProductExists(int id)
        {
            return db.Products.Count(e => e.ProductID == id) > 0;
        }
    }
}